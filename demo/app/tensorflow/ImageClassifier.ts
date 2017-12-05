import { TensorFlowInferenceInterface } from "nativescript-tensorflow";

/**
 * Generic interface for interacting with different recognition engines.
 */
export interface Classifier {
    recognizeImage(
        bitmap: android.graphics.Bitmap
    ): java.util.List<Classifier.Recognition>;
    enableStatLogging(debug: boolean): void;
    getStatString(): string;
    close(): void;
}
export namespace Classifier {
    /**
     * An immutable result returned by a Classifier describing what was recognized.
     */
    export class Recognition {
        /**
         * A unique identifier for what has been recognized. Specific to the class, not the instance of
         * the object.
         */
        private id: string;

        /**
         * Display name for the recognition.
         */
        private title: string;

        /**
         * A sortable score for how good the recognition is relative to others. Higher should be better.
         */
        private confidence: number;

        /** Optional location within the source image for the location of the recognized object. */
        private location: android.graphics.RectF;

        constructor(
            id: string,
            title: string,
            confidence: number,
            location: android.graphics.RectF
        ) {
            this.id = id;
            this.title = title;
            this.confidence = confidence;
            this.location = location;
        }

        getId(): string {
            return this.id;
        }
        getTitle(): string {
            return this.title;
        }
        getConfidence(): number {
            return this.confidence;
        }
        getLocation(): android.graphics.RectF {
            return this.location;
        }
        setLocation(location: android.graphics.RectF): void {
            this.location = location;
        }
        toString(): string {
            let result = "";
            if (this.id !== undefined) {
                result += "[" + this.id + "] ";
            }
            if (this.title !== undefined) {
                result += this.title + " ";
            }

            if (this.confidence !== undefined) {
                result += (this.confidence * 100.0).toFixed(2);
            }

            if (this.location !== undefined) {
                result += this.location + " ";
            }

            return result.trim();
        }
    }
}

/** A classifier specialized to label images using TensorFlow. */
export class TensorFlowImageClassifier implements Classifier {
    // Only return this many results with at least this confidence.
    static MAX_RESULTS = 3;
    static THRESHOLD = 0.1;

    // config values
    private inputName: string;
    private outputName: string;
    private inputSize: number;
    private imageMean: number;
    private imageStd: number;

    private logStats: boolean = false;

    // Pre-allocated buffers.
    private labels = new java.util.Vector<string>();
    private intValues: any[];
    private floatValues: any[];
    private outputs: any[];
    private outputNames: any[];

    private inferenceInterface: any;

    private TensorFlowImageClassifier = function() {};

    /**
     * Initializes a native TensorFlow session for classifying images.
     *
     * @param assetManager The asset manager to be used to load assets.
     * @param modelFilename The filepath of the model GraphDef protocol buffer.
     * @param labelFilename The filepath of label file for classes.
     * @param inputSize The input size. A square image of inputSize x inputSize is assumed.
     * @param imageMean The assumed mean of the image values.
     * @param imageStd The assumed std of the image values.
     * @param inputName The label of the image input node.
     * @param outputName The label of the output node.
     * @throws IOException
     */
    public static create = function(
        assetManager: android.content.res.AssetManager,
        modelFilename: string,
        labelFilename: string,
        inputSize: number,
        imageMean: number,
        imageStd: number,
        inputName: string,
        outputName: string
    ): Classifier {
        const c = new TensorFlowImageClassifier();
        c.inputName = inputName;
        c.outputName = outputName;
        const actualFilename: string = labelFilename.split(
            "file:///android_asset/"
        )[1];

        // Read the label names into memory.
        let br: java.io.BufferedReader = null;
        console.log("Reading labels from: " + actualFilename);
        try {
            br = new java.io.BufferedReader(
                new java.io.InputStreamReader(assetManager.open(actualFilename))
            );
            let line;
            while ((line = br.readLine()) !== null) {
                c.labels.add(line);
            }
            br.close();
        } catch (e) {
            console.error("Problem reading label file! ", e);
        }

        c.inferenceInterface = new TensorFlowInferenceInterface(
            assetManager,
            modelFilename
        );

        // The shape of the output is [N, NUM_CLASSES], where N is the batch size.
        const operation = c.inferenceInterface.graphOperation(outputName);
        const numClasses = operation
            .output(0)
            .shape()
            .size(1);
        console.log(
            "Read " +
                c.labels.size() +
                " labels, output layer size is " +
                numClasses
        );

        // Ideally, inputSize could have been retrieved from the shape of the input operation.  Alas,
        // the placeholder node for input in the graphdef typically used does not specify a shape, so it
        // must be passed in as a parameter.
        c.inputSize = inputSize;
        c.imageMean = imageMean;
        c.imageStd = imageStd;

        // Pre-allocate buffers.

        // TODO: If ML doesn't work, then you need to manually create the arrays below
        // https://github.com/tensorflow/tensorflow/blob/27c55e556b77fdc841fb54483dece48476645239/tensorflow/examples/android/src/org/tensorflow/demo/TensorFlowImageClassifier.java#L118
        c.outputNames = [];
        c.intValues = [];
        c.floatValues = [];
        c.outputs = [];

        return c;
    };

    recognizeImage(bitmap): java.util.List<Classifier.Recognition> {
        console.log("recognizeImage");

        console.log("preprocessBitmap");
        // Preprocess the image data from 0-255 int to normalized float based
        // on the provided parameters.
        bitmap.getPixels(
            this.intValues,
            0,
            bitmap.getWidth(),
            0,
            0,
            bitmap.getWidth(),
            bitmap.getHeight()
        );

        for (let i = 0; i < this.intValues.length; ++i) {
            const val = this.intValues[i];
            this.floatValues[i * 3 + 0] =
                (((val >> 16) & 0xff) - this.imageMean) / this.imageStd;
            this.floatValues[i * 3 + 1] =
                (((val >> 8) & 0xff) - this.imageMean) / this.imageStd;
            this.floatValues[i * 3 + 2] =
                ((val & 0xff) - this.imageMean) / this.imageStd;
        }
        console.log("End of preprocessBitmap");

        // Copy the input data into TensorFlow.
        console.log("feed");
        this.inferenceInterface.feed(
            this.inputName,
            this.floatValues,
            1,
            this.inputSize,
            this.inputSize,
            3
        );
        console.log("End of feed");

        // Run the inference call.
        console.log("run");
        this.inferenceInterface.run(this.outputNames, this.logStats);
        console.log("End of run");

        // Copy the output Tensor back into the output array.
        console.log("fetch");
        this.inferenceInterface.fetch(this.outputName, this.outputs);
        console.log("End of fetch");

        // Find the best classifications.
        const pq = new java.util.PriorityQueue<Classifier.Recognition>(
            3,
            new java.util.Comparator<Classifier.Recognition>({
                equals: function(object: any): boolean {
                    return true;
                },
                compare: function(
                    lhs: Classifier.Recognition,
                    rhs: Classifier.Recognition
                ): number {
                    return java.lang.Float.compare(
                        rhs.getConfidence(),
                        lhs.getConfidence()
                    );
                }
            })
        );

        for (let i = 0; i < this.outputs.length; ++i) {
            if (this.outputs[i] > TensorFlowImageClassifier.THRESHOLD) {
                pq.add(
                    new Classifier.Recognition(
                        "" + i,
                        this.labels.size() > i ? this.labels.get(i) : "unknown",
                        this.outputs[i],
                        null
                    )
                );
            }
        }

        const recognitions = new java.util.ArrayList<Classifier.Recognition>();
        const recognitionsSize = Math.min(
            pq.size(),
            TensorFlowImageClassifier.MAX_RESULTS
        );
        for (let i = 0; i < recognitionsSize; ++i) {
            recognitions.add(pq.poll());
        }
        console.log("End of recognize image");

        return recognitions;
    }

    enableStatLogging(logStats) {
        this.logStats = logStats;
    }

    getStatString() {
        return this.inferenceInterface.getStatString();
    }

    close() {
        this.inferenceInterface.close();
    }
}
