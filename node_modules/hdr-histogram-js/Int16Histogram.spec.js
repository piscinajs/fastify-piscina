"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var Int16Histogram_1 = require("./Int16Histogram");
describe("Int16 histogram", function () {
    it("should record a value", function () {
        // given
        var histogram = new Int16Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        // when
        histogram.recordValue(123456);
        // then
        chai_1.expect(histogram.counts[8073]).equals(1);
    });
    it("should compute median value in first bucket", function () {
        // given
        var histogram = new Int16Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        histogram.recordValue(123456);
        histogram.recordValue(127);
        histogram.recordValue(42);
        // when
        var medianValue = histogram.getValueAtPercentile(50);
        // then
        chai_1.expect(medianValue).equals(127);
    });
    it("should compute value outside first bucket with an error less than 1000", function () {
        // given
        var histogram = new Int16Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        histogram.recordValue(123456);
        histogram.recordValue(122777);
        histogram.recordValue(127);
        histogram.recordValue(42);
        // when
        var percentileValue = histogram.getValueAtPercentile(99.9);
        // then
        chai_1.expect(percentileValue).satisfies(function (result) { return Math.abs(result - 123456) < 1000; });
    });
});
//# sourceMappingURL=Int16Histogram.spec.js.map