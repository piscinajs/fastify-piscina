"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fc = require("fast-check");
var hdr = require("./index");
var runFromStryker = __dirname.includes("stryker");
var runnerOptions = {
    numRuns: runFromStryker ? 10 : 1000,
    verbose: true
};
describe("Histogram percentile computation", function () {
    it("should be accurate according to its significant figures", function () {
        var numberOfSignificantValueDigits = 3;
        var histogram = hdr.build({
            numberOfSignificantValueDigits: numberOfSignificantValueDigits
        });
        fc.json;
        fc.assert(fc.property(arbData(2000), function (numbers) {
            histogram.reset();
            numbers.forEach(function (n) { return histogram.recordValue(n); });
            var actual = quantile(numbers, 90);
            var got = histogram.getValueAtPercentile(90);
            var relativeError = Math.abs(1 - got / actual);
            var variation = Math.pow(10, -numberOfSignificantValueDigits);
            return relativeError < variation;
        }), runnerOptions);
    });
});
describe("Histogram encoding/decoding", function () {
    it("should keep all data after an encoding/decoding roundtrip", function () {
        var numberOfSignificantValueDigits = 3;
        [8, 16, 32, 64].forEach(function (bitBucketSize) {
            fc.assert(fc.property(arbData(1), fc.double(50, 100), function (numbers, percentile) {
                var histogram = hdr.build({
                    bitBucketSize: bitBucketSize,
                    numberOfSignificantValueDigits: numberOfSignificantValueDigits
                });
                numbers.forEach(function (n) { return histogram.recordValue(n); });
                var encodedHistogram = hdr.encodeIntoBase64String(histogram);
                var decodedHistogram = hdr.decodeFromCompressedBase64(encodedHistogram);
                var actual = histogram.getValueAtPercentile(percentile);
                var got = decodedHistogram.getValueAtPercentile(percentile);
                return actual === got;
            }), runnerOptions);
        });
    });
});
var arbData = function (size) {
    return fc.array(fc.integer(1, Number.MAX_SAFE_INTEGER), size, size);
};
// reference implementation
var quantile = function (inputData, percentile) {
    var data = __spreadArrays(inputData).sort(function (a, b) { return a - b; });
    var index = percentile / 100 * (data.length - 1);
    var result;
    if (Math.floor(index) === index) {
        result = data[index];
    }
    else {
        var i = Math.floor(index);
        var fraction = index - i;
        result = data[i] + (data[i + 1] - data[i]) * fraction;
    }
    return result;
};
//# sourceMappingURL=Histogram.fc.spec.js.map