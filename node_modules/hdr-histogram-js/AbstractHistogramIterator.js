"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HistogramIterationValue_1 = require("./HistogramIterationValue");
/**
 * Used for iterating through histogram values.
 */
var AbstractHistogramIterator /* implements Iterator<HistogramIterationValue> */ = /** @class */ (function () {
    function AbstractHistogramIterator() {
        this.currentIterationValue = new HistogramIterationValue_1.default();
    }
    AbstractHistogramIterator.prototype.resetIterator = function (histogram) {
        this.histogram = histogram;
        this.savedHistogramTotalRawCount = histogram.getTotalCount();
        this.arrayTotalCount = histogram.getTotalCount();
        this.currentIndex = 0;
        this.currentValueAtIndex = 0;
        this.nextValueAtIndex = Math.pow(2, histogram.unitMagnitude);
        this.prevValueIteratedTo = 0;
        this.totalCountToPrevIndex = 0;
        this.totalCountToCurrentIndex = 0;
        this.totalValueToCurrentIndex = 0;
        this.countAtThisValue = 0;
        this.freshSubBucket = true;
        this.currentIterationValue.reset();
    };
    /**
     * Returns true if the iteration has more elements. (In other words, returns true if next would return an
     * element rather than throwing an exception.)
     *
     * @return true if the iterator has more elements.
     */
    AbstractHistogramIterator.prototype.hasNext = function () {
        if (this.histogram.getTotalCount() !== this.savedHistogramTotalRawCount) {
            throw "Concurrent Modification Exception";
        }
        return this.totalCountToCurrentIndex < this.arrayTotalCount;
    };
    /**
     * Returns the next element in the iteration.
     *
     * @return the {@link HistogramIterationValue} associated with the next element in the iteration.
     */
    AbstractHistogramIterator.prototype.next = function () {
        // Move through the sub buckets and buckets until we hit the next reporting level:
        while (!this.exhaustedSubBuckets()) {
            this.countAtThisValue = this.histogram.getCountAtIndex(this.currentIndex);
            if (this.freshSubBucket) {
                // Don't add unless we've incremented since last bucket...
                this.totalCountToCurrentIndex += this.countAtThisValue;
                this.totalValueToCurrentIndex +=
                    this.countAtThisValue *
                        this.histogram.highestEquivalentValue(this.currentValueAtIndex);
                this.freshSubBucket = false;
            }
            if (this.reachedIterationLevel()) {
                var valueIteratedTo = this.getValueIteratedTo();
                Object.assign(this.currentIterationValue, {
                    valueIteratedTo: valueIteratedTo,
                    valueIteratedFrom: this.prevValueIteratedTo,
                    countAtValueIteratedTo: this.countAtThisValue,
                    countAddedInThisIterationStep: this.totalCountToCurrentIndex - this.totalCountToPrevIndex,
                    totalCountToThisValue: this.totalCountToCurrentIndex,
                    totalValueToThisValue: this.totalValueToCurrentIndex,
                    percentile: 100 * this.totalCountToCurrentIndex / this.arrayTotalCount,
                    percentileLevelIteratedTo: this.getPercentileIteratedTo()
                });
                this.prevValueIteratedTo = valueIteratedTo;
                this.totalCountToPrevIndex = this.totalCountToCurrentIndex;
                this.incrementIterationLevel();
                if (this.histogram.getTotalCount() !== this.savedHistogramTotalRawCount) {
                    throw new Error("Concurrent Modification Exception");
                }
                return this.currentIterationValue;
            }
            this.incrementSubBucket();
        }
        throw new Error("Index Out Of Bounds Exception");
    };
    AbstractHistogramIterator.prototype.getPercentileIteratedTo = function () {
        return 100 * this.totalCountToCurrentIndex / this.arrayTotalCount;
    };
    AbstractHistogramIterator.prototype.getPercentileIteratedFrom = function () {
        return 100 * this.totalCountToPrevIndex / this.arrayTotalCount;
    };
    AbstractHistogramIterator.prototype.getValueIteratedTo = function () {
        return this.histogram.highestEquivalentValue(this.currentValueAtIndex);
    };
    AbstractHistogramIterator.prototype.exhaustedSubBuckets = function () {
        return this.currentIndex >= this.histogram.countsArrayLength;
    };
    AbstractHistogramIterator.prototype.incrementSubBucket = function () {
        this.freshSubBucket = true;
        this.currentIndex++;
        this.currentValueAtIndex = this.histogram.valueFromIndex(this.currentIndex);
        this.nextValueAtIndex = this.histogram.valueFromIndex(this.currentIndex + 1);
    };
    return AbstractHistogramIterator;
}());
exports.default = AbstractHistogramIterator;
//# sourceMappingURL=AbstractHistogramIterator.js.map