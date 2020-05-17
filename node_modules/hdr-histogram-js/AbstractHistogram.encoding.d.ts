import ByteBuffer from "./ByteBuffer";
import { AbstractHistogram, HistogramConstructor } from "./AbstractHistogram";
/**
 * Encode this histogram into a ByteBuffer
 * @param buffer The buffer to encode into
 * @return The number of bytes written to the buffer
 */
export declare function encodeIntoByteBuffer(buffer: ByteBuffer): number;
export declare function doDecodeFromByteBuffer(buffer: ByteBuffer, histogramConstr: HistogramConstructor, minBarForHighestTrackableValue: number): AbstractHistogram;
export declare function doDecodeFromCompressedByteBuffer(buffer: ByteBuffer, histogramConstr: HistogramConstructor, minBarForHighestTrackableValue: number): AbstractHistogram;
/**
 * Encode this histogram in compressed form into a byte array
 * @param targetBuffer The buffer to encode into
 * @return The number of bytes written to the array
 */
export declare function encodeIntoCompressedByteBuffer(targetBuffer: ByteBuffer, compressionLevel?: number): number;
declare module "./AbstractHistogram" {
    namespace AbstractHistogram {
        let decodeFromByteBuffer: typeof doDecodeFromByteBuffer;
        let decodeFromCompressedByteBuffer: typeof doDecodeFromCompressedByteBuffer;
    }
}
declare module "./AbstractHistogram" {
    interface AbstractHistogram {
        encodeIntoByteBuffer: typeof encodeIntoByteBuffer;
        encodeIntoCompressedByteBuffer: typeof encodeIntoCompressedByteBuffer;
    }
}
