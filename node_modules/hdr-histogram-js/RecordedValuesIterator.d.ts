import AbstractHistogram from "./AbstractHistogram";
import AbstractHistogramIterator from "./AbstractHistogramIterator";
/**
 * Used for iterating through all recorded histogram values using the finest granularity steps supported by the
 * underlying representation. The iteration steps through all non-zero recorded value counts, and terminates when
 * all recorded histogram values are exhausted.
 */
declare class RecordedValuesIterator extends AbstractHistogramIterator {
    visitedIndex: number;
    /**
     * @param histogram The histogram this iterator will operate on
     */
    constructor(histogram: AbstractHistogram);
    /**
     * Reset iterator for re-use in a fresh iteration over the same histogram data set.
     */
    reset(): void;
    private doReset;
    incrementIterationLevel(): void;
    reachedIterationLevel(): boolean;
}
export default RecordedValuesIterator;
