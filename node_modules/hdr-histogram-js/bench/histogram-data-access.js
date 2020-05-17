"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var benny_1 = require("benny");
var index_1 = require("../index");
var randomInteger = function () { return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); };
var options = { initCount: 1000 };
benny_1.default.suite("Histogram data access", benny_1.default.add("Int32Histogram", function () {
    var histogram = index_1.build({ bitBucketSize: 32 });
    return function () {
        histogram.recordValue(randomInteger());
    };
}, options), benny_1.default.add("PackedHistogram", function () {
    var histogram = index_1.build({ bitBucketSize: "packed" });
    return function () {
        histogram.recordValue(randomInteger());
    };
}, options), benny_1.default.add("Float64Histogram", function () {
    var histogram = index_1.build({ bitBucketSize: 64 });
    return function () {
        histogram.recordValue(randomInteger());
    };
}, options), benny_1.default.add("SparseArrayHistogram", function () {
    var histogram = index_1.build({ bitBucketSize: "sparse_array" });
    return function () {
        histogram.recordValue(randomInteger());
    };
}, options), benny_1.default.add("Int32Histogram eager allocation", function () {
    var histogram = index_1.build({
        bitBucketSize: 32,
        highestTrackableValue: Number.MAX_SAFE_INTEGER
    });
    return function () {
        histogram.recordValue(randomInteger());
    };
}, options), benny_1.default.add("Float64Histogram eager allocation", function () {
    var histogram = index_1.build({
        bitBucketSize: 64,
        highestTrackableValue: Number.MAX_SAFE_INTEGER
    });
    return function () {
        histogram.recordValue(randomInteger());
    };
}, options), benny_1.default.complete(), benny_1.default.save({ file: "data-access", format: "chart.html" }));
//# sourceMappingURL=histogram-data-access.js.map