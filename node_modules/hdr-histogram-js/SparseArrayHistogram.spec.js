"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var SparseArrayHistogram_1 = require("./SparseArrayHistogram");
describe("Sparse Array histogram", function () {
    it("should compute median value in first bucket", function () {
        // given
        var histogram = new SparseArrayHistogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
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
        var histogram = new SparseArrayHistogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
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
//# sourceMappingURL=SparseArrayHistogram.spec.js.map