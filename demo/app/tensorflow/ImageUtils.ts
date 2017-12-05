export class ImageUtils {
    constructor() {}

    getYUVByteSize(width, height) {
        // The luminance plane requires 1 byte per pixel.
        const ySize = width * height;

        // The UV plane works on 2x2 blocks, so dimensions with odd size must be rounded up.
        // Each 2x2 block takes 2 bytes to encode, one each for U and V.
        const uvSize = (width + 1) / 2 * ((height + 1) / 2) * 2;

        return ySize + uvSize;
    }

    static saveBitmap(bitmap: android.graphics.Bitmap, filename: string) {
        filename = filename || "preview.png";
        const root: string =
            android.os.Environment.getExternalStorageDirectory().getAbsolutePath() +
            java.io.File.separator +
            "tensorflow";
        console.log(
            "Saving %dx%d bitmap to %s.",
            bitmap.getWidth(),
            bitmap.getHeight(),
            root
        );
        const myDir: java.io.File = new java.io.File(root);

        if (!myDir.mkdirs()) {
            console.log("Make dir failed");
        }

        const fname: string = filename;
        const file: java.io.File = new java.io.File(myDir, fname);
        if (file.exists()) {
            file.delete();
        }
        try {
            const out: java.io.FileOutputStream = new java.io.FileOutputStream(
                file
            );
            bitmap.compress(
                android.graphics.Bitmap.CompressFormat.PNG,
                99,
                out
            );
            out.flush();
            out.close();
        } catch (e) {
            console.error("Exception!", e);
        }
    }

    static kMaxChannelValue: number = 262143;

    static convertYUV420SPToARGB8888(input, width, height, output, val) {
        // TS implementation of YUV420SP to ARGB8888 converting
        const frameSize = width * height;
        for (let j = 0, yp = 0; j < height; j++) {
            let uvp = frameSize + (j >> 1) * width;
            let u = 0;
            let v = 0;

            for (let i = 0; i < width; i++, yp++) {
                const y = 0xff & input[yp];
                if ((i & 1) == 0) {
                    v = 0xff & input[uvp++];
                    u = 0xff & input[uvp++];
                }

                output[yp] = ImageUtils.YUV2RGB(y, u, v);
            }
        }
    }

    private static YUV2RGB(y, u, v) {
        // Adjust and check YUV values
        y = y - 16 < 0 ? 0 : y - 16;
        u -= 128;
        v -= 128;

        // This is the floating point equivalent. We do the conversion in integer
        // because some Android devices do not have floating point in hardware.
        // nR = (int)(1.164 * nY + 2.018 * nU);
        // nG = (int)(1.164 * nY - 0.813 * nV - 0.391 * nU);
        // nB = (int)(1.164 * nY + 1.596 * nV);
        const y1192 = 1192 * y;
        let r = y1192 + 1634 * v;
        let g = y1192 - 833 * v - 400 * u;
        let b = y1192 + 2066 * u;

        // Clipping RGB values to be inside boundaries [ 0 , kMaxChannelValue ]
        r =
            r > ImageUtils.kMaxChannelValue
                ? ImageUtils.kMaxChannelValue
                : r < 0 ? 0 : r;
        g =
            g > ImageUtils.kMaxChannelValue
                ? ImageUtils.kMaxChannelValue
                : g < 0 ? 0 : g;
        b =
            b > ImageUtils.kMaxChannelValue
                ? ImageUtils.kMaxChannelValue
                : b < 0 ? 0 : b;

        return (
            0xff000000 |
            ((r << 6) & 0xff0000) |
            ((g >> 2) & 0xff00) |
            ((b >> 10) & 0xff)
        );
    }

    static convertYUV420ToARGB8888(
        yData,
        uData,
        vData,
        width,
        height,
        yRowStride,
        uvRowStride,
        uvPixelStride,
        out
    ) {
        let yp = 0;
        for (let j = 0; j < height; j++) {
            let pY = yRowStride * j;
            let pUV = uvRowStride * (j >> 1);

            for (let i = 0; i < width; i++) {
                const uv_offset = pUV + (i >> 1) * uvPixelStride;

                out[yp++] = ImageUtils.YUV2RGB(
                    0xff & yData[pY + i],
                    0xff & uData[uv_offset],
                    0xff & vData[uv_offset]
                );
            }
        }
    }

    static getTransformationMatrix(
        srcWidth,
        srcHeight,
        dstWidth,
        dstHeight,
        applyRotation,
        maintainAspectRatio
    ) {
        const matrix: android.graphics.Matrix = new android.graphics.Matrix();

        if (applyRotation != 0) {
            if (applyRotation % 90 != 0) {
                console.log("Rotation of %d % 90 != 0", applyRotation);
            }

            // Translate so center of image is at origin.
            matrix.postTranslate(-srcWidth / 2.0, -srcHeight / 2.0);

            // Rotate around origin.
            matrix.postRotate(applyRotation);
        }

        // Account for the already applied rotation, if any, and then determine how
        // much scaling is needed for each axis.
        const transpose: boolean = (Math.abs(applyRotation) + 90) % 180 == 0;

        const inWidth = transpose ? srcHeight : srcWidth;
        const inHeight = transpose ? srcWidth : srcHeight;

        // Apply scaling if necessary.
        if (inWidth != dstWidth || inHeight != dstHeight) {
            const scaleFactorX = dstWidth / inWidth;
            const scaleFactorY = dstHeight / inHeight;

            if (maintainAspectRatio) {
                // Scale by minimum factor so that dst is filled completely while
                // maintaining the aspect ratio. Some image may fall off the edge.
                const scaleFactor: number = Math.max(
                    scaleFactorX,
                    scaleFactorY
                );
                matrix.postScale(scaleFactor, scaleFactor);
            } else {
                // Scale exactly to fill dst from src.
                matrix.postScale(scaleFactorX, scaleFactorY);
            }
        }

        if (applyRotation != 0) {
            // Translate back from origin centered reference to destination frame.
            matrix.postTranslate(dstWidth / 2.0, dstHeight / 2.0);
        }

        return matrix;
    }
}
