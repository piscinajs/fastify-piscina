"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var RecordedValuesIterator_1 = require("./RecordedValuesIterator");
var Int32Histogram_1 = require("./Int32Histogram");
describe("Recorded Values Iterator", function () {
    it("should iterate to recorded value", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 5);
        histogram.recordValue(12345);
        var iterator = new RecordedValuesIterator_1.default(histogram);
        // when
        var iterationValue = iterator.next();
        // then
        chai_1.expect(iterator.hasNext()).is.false;
        chai_1.expect(iterationValue.totalCountToThisValue).equals(1);
        chai_1.expect(iterationValue.totalValueToThisValue).equals(12345);
    });
    it("should iterate to all recorded values", function () {
        // given
        var histogram = new Int32Histogram_1.default(1, Number.MAX_SAFE_INTEGER, 2);
        histogram.recordValue(1);
        histogram.recordValue(300);
        histogram.recordValue(3000);
        var iterator = new RecordedValuesIterator_1.default(histogram);
        // when
        var values = [];
        while (iterator.hasNext()) {
            values.push(iterator.next().valueIteratedTo);
        }
        // then
        chai_1.expect(values).to.have.length(3);
        chai_1.expect(values[0]).equals(1);
        chai_1.expect(values[1]).satisfies(function (value) { return value >= 300; });
        chai_1.expect(values[2]).satisfies(function (value) { return value >= 3000; });
    });
});
//# sourceMappingURL=RecordedValuesIterator.spec.js.map