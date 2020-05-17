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
var AbstractHistogramIterator_1 = require("./AbstractHistogramIterator");
var pow = Math.pow, floor = Math.floor, log2 = Math.log2;
/**
 * Used for iterating through histogram values according to percentile levels. The iteration is
 * performed in steps that start at 0% and reduce their distance to 100% according to the
 * <i>percentileTicksPerHalfDistance</i> parameter, ultimately reaching 100% when all recorded histogram
 * values are exhausted.
 */
var PercentileIterator = /** @class */ (function (_super) {
    __extends(PercentileIterator, _super);
    /**
     * @param histogram The histogram this iterator will operate on
     * @param percentileTicksPerHalfDistance The number of equal-sized iteration steps per half-distance to 100%.
     */
    function PercentileIterator(histogram, percentileTicksPerHalfDistance) {
        var _this = _super.call(this) || this;
        _this.percentileTicksPerHalfDistance = 0;
        _this.percentileLevelToIterateTo = 0;
        _this.percentileLevelToIterateFrom = 0;
        _this.reachedLastRecordedValue = false;
        _this.doReset(histogram, percentileTicksPerHalfDistance);
        return _this;
    }
    /**
     * Reset iterator for re-use in a fresh iteration over the same histogram data set.
     *
     * @param percentileTicksPerHalfDistance The number of iteration steps per half-distance to 100%.
     */
    PercentileIterator.prototype.reset = function (percentileTicksPerHalfDistance) {
        this.doReset(this.histogram, percentileTicksPerHalfDistance);
    };
    PercentileIterator.prototype.doReset = function (histogram, percentileTicksPerHalfDistance) {
        _super.prototype.resetIterator.call(this, histogram);
        this.percentileTicksPerHalfDistance = percentileTicksPerHalfDistance;
        this.percentileLevelToIterateTo = 0;
        this.percentileLevelToIterateFrom = 0;
        this.reachedLastRecordedValue = false;
    };
    PercentileIterator.prototype.hasNext = function () {
        if (_super.prototype.hasNext.call(this))
            return true;
        if (!this.reachedLastRecordedValue && this.arrayTotalCount > 0) {
            this.percentileLevelToIterateTo = 100;
            this.reachedLastRecordedValue = true;
            return true;
        }
        return false;
    };
    PercentileIterator.prototype.incrementIterationLevel = function () {
        this.percentileLevelToIterateFrom = this.percentileLevelToIterateTo;
        // The choice to maintain fixed-sized "ticks" in each half-distance to 100% [starting
        // from 0%], as opposed to a "tick" size that varies with each interval, was made to
        // make the steps easily comprehensible and readable to humans. The resulting percentile
        // steps are much easier to browse through in a percentile distribution output, for example.
        //
        // We calculate the number of equal-sized "ticks" that the 0-100 range will be divided
        // by at the current scale. The scale is detemined by the percentile level we are
        // iterating to. The following math determines the tick size for the current scale,
        // and maintain a fixed tick size for the remaining "half the distance to 100%"
        // [from either 0% or from the previous half-distance]. When that half-distance is
        // crossed, the scale changes and the tick size is effectively cut in half.
        // percentileTicksPerHalfDistance = 5
        // percentileReportingTicks = 10,
        var percentileReportingTicks = this.percentileTicksPerHalfDistance *
            pow(2, floor(log2(100 / (100 - this.percentileLevelToIterateTo))) + 1);
        this.percentileLevelToIterateTo += 100 / percentileReportingTicks;
    };
    PercentileIterator.prototype.reachedIterationLevel = function () {
        if (this.countAtThisValue === 0) {
            return false;
        }
        var currentPercentile = 100 * this.totalCountToCurrentIndex / this.arrayTotalCount;
        return currentPercentile >= this.percentileLevelToIterateTo;
    };
    PercentileIterator.prototype.getPercentileIteratedTo = function () {
        return this.percentileLevelToIterateTo;
    };
    PercentileIterator.prototype.getPercentileIteratedFrom = function () {
        return this.percentileLevelToIterateFrom;
    };
    return PercentileIterator;
}(AbstractHistogramIterator_1.default));
exports.default = PercentileIterator;
//# sourceMappingURL=PercentileIterator.js.map