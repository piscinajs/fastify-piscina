"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
var ByteBuffer_1 = require("./ByteBuffer");
var AbstractHistogram_1 = require("./AbstractHistogram");
var ZigZagEncoding_1 = require("./ZigZagEncoding");
var max = Math.max;
var V2EncodingCookieBase = 0x1c849303;
var V2CompressedEncodingCookieBase = 0x1c849304;
var V2maxWordSizeInBytes = 9; // LEB128-64b9B + ZigZag require up to 9 bytes per word
var encodingCookie = V2EncodingCookieBase | 0x10; // LSBit of wordsize byte indicates TLZE Encoding
var compressedEncodingCookie = V2CompressedEncodingCookieBase | 0x10; // LSBit of wordsize byte indicates TLZE Encoding
function fillBufferFromCountsArray(self, buffer) {
    var countsLimit = self.countsArrayIndex(self.maxValue) + 1;
    var srcIndex = 0;
    while (srcIndex < countsLimit) {
        // V2 encoding format uses a ZigZag LEB128-64b9B encoded long. Positive values are counts,
        // while negative values indicate a repeat zero counts.
        var count = self.getCountAtIndex(srcIndex++);
        if (count < 0) {
            throw new Error("Cannot encode histogram containing negative counts (" +
                count +
                ") at index " +
                srcIndex +
                ", corresponding the value range [" +
                self.lowestEquivalentValue(self.valueFromIndex(srcIndex)) +
                "," +
                self.nextNonEquivalentValue(self.valueFromIndex(srcIndex)) +
                ")");
        }
        // Count trailing 0s (which follow this count):
        var zerosCount = 0;
        if (count == 0) {
            zerosCount = 1;
            while (srcIndex < countsLimit && self.getCountAtIndex(srcIndex) == 0) {
                zerosCount++;
                srcIndex++;
            }
        }
        if (zerosCount > 1) {
            ZigZagEncoding_1.default.encode(buffer, -zerosCount);
        }
        else {
            ZigZagEncoding_1.default.encode(buffer, count);
        }
    }
}
/**
 * Encode this histogram into a ByteBuffer
 * @param buffer The buffer to encode into
 * @return The number of bytes written to the buffer
 */
function encodeIntoByteBuffer(buffer) {
    var self = this;
    var initialPosition = buffer.position;
    buffer.putInt32(encodingCookie);
    buffer.putInt32(0); // Placeholder for payload length in bytes.
    buffer.putInt32(1);
    buffer.putInt32(self.numberOfSignificantValueDigits);
    buffer.putInt64(self.lowestDiscernibleValue);
    buffer.putInt64(self.highestTrackableValue);
    buffer.putInt64(1);
    var payloadStartPosition = buffer.position;
    fillBufferFromCountsArray(self, buffer);
    var backupIndex = buffer.position;
    buffer.position = initialPosition + 4;
    buffer.putInt32(backupIndex - payloadStartPosition); // Record the payload length
    buffer.position = backupIndex;
    return backupIndex - initialPosition;
}
exports.encodeIntoByteBuffer = encodeIntoByteBuffer;
function fillCountsArrayFromSourceBuffer(self, sourceBuffer, lengthInBytes, wordSizeInBytes) {
    if (wordSizeInBytes != 2 &&
        wordSizeInBytes != 4 &&
        wordSizeInBytes != 8 &&
        wordSizeInBytes != V2maxWordSizeInBytes) {
        throw new Error("word size must be 2, 4, 8, or V2maxWordSizeInBytes (" +
            V2maxWordSizeInBytes +
            ") bytes");
    }
    var dstIndex = 0;
    var endPosition = sourceBuffer.position + lengthInBytes;
    while (sourceBuffer.position < endPosition) {
        var zerosCount = 0;
        var count = ZigZagEncoding_1.default.decode(sourceBuffer);
        if (count < 0) {
            zerosCount = -count;
            dstIndex += zerosCount; // No need to set zeros in array. Just skip them.
        }
        else {
            self.setCountAtIndex(dstIndex++, count);
        }
    }
    return dstIndex; // this is the destination length
}
function getCookieBase(cookie) {
    return cookie & ~0xf0;
}
function getWordSizeInBytesFromCookie(cookie) {
    if (getCookieBase(cookie) == V2EncodingCookieBase ||
        getCookieBase(cookie) == V2CompressedEncodingCookieBase) {
        return V2maxWordSizeInBytes;
    }
    var sizeByte = (cookie & 0xf0) >> 4;
    return sizeByte & 0xe;
}
function doDecodeFromByteBuffer(buffer, histogramConstr, minBarForHighestTrackableValue) {
    var cookie = buffer.getInt32();
    var payloadLengthInBytes;
    var numberOfSignificantValueDigits;
    var lowestTrackableUnitValue;
    var highestTrackableValue;
    if (getCookieBase(cookie) === V2EncodingCookieBase) {
        if (getWordSizeInBytesFromCookie(cookie) != V2maxWordSizeInBytes) {
            throw new Error("The buffer does not contain a Histogram (no valid cookie found)");
        }
        payloadLengthInBytes = buffer.getInt32();
        buffer.getInt32(); // normalizingIndexOffset not used
        numberOfSignificantValueDigits = buffer.getInt32();
        lowestTrackableUnitValue = buffer.getInt64();
        highestTrackableValue = buffer.getInt64();
        buffer.getInt64(); // integerToDoubleValueConversionRatio not used
    }
    else {
        throw new Error("The buffer does not contain a Histogram (no valid V2 encoding cookie found)");
    }
    highestTrackableValue = max(highestTrackableValue, minBarForHighestTrackableValue);
    var histogram = new histogramConstr(lowestTrackableUnitValue, highestTrackableValue, numberOfSignificantValueDigits);
    var filledLength = fillCountsArrayFromSourceBuffer(histogram, buffer, payloadLengthInBytes, V2maxWordSizeInBytes);
    histogram.establishInternalTackingValues(filledLength);
    return histogram;
}
exports.doDecodeFromByteBuffer = doDecodeFromByteBuffer;
function findDeflateFunction() {
    try {
        return eval('require("zlib").deflateSync');
    }
    catch (error) {
        var pako = require("pako/lib/deflate");
        return pako.deflate;
    }
}
function findInflateFunction() {
    try {
        return eval('require("zlib").inflateSync');
    }
    catch (error) {
        var pako = require("pako/lib/inflate");
        return pako.inflate;
    }
}
var deflate = findDeflateFunction();
var inflate = findInflateFunction();
function doDecodeFromCompressedByteBuffer(buffer, histogramConstr, minBarForHighestTrackableValue) {
    var initialTargetPosition = buffer.position;
    var cookie = buffer.getInt32();
    if ((cookie & ~0xf0) !== V2CompressedEncodingCookieBase) {
        throw new Error("Encoding not supported, only V2 is supported");
    }
    var lengthOfCompressedContents = buffer.getInt32();
    var uncompressedBuffer = inflate(buffer.data.slice(initialTargetPosition + 8, initialTargetPosition + 8 + lengthOfCompressedContents));
    return doDecodeFromByteBuffer(new ByteBuffer_1.default(uncompressedBuffer), histogramConstr, minBarForHighestTrackableValue);
}
exports.doDecodeFromCompressedByteBuffer = doDecodeFromCompressedByteBuffer;
/**
 * Encode this histogram in compressed form into a byte array
 * @param targetBuffer The buffer to encode into
 * @return The number of bytes written to the array
 */
function encodeIntoCompressedByteBuffer(targetBuffer, compressionLevel) {
    var self = this;
    var intermediateUncompressedByteBuffer = ByteBuffer_1.default.allocate();
    var uncompressedLength = self.encodeIntoByteBuffer(intermediateUncompressedByteBuffer);
    targetBuffer.putInt32(compressedEncodingCookie);
    var compressionOptions = compressionLevel
        ? { level: compressionLevel }
        : {};
    var compressedArray = deflate(intermediateUncompressedByteBuffer.data.slice(0, uncompressedLength), compressionOptions);
    targetBuffer.putInt32(compressedArray.byteLength);
    targetBuffer.putArray(compressedArray);
    return targetBuffer.position;
}
exports.encodeIntoCompressedByteBuffer = encodeIntoCompressedByteBuffer;
AbstractHistogram_1.AbstractHistogram.decodeFromByteBuffer = doDecodeFromByteBuffer;
AbstractHistogram_1.AbstractHistogram.decodeFromCompressedByteBuffer = doDecodeFromCompressedByteBuffer;
AbstractHistogram_1.AbstractHistogram.prototype.encodeIntoByteBuffer = encodeIntoByteBuffer;
AbstractHistogram_1.AbstractHistogram.prototype.encodeIntoCompressedByteBuffer = encodeIntoCompressedByteBuffer;
//# sourceMappingURL=AbstractHistogram.encoding.js.map