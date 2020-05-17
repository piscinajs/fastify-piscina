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
var EncodableHistogram_1 = require("./EncodableHistogram");
exports.NO_TAG = "NO TAG";
var AbstractHistogramBase = /** @class */ (function (_super) {
    __extends(AbstractHistogramBase, _super);
    //intermediateUncompressedByteBuffer : ByteBuffer = null;
    //intermediateUncompressedByteArray : number[] = null;
    /* useless ?
    getIntegerToDoubleValueConversionRatio(): number {
        return this.integerToDoubleValueConversionRatio;
    }
  
    setIntegerToDoubleValueConversionRatio(integerToDoubleValueConversionRatio: number) {
        this.integerToDoubleValueConversionRatio = integerToDoubleValueConversionRatio;
    }*/
    function AbstractHistogramBase() {
        var _this = _super.call(this) || this;
        _this.autoResize = false;
        _this.startTimeStampMsec = Number.MAX_SAFE_INTEGER;
        _this.endTimeStampMsec = 0;
        _this.tag = exports.NO_TAG;
        _this.integerToDoubleValueConversionRatio = 1.0;
        _this.identity = 0;
        _this.highestTrackableValue = 0;
        _this.lowestDiscernibleValue = 0;
        _this.numberOfSignificantValueDigits = 0;
        _this.bucketCount = 0;
        _this.subBucketCount = 0;
        _this.countsArrayLength = 0;
        _this.wordSizeInBytes = 0;
        return _this;
    }
    return AbstractHistogramBase;
}(EncodableHistogram_1.EncodableHistogram));
exports.AbstractHistogramBase = AbstractHistogramBase;
//# sourceMappingURL=AbstractHistogramBase.js.map