/// <reference path="./_helpers.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module org {
	export module tensorflow {
		export module lite {
			export class DataType {
				public static FLOAT32: org.tensorflow.lite.DataType;
				public static INT32: org.tensorflow.lite.DataType;
				public static UINT8: org.tensorflow.lite.DataType;
				public static INT64: org.tensorflow.lite.DataType;
				public static BYTEBUFFER: org.tensorflow.lite.DataType;
				public static values(): native.Array<org.tensorflow.lite.DataType>;
				public static valueOf(param0: string): org.tensorflow.lite.DataType;
			}
		}
	}
}

import javaioFile = java.io.File;
import javanioMappedByteBuffer = java.nio.MappedByteBuffer;
import javalangObject = java.lang.Object;
import javautilMap = java.util.Map;
/// <reference path="./java.io.File.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.nio.MappedByteBuffer.d.ts" />
/// <reference path="./java.util.Map.d.ts" />
declare module org {
	export module tensorflow {
		export module lite {
			export class Interpreter {
				public close(): void;
				public runForMultipleInputsOutputs(param0: native.Array<javalangObject>, param1: javautilMap): void;
				public getInputIndex(param0: string): number;
				public resizeInput(param0: number, param1: native.Array<number>): void;
				public getOutputIndex(param0: string): number;
				public constructor(param0: javaioFile);
				public constructor(param0: javanioMappedByteBuffer);
				public run(param0: javalangObject, param1: javalangObject): void;
			}
		}
	}
}

declare module org {
	export module tensorflow {
		export module lite {
			export class NativeInterpreterWrapper {
				public close(): void;
			}
		}
	}
}

declare module org {
	export module tensorflow {
		export module lite {
			export class Tensor {
			}
		}
	}
}

declare module org {
	export module tensorflow {
		export module lite {
			export class TensorFlowLite {
				public static version(): string;
			}
		}
	}
}

