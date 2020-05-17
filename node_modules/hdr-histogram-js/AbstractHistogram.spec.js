"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var AbstractHistogramBase_1 = require("./AbstractHistogramBase");
var AbstractHistogram_1 = require("./AbstractHistogram");
var Int32Histogram_1 = require("./Int32Histogram");
var HistogramForTests = /** @class */ (function (_super) {
    __extends(HistogramForTests, _super);
    function HistogramForTests() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //constructor() {}
    HistogramForTests.prototype.clearCounts = function () { };
    HistogramForTests.prototype.incrementCountAtIndex = function (index) { };
    HistogramForTests.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
    HistogramForTests.prototype.incrementTotalCount = function () { };
    HistogramForTests.prototype.addToTotalCount = function (value) { };
    HistogramForTests.prototype.setTotalCount = function (totalCount) { };
    HistogramForTests.prototype.resize = function (newHighestTrackableValue) {
        this.establishSize(newHighestTrackableValue);
    };
    HistogramForTests.prototype.addToCountAtIndex = function (index, value) { };
    HistogramForTests.prototype.setCountAtIndex = function (index, value) { };
    HistogramForTests.prototype.getTotalCount = function () {
        return 0;
    };
    HistogramForTests.prototype.getCountAtIndex = function (index) {
        return 0;
    };
    HistogramForTests.prototype._getEstimatedFootprintInBytes = function () {
        return 42;
    };
    HistogramForTests.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
        return this;
    };
    return HistogramForTests;
}(AbstractHistogram_1.default));
describe("Histogram initialization", function () {
    var histogram;
    beforeEach(function () {
        histogram = new HistogramForTests(1, Number.MAX_SAFE_INTEGER, 3);
    });
    it("should set sub bucket size", function () {
        chai_1.expect(histogram.subBucketCount).to.be.equal(2048);
    });
    it("should set resize to false when max value specified", function () {
        chai_1.expect(histogram.autoResize).to.be.false;
    });
    it("should compute counts array length", function () {
        chai_1.expect(histogram.countsArrayLength).to.be.equal(45056);
    });
    it("should compute bucket count", function () {
        chai_1.expect(histogram.bucketCount).to.be.equal(43);
    });
    it("should set min non zero value", function () {
        chai_1.expect(histogram.minNonZeroValue).to.be.equal(Number.MAX_SAFE_INTEGER);
    });
    it("should set max value", function () {
        chai_1.expect(histogram.maxValue).to.be.equal(0);
    });
});
describe("Histogram recording values", function () {
    it("should compute count index when value in first bucket", function () {
        // given
        var histogram = new HistogramForTests(1, Number.MAX_SAFE_INTEGER, 3);
        // when
        var index = histogram.countsArrayIndex(2000); // 2000 < 2048
        chai_1.expect(index).to.be.equal(2000);
    });
    it("should compute count index when value outside first bucket", function () {
        // given
        var histogram = new HistogramForTests(1, Number.MAX_SAFE_INTEGER, 3);
        // when
        var index = histogram.countsArrayIndex(2050); // 2050 > 2048
        // then
        chai_1.expect(index).to.be.equal(2049);
    });
    it("should compute count index taking into account lowest discernible value", function () {
        // given
        var histogram = new HistogramForTests(2000, Number.MAX_SAFE_INTEGER, 2);
        // when
        var index = histogram.countsArrayIndex(16000);
        // then
        chai_1.expect(index).to.be.equal(15);
    });
    it("should compute count index of a big value taking into account lowest discernible value", function () {
        // given
        var histogram = new HistogramForTests(2000, Number.MAX_SAFE_INTEGER, 2);
        // when
        var bigValue = Number.MAX_SAFE_INTEGER - 1;
        var index = histogram.countsArrayIndex(bigValue);
        // then
        chai_1.expect(index).to.be.equal(4735);
    });
    it("should update min non zero value", function () {
        // given
        var histogram = new HistogramForTests(1, Number.MAX_SAFE_INTEGER, 3);
        // when
        histogram.recordValue(123);
        // then
        chai_1.expect(histogram.minNonZeroValue).to.be.equal(123);
    });
    it("should update max value", function () {
        // given
        var histogram = new HistogramForTests(1, Number.MAX_SAFE_INTEGER, 3);
        // when
        histogram.recordValue(123);
        // then
        chai_1.expect(histogram.maxValue).to.be.equal(123);
    });
    it("should throw an error when value bigger than highest trackable value", function () {
        // given
        var histogram = new HistogramForTests(1, 4096, 3);
        // when then
        chai_1.expect(function () { return histogram.recordValue(9000); }).to.throw();
    });
    it("should not throw an error when autoresize enable and value bigger than highest trackable value", function () {
        // given
        var histogram = new HistogramForTests(1, 4096, 3);
        histogram.autoResize = true;
        // when then
        chai_1.expect(function () { return histogram.recordValue(9000); }).to.not.throw();
    });
    it("should increase counts array size when recording value bigger than highest trackable value", function () {
        // given
        var histogram = new HistogramForTests(1, 4096, 3);
        histogram.autoResize = true;
        // when
        histogram.recordValue(9000);
        // then
        chai_1.expect(histogram.highestTrackableValue).to.be.greaterThan(9000);
    });
    /*
    it("should bench", () => {
      const histogram = new HistogramForTests(1, Number.MAX_SAFE_INTEGER, 3);
      for (var i = 0; i < 1000; i++) {
         histogram.recordValue(Math.floor(Math.random() * 100000));
      }
      const start = new Date().getTime();
      const nbLoop = 100000;
      for (var i = 0; i < nbLoop; i++) {
         histogram.recordValue(Math.floor(Math.random() * 100000));
      }
      const end = new Date().getTime();
      console.log("avg", (end - start)/nbLoop );
  
    })
  */
});
describe("Histogram computing statistics", function () {
    var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
    it("should compute mean value", function () {
        // given
        histogram.reset();
        // when
        histogram.recordValue(25);
        histogram.recordValue(50);
        histogram.recordValue(75);
        // then
        chai_1.expect(histogram.getMean()).to.be.equal(50);
    });
    it("should compute standard deviation", function () {
        // given
        histogram.reset();
        // when
        histogram.recordValue(25);
        histogram.recordValue(50);
        histogram.recordValue(75);
        // then
        chai_1.expect(histogram.getStdDeviation()).to.be.greaterThan(20.4124);
        chai_1.expect(histogram.getStdDeviation()).to.be.below(20.4125);
    });
    it("should compute percentile distribution", function () {
        // given
        histogram.reset();
        // when
        histogram.recordValue(25);
        histogram.recordValue(50);
        histogram.recordValue(75);
        // then
        var expectedResult = "       Value     Percentile TotalCount 1/(1-Percentile)\n\n      25.000 0.000000000000          1           1.00\n      25.000 0.100000000000          1           1.11\n      25.000 0.200000000000          1           1.25\n      25.000 0.300000000000          1           1.43\n      50.000 0.400000000000          2           1.67\n      50.000 0.500000000000          2           2.00\n      50.000 0.550000000000          2           2.22\n      50.000 0.600000000000          2           2.50\n      50.000 0.650000000000          2           2.86\n      75.000 0.700000000000          3           3.33\n      75.000 1.000000000000          3\n#[Mean    =       50.000, StdDeviation   =       20.412]\n#[Max     =       75.000, Total count    =            3]\n#[Buckets =           43, SubBuckets     =         2048]\n";
        chai_1.expect(histogram.outputPercentileDistribution()).to.be.equal(expectedResult);
    });
    it("should compute percentile distribution in csv format", function () {
        // given
        histogram.reset();
        // when
        histogram.recordValue(25);
        histogram.recordValue(50);
        histogram.recordValue(75);
        // then
        var expectedResult = "\"Value\",\"Percentile\",\"TotalCount\",\"1/(1-Percentile)\"\n25.000,0.000000000000,1,1.00\n25.000,0.100000000000,1,1.11\n25.000,0.200000000000,1,1.25\n25.000,0.300000000000,1,1.43\n50.000,0.400000000000,2,1.67\n50.000,0.500000000000,2,2.00\n50.000,0.550000000000,2,2.22\n50.000,0.600000000000,2,2.50\n50.000,0.650000000000,2,2.86\n75.000,0.700000000000,3,3.33\n75.000,1.000000000000,3,Infinity\n";
        chai_1.expect(histogram.outputPercentileDistribution(undefined, undefined, true)).to.be.equal(expectedResult);
    });
});
describe("Histogram correcting coordinated omissions", function () {
    var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
    it("should generate additional values when recording", function () {
        // given
        histogram.reset();
        // when
        histogram.recordValueWithExpectedInterval(207, 100);
        // then
        chai_1.expect(histogram.totalCount).to.be.equal(2);
        chai_1.expect(histogram.minNonZeroValue).to.be.equal(107);
        chai_1.expect(histogram.maxValue).to.be.equal(207);
    });
    it("should generate additional values when correcting after recording", function () {
        // given
        histogram.reset();
        histogram.recordValue(207);
        histogram.recordValue(207);
        // when
        var correctedHistogram = histogram.copyCorrectedForCoordinatedOmission(100);
        // then
        chai_1.expect(correctedHistogram.totalCount).to.be.equal(4);
        chai_1.expect(correctedHistogram.minNonZeroValue).to.be.equal(107);
        chai_1.expect(correctedHistogram.maxValue).to.be.equal(207);
    });
});
describe("Histogram add & substract", function () {
    it("should add histograms of same size", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 2);
        var histogram2 = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 2);
        histogram.recordValue(42);
        histogram2.recordValue(158);
        // when
        histogram.add(histogram2);
        // then
        chai_1.expect(histogram.getTotalCount()).to.be.equal(2);
        chai_1.expect(histogram.getMean()).to.be.equal(100);
    });
    it("should add histograms of different sizes", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 2);
        var histogram2 = new Int32Histogram_1.default(1, 1024, 2);
        histogram2.autoResize = true;
        histogram.recordValue(42000);
        histogram2.recordValue(1000);
        // when
        histogram.add(histogram2);
        // then
        chai_1.expect(histogram.getTotalCount()).to.be.equal(2);
        chai_1.expect(Math.floor(histogram.getMean() / 100)).to.be.equal(215);
    });
    it("should add histograms of different sizes & precisions", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 2);
        var histogram2 = new Int32Histogram_1.default(1, 1024, 3);
        histogram2.autoResize = true;
        histogram.recordValue(42000);
        histogram2.recordValue(1000);
        // when
        histogram.add(histogram2);
        // then
        chai_1.expect(histogram.getTotalCount()).to.be.equal(2);
        chai_1.expect(Math.floor(histogram.getMean() / 100)).to.be.equal(215);
    });
    it("should be equal when another histogram is added then subtracted", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, 1024, 5);
        var histogram2 = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 5);
        histogram.autoResize = true;
        histogram.recordValue(1000);
        histogram2.recordValue(42000);
        var outputBefore = histogram.outputPercentileDistribution();
        // when
        histogram.add(histogram2);
        histogram.subtract(histogram2);
        // then
        chai_1.expect(histogram.outputPercentileDistribution()).to.be.equal(outputBefore);
    });
    it("should be equal when another histogram is added then subtracted with same characteristics", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        var histogram2 = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        histogram.autoResize = true;
        histogram.recordValue(1000);
        histogram2.recordValue(42000);
        var outputBefore = histogram.outputPercentileDistribution();
        // when
        histogram.add(histogram2);
        histogram.subtract(histogram2);
        // then
        chai_1.expect(histogram.outputPercentileDistribution()).to.be.equal(outputBefore);
    });
});
describe("Histogram clearing support", function () {
    it("should reset data in order to reuse histogram", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 5);
        histogram.startTimeStampMsec = 42;
        histogram.endTimeStampMsec = 56;
        histogram.tag = "blabla";
        histogram.recordValue(1000);
        // when
        histogram.reset();
        // then
        chai_1.expect(histogram.totalCount).to.be.equal(0);
        chai_1.expect(histogram.startTimeStampMsec).to.be.equal(0);
        chai_1.expect(histogram.endTimeStampMsec).to.be.equal(0);
        chai_1.expect(histogram.tag).to.be.equal(AbstractHistogramBase_1.NO_TAG);
        chai_1.expect(histogram.maxValue).to.be.equal(0);
        chai_1.expect(histogram.minNonZeroValue).to.be.equal(Number.MAX_SAFE_INTEGER);
        chai_1.expect(histogram.getValueAtPercentile(99.999)).to.be.equal(0);
    });
});
//# sourceMappingURL=AbstractHistogram.spec.js.map