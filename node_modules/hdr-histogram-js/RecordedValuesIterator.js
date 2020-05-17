"use strict";
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
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
var AbstractHistogramIterator_1 = require("./AbstractHistogramIterator");
/**
 * Used for iterating through all recorded histogram values using the finest granularity steps supported by the
 * underlying representation. The iteration steps through all non-zero recorded value counts, and terminates when
 * all recorded histogram values are exhausted.
 */
var RecordedValuesIterator = /** @class */ (function (_super) {
    __extends(RecordedValuesIterator, _super);
    /**
     * @param histogram The histogram this iterator will operate on
     */
    function RecordedValuesIterator(histogram) {
        var _this = _super.call(this) || this;
        _this.doReset(histogram);
        return _this;
    }
    /**
     * Reset iterator for re-use in a fresh iteration over the same histogram data set.
     */
    RecordedValuesIterator.prototype.reset = function () {
        this.doReset(this.histogram);
    };
    RecordedValuesIterator.prototype.doReset = function (histogram) {
        _super.prototype.resetIterator.call(this, histogram);
        this.visitedIndex = -1;
    };
    RecordedValuesIterator.prototype.incrementIterationLevel = function () {
        this.visitedIndex = this.currentIndex;
    };
    RecordedValuesIterator.prototype.reachedIterationLevel = function () {
        var currentCount = this.histogram.getCountAtIndex(this.currentIndex);
        return currentCount != 0 && this.visitedIndex !== this.currentIndex;
    };
    return RecordedValuesIterator;
}(AbstractHistogramIterator_1.default));
exports.default = RecordedValuesIterator;
//# sourceMappingURL=RecordedValuesIterator.js.map