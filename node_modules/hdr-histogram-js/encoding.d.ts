import { AbstractHistogram, HistogramConstructor } from "./AbstractHistogram";
import "./AbstractHistogram.encoding";
declare const decodeFromCompressedBase64: (base64String: string, histogramConstr?: HistogramConstructor, minBarForHighestTrackableValue?: number) => AbstractHistogram;
declare const encodeIntoBase64String: (histogram: AbstractHistogram, compressionLevel?: number | undefined) => string;
export { decodeFromCompressedBase64, encodeIntoBase64String };
