import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as app from "tns-core-modules/application";
import * as utils from "tns-core-modules/utils/utils";

let gridLayout;
let textureListener;
let cameraId;
let imageDimension;
let cameraDevice;
let textureView;
let cameraCaptureSessions;
let captureRequestBuilder;
let mBackgroundThread;
let mBackgroundHandler;
// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    gridLayout = page.getViewById("gridLayout");
    textureView = new android.view.TextureView(
        utils.ad.getApplicationContext()
    );
    // gridLayout.addChild(textureView);
    gridLayout.nativeView.addView(textureView);
    textureView.setSurfaceTextureListener(textureListener);
    startBackgroundThread();
}

export function pageUnloaded(args: observable.EventData) {
    console.log("Stopping background thread");
    stopBackgroundThread();
}

textureListener = new android.view.TextureView.SurfaceTextureListener({
    onSurfaceTextureAvailable: function(surface, width, height) {
        //open your camera here
        openCamera();
    },
    onSurfaceTextureSizeChanged: function(surface, width, height) {
        // Transform you image captured size according to the surface width and height
    },
    onSurfaceTextureDestroyed: function(surface): boolean {
        return false;
    },
    onSurfaceTextureUpdated: function(surface) {}
});

const STCB = android.hardware.camera2.CameraDevice.StateCallback.extend({
    onOpened: function(camera) {
        //This is called when the camera is open
        cameraDevice = camera;
        createCameraPreview();
    },
    onDisconnected: function(camera) {
        cameraDevice.close();
    },
    onError: function(camera, error) {
        cameraDevice.close();
        cameraDevice = null;
    }
});

const stateCallback = new STCB();

function createCameraPreview() {
    try {
        const texture = textureView.getSurfaceTexture();
        texture.setDefaultBufferSize(
            imageDimension.getWidth(),
            imageDimension.getHeight()
        );
        const surface: android.view.Surface = new android.view.Surface(texture);
        captureRequestBuilder = cameraDevice.createCaptureRequest(
            android.hardware.camera2.CameraDevice.TEMPLATE_PREVIEW
        );
        captureRequestBuilder.addTarget(surface);
        const l: java.util.List<android.view.Surface> = new java.util.ArrayList<
            android.view.Surface
        >();
        l.add(surface);

        const ST2CB = android.hardware.camera2.CameraCaptureSession.StateCallback.extend(
            {
                onConfigured(cameraCaptureSession) {
                    //The camera is already closed
                    if (null == cameraDevice) {
                        return;
                    }
                    // When the session is ready, we start displaying the preview.
                    cameraCaptureSessions = cameraCaptureSession;
                    updatePreview();
                },
                onConfigureFailed(cameraCaptureSession) {
                    console.log("Configuration change");
                }
            }
        );

        cameraDevice.createCaptureSession(l, new ST2CB(), null);
    } catch (e) {
        console.log("error createCameraPreview");
        console.log(e);
    }
}

function openCamera() {
    const manager: any = utils.ad
        .getApplicationContext()
        .getSystemService(android.content.Context["CAMERA_SERVICE"]);
    try {
        cameraId = manager.getCameraIdList()[0];
        const characteristics = manager.getCameraCharacteristics(cameraId);
        const map = characteristics.get(
            android.hardware.camera2.CameraCharacteristics
                .SCALER_STREAM_CONFIGURATION_MAP
        );
        imageDimension = map.getOutputSizes(
            android.graphics.SurfaceTexture.class
        )[0];
        manager.openCamera(cameraId, stateCallback, null);
    } catch (e) {
        console.log("error");
        console.log(e);
    }
}

function updatePreview() {
    if (null == cameraDevice) {
        console.log("updatePreview error");
    }

    try {
        // This part doesn't seem to work
        // captureRequestBuilder.set(
        //     android.hardware.camera2.CaptureRequest.CONTROL_MODE,
        //     android.hardware.camera2.CameraMetadata.CONTROL_MODE_AUTO
        // );
        cameraCaptureSessions.setRepeatingRequest(
            captureRequestBuilder.build(),
            null,
            mBackgroundHandler
        );
    } catch (e) {
        console.log("Error in update Preview");
        console.log(e);
    }
}

function startBackgroundThread() {
    mBackgroundThread = new android.os.HandlerThread("Camera Background");
    mBackgroundThread.start();
    mBackgroundHandler = new android.os.Handler(mBackgroundThread.getLooper());
}

function stopBackgroundThread() {
    mBackgroundThread.quitSafely();
    try {
        mBackgroundThread.join();
        mBackgroundThread = null;
        mBackgroundHandler = null;
    } catch (e) {
        console.log("error");
        console.log(e);
    }
}
