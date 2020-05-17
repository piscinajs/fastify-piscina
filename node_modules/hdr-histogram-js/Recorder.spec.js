"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Recorder_1 = require("./Recorder");
var Int32Histogram_1 = require("./Int32Histogram");
var PackedHistogram_1 = require("./PackedHistogram");
describe("Recorder", function () {
    it("should record value", function () {
        // given
        var recorder = new Recorder_1.default();
        // when
        recorder.recordValue(123);
        // then
        var histogram = recorder.getIntervalHistogram();
        chai_1.expect(histogram.getTotalCount()).to.be.equal(1);
    });
    it("should record value in a packed histogram", function () {
        // given
        var recorder = new Recorder_1.default(5, true);
        // when
        recorder.recordValue(123);
        // then
        chai_1.expect(recorder.getIntervalHistogram() instanceof PackedHistogram_1.default).to.be
            .true;
        chai_1.expect(recorder.getIntervalHistogram() instanceof PackedHistogram_1.default).to.be
            .true;
    });
    it("should record value with count", function () {
        // given
        var recorder = new Recorder_1.default();
        // when
        recorder.recordValueWithCount(123, 3);
        // then
        var histogram = recorder.getIntervalHistogram();
        chai_1.expect(histogram.getTotalCount()).to.be.equal(3);
    });
    it("should record value with expected interval", function () {
        // given
        var recorder = new Recorder_1.default();
        // when
        recorder.recordValueWithExpectedInterval(223, 100);
        // then
        var histogram = recorder.getIntervalHistogram();
        chai_1.expect(histogram.getTotalCount()).to.be.equal(2);
    });
    it("should record value in a packed histogram", function () {
        // given
        var recorder = new Recorder_1.default(3, true);
        recorder.recordValue(42);
        // when
        var histogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(histogram instanceof PackedHistogram_1.default).to.be.true;
    });
    it("should record value only on one interval histogram", function () {
        // given
        var recorder = new Recorder_1.default();
        // when
        recorder.recordValue(123);
        var firstHistogram = recorder.getIntervalHistogram();
        // then
        var secondHistogram = recorder.getIntervalHistogram();
        chai_1.expect(secondHistogram.getTotalCount()).to.be.equal(0);
    });
    it("should not record value on returned interval histogram", function () {
        // given
        var recorder = new Recorder_1.default();
        var firstHistogram = recorder.getIntervalHistogram();
        var secondHistogram = recorder.getIntervalHistogram();
        // when
        firstHistogram.recordValue(42); // should have 0 impact on recorder
        var thirdHistogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(thirdHistogram.getTotalCount()).to.be.equal(0);
    });
    it("should return interval histograms with expected significant digits", function () {
        // given
        var recorder = new Recorder_1.default(4);
        var firstHistogram = recorder.getIntervalHistogram();
        var secondHistogram = recorder.getIntervalHistogram();
        // when
        var thirdHistogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(thirdHistogram.numberOfSignificantValueDigits).to.be.equal(4);
    });
    it("should return recycled histograms when asking for interval histogram", function () {
        // given
        var recorder = new Recorder_1.default();
        var firstHistogram = recorder.getIntervalHistogram();
        // when
        var secondHistogram = recorder.getIntervalHistogram(firstHistogram);
        var thirdHistogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(thirdHistogram === firstHistogram).to.be.true;
    });
    it("should throw an error when trying to recycle an histogram not created by the recorder", function () {
        // given
        var recorder = new Recorder_1.default();
        var somehistogram = new Int32Histogram_1.default(1, 2, 3);
        // when & then
        chai_1.expect(function () { return recorder.getIntervalHistogram(somehistogram); }).to.throw();
    });
    it("should reset histogram when recycling", function () {
        // given
        var recorder = new Recorder_1.default();
        recorder.recordValue(42);
        var firstHistogram = recorder.getIntervalHistogram();
        // when
        var secondHistogram = recorder.getIntervalHistogram(firstHistogram);
        var thirdHistogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(thirdHistogram.getTotalCount()).to.be.equal(0);
    });
    it("should set timestamps on first interval histogram", function () {
        // given
        var currentTime = 42;
        var clock = function () { return currentTime; };
        var recorder = new Recorder_1.default(3, false, clock);
        // when
        currentTime = 123;
        var histogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(histogram.startTimeStampMsec).to.be.equal(42);
        chai_1.expect(histogram.endTimeStampMsec).to.be.equal(123);
    });
    it("should set timestamps on any interval histogram", function () {
        // given
        var currentTime = 42;
        var clock = function () { return currentTime; };
        var recorder = new Recorder_1.default(3, false, clock);
        currentTime = 51;
        var firstHistogram = recorder.getIntervalHistogram();
        // when
        currentTime = 56;
        var secondHistogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(secondHistogram.startTimeStampMsec).to.be.equal(51);
        chai_1.expect(secondHistogram.endTimeStampMsec).to.be.equal(56);
    });
    it("should copy interval histogram", function () {
        // given
        var currentTime = 42;
        var clock = function () { return currentTime; };
        var recorder = new Recorder_1.default(4, false, clock);
        recorder.recordValue(123);
        // when
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        currentTime = 51;
        recorder.getIntervalHistogramInto(histogram);
        // then
        chai_1.expect(histogram.getTotalCount()).to.be.equal(1);
        chai_1.expect(histogram.startTimeStampMsec).to.be.equal(42);
        chai_1.expect(histogram.endTimeStampMsec).to.be.equal(51);
    });
    it("should reset values and timestamp", function () {
        // given
        var currentTime = 42;
        var clock = function () { return currentTime; };
        var recorder = new Recorder_1.default(4, false, clock);
        recorder.recordValue(123);
        // when
        currentTime = 55;
        recorder.reset();
        var histogram = recorder.getIntervalHistogram();
        // then
        chai_1.expect(histogram.getTotalCount()).to.be.equal(0);
        chai_1.expect(histogram.startTimeStampMsec).to.be.equal(55);
    });
});
//# sourceMappingURL=Recorder.spec.js.map