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
exports.ByteBuffer = ByteBuffer_1.default;
var Int8Histogram_1 = require("./Int8Histogram");
exports.Int8Histogram = Int8Histogram_1.default;
var Int16Histogram_1 = require("./Int16Histogram");
exports.Int16Histogram = Int16Histogram_1.default;
var Int32Histogram_1 = require("./Int32Histogram");
exports.Int32Histogram = Int32Histogram_1.default;
var Float64Histogram_1 = require("./Float64Histogram");
exports.Float64Histogram = Float64Histogram_1.default;
var PackedHistogram_1 = require("./PackedHistogram");
exports.PackedHistogram = PackedHistogram_1.default;
var SparseArrayHistogram_1 = require("./SparseArrayHistogram");
exports.SparseArrayHistogram = SparseArrayHistogram_1.default;
var AbstractHistogram_1 = require("./AbstractHistogram");
exports.AbstractHistogram = AbstractHistogram_1.default;
exports.Histogram = AbstractHistogram_1.default;
var HistogramLogReader_1 = require("./HistogramLogReader");
exports.HistogramLogReader = HistogramLogReader_1.default;
exports.listTags = HistogramLogReader_1.listTags;
var HistogramLogWriter_1 = require("./HistogramLogWriter");
exports.HistogramLogWriter = HistogramLogWriter_1.default;
var encoding_1 = require("./encoding");
exports.decodeFromCompressedBase64 = encoding_1.decodeFromCompressedBase64;
exports.encodeIntoBase64String = encoding_1.encodeIntoBase64String;
var Recorder_1 = require("./Recorder");
exports.Recorder = Recorder_1.default;
var defaultRequest = {
    bitBucketSize: 32,
    autoResize: true,
    lowestDiscernibleValue: 1,
    highestTrackableValue: 2,
    numberOfSignificantValueDigits: 3
};
exports.defaultRequest = defaultRequest;
/*const bigIntAvailable = (() => {
  try {
    eval("123n");
    return true;
  } catch (e) {
    return false;
  }
})();*/
var build = function (request) {
    if (request === void 0) { request = defaultRequest; }
    var parameters = Object.assign({}, defaultRequest, request);
    var histogramConstr;
    switch (parameters.bitBucketSize) {
        case 8:
            histogramConstr = Int8Histogram_1.default;
            break;
        case 16:
            histogramConstr = Int16Histogram_1.default;
            break;
        case 32:
            histogramConstr = Int32Histogram_1.default;
            break;
        case "sparse_array":
            histogramConstr = SparseArrayHistogram_1.default;
            break;
        case "packed":
            histogramConstr = PackedHistogram_1.default;
            break;
        default:
            //histogramConstr = bigIntAvailable ? BigIntHistogram : Float64Histogram;
            histogramConstr = Float64Histogram_1.default;
    }
    var histogram = new histogramConstr(parameters.lowestDiscernibleValue, parameters.highestTrackableValue, parameters.numberOfSignificantValueDigits);
    histogram.autoResize = parameters.autoResize;
    return histogram;
};
exports.build = build;
//# sourceMappingURL=index.js.map