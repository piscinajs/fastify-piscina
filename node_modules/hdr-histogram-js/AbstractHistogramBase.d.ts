import { EncodableHistogram } from "./EncodableHistogram";
import RecordedValuesIterator from "./RecordedValuesIterator";
import PercentileIterator from "./PercentileIterator";
export declare const NO_TAG = "NO TAG";
export declare abstract class AbstractHistogramBase extends EncodableHistogram {
    static identityBuilder: number;
    identity: number;
    autoResize: boolean;
    highestTrackableValue: number;
    lowestDiscernibleValue: number;
    numberOfSignificantValueDigits: number;
    bucketCount: number;
    /**
     * Power-of-two length of linearly scaled array slots in the counts array. Long enough to hold the first sequence of
     * entries that must be distinguished by a single unit (determined by configured precision).
     */
    subBucketCount: number;
    countsArrayLength: number;
    wordSizeInBytes: number;
    startTimeStampMsec: number;
    endTimeStampMsec: number;
    tag: string;
    integerToDoubleValueConversionRatio: number;
    percentileIterator: PercentileIterator;
    recordedValuesIterator: RecordedValuesIterator;
    constructor();
}
