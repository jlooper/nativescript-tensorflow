import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as app from "tns-core-modules/application";
import * as utils from "tns-core-modules/utils/utils";
import { TensorFlowImageClassifier } from "./tensorflow/ImageClassifier";
import { ImageUtils } from "./tensorflow/ImageUtils";

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
const SAVE_PREVIEW_BITMAP = false;
let rgbFrameBitmap: android.graphics.Bitmap;
let croppedBitmap: android.graphics.Bitmap;
let cropCopyBitmap: android.graphics.Bitmap;

let lastProcessingTimeMs;

const INPUT_SIZE = 224;
const IMAGE_MEAN = 117;
const IMAGE_STD = 1;
const INPUT_NAME = "input";
const OUTPUT_NAME = "output";

const MODEL_FILE = "./assets/tensorflow_inception_graph.pb";
const LABEL_FILE = "./assets/imagenet_comp_graph_label_strings.txt";

const MAINTAIN_ASPECT = true;

const DESIRED_PREVIEW_SIZE = new android.util.Size(640, 480);

let sensorOrientation;
let classifier;
let frameToCropTransform;
let cropToFrameTransform;

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

        classifier = TensorFlowImageClassifier.create(
            app.andoird.context.getAssets(),
            MODEL_FILE,
            LABEL_FILE,
            INPUT_SIZE,
            IMAGE_MEAN,
            IMAGE_STD,
            INPUT_NAME,
            OUTPUT_NAME
        );

        const previewWidth = imageDimension.getWidth();
        const previewHeight = imageDimension.getHeight();

        const sensorOrientation = 0; // TODO: Fix this part

        console.log(
            "Camera orientation relative to screen canvas: %d",
            sensorOrientation
        );
        console.log("Initializing at size %dx%d", previewWidth, previewHeight);

        rgbFrameBitmap = android.graphics.Bitmap.createBitmap(
            previewWidth,
            previewHeight,
            android.graphics.Bitmap.Config.ARGB_8888
        );
        croppedBitmap = android.graphics.Bitmap.createBitmap(
            INPUT_SIZE,
            INPUT_SIZE,
            android.graphics.Bitmap.Config.ARGB_8888
        );

        frameToCropTransform = ImageUtils.getTransformationMatrix(
            previewWidth,
            previewHeight,
            INPUT_SIZE,
            INPUT_SIZE,
            sensorOrientation,
            MAINTAIN_ASPECT
        );

        cropToFrameTransform = new android.graphics.Matrix();
        frameToCropTransform.invert(cropToFrameTransform);
        processImage();
    } catch (e) {
        console.log("error createCameraPreview");
        console.log(e);
    }
}

function getRgbBytes() {}

function processImage() {
    // TODO: Finish implementing camera activity first, then come here
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
