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
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
var AbstractHistogram_1 = require("./AbstractHistogram");
var Int32Histogram = /** @class */ (function (_super) {
    __extends(Int32Histogram, _super);
    function Int32Histogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
        var _this = _super.call(this, lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) || this;
        _this.totalCount = 0;
        _this.counts = new Uint32Array(_this.countsArrayLength);
        return _this;
    }
    Int32Histogram.prototype.clearCounts = function () {
        this.counts.fill(0);
    };
    Int32Histogram.prototype.incrementCountAtIndex = function (index) {
        var currentCount = this.counts[index];
        var newCount = currentCount + 1;
        if (newCount < 0) {
            throw newCount + " would overflow short integer count";
        }
        this.counts[index] = newCount;
    };
    Int32Histogram.prototype.addToCountAtIndex = function (index, value) {
        var currentCount = this.counts[index];
        var newCount = currentCount + value;
        if (newCount < Number.MIN_SAFE_INTEGER ||
            newCount > Number.MAX_SAFE_INTEGER) {
            throw newCount + " would overflow integer count";
        }
        this.counts[index] = newCount;
    };
    Int32Histogram.prototype.setCountAtIndex = function (index, value) {
        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
            throw value + " would overflow integer count";
        }
        this.counts[index] = value;
    };
    Int32Histogram.prototype.resize = function (newHighestTrackableValue) {
        this.establishSize(newHighestTrackableValue);
        var newCounts = new Uint32Array(this.countsArrayLength);
        newCounts.set(this.counts);
        this.counts = newCounts;
    };
    Int32Histogram.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
    Int32Histogram.prototype.incrementTotalCount = function () {
        this.totalCount++;
    };
    Int32Histogram.prototype.addToTotalCount = function (value) {
        this.totalCount += value;
    };
    Int32Histogram.prototype.setTotalCount = function (value) {
        this.totalCount = value;
    };
    Int32Histogram.prototype.getTotalCount = function () {
        return this.totalCount;
    };
    Int32Histogram.prototype.getCountAtIndex = function (index) {
        return this.counts[index];
    };
    Int32Histogram.prototype._getEstimatedFootprintInBytes = function () {
        return 512 + 4 * this.counts.length;
    };
    Int32Histogram.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
        var copy = new Int32Histogram(this.lowestDiscernibleValue, this.highestTrackableValue, this.numberOfSignificantValueDigits);
        copy.addWhileCorrectingForCoordinatedOmission(this, expectedIntervalBetweenValueSamples);
        return copy;
    };
    return Int32Histogram;
}(AbstractHistogram_1.default));
exports.default = Int32Histogram;
//# sourceMappingURL=Int32Histogram.js.map