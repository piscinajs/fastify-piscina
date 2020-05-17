import AbstractHistogram from "./AbstractHistogram";
declare class SparseArrayHistogram extends AbstractHistogram {
    counts: Array<number>;
    totalCount: number;
    constructor(lowestDiscernibleValue: number, highestTrackableValue: number, numberOfSignificantValueDigits: number);
    clearCounts(): void;
    incrementCountAtIndex(index: number): void;
    addToCountAtIndex(index: number, value: number): void;
    setCountAtIndex(index: number, value: number): void;
    resize(newHighestTrackableValue: number): void;
    setNormalizingIndexOffset(normalizingIndexOffset: number): void;
    incrementTotalCount(): void;
    addToTotalCount(value: number): void;
    setTotalCount(value: number): void;
    getTotalCount(): number;
    getCountAtIndex(index: number): number;
    protected _getEstimatedFootprintInBytes(): number;
    copyCorrectedForCoordinatedOmission(expectedIntervalBetweenValueSamples: number): SparseArrayHistogram;
}
export default SparseArrayHistogram;
