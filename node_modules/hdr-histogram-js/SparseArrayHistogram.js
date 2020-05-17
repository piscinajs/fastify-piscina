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
var SparseArrayHistogram = /** @class */ (function (_super) {
    __extends(SparseArrayHistogram, _super);
    function SparseArrayHistogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
        var _this = _super.call(this, lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) || this;
        _this.totalCount = 0;
        _this.counts = new Array();
        return _this;
    }
    SparseArrayHistogram.prototype.clearCounts = function () {
        this.counts.fill(0);
    };
    SparseArrayHistogram.prototype.incrementCountAtIndex = function (index) {
        var currentCount = this.counts[index] || 0;
        var newCount = currentCount + 1;
        if (newCount < 0) {
            throw newCount + " would overflow short integer count";
        }
        this.counts[index] = newCount;
    };
    SparseArrayHistogram.prototype.addToCountAtIndex = function (index, value) {
        var currentCount = this.counts[index] || 0;
        var newCount = currentCount + value;
        if (newCount < Number.MIN_SAFE_INTEGER ||
            newCount > Number.MAX_SAFE_INTEGER) {
            throw newCount + " would overflow integer count";
        }
        this.counts[index] = newCount;
    };
    SparseArrayHistogram.prototype.setCountAtIndex = function (index, value) {
        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
            throw value + " would overflow integer count";
        }
        this.counts[index] = value;
    };
    SparseArrayHistogram.prototype.resize = function (newHighestTrackableValue) {
        this.establishSize(newHighestTrackableValue);
    };
    SparseArrayHistogram.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
    SparseArrayHistogram.prototype.incrementTotalCount = function () {
        this.totalCount++;
    };
    SparseArrayHistogram.prototype.addToTotalCount = function (value) {
        this.totalCount += value;
    };
    SparseArrayHistogram.prototype.setTotalCount = function (value) {
        this.totalCount = value;
    };
    SparseArrayHistogram.prototype.getTotalCount = function () {
        return this.totalCount;
    };
    SparseArrayHistogram.prototype.getCountAtIndex = function (index) {
        return this.counts[index] || 0;
    };
    SparseArrayHistogram.prototype._getEstimatedFootprintInBytes = function () {
        return 512 + this.counts.length;
    };
    SparseArrayHistogram.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
        var copy = new SparseArrayHistogram(this.lowestDiscernibleValue, this.highestTrackableValue, this.numberOfSignificantValueDigits);
        copy.addWhileCorrectingForCoordinatedOmission(this, expectedIntervalBetweenValueSamples);
        return copy;
    };
    return SparseArrayHistogram;
}(AbstractHistogram_1.default));
exports.default = SparseArrayHistogram;
//# sourceMappingURL=SparseArrayHistogram.js.map