"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var _1 = require(".");
describe("Logs", function () {
    it("should give same result after been written then read", function () {
        // given
        var buffer = "";
        var writer = new _1.HistogramLogWriter(function (content) {
            buffer += content;
        });
        writer.outputLogFormatVersion();
        writer.outputStartTime(12345000);
        writer.outputLegend();
        var inputHistogram = _1.build();
        inputHistogram.recordValue(1515);
        inputHistogram.recordValue(1789);
        // when
        writer.outputIntervalHistogram(inputHistogram, 12345042, 1234056, 1);
        var reader = new _1.HistogramLogReader(buffer);
        var outputHistogram = reader.nextIntervalHistogram();
        // then
        chai_1.expect(outputHistogram).to.be.not.null;
        var outputText = outputHistogram.outputPercentileDistribution();
        var inputText = inputHistogram.outputPercentileDistribution();
        chai_1.expect(outputText).to.be.equal(inputText);
    });
});
//# sourceMappingURL=log.spec.js.map