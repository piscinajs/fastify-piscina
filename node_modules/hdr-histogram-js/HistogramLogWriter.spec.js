"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var HistogramLogWriter_1 = require("./HistogramLogWriter");
var Int32Histogram_1 = require("./Int32Histogram");
describe("Histogram Log Writer", function () {
    var buffer;
    var writer;
    var histogram;
    beforeEach(function () {
        buffer = "";
        writer = new HistogramLogWriter_1.default(function (content) {
            buffer += content;
        });
        histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
    });
    it("should write a line with start time, duration, max value, and a base64 encoded histogram", function () {
        // given
        histogram.recordValue(123000);
        // when
        writer.outputIntervalHistogram(histogram, 1000, 1042);
        // then
        chai_1.expect(buffer).to.match(/^1000.000,42.000,123.000,HISTFAA/);
    });
    it("should write start time, duration and  max value using 3 digits", function () {
        // given
        histogram.recordValue(123001);
        // when
        writer.outputIntervalHistogram(histogram, 1000.0120001, 1042.013001);
        // then
        chai_1.expect(buffer).to.match(/^1000.012,42.001,123.001,HISTFAA/);
    });
    it("should write a line starting with histogram tag", function () {
        // given
        histogram.tag = "TAG";
        histogram.recordValue(123000);
        // when
        writer.outputIntervalHistogram(histogram, 1000, 1042);
        // then
        chai_1.expect(buffer).to.contain("Tag=TAG,1000.000,42.000,123.000,HISTFAA");
    });
    it("should write a histogram's start time in sec using basetime", function () {
        // given
        histogram.startTimeStampMsec = 1234001;
        histogram.endTimeStampMsec = 1235001;
        writer.baseTime = 1000000;
        histogram.recordValue(1);
        // when
        writer.outputIntervalHistogram(histogram);
        // then
        chai_1.expect(buffer).to.contain("234.001");
    });
    it("should write start time in seconds", function () {
        // given
        // when
        writer.outputStartTime(1234560);
        // then
        chai_1.expect(buffer).to.contain("1234.560");
    });
});
//# sourceMappingURL=HistogramLogWriter.spec.js.map