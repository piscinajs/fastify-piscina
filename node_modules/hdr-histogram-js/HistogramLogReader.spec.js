"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var fs = require("fs");
var chai_1 = require("chai");
var HistogramLogReader_1 = require("./HistogramLogReader");
var Int32Histogram_1 = require("./Int32Histogram");
var PackedHistogram_1 = require("./PackedHistogram");
var floor = Math.floor;
var checkNotNull = function (actual) {
    chai_1.expect(actual).to.be.not.null;
    return true;
};
describe("Histogram Log Reader", function () {
    var fileContent;
    var tagFileContent;
    var fileContentWithBaseTime;
    var fileContentWithoutHeader;
    var fileContentWithTrailingWhitespace;
    before(function () {
        // when using mutation testing tool stryker, source code
        // is copied in a sandbox directory without the test_files
        // directory...
        var runFromStryker = __dirname.includes("stryker");
        var prefix = runFromStryker ? "../.." : ".";
        fileContent = fs.readFileSync(prefix + "/test_files/jHiccup-2.0.7S.logV2.hlog", "UTF-8");
        fileContentWithBaseTime = fs.readFileSync(prefix + "/test_files/jHiccup-with-basetime-2.0.7S.logV2.hlog", "UTF-8");
        fileContentWithoutHeader = fs.readFileSync(prefix + "/test_files/jHiccup-no-header-2.0.7S.logV2.hlog", "UTF-8");
        tagFileContent = fs.readFileSync(prefix + "/test_files/tagged-Log.logV2.hlog", "UTF-8");
        fileContentWithTrailingWhitespace = fs.readFileSync(prefix + "/test_files/bug-whitespace.hlog", "UTF-8");
    });
    it("should update startTimeSec reading first histogram", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        reader.nextIntervalHistogram();
        // then
        chai_1.expect(reader.startTimeSec).to.be.equal(1441812279.474);
    });
    it("should read first histogram starting from the beginning", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        checkNotNull(histogram);
        // if mean is good, strong probability everything else is good as well
        chai_1.expect(floor(histogram.getMean())).to.be.equal(301998);
    });
    it("should read encoded histogram and use provided constructor", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent, {
            histogramConstr: PackedHistogram_1.default
        });
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        checkNotNull(histogram);
        // if mean is good, strong probability everything else is good as well
        chai_1.expect(floor(histogram.getMean())).to.be.equal(301998);
    });
    it("should return null if no histogram in the logs", function () {
        // given
        var reader = new HistogramLogReader_1.default("# empty");
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        chai_1.expect(histogram).to.be.null;
    });
    it("should return next histogram in the logs", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        reader.nextIntervalHistogram();
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        if (checkNotNull(histogram)) {
            // if mean is good, strong probability everything else is good as well
            chai_1.expect(floor(histogram.getMean())).to.be.equal(293719);
        }
    });
    it("should return null if all histograms are after specified time range", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        var histogram = reader.nextIntervalHistogram(0.01, 0.1);
        // then
        chai_1.expect(histogram).to.be.null;
    });
    it("should return null if all histograms are before specified time range", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        var histogram = reader.nextIntervalHistogram(62, 63);
        // then
        chai_1.expect(histogram).to.be.null;
    });
    it("should parse histogram even if there are trailing whitespaces", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContentWithTrailingWhitespace);
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        // no error
    });
    it("should return histograms within specified time range", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        var firstHistogram = reader.nextIntervalHistogram(0, 2);
        var secondHistogram = reader.nextIntervalHistogram(0, 2);
        var thirdHistogram = reader.nextIntervalHistogram(0, 2);
        // then
        chai_1.expect(thirdHistogram).to.be.null;
        if (checkNotNull(firstHistogram) && checkNotNull(secondHistogram)) {
            // if mean is good, strong probability everything else is good as well
            chai_1.expect(floor(firstHistogram.getMean())).to.be.equal(301998);
            chai_1.expect(floor(secondHistogram.getMean())).to.be.equal(293719);
        }
    });
    it("should set start timestamp on histogram", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        if (checkNotNull(histogram)) {
            chai_1.expect(histogram.startTimeStampMsec).to.be.equal(1441812279601);
        }
    });
    it("should set end timestamp on histogram", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        if (checkNotNull(histogram)) {
            chai_1.expect(histogram.endTimeStampMsec).to.be.equal(1441812280608);
        }
    });
    it("should parse tagged histogram", function () {
        // given
        var reader = new HistogramLogReader_1.default(tagFileContent);
        reader.nextIntervalHistogram();
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        if (checkNotNull(histogram)) {
            chai_1.expect(histogram.tag).to.be.equal("A");
            chai_1.expect(floor(histogram.getMean())).to.be.equal(301998);
        }
    });
    it("should use basetime to set timestamps on histogram", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContentWithBaseTime);
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        if (checkNotNull(histogram)) {
            chai_1.expect(histogram.startTimeStampMsec).to.be.equal(1441812123250);
            chai_1.expect(histogram.endTimeStampMsec).to.be.equal(1441812124257);
        }
    });
    it("should default startTime using 1st observed time", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContentWithoutHeader);
        // when
        var histogram = reader.nextIntervalHistogram();
        // then
        if (checkNotNull(histogram)) {
            chai_1.expect(histogram.startTimeStampMsec).to.be.equal(127);
            chai_1.expect(histogram.endTimeStampMsec).to.be.equal(1134);
        }
    });
    it("should do the whole 9 yards just like the original Java version :-)", function () {
        // given
        var reader = new HistogramLogReader_1.default(fileContent);
        var accumulatedHistogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 3);
        var histogram;
        var histogramCount = 0;
        var totalCount = 0;
        // when
        while ((histogram = reader.nextIntervalHistogram()) != null) {
            histogramCount++;
            totalCount += histogram.getTotalCount();
            accumulatedHistogram.add(histogram);
        }
        // then
        chai_1.expect(histogramCount).to.be.equal(62);
        chai_1.expect(totalCount).to.be.equal(48761);
        chai_1.expect(accumulatedHistogram.getValueAtPercentile(99.9)).to.be.equal(1745879039);
        chai_1.expect(reader.startTimeSec).to.be.equal(1441812279.474);
    });
    it("should list all the tags of a log file", function () {
        // given
        // when
        var tags = HistogramLogReader_1.listTags(tagFileContent);
        // then
        chai_1.expect(tags).to.be.deep.equal(["NO TAG", "A"]);
    });
    it("should list all the tags of a log file where all histograms are tagged", function () {
        // given
        var content = "#[Fake log chunk]\n#[Histogram log format version 1.2]\n#[StartTime: 1441812279.474 (seconds since epoch), Wed Sep 09 08:24:39 PDT 2015]\n\"StartTimestamp\",\"Interval_Length\",\"Interval_Max\",\"Interval_Compressed_Histogram\"\nTag=NOT-EMPTY,0.127,1.007,2.769,HISTFAAAAEV42pNpmSzMwMCgyAABTBDKT4GBgdnNYMcCBvsPEBEJISEuATEZMQ4uASkhIR4nrxg9v2lMaxhvMekILGZkKmcCAEf2CsI=\nTag=A,0.127,1.007,2.769,HISTFAAAAEV42pNpmSzMwMCgyAABTBDKT4GBgdnNYMcCBvsPEBEJISEuATEZMQ4uASkhIR4nrxg9v2lMaxhvMekILGZkKmcCAEf2CsI=\n";
        // when
        var tags = HistogramLogReader_1.listTags(content);
        // then
        chai_1.expect(tags).to.be.deep.equal(["NOT-EMPTY", "A"]);
    });
});
//# sourceMappingURL=HistogramLogReader.spec.js.map