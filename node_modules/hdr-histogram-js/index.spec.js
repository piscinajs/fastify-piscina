"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
var chai_1 = require("chai");
var hdr = require("./index");
describe("Histogram builder", function () {
    it("should build histogram with default values", function () {
        // given
        // when
        var histogram = hdr.build();
        // then
        chai_1.expect(histogram).to.be.not.null;
        chai_1.expect(histogram.autoResize).to.be.true;
        chai_1.expect(histogram.highestTrackableValue).to.be.equal(2);
    });
    it("should build histogram with custom parameters", function () {
        // given
        // when
        var histogram = hdr.build({
            bitBucketSize: 32,
            numberOfSignificantValueDigits: 2
        });
        var expectedHistogram = new hdr.Int32Histogram(1, 2, 2);
        expectedHistogram.autoResize = true;
        histogram.recordValue(12345678);
        expectedHistogram.recordValue(12345678);
        // then
        chai_1.expect(histogram.outputPercentileDistribution()).to.be.equal(expectedHistogram.outputPercentileDistribution());
    });
});
//# sourceMappingURL=index.spec.js.map