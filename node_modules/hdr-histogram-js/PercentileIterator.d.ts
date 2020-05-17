import AbstractHistogram from "./AbstractHistogram";
import AbstractHistogramIterator from "./AbstractHistogramIterator";
/**
 * Used for iterating through histogram values according to percentile levels. The iteration is
 * performed in steps that start at 0% and reduce their distance to 100% according to the
 * <i>percentileTicksPerHalfDistance</i> parameter, ultimately reaching 100% when all recorded histogram
 * values are exhausted.
 */
declare class PercentileIterator extends AbstractHistogramIterator {
    percentileTicksPerHalfDistance: number;
    percentileLevelToIterateTo: number;
    percentileLevelToIterateFrom: number;
    reachedLastRecordedValue: boolean;
    /**
     * @param histogram The histogram this iterator will operate on
     * @param percentileTicksPerHalfDistance The number of equal-sized iteration steps per half-distance to 100%.
     */
    constructor(histogram: AbstractHistogram, percentileTicksPerHalfDistance: number);
    /**
     * Reset iterator for re-use in a fresh iteration over the same histogram data set.
     *
     * @param percentileTicksPerHalfDistance The number of iteration steps per half-distance to 100%.
     */
    reset(percentileTicksPerHalfDistance: number): void;
    private doReset;
    hasNext(): boolean;
    incrementIterationLevel(): void;
    reachedIterationLevel(): boolean;
    getPercentileIteratedTo(): number;
    getPercentileIteratedFrom(): number;
}
export default PercentileIterator;
