import AbstractHistogram from "./AbstractHistogram";
declare class Int32Histogram extends AbstractHistogram {
    counts: Uint32Array;
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
    copyCorrectedForCoordinatedOmission(expectedIntervalBetweenValueSamples: number): Int32Histogram;
}
export default Int32Histogram;
