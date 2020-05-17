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
var Int32Histogram_1 = require("./Int32Histogram");
require("./AbstractHistogram.encoding");
var base64 = require("base64-js");
var decodeFromCompressedBase64 = function (base64String, histogramConstr, minBarForHighestTrackableValue) {
    if (histogramConstr === void 0) { histogramConstr = Int32Histogram_1.default; }
    if (minBarForHighestTrackableValue === void 0) { minBarForHighestTrackableValue = 0; }
    var buffer = new ByteBuffer_1.default(base64.toByteArray(base64String.trim()));
    return AbstractHistogram_1.AbstractHistogram.decodeFromCompressedByteBuffer(buffer, histogramConstr, minBarForHighestTrackableValue);
};
exports.decodeFromCompressedBase64 = decodeFromCompressedBase64;
var encodeIntoBase64String = function (histogram, compressionLevel) {
    var buffer = ByteBuffer_1.default.allocate();
    var bufferSize = histogram.encodeIntoCompressedByteBuffer(buffer, compressionLevel);
    var encodedBuffer = buffer.data.slice(0, bufferSize);
    return base64.fromByteArray(encodedBuffer);
};
exports.encodeIntoBase64String = encodeIntoBase64String;
//# sourceMappingURL=encoding.js.map