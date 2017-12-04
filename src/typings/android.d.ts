/// <reference path="./_helpers.d.ts" />
import javalangClass = java.lang.Class;
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module org {
	export module tensorflow {
		export class DataType {
			public static FLOAT: org.tensorflow.DataType;
			public static DOUBLE: org.tensorflow.DataType;
			public static INT32: org.tensorflow.DataType;
			public static UINT8: org.tensorflow.DataType;
			public static STRING: org.tensorflow.DataType;
			public static INT64: org.tensorflow.DataType;
			public static BOOL: org.tensorflow.DataType;
			public static valueOf(param0: string): org.tensorflow.DataType;
			public static values(): native.Array<org.tensorflow.DataType>;
			public static fromClass(param0: javalangClass): org.tensorflow.DataType;
		}
	}
}

import javautilIterator = java.util.Iterator;
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.Iterator.d.ts" />
/// <reference path="./org.tensorflow.Operation.d.ts" />
/// <reference path="./org.tensorflow.OperationBuilder.d.ts" />
declare module org {
	export module tensorflow {
		export class Graph {
			public opBuilder(param0: string, param1: string): org.tensorflow.OperationBuilder;
			public operation(param0: string): org.tensorflow.Operation;
			public importGraphDef(param0: native.Array<number>): void;
			public toGraphDef(): native.Array<number>;
			public constructor();
			public close(): void;
			public importGraphDef(param0: native.Array<number>, param1: string): void;
			public operations(): javautilIterator;
		}
		export module Graph {
			export class OperationIterator {
				public next(): org.tensorflow.Operation;
				public remove(): void;
				public hasNext(): boolean;
			}
			export class Reference {
				public close(): void;
				public nativeHandle(): number;
			}
		}
	}
}

declare module org {
	export module tensorflow {
		export class NativeLibrary {
			public static load(): void;
		}
	}
}

/// <reference path="./org.tensorflow.Output.d.ts" />
declare module org {
	export module tensorflow {
		export class Operand {
			/**
			 * Constructs a new instance of the org.tensorflow.Operand interface with the provided implementation.
			 */
			public constructor(implementation: {
				asOutput(): org.tensorflow.Output;
			});
			public asOutput(): org.tensorflow.Output;
		}
	}
}

import javalangObject = java.lang.Object;
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./org.tensorflow.Output.d.ts" />
declare module org {
	export module tensorflow {
		export class Operation {
			public output(param0: number): org.tensorflow.Output;
			public toString(): string;
			public name(): string;
			public inputListLength(param0: string): number;
			public outputListLength(param0: string): number;
			public outputList(param0: number, param1: number): native.Array<org.tensorflow.Output>;
			public numOutputs(): number;
			public equals(param0: javalangObject): boolean;
			public type(): string;
			public hashCode(): number;
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./org.tensorflow.DataType.d.ts" />
/// <reference path="./org.tensorflow.Operation.d.ts" />
/// <reference path="./org.tensorflow.Output.d.ts" />
/// <reference path="./org.tensorflow.Shape.d.ts" />
/// <reference path="./org.tensorflow.Tensor.d.ts" />
declare module org {
	export module tensorflow {
		export class OperationBuilder {
			public setAttr(param0: string, param1: string): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: org.tensorflow.Tensor): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: number): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: native.Array<string>): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: native.Array<org.tensorflow.DataType>): org.tensorflow.OperationBuilder;
			public build(): org.tensorflow.Operation;
			public setAttr(param0: string, param1: boolean): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: org.tensorflow.DataType): org.tensorflow.OperationBuilder;
			public addControlInput(param0: org.tensorflow.Operation): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: native.Array<boolean>): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: native.Array<org.tensorflow.Tensor>): org.tensorflow.OperationBuilder;
			public addInput(param0: org.tensorflow.Output): org.tensorflow.OperationBuilder;
			public setDevice(param0: string): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: native.Array<number>): org.tensorflow.OperationBuilder;
			public setAttr(param0: string, param1: org.tensorflow.Shape): org.tensorflow.OperationBuilder;
			public addInputList(param0: native.Array<org.tensorflow.Output>): org.tensorflow.OperationBuilder;
		}
	}
}

/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./org.tensorflow.DataType.d.ts" />
/// <reference path="./org.tensorflow.Operation.d.ts" />
/// <reference path="./org.tensorflow.Shape.d.ts" />
declare module org {
	export module tensorflow {
		export class Output {
			public asOutput(): org.tensorflow.Output;
			public toString(): string;
			public shape(): org.tensorflow.Shape;
			public equals(param0: javalangObject): boolean;
			public index(): number;
			public constructor(param0: org.tensorflow.Operation, param1: number);
			public dataType(): org.tensorflow.DataType;
			public op(): org.tensorflow.Operation;
			public hashCode(): number;
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./org.tensorflow.Graph.d.ts" />
/// <reference path="./org.tensorflow.Session.d.ts" />
declare module org {
	export module tensorflow {
		export class SavedModelBundle {
			public session(): org.tensorflow.Session;
			public static load(param0: string, param1: native.Array<string>): org.tensorflow.SavedModelBundle;
			public metaGraphDef(): native.Array<number>;
			public close(): void;
			public graph(): org.tensorflow.Graph;
		}
	}
}

import javautilList = java.util.List;
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.List.d.ts" />
/// <reference path="./org.tensorflow.Graph.d.ts" />
/// <reference path="./org.tensorflow.Operation.d.ts" />
/// <reference path="./org.tensorflow.Output.d.ts" />
/// <reference path="./org.tensorflow.Session.d.ts" />
/// <reference path="./org.tensorflow.Tensor.d.ts" />
declare module org {
	export module tensorflow {
		export class Session {
			public constructor(param0: org.tensorflow.Graph);
			public runner(): org.tensorflow.Session.Runner;
			public constructor(param0: org.tensorflow.Graph, param1: native.Array<number>);
			public close(): void;
		}
		export module Session {
			export class Run {
				public outputs: javautilList;
				public metadata: native.Array<number>;
				public constructor();
			}
			export class Runner {
				public addTarget(param0: org.tensorflow.Operation): org.tensorflow.Session.Runner;
				public feed(param0: org.tensorflow.Output, param1: org.tensorflow.Tensor): org.tensorflow.Session.Runner;
				public feed(param0: string, param1: number, param2: org.tensorflow.Tensor): org.tensorflow.Session.Runner;
				public fetch(param0: string): org.tensorflow.Session.Runner;
				public fetch(param0: org.tensorflow.Output): org.tensorflow.Session.Runner;
				public run(): javautilList;
				public constructor(param0: org.tensorflow.Session);
				public addTarget(param0: string): org.tensorflow.Session.Runner;
				public setOptions(param0: native.Array<number>): org.tensorflow.Session.Runner;
				public fetch(param0: string, param1: number): org.tensorflow.Session.Runner;
				public runAndFetchMetadata(): org.tensorflow.Session.Run;
				public feed(param0: string, param1: org.tensorflow.Tensor): org.tensorflow.Session.Runner;
			}
			export module Runner {
				export class Reference {
					public constructor(param0: org.tensorflow.Session.Runner);
					public close(): void;
				}
			}
		}
	}
}

declare module org {
	export module tensorflow {
		export class Shape {
			public static unknown(): org.tensorflow.Shape;
			public toString(): string;
			public numDimensions(): number;
			public static scalar(): org.tensorflow.Shape;
			public static make(param0: number, param1: native.Array<number>): org.tensorflow.Shape;
			public size(param0: number): number;
		}
	}
}

import javanioIntBuffer = java.nio.IntBuffer;
import javanioFloatBuffer = java.nio.FloatBuffer;
import javanioDoubleBuffer = java.nio.DoubleBuffer;
import javanioLongBuffer = java.nio.LongBuffer;
import javanioByteBuffer = java.nio.ByteBuffer;
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.nio.ByteBuffer.d.ts" />
/// <reference path="./java.nio.DoubleBuffer.d.ts" />
/// <reference path="./java.nio.FloatBuffer.d.ts" />
/// <reference path="./java.nio.IntBuffer.d.ts" />
/// <reference path="./java.nio.LongBuffer.d.ts" />
/// <reference path="./org.tensorflow.DataType.d.ts" />
declare module org {
	export module tensorflow {
		export class Tensor {
			public writeTo(param0: javanioDoubleBuffer): void;
			public static create(param0: javalangClass, param1: native.Array<number>, param2: javanioByteBuffer): org.tensorflow.Tensor;
			public static create(param0: native.Array<number>, param1: javanioDoubleBuffer): org.tensorflow.Tensor;
			public writeTo(param0: javanioLongBuffer): void;
			public numElements(): number;
			public expect(param0: javalangClass): org.tensorflow.Tensor;
			public numBytes(): number;
			public doubleValue(): number;
			public static create(param0: native.Array<number>, param1: javanioFloatBuffer): org.tensorflow.Tensor;
			public numDimensions(): number;
			public shape(): native.Array<number>;
			public copyTo(param0: javalangObject): javalangObject;
			public close(): void;
			public static create(param0: native.Array<number>, param1: javanioIntBuffer): org.tensorflow.Tensor;
			public booleanValue(): boolean;
			public static create(param0: javalangObject, param1: javalangClass): org.tensorflow.Tensor;
			public writeTo(param0: javanioIntBuffer): void;
			public writeTo(param0: javanioByteBuffer): void;
			public floatValue(): number;
			public intValue(): number;
			public writeTo(param0: javanioFloatBuffer): void;
			public static create(param0: javalangObject): org.tensorflow.Tensor;
			public toString(): string;
			public static create(param0: native.Array<number>, param1: javanioLongBuffer): org.tensorflow.Tensor;
			public dataType(): org.tensorflow.DataType;
			public bytesValue(): native.Array<number>;
			public longValue(): number;
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
declare module org {
	export module tensorflow {
		export class TensorFlow {
			public static version(): string;
			public static registeredOpList(): native.Array<number>;
			public static loadLibrary(param0: string): native.Array<number>;
		}
	}
}

declare module org {
	export module tensorflow {
		export class TensorFlowException {
		}
	}
}

import javaniocharsetCharset = java.nio.charset.Charset;
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.nio.charset.Charset.d.ts" />
/// <reference path="./org.tensorflow.Tensor.d.ts" />
declare module org {
	export module tensorflow {
		export class Tensors {
			public static create(param0: string): org.tensorflow.Tensor;
			public static create(param0: native.Array<number>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<native.Array<number>>>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<native.Array<native.Array<boolean>>>>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<native.Array<native.Array<native.Array<number>>>>>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<boolean>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<native.Array<boolean>>>>): org.tensorflow.Tensor;
			public static create(param0: string, param1: javaniocharsetCharset): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<number>>): org.tensorflow.Tensor;
			public static create(param0: number): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<boolean>>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<number>>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<native.Array<native.Array<native.Array<boolean>>>>>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<boolean>>): org.tensorflow.Tensor;
			public static create(param0: native.Array<native.Array<native.Array<native.Array<native.Array<number>>>>>): org.tensorflow.Tensor;
			public static create(param0: boolean): org.tensorflow.Tensor;
		}
	}
}

declare module org {
	export module tensorflow {
		export module contrib {
			export module android {
				export class RunStats {
					public constructor();
					public summary(): string;
					public close(): void;
					public static runOptions(): native.Array<number>;
					public add(param0: native.Array<number>): void;
				}
			}
		}
	}
}

import androidcontentresAssetManager = android.content.res.AssetManager;
import javaioInputStream = java.io.InputStream;
/// <reference path="./android.content.res.AssetManager.d.ts" />
/// <reference path="./java.io.InputStream.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.nio.ByteBuffer.d.ts" />
/// <reference path="./java.nio.DoubleBuffer.d.ts" />
/// <reference path="./java.nio.FloatBuffer.d.ts" />
/// <reference path="./java.nio.IntBuffer.d.ts" />
/// <reference path="./java.nio.LongBuffer.d.ts" />
/// <reference path="./org.tensorflow.Graph.d.ts" />
/// <reference path="./org.tensorflow.Operation.d.ts" />
declare module org {
	export module tensorflow {
		export module contrib {
			export module android {
				export class TensorFlowInferenceInterface {
					public constructor(param0: javaioInputStream);
					public fetch(param0: string, param1: javanioDoubleBuffer): void;
					public getStatString(): string;
					public run(param0: native.Array<string>): void;
					public feed(param0: string, param1: native.Array<number>, param2: native.Array<number>): void;
					public feedString(param0: string, param1: native.Array<native.Array<number>>): void;
					public finalize(): void;
					public constructor(param0: org.tensorflow.Graph);
					public feed(param0: string, param1: javanioLongBuffer, param2: native.Array<number>): void;
					public feedString(param0: string, param1: native.Array<number>): void;
					public fetch(param0: string, param1: javanioByteBuffer): void;
					public graph(): org.tensorflow.Graph;
					public feed(param0: string, param1: javanioIntBuffer, param2: native.Array<number>): void;
					public fetch(param0: string, param1: javanioIntBuffer): void;
					public constructor(param0: androidcontentresAssetManager, param1: string);
					public feed(param0: string, param1: javanioDoubleBuffer, param2: native.Array<number>): void;
					public run(param0: native.Array<string>, param1: boolean): void;
					public feed(param0: string, param1: javanioByteBuffer, param2: native.Array<number>): void;
					public fetch(param0: string, param1: native.Array<number>): void;
					public fetch(param0: string, param1: javanioFloatBuffer): void;
					public close(): void;
					public graphOperation(param0: string): org.tensorflow.Operation;
					public feed(param0: string, param1: javanioFloatBuffer, param2: native.Array<number>): void;
					public fetch(param0: string, param1: javanioLongBuffer): void;
				}
				export module TensorFlowInferenceInterface {
					export class TensorId {
						public static parse(param0: string): org.tensorflow.contrib.android.TensorFlowInferenceInterface.TensorId;
					}
				}
			}
		}
	}
}

declare module org {
	export module tensorflow {
		export module types {
			export class UInt8 {
			}
		}
	}
}

