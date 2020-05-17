(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("pako"));
	else if(typeof define === 'function' && define.amd)
		define("hdr", ["pako"], factory);
	else if(typeof exports === 'object')
		exports["hdr"] = factory(require("pako"));
	else
		root["hdr"] = factory(root["pako"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_25__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var ByteBuffer_1 = __webpack_require__(2);
	exports.ByteBuffer = ByteBuffer_1.default;
	var Int8Histogram_1 = __webpack_require__(3);
	exports.Int8Histogram = Int8Histogram_1.default;
	var Int16Histogram_1 = __webpack_require__(13);
	exports.Int16Histogram = Int16Histogram_1.default;
	var Int32Histogram_1 = __webpack_require__(14);
	exports.Int32Histogram = Int32Histogram_1.default;
	var Float64Histogram_1 = __webpack_require__(15);
	exports.Float64Histogram = Float64Histogram_1.default;
	var PackedHistogram_1 = __webpack_require__(16);
	exports.PackedHistogram = PackedHistogram_1.default;
	var SparseArrayHistogram_1 = __webpack_require__(20);
	exports.SparseArrayHistogram = SparseArrayHistogram_1.default;
	var AbstractHistogram_1 = __webpack_require__(4);
	exports.AbstractHistogram = AbstractHistogram_1.default;
	exports.Histogram = AbstractHistogram_1.default;
	var HistogramLogReader_1 = __webpack_require__(21);
	exports.HistogramLogReader = HistogramLogReader_1.default;
	exports.listTags = HistogramLogReader_1.listTags;
	var HistogramLogWriter_1 = __webpack_require__(27);
	exports.HistogramLogWriter = HistogramLogWriter_1.default;
	var encoding_1 = __webpack_require__(22);
	exports.decodeFromCompressedBase64 = encoding_1.decodeFromCompressedBase64;
	exports.encodeIntoBase64String = encoding_1.encodeIntoBase64String;
	var Recorder_1 = __webpack_require__(28);
	exports.Recorder = Recorder_1.default;
	var defaultRequest = {
	    bitBucketSize: 32,
	    autoResize: true,
	    lowestDiscernibleValue: 1,
	    highestTrackableValue: 2,
	    numberOfSignificantValueDigits: 3
	};
	exports.defaultRequest = defaultRequest;
	/*const bigIntAvailable = (() => {
	  try {
	    eval("123n");
	    return true;
	  } catch (e) {
	    return false;
	  }
	})();*/
	var build = function (request) {
	    if (request === void 0) { request = defaultRequest; }
	    var parameters = Object.assign({}, defaultRequest, request);
	    var histogramConstr;
	    switch (parameters.bitBucketSize) {
	        case 8:
	            histogramConstr = Int8Histogram_1.default;
	            break;
	        case 16:
	            histogramConstr = Int16Histogram_1.default;
	            break;
	        case 32:
	            histogramConstr = Int32Histogram_1.default;
	            break;
	        case "sparse_array":
	            histogramConstr = SparseArrayHistogram_1.default;
	            break;
	        case "packed":
	            histogramConstr = PackedHistogram_1.default;
	            break;
	        default:
	            //histogramConstr = bigIntAvailable ? BigIntHistogram : Float64Histogram;
	            histogramConstr = Float64Histogram_1.default;
	    }
	    var histogram = new histogramConstr(parameters.lowestDiscernibleValue, parameters.highestTrackableValue, parameters.numberOfSignificantValueDigits);
	    histogram.autoResize = parameters.autoResize;
	    return histogram;
	};
	exports.build = build;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var pow = Math.pow, floor = Math.floor;
	var TWO_POW_32 = pow(2, 32);
	/**
	 * Mimic Java's ByteBufffer with big endian order
	 */
	var ByteBuffer = /** @class */ (function () {
	    function ByteBuffer(data) {
	        this.position = 0;
	        this.data = data;
	        this.int32ArrayForConvert = new Uint32Array(1);
	        this.int8ArrayForConvert = new Uint8Array(this.int32ArrayForConvert.buffer);
	    }
	    ByteBuffer.allocate = function (size) {
	        if (size === void 0) { size = 16; }
	        return new ByteBuffer(new Uint8Array(size));
	    };
	    ByteBuffer.prototype.put = function (value) {
	        if (this.position === this.data.length) {
	            var oldArray = this.data;
	            this.data = new Uint8Array(this.data.length * 2);
	            this.data.set(oldArray);
	        }
	        this.data[this.position] = value;
	        this.position++;
	    };
	    ByteBuffer.prototype.putInt32 = function (value) {
	        if (this.data.length - this.position < 4) {
	            var oldArray = this.data;
	            this.data = new Uint8Array(this.data.length * 2 + 4);
	            this.data.set(oldArray);
	        }
	        this.int32ArrayForConvert[0] = value;
	        this.data.set(this.int8ArrayForConvert.reverse(), this.position);
	        this.position += 4;
	    };
	    ByteBuffer.prototype.putInt64 = function (value) {
	        this.putInt32(floor(value / TWO_POW_32));
	        this.putInt32(value);
	    };
	    ByteBuffer.prototype.putArray = function (array) {
	        if (this.data.length - this.position < array.byteLength) {
	            var oldArray = this.data;
	            this.data = new Uint8Array(this.position + array.byteLength);
	            this.data.set(oldArray);
	        }
	        this.data.set(array, this.position);
	        this.position += array.byteLength;
	    };
	    ByteBuffer.prototype.get = function () {
	        var value = this.data[this.position];
	        this.position++;
	        return value;
	    };
	    ByteBuffer.prototype.getInt32 = function () {
	        this.int8ArrayForConvert.set(this.data.slice(this.position, this.position + 4).reverse());
	        var value = this.int32ArrayForConvert[0];
	        this.position += 4;
	        return value;
	    };
	    ByteBuffer.prototype.getInt64 = function () {
	        var high = this.getInt32();
	        var low = this.getInt32();
	        return high * TWO_POW_32 + low;
	    };
	    ByteBuffer.prototype.resetPosition = function () {
	        this.position = 0;
	    };
	    return ByteBuffer;
	}());
	exports.default = ByteBuffer;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogram_1 = __webpack_require__(4);
	var Int8Histogram = /** @class */ (function (_super) {
	    __extends(Int8Histogram, _super);
	    function Int8Histogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
	        var _this = _super.call(this, lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) || this;
	        _this.totalCount = 0;
	        _this.counts = new Uint8Array(_this.countsArrayLength);
	        return _this;
	    }
	    Int8Histogram.prototype.clearCounts = function () {
	        this.counts.fill(0);
	    };
	    Int8Histogram.prototype.incrementCountAtIndex = function (index) {
	        var currentCount = this.counts[index];
	        var newCount = currentCount + 1;
	        if (newCount < 0) {
	            throw newCount + " would overflow short integer count";
	        }
	        this.counts[index] = newCount;
	    };
	    Int8Histogram.prototype.addToCountAtIndex = function (index, value) {
	        var currentCount = this.counts[index];
	        var newCount = currentCount + value;
	        if (newCount < Number.MIN_SAFE_INTEGER ||
	            newCount > Number.MAX_SAFE_INTEGER) {
	            throw newCount + " would overflow integer count";
	        }
	        this.counts[index] = newCount;
	    };
	    Int8Histogram.prototype.setCountAtIndex = function (index, value) {
	        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
	            throw value + " would overflow integer count";
	        }
	        this.counts[index] = value;
	    };
	    Int8Histogram.prototype.resize = function (newHighestTrackableValue) {
	        this.establishSize(newHighestTrackableValue);
	        var newCounts = new Uint8Array(this.countsArrayLength);
	        newCounts.set(this.counts);
	        this.counts = newCounts;
	    };
	    Int8Histogram.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
	    Int8Histogram.prototype.incrementTotalCount = function () {
	        this.totalCount++;
	    };
	    Int8Histogram.prototype.addToTotalCount = function (value) {
	        this.totalCount += value;
	    };
	    Int8Histogram.prototype.setTotalCount = function (value) {
	        this.totalCount = value;
	    };
	    Int8Histogram.prototype.getTotalCount = function () {
	        return this.totalCount;
	    };
	    Int8Histogram.prototype.getCountAtIndex = function (index) {
	        return this.counts[index];
	    };
	    Int8Histogram.prototype._getEstimatedFootprintInBytes = function () {
	        return 512 + this.counts.length;
	    };
	    Int8Histogram.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
	        var copy = new Int8Histogram(this.lowestDiscernibleValue, this.highestTrackableValue, this.numberOfSignificantValueDigits);
	        copy.addWhileCorrectingForCoordinatedOmission(this, expectedIntervalBetweenValueSamples);
	        return copy;
	    };
	    return Int8Histogram;
	}(AbstractHistogram_1.default));
	exports.default = Int8Histogram;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogramBase_1 = __webpack_require__(5);
	var RecordedValuesIterator_1 = __webpack_require__(7);
	var PercentileIterator_1 = __webpack_require__(10);
	var formatters_1 = __webpack_require__(11);
	var ulp_1 = __webpack_require__(12);
	var pow = Math.pow, floor = Math.floor, ceil = Math.ceil, log2 = Math.log2, max = Math.max, min = Math.min;
	var AbstractHistogram = /** @class */ (function (_super) {
	    __extends(AbstractHistogram, _super);
	    function AbstractHistogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
	        var _this = _super.call(this) || this;
	        _this.maxValue = 0;
	        _this.minNonZeroValue = Number.MAX_SAFE_INTEGER;
	        // Verify argument validity
	        if (lowestDiscernibleValue < 1) {
	            throw new Error("lowestDiscernibleValue must be >= 1");
	        }
	        if (highestTrackableValue < 2 * lowestDiscernibleValue) {
	            throw new Error("highestTrackableValue must be >= 2 * lowestDiscernibleValue ( 2 * " + lowestDiscernibleValue + " )");
	        }
	        if (numberOfSignificantValueDigits < 0 ||
	            numberOfSignificantValueDigits > 5) {
	            throw new Error("numberOfSignificantValueDigits must be between 0 and 5");
	        }
	        _this.identity = AbstractHistogramBase_1.AbstractHistogramBase.identityBuilder++;
	        _this.init(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits, 1.0, 0);
	        return _this;
	    }
	    AbstractHistogram.prototype.updatedMaxValue = function (value) {
	        var internalValue = value + this.unitMagnitudeMask;
	        this.maxValue = internalValue;
	    };
	    AbstractHistogram.prototype.updateMinNonZeroValue = function (value) {
	        if (value <= this.unitMagnitudeMask) {
	            return;
	        }
	        var internalValue = floor(value / this.lowestDiscernibleValueRounded) *
	            this.lowestDiscernibleValueRounded;
	        this.minNonZeroValue = internalValue;
	    };
	    AbstractHistogram.prototype.resetMinNonZeroValue = function (minNonZeroValue) {
	        var internalValue = floor(minNonZeroValue / this.lowestDiscernibleValueRounded) *
	            this.lowestDiscernibleValueRounded;
	        this.minNonZeroValue =
	            minNonZeroValue === Number.MAX_SAFE_INTEGER
	                ? minNonZeroValue
	                : internalValue;
	    };
	    AbstractHistogram.prototype.init = function (lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits, integerToDoubleValueConversionRatio, normalizingIndexOffset) {
	        this.lowestDiscernibleValue = lowestDiscernibleValue;
	        this.highestTrackableValue = highestTrackableValue;
	        this.numberOfSignificantValueDigits = numberOfSignificantValueDigits;
	        this.integerToDoubleValueConversionRatio = integerToDoubleValueConversionRatio;
	        if (normalizingIndexOffset !== 0) {
	            this.setNormalizingIndexOffset(normalizingIndexOffset);
	        }
	        /*
	         * Given a 3 decimal point accuracy, the expectation is obviously for "+/- 1 unit at 1000". It also means that
	         * it's "ok to be +/- 2 units at 2000". The "tricky" thing is that it is NOT ok to be +/- 2 units at 1999. Only
	         * starting at 2000. So internally, we need to maintain single unit resolution to 2x 10^decimalPoints.
	         */
	        var largestValueWithSingleUnitResolution = 2 * floor(pow(10, numberOfSignificantValueDigits));
	        this.unitMagnitude = floor(log2(lowestDiscernibleValue));
	        this.lowestDiscernibleValueRounded = pow(2, this.unitMagnitude);
	        this.unitMagnitudeMask = this.lowestDiscernibleValueRounded - 1;
	        // We need to maintain power-of-two subBucketCount (for clean direct indexing) that is large enough to
	        // provide unit resolution to at least largestValueWithSingleUnitResolution. So figure out
	        // largestValueWithSingleUnitResolution's nearest power-of-two (rounded up), and use that:
	        var subBucketCountMagnitude = ceil(log2(largestValueWithSingleUnitResolution));
	        this.subBucketHalfCountMagnitude =
	            (subBucketCountMagnitude > 1 ? subBucketCountMagnitude : 1) - 1;
	        this.subBucketCount = pow(2, this.subBucketHalfCountMagnitude + 1);
	        this.subBucketHalfCount = this.subBucketCount / 2;
	        this.subBucketMask =
	            (floor(this.subBucketCount) - 1) * pow(2, this.unitMagnitude);
	        this.establishSize(highestTrackableValue);
	        this.leadingZeroCountBase =
	            53 - this.unitMagnitude - this.subBucketHalfCountMagnitude - 1;
	        this.percentileIterator = new PercentileIterator_1.default(this, 1);
	        this.recordedValuesIterator = new RecordedValuesIterator_1.default(this);
	    };
	    /**
	     * The buckets (each of which has subBucketCount sub-buckets, here assumed to be 2048 as an example) overlap:
	     *
	     * <pre>
	     * The 0'th bucket covers from 0...2047 in multiples of 1, using all 2048 sub-buckets
	     * The 1'th bucket covers from 2048..4097 in multiples of 2, using only the top 1024 sub-buckets
	     * The 2'th bucket covers from 4096..8191 in multiple of 4, using only the top 1024 sub-buckets
	     * ...
	     * </pre>
	     *
	     * Bucket 0 is "special" here. It is the only one that has 2048 entries. All the rest have 1024 entries (because
	     * their bottom half overlaps with and is already covered by the all of the previous buckets put together). In other
	     * words, the k'th bucket could represent 0 * 2^k to 2048 * 2^k in 2048 buckets with 2^k precision, but the midpoint
	     * of 1024 * 2^k = 2048 * 2^(k-1) = the k-1'th bucket's end, so we would use the previous bucket for those lower
	     * values as it has better precision.
	     */
	    AbstractHistogram.prototype.establishSize = function (newHighestTrackableValue) {
	        // establish counts array length:
	        this.countsArrayLength = this.determineArrayLengthNeeded(newHighestTrackableValue);
	        // establish exponent range needed to support the trackable value with no overflow:
	        this.bucketCount = this.getBucketsNeededToCoverValue(newHighestTrackableValue);
	        // establish the new highest trackable value:
	        this.highestTrackableValue = newHighestTrackableValue;
	    };
	    AbstractHistogram.prototype.determineArrayLengthNeeded = function (highestTrackableValue) {
	        if (highestTrackableValue < 2 * this.lowestDiscernibleValue) {
	            throw new Error("highestTrackableValue (" +
	                highestTrackableValue +
	                ") cannot be < (2 * lowestDiscernibleValue)");
	        }
	        //determine counts array length needed:
	        var countsArrayLength = this.getLengthForNumberOfBuckets(this.getBucketsNeededToCoverValue(highestTrackableValue));
	        return countsArrayLength;
	    };
	    /**
	     * If we have N such that subBucketCount * 2^N > max value, we need storage for N+1 buckets, each with enough
	     * slots to hold the top half of the subBucketCount (the lower half is covered by previous buckets), and the +1
	     * being used for the lower half of the 0'th bucket. Or, equivalently, we need 1 more bucket to capture the max
	     * value if we consider the sub-bucket length to be halved.
	     */
	    AbstractHistogram.prototype.getLengthForNumberOfBuckets = function (numberOfBuckets) {
	        var lengthNeeded = (numberOfBuckets + 1) * (this.subBucketCount / 2);
	        return lengthNeeded;
	    };
	    AbstractHistogram.prototype.getBucketsNeededToCoverValue = function (value) {
	        // the k'th bucket can express from 0 * 2^k to subBucketCount * 2^k in units of 2^k
	        var smallestUntrackableValue = this.subBucketCount * pow(2, this.unitMagnitude);
	        // always have at least 1 bucket
	        var bucketsNeeded = 1;
	        while (smallestUntrackableValue <= value) {
	            if (smallestUntrackableValue > Number.MAX_SAFE_INTEGER / 2) {
	                // TODO check array max size in JavaScript
	                // next shift will overflow, meaning that bucket could represent values up to ones greater than
	                // Number.MAX_SAFE_INTEGER, so it's the last bucket
	                return bucketsNeeded + 1;
	            }
	            smallestUntrackableValue = smallestUntrackableValue * 2;
	            bucketsNeeded++;
	        }
	        return bucketsNeeded;
	    };
	    /**
	     * Record a value in the histogram
	     *
	     * @param value The value to be recorded
	     * @throws may throw Error if value is exceeds highestTrackableValue
	     */
	    AbstractHistogram.prototype.recordValue = function (value) {
	        this.recordSingleValue(value);
	    };
	    AbstractHistogram.prototype.recordSingleValue = function (value) {
	        var countsIndex = this.countsArrayIndex(value);
	        if (countsIndex >= this.countsArrayLength) {
	            this.handleRecordException(1, value);
	        }
	        else {
	            this.incrementCountAtIndex(countsIndex);
	        }
	        this.updateMinAndMax(value);
	        this.incrementTotalCount();
	    };
	    AbstractHistogram.prototype.handleRecordException = function (count, value) {
	        if (!this.autoResize) {
	            throw new Error("Value " + value + " is outside of histogram covered range");
	        }
	        this.resize(value);
	        var countsIndex = this.countsArrayIndex(value);
	        this.addToCountAtIndex(countsIndex, count);
	        this.highestTrackableValue = this.highestEquivalentValue(this.valueFromIndex(this.countsArrayLength - 1));
	    };
	    AbstractHistogram.prototype.countsArrayIndex = function (value) {
	        if (value < 0) {
	            throw new Error("Histogram recorded value cannot be negative.");
	        }
	        var bucketIndex = this.getBucketIndex(value);
	        var subBucketIndex = this.getSubBucketIndex(value, bucketIndex);
	        return this.computeCountsArrayIndex(bucketIndex, subBucketIndex);
	    };
	    AbstractHistogram.prototype.computeCountsArrayIndex = function (bucketIndex, subBucketIndex) {
	        // TODO
	        //assert(subBucketIndex < subBucketCount);
	        //assert(bucketIndex == 0 || (subBucketIndex >= subBucketHalfCount));
	        // Calculate the index for the first entry that will be used in the bucket (halfway through subBucketCount).
	        // For bucketIndex 0, all subBucketCount entries may be used, but bucketBaseIndex is still set in the middle.
	        var bucketBaseIndex = (bucketIndex + 1) * pow(2, this.subBucketHalfCountMagnitude);
	        // Calculate the offset in the bucket. This subtraction will result in a positive value in all buckets except
	        // the 0th bucket (since a value in that bucket may be less than half the bucket's 0 to subBucketCount range).
	        // However, this works out since we give bucket 0 twice as much space.
	        var offsetInBucket = subBucketIndex - this.subBucketHalfCount;
	        // The following is the equivalent of ((subBucketIndex  - subBucketHalfCount) + bucketBaseIndex;
	        return bucketBaseIndex + offsetInBucket;
	    };
	    /**
	     * @return the lowest (and therefore highest precision) bucket index that can represent the value
	     */
	    AbstractHistogram.prototype.getBucketIndex = function (value) {
	        // Calculates the number of powers of two by which the value is greater than the biggest value that fits in
	        // bucket 0. This is the bucket index since each successive bucket can hold a value 2x greater.
	        // The mask maps small values to bucket 0.
	        // return this.leadingZeroCountBase - Long.numberOfLeadingZeros(value | subBucketMask);
	        return max(floor(log2(value)) -
	            this.subBucketHalfCountMagnitude -
	            this.unitMagnitude, 0);
	    };
	    AbstractHistogram.prototype.getSubBucketIndex = function (value, bucketIndex) {
	        // For bucketIndex 0, this is just value, so it may be anywhere in 0 to subBucketCount.
	        // For other bucketIndex, this will always end up in the top half of subBucketCount: assume that for some bucket
	        // k > 0, this calculation will yield a value in the bottom half of 0 to subBucketCount. Then, because of how
	        // buckets overlap, it would have also been in the top half of bucket k-1, and therefore would have
	        // returned k-1 in getBucketIndex(). Since we would then shift it one fewer bits here, it would be twice as big,
	        // and therefore in the top half of subBucketCount.
	        return floor(value / pow(2, bucketIndex + this.unitMagnitude));
	    };
	    AbstractHistogram.prototype.updateMinAndMax = function (value) {
	        if (value > this.maxValue) {
	            this.updatedMaxValue(value);
	        }
	        if (value < this.minNonZeroValue && value !== 0) {
	            this.updateMinNonZeroValue(value);
	        }
	    };
	    /**
	     * Get the value at a given percentile.
	     * When the given percentile is &gt; 0.0, the value returned is the value that the given
	     * percentage of the overall recorded value entries in the histogram are either smaller than
	     * or equivalent to. When the given percentile is 0.0, the value returned is the value that all value
	     * entries in the histogram are either larger than or equivalent to.
	     * <p>
	     * Note that two values are "equivalent" in this statement if
	     * {@link org.HdrHistogram.AbstractHistogram#valuesAreEquivalent} would return true.
	     *
	     * @param percentile  The percentile for which to return the associated value
	     * @return The value that the given percentage of the overall recorded value entries in the
	     * histogram are either smaller than or equivalent to. When the percentile is 0.0, returns the
	     * value that all value entries in the histogram are either larger than or equivalent to.
	     */
	    AbstractHistogram.prototype.getValueAtPercentile = function (percentile) {
	        var requestedPercentile = min(percentile, 100); // Truncate down to 100%
	        // round count up to nearest integer, to ensure that the largest value that the requested percentile
	        // of overall recorded values is actually included. However, this must be done with care:
	        //
	        // First, Compute fp value for count at the requested percentile. Note that fp result end up
	        // being 1 ulp larger than the correct integer count for this percentile:
	        var fpCountAtPercentile = (requestedPercentile / 100.0) * this.getTotalCount();
	        // Next, round up, but make sure to prevent <= 1 ulp inaccurancies in the above fp math from
	        // making us skip a count:
	        var countAtPercentile = max(ceil(fpCountAtPercentile - ulp_1.default(fpCountAtPercentile)), // round up
	        1 // Make sure we at least reach the first recorded entry
	        );
	        var totalToCurrentIndex = 0;
	        for (var i = 0; i < this.countsArrayLength; i++) {
	            totalToCurrentIndex += this.getCountAtIndex(i);
	            if (totalToCurrentIndex >= countAtPercentile) {
	                var valueAtIndex = this.valueFromIndex(i);
	                return percentile === 0.0
	                    ? this.lowestEquivalentValue(valueAtIndex)
	                    : this.highestEquivalentValue(valueAtIndex);
	            }
	        }
	        return 0;
	    };
	    AbstractHistogram.prototype.valueFromIndexes = function (bucketIndex, subBucketIndex) {
	        return subBucketIndex * pow(2, bucketIndex + this.unitMagnitude);
	    };
	    AbstractHistogram.prototype.valueFromIndex = function (index) {
	        var bucketIndex = floor(index / this.subBucketHalfCount) - 1;
	        var subBucketIndex = (index % this.subBucketHalfCount) + this.subBucketHalfCount;
	        if (bucketIndex < 0) {
	            subBucketIndex -= this.subBucketHalfCount;
	            bucketIndex = 0;
	        }
	        return this.valueFromIndexes(bucketIndex, subBucketIndex);
	    };
	    /**
	     * Get the lowest value that is equivalent to the given value within the histogram's resolution.
	     * Where "equivalent" means that value samples recorded for any two
	     * equivalent values are counted in a common total count.
	     *
	     * @param value The given value
	     * @return The lowest value that is equivalent to the given value within the histogram's resolution.
	     */
	    AbstractHistogram.prototype.lowestEquivalentValue = function (value) {
	        var bucketIndex = this.getBucketIndex(value);
	        var subBucketIndex = this.getSubBucketIndex(value, bucketIndex);
	        var thisValueBaseLevel = this.valueFromIndexes(bucketIndex, subBucketIndex);
	        return thisValueBaseLevel;
	    };
	    /**
	     * Get the highest value that is equivalent to the given value within the histogram's resolution.
	     * Where "equivalent" means that value samples recorded for any two
	     * equivalent values are counted in a common total count.
	     *
	     * @param value The given value
	     * @return The highest value that is equivalent to the given value within the histogram's resolution.
	     */
	    AbstractHistogram.prototype.highestEquivalentValue = function (value) {
	        return this.nextNonEquivalentValue(value) - 1;
	    };
	    /**
	     * Get the next value that is not equivalent to the given value within the histogram's resolution.
	     * Where "equivalent" means that value samples recorded for any two
	     * equivalent values are counted in a common total count.
	     *
	     * @param value The given value
	     * @return The next value that is not equivalent to the given value within the histogram's resolution.
	     */
	    AbstractHistogram.prototype.nextNonEquivalentValue = function (value) {
	        return (this.lowestEquivalentValue(value) + this.sizeOfEquivalentValueRange(value));
	    };
	    /**
	     * Get the size (in value units) of the range of values that are equivalent to the given value within the
	     * histogram's resolution. Where "equivalent" means that value samples recorded for any two
	     * equivalent values are counted in a common total count.
	     *
	     * @param value The given value
	     * @return The size of the range of values equivalent to the given value.
	     */
	    AbstractHistogram.prototype.sizeOfEquivalentValueRange = function (value) {
	        var bucketIndex = this.getBucketIndex(value);
	        var subBucketIndex = this.getSubBucketIndex(value, bucketIndex);
	        var distanceToNextValue = pow(2, this.unitMagnitude +
	            (subBucketIndex >= this.subBucketCount ? bucketIndex + 1 : bucketIndex));
	        return distanceToNextValue;
	    };
	    /**
	     * Get a value that lies in the middle (rounded up) of the range of values equivalent the given value.
	     * Where "equivalent" means that value samples recorded for any two
	     * equivalent values are counted in a common total count.
	     *
	     * @param value The given value
	     * @return The value lies in the middle (rounded up) of the range of values equivalent the given value.
	     */
	    AbstractHistogram.prototype.medianEquivalentValue = function (value) {
	        return (this.lowestEquivalentValue(value) +
	            floor(this.sizeOfEquivalentValueRange(value) / 2));
	    };
	    /**
	     * Get the computed mean value of all recorded values in the histogram
	     *
	     * @return the mean value (in value units) of the histogram data
	     */
	    AbstractHistogram.prototype.getMean = function () {
	        if (this.getTotalCount() === 0) {
	            return 0;
	        }
	        this.recordedValuesIterator.reset();
	        var totalValue = 0;
	        while (this.recordedValuesIterator.hasNext()) {
	            var iterationValue = this.recordedValuesIterator.next();
	            totalValue +=
	                this.medianEquivalentValue(iterationValue.valueIteratedTo) *
	                    iterationValue.countAtValueIteratedTo;
	        }
	        return (totalValue * 1.0) / this.getTotalCount();
	    };
	    /**
	     * Get the computed standard deviation of all recorded values in the histogram
	     *
	     * @return the standard deviation (in value units) of the histogram data
	     */
	    AbstractHistogram.prototype.getStdDeviation = function () {
	        if (this.getTotalCount() === 0) {
	            return 0;
	        }
	        var mean = this.getMean();
	        var geometric_deviation_total = 0.0;
	        this.recordedValuesIterator.reset();
	        while (this.recordedValuesIterator.hasNext()) {
	            var iterationValue = this.recordedValuesIterator.next();
	            var deviation = this.medianEquivalentValue(iterationValue.valueIteratedTo) - mean;
	            geometric_deviation_total +=
	                deviation * deviation * iterationValue.countAddedInThisIterationStep;
	        }
	        var std_deviation = Math.sqrt(geometric_deviation_total / this.getTotalCount());
	        return std_deviation;
	    };
	    /**
	     * Produce textual representation of the value distribution of histogram data by percentile. The distribution is
	     * output with exponentially increasing resolution, with each exponentially decreasing half-distance containing
	     * <i>dumpTicksPerHalf</i> percentile reporting tick points.
	     *
	     * @param printStream    Stream into which the distribution will be output
	     * <p>
	     * @param percentileTicksPerHalfDistance  The number of reporting points per exponentially decreasing half-distance
	     * <p>
	     * @param outputValueUnitScalingRatio    The scaling factor by which to divide histogram recorded values units in
	     *                                     output
	     * @param useCsvFormat  Output in CSV format if true. Otherwise use plain text form.
	     */
	    AbstractHistogram.prototype.outputPercentileDistribution = function (percentileTicksPerHalfDistance, outputValueUnitScalingRatio, useCsvFormat) {
	        if (percentileTicksPerHalfDistance === void 0) { percentileTicksPerHalfDistance = 5; }
	        if (outputValueUnitScalingRatio === void 0) { outputValueUnitScalingRatio = 1; }
	        if (useCsvFormat === void 0) { useCsvFormat = false; }
	        var result = "";
	        if (useCsvFormat) {
	            result += '"Value","Percentile","TotalCount","1/(1-Percentile)"\n';
	        }
	        else {
	            result += "       Value     Percentile TotalCount 1/(1-Percentile)\n\n";
	        }
	        var iterator = this.percentileIterator;
	        iterator.reset(percentileTicksPerHalfDistance);
	        var lineFormatter;
	        var lastLineFormatter;
	        if (useCsvFormat) {
	            var valueFormatter_1 = formatters_1.floatFormatter(0, this.numberOfSignificantValueDigits);
	            var percentileFormatter_1 = formatters_1.floatFormatter(0, 12);
	            var lastFormatter_1 = formatters_1.floatFormatter(0, 2);
	            lineFormatter = function (iterationValue) {
	                return valueFormatter_1(iterationValue.valueIteratedTo / outputValueUnitScalingRatio) +
	                    "," +
	                    percentileFormatter_1(iterationValue.percentileLevelIteratedTo / 100) +
	                    "," +
	                    iterationValue.totalCountToThisValue +
	                    "," +
	                    lastFormatter_1(1 / (1 - iterationValue.percentileLevelIteratedTo / 100)) +
	                    "\n";
	            };
	            lastLineFormatter = function (iterationValue) {
	                return valueFormatter_1(iterationValue.valueIteratedTo / outputValueUnitScalingRatio) +
	                    "," +
	                    percentileFormatter_1(iterationValue.percentileLevelIteratedTo / 100) +
	                    "," +
	                    iterationValue.totalCountToThisValue +
	                    ",Infinity\n";
	            };
	        }
	        else {
	            var valueFormatter_2 = formatters_1.floatFormatter(12, this.numberOfSignificantValueDigits);
	            var percentileFormatter_2 = formatters_1.floatFormatter(2, 12);
	            var totalCountFormatter_1 = formatters_1.integerFormatter(10);
	            var lastFormatter_2 = formatters_1.floatFormatter(14, 2);
	            lineFormatter = function (iterationValue) {
	                return valueFormatter_2(iterationValue.valueIteratedTo / outputValueUnitScalingRatio) +
	                    " " +
	                    percentileFormatter_2(iterationValue.percentileLevelIteratedTo / 100) +
	                    " " +
	                    totalCountFormatter_1(iterationValue.totalCountToThisValue) +
	                    " " +
	                    lastFormatter_2(1 / (1 - iterationValue.percentileLevelIteratedTo / 100)) +
	                    "\n";
	            };
	            lastLineFormatter = function (iterationValue) {
	                return valueFormatter_2(iterationValue.valueIteratedTo / outputValueUnitScalingRatio) +
	                    " " +
	                    percentileFormatter_2(iterationValue.percentileLevelIteratedTo / 100) +
	                    " " +
	                    totalCountFormatter_1(iterationValue.totalCountToThisValue) +
	                    "\n";
	            };
	        }
	        while (iterator.hasNext()) {
	            var iterationValue = iterator.next();
	            if (iterationValue.percentileLevelIteratedTo < 100) {
	                result += lineFormatter(iterationValue);
	            }
	            else {
	                result += lastLineFormatter(iterationValue);
	            }
	        }
	        if (!useCsvFormat) {
	            // Calculate and output mean and std. deviation.
	            // Note: mean/std. deviation numbers are very often completely irrelevant when
	            // data is extremely non-normal in distribution (e.g. in cases of strong multi-modal
	            // response time distribution associated with GC pauses). However, reporting these numbers
	            // can be very useful for contrasting with the detailed percentile distribution
	            // reported by outputPercentileDistribution(). It is not at all surprising to find
	            // percentile distributions where results fall many tens or even hundreds of standard
	            // deviations away from the mean - such results simply indicate that the data sampled
	            // exhibits a very non-normal distribution, highlighting situations for which the std.
	            // deviation metric is a useless indicator.
	            //
	            var formatter = formatters_1.floatFormatter(12, this.numberOfSignificantValueDigits);
	            var mean = formatter(this.getMean() / outputValueUnitScalingRatio);
	            var std_deviation = formatter(this.getStdDeviation() / outputValueUnitScalingRatio);
	            var max_1 = formatter(this.maxValue / outputValueUnitScalingRatio);
	            var intFormatter = formatters_1.integerFormatter(12);
	            var totalCount = intFormatter(this.getTotalCount());
	            var bucketCount = intFormatter(this.bucketCount);
	            var subBucketCount = intFormatter(this.subBucketCount);
	            result += "#[Mean    = " + mean + ", StdDeviation   = " + std_deviation + "]\n#[Max     = " + max_1 + ", Total count    = " + totalCount + "]\n#[Buckets = " + bucketCount + ", SubBuckets     = " + subBucketCount + "]\n";
	        }
	        return result;
	    };
	    /**
	     * Provide a (conservatively high) estimate of the Histogram's total footprint in bytes
	     *
	     * @return a (conservatively high) estimate of the Histogram's total footprint in bytes
	     */
	    AbstractHistogram.prototype.getEstimatedFootprintInBytes = function () {
	        return this._getEstimatedFootprintInBytes();
	    };
	    AbstractHistogram.prototype.recordSingleValueWithExpectedInterval = function (value, expectedIntervalBetweenValueSamples) {
	        this.recordSingleValue(value);
	        if (expectedIntervalBetweenValueSamples <= 0) {
	            return;
	        }
	        for (var missingValue = value - expectedIntervalBetweenValueSamples; missingValue >= expectedIntervalBetweenValueSamples; missingValue -= expectedIntervalBetweenValueSamples) {
	            this.recordSingleValue(missingValue);
	        }
	    };
	    AbstractHistogram.prototype.recordCountAtValue = function (count, value) {
	        var countsIndex = this.countsArrayIndex(value);
	        if (countsIndex >= this.countsArrayLength) {
	            this.handleRecordException(count, value);
	        }
	        else {
	            this.addToCountAtIndex(countsIndex, count);
	        }
	        this.updateMinAndMax(value);
	        this.addToTotalCount(count);
	    };
	    /**
	     * Record a value in the histogram (adding to the value's current count)
	     *
	     * @param value The value to be recorded
	     * @param count The number of occurrences of this value to record
	     * @throws ArrayIndexOutOfBoundsException (may throw) if value is exceeds highestTrackableValue
	     */
	    AbstractHistogram.prototype.recordValueWithCount = function (value, count) {
	        this.recordCountAtValue(count, value);
	    };
	    /**
	     * Record a value in the histogram.
	     * <p>
	     * To compensate for the loss of sampled values when a recorded value is larger than the expected
	     * interval between value samples, Histogram will auto-generate an additional series of decreasingly-smaller
	     * (down to the expectedIntervalBetweenValueSamples) value records.
	     * <p>
	     * Note: This is a at-recording correction method, as opposed to the post-recording correction method provided
	     * by {@link #copyCorrectedForCoordinatedOmission(long)}.
	     * The two methods are mutually exclusive, and only one of the two should be be used on a given data set to correct
	     * for the same coordinated omission issue.
	     * <p>
	     * See notes in the description of the Histogram calls for an illustration of why this corrective behavior is
	     * important.
	     *
	     * @param value The value to record
	     * @param expectedIntervalBetweenValueSamples If expectedIntervalBetweenValueSamples is larger than 0, add
	     *                                           auto-generated value records as appropriate if value is larger
	     *                                           than expectedIntervalBetweenValueSamples
	     * @throws ArrayIndexOutOfBoundsException (may throw) if value is exceeds highestTrackableValue
	     */
	    AbstractHistogram.prototype.recordValueWithExpectedInterval = function (value, expectedIntervalBetweenValueSamples) {
	        this.recordSingleValueWithExpectedInterval(value, expectedIntervalBetweenValueSamples);
	    };
	    AbstractHistogram.prototype.recordValueWithCountAndExpectedInterval = function (value, count, expectedIntervalBetweenValueSamples) {
	        this.recordCountAtValue(count, value);
	        if (expectedIntervalBetweenValueSamples <= 0) {
	            return;
	        }
	        for (var missingValue = value - expectedIntervalBetweenValueSamples; missingValue >= expectedIntervalBetweenValueSamples; missingValue -= expectedIntervalBetweenValueSamples) {
	            this.recordCountAtValue(count, missingValue);
	        }
	    };
	    /**
	     * Add the contents of another histogram to this one, while correcting the incoming data for coordinated omission.
	     * <p>
	     * To compensate for the loss of sampled values when a recorded value is larger than the expected
	     * interval between value samples, the values added will include an auto-generated additional series of
	     * decreasingly-smaller (down to the expectedIntervalBetweenValueSamples) value records for each count found
	     * in the current histogram that is larger than the expectedIntervalBetweenValueSamples.
	     *
	     * Note: This is a post-recording correction method, as opposed to the at-recording correction method provided
	     * by {@link #recordValueWithExpectedInterval(long, long) recordValueWithExpectedInterval}. The two
	     * methods are mutually exclusive, and only one of the two should be be used on a given data set to correct
	     * for the same coordinated omission issue.
	     * by
	     * <p>
	     * See notes in the description of the Histogram calls for an illustration of why this corrective behavior is
	     * important.
	     *
	     * @param otherHistogram The other histogram. highestTrackableValue and largestValueWithSingleUnitResolution must match.
	     * @param expectedIntervalBetweenValueSamples If expectedIntervalBetweenValueSamples is larger than 0, add
	     *                                           auto-generated value records as appropriate if value is larger
	     *                                           than expectedIntervalBetweenValueSamples
	     * @throws ArrayIndexOutOfBoundsException (may throw) if values exceed highestTrackableValue
	     */
	    AbstractHistogram.prototype.addWhileCorrectingForCoordinatedOmission = function (otherHistogram, expectedIntervalBetweenValueSamples) {
	        var toHistogram = this;
	        var otherValues = new RecordedValuesIterator_1.default(otherHistogram);
	        while (otherValues.hasNext()) {
	            var v = otherValues.next();
	            toHistogram.recordValueWithCountAndExpectedInterval(v.valueIteratedTo, v.countAtValueIteratedTo, expectedIntervalBetweenValueSamples);
	        }
	    };
	    /**
	     * Add the contents of another histogram to this one.
	     * <p>
	     * As part of adding the contents, the start/end timestamp range of this histogram will be
	     * extended to include the start/end timestamp range of the other histogram.
	     *
	     * @param otherHistogram The other histogram.
	     * @throws (may throw) if values in fromHistogram's are
	     * higher than highestTrackableValue.
	     */
	    AbstractHistogram.prototype.add = function (otherHistogram) {
	        var highestRecordableValue = this.highestEquivalentValue(this.valueFromIndex(this.countsArrayLength - 1));
	        if (highestRecordableValue < otherHistogram.maxValue) {
	            if (!this.autoResize) {
	                throw new Error("The other histogram includes values that do not fit in this histogram's range.");
	            }
	            this.resize(otherHistogram.maxValue);
	        }
	        if (this.bucketCount === otherHistogram.bucketCount &&
	            this.subBucketCount === otherHistogram.subBucketCount &&
	            this.unitMagnitude === otherHistogram.unitMagnitude) {
	            // Counts arrays are of the same length and meaning, so we can just iterate and add directly:
	            var observedOtherTotalCount = 0;
	            for (var i = 0; i < otherHistogram.countsArrayLength; i++) {
	                var otherCount = otherHistogram.getCountAtIndex(i);
	                if (otherCount > 0) {
	                    this.addToCountAtIndex(i, otherCount);
	                    observedOtherTotalCount += otherCount;
	                }
	            }
	            this.setTotalCount(this.getTotalCount() + observedOtherTotalCount);
	            this.updatedMaxValue(max(this.maxValue, otherHistogram.maxValue));
	            this.updateMinNonZeroValue(min(this.minNonZeroValue, otherHistogram.minNonZeroValue));
	        }
	        else {
	            // Arrays are not a direct match (or the other could change on the fly in some valid way),
	            // so we can't just stream through and add them. Instead, go through the array and add each
	            // non-zero value found at it's proper value:
	            // Do max value first, to avoid max value updates on each iteration:
	            var otherMaxIndex = otherHistogram.countsArrayIndex(otherHistogram.maxValue);
	            var otherCount = otherHistogram.getCountAtIndex(otherMaxIndex);
	            this.recordCountAtValue(otherCount, otherHistogram.maxValue);
	            // Record the remaining values, up to but not including the max value:
	            for (var i = 0; i < otherMaxIndex; i++) {
	                otherCount = otherHistogram.getCountAtIndex(i);
	                if (otherCount > 0) {
	                    this.recordCountAtValue(otherCount, otherHistogram.valueFromIndex(i));
	                }
	            }
	        }
	        this.startTimeStampMsec = min(this.startTimeStampMsec, otherHistogram.startTimeStampMsec);
	        this.endTimeStampMsec = max(this.endTimeStampMsec, otherHistogram.endTimeStampMsec);
	    };
	    /**
	     * Get the count of recorded values at a specific value (to within the histogram resolution at the value level).
	     *
	     * @param value The value for which to provide the recorded count
	     * @return The total count of values recorded in the histogram within the value range that is
	     * {@literal >=} lowestEquivalentValue(<i>value</i>) and {@literal <=} highestEquivalentValue(<i>value</i>)
	     */
	    AbstractHistogram.prototype.getCountAtValue = function (value) {
	        var index = min(max(0, this.countsArrayIndex(value)), this.countsArrayLength - 1);
	        return this.getCountAtIndex(index);
	    };
	    /**
	     * Subtract the contents of another histogram from this one.
	     * <p>
	     * The start/end timestamps of this histogram will remain unchanged.
	     *
	     * @param otherHistogram The other histogram.
	     * @throws ArrayIndexOutOfBoundsException (may throw) if values in otherHistogram's are higher than highestTrackableValue.
	     *
	     */
	    AbstractHistogram.prototype.subtract = function (otherHistogram) {
	        var highestRecordableValue = this.valueFromIndex(this.countsArrayLength - 1);
	        if (highestRecordableValue < otherHistogram.maxValue) {
	            if (!this.autoResize) {
	                throw new Error("The other histogram includes values that do not fit in this histogram's range.");
	            }
	            this.resize(otherHistogram.maxValue);
	        }
	        if (this.bucketCount === otherHistogram.bucketCount &&
	            this.subBucketCount === otherHistogram.subBucketCount &&
	            this.unitMagnitude === otherHistogram.unitMagnitude) {
	            // optim
	            // Counts arrays are of the same length and meaning, so we can just iterate and add directly:
	            for (var i = 0; i < otherHistogram.countsArrayLength; i++) {
	                var otherCount = otherHistogram.getCountAtIndex(i);
	                if (otherCount > 0) {
	                    this.addToCountAtIndex(i, -otherCount);
	                }
	            }
	        }
	        else {
	            for (var i = 0; i < otherHistogram.countsArrayLength; i++) {
	                var otherCount = otherHistogram.getCountAtIndex(i);
	                if (otherCount > 0) {
	                    var otherValue = otherHistogram.valueFromIndex(i);
	                    if (this.getCountAtValue(otherValue) < otherCount) {
	                        throw new Error("otherHistogram count (" +
	                            otherCount +
	                            ") at value " +
	                            otherValue +
	                            " is larger than this one's (" +
	                            this.getCountAtValue(otherValue) +
	                            ")");
	                    }
	                    this.recordCountAtValue(-otherCount, otherValue);
	                }
	            }
	        }
	        // With subtraction, the max and minNonZero values could have changed:
	        if (this.getCountAtValue(this.maxValue) <= 0 ||
	            this.getCountAtValue(this.minNonZeroValue) <= 0) {
	            this.establishInternalTackingValues();
	        }
	    };
	    AbstractHistogram.prototype.establishInternalTackingValues = function (lengthToCover) {
	        if (lengthToCover === void 0) { lengthToCover = this.countsArrayLength; }
	        this.maxValue = 0;
	        this.minNonZeroValue = Number.MAX_VALUE;
	        var maxIndex = -1;
	        var minNonZeroIndex = -1;
	        var observedTotalCount = 0;
	        for (var index = 0; index < lengthToCover; index++) {
	            var countAtIndex = this.getCountAtIndex(index);
	            if (countAtIndex > 0) {
	                observedTotalCount += countAtIndex;
	                maxIndex = index;
	                if (minNonZeroIndex == -1 && index != 0) {
	                    minNonZeroIndex = index;
	                }
	            }
	        }
	        if (maxIndex >= 0) {
	            this.updatedMaxValue(this.highestEquivalentValue(this.valueFromIndex(maxIndex)));
	        }
	        if (minNonZeroIndex >= 0) {
	            this.updateMinNonZeroValue(this.valueFromIndex(minNonZeroIndex));
	        }
	        this.setTotalCount(observedTotalCount);
	    };
	    AbstractHistogram.prototype.reset = function () {
	        this.clearCounts();
	        this.setTotalCount(0);
	        this.startTimeStampMsec = 0;
	        this.endTimeStampMsec = 0;
	        this.tag = AbstractHistogramBase_1.NO_TAG;
	        this.maxValue = 0;
	        this.minNonZeroValue = Number.MAX_SAFE_INTEGER;
	    };
	    return AbstractHistogram;
	}(AbstractHistogramBase_1.AbstractHistogramBase));
	exports.AbstractHistogram = AbstractHistogram;
	exports.default = AbstractHistogram;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
	var EncodableHistogram_1 = __webpack_require__(6);
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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	var EncodableHistogram = /** @class */ (function () {
	    function EncodableHistogram() {
	    }
	    return EncodableHistogram;
	}());
	exports.EncodableHistogram = EncodableHistogram;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
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
	var AbstractHistogramIterator_1 = __webpack_require__(8);
	/**
	 * Used for iterating through all recorded histogram values using the finest granularity steps supported by the
	 * underlying representation. The iteration steps through all non-zero recorded value counts, and terminates when
	 * all recorded histogram values are exhausted.
	 */
	var RecordedValuesIterator = /** @class */ (function (_super) {
	    __extends(RecordedValuesIterator, _super);
	    /**
	     * @param histogram The histogram this iterator will operate on
	     */
	    function RecordedValuesIterator(histogram) {
	        var _this = _super.call(this) || this;
	        _this.doReset(histogram);
	        return _this;
	    }
	    /**
	     * Reset iterator for re-use in a fresh iteration over the same histogram data set.
	     */
	    RecordedValuesIterator.prototype.reset = function () {
	        this.doReset(this.histogram);
	    };
	    RecordedValuesIterator.prototype.doReset = function (histogram) {
	        _super.prototype.resetIterator.call(this, histogram);
	        this.visitedIndex = -1;
	    };
	    RecordedValuesIterator.prototype.incrementIterationLevel = function () {
	        this.visitedIndex = this.currentIndex;
	    };
	    RecordedValuesIterator.prototype.reachedIterationLevel = function () {
	        var currentCount = this.histogram.getCountAtIndex(this.currentIndex);
	        return currentCount != 0 && this.visitedIndex !== this.currentIndex;
	    };
	    return RecordedValuesIterator;
	}(AbstractHistogramIterator_1.default));
	exports.default = RecordedValuesIterator;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HistogramIterationValue_1 = __webpack_require__(9);
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


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Represents a value point iterated through in a Histogram, with associated stats.
	 * <ul>
	 * <li><b><code>valueIteratedTo</code></b> :<br> The actual value level that was iterated to by the iterator</li>
	 * <li><b><code>prevValueIteratedTo</code></b> :<br> The actual value level that was iterated from by the iterator</li>
	 * <li><b><code>countAtValueIteratedTo</code></b> :<br> The count of recorded values in the histogram that
	 * exactly match this [lowestEquivalentValue(valueIteratedTo)...highestEquivalentValue(valueIteratedTo)] value
	 * range.</li>
	 * <li><b><code>countAddedInThisIterationStep</code></b> :<br> The count of recorded values in the histogram that
	 * were added to the totalCountToThisValue (below) as a result on this iteration step. Since multiple iteration
	 * steps may occur with overlapping equivalent value ranges, the count may be lower than the count found at
	 * the value (e.g. multiple linear steps or percentile levels can occur within a single equivalent value range)</li>
	 * <li><b><code>totalCountToThisValue</code></b> :<br> The total count of all recorded values in the histogram at
	 * values equal or smaller than valueIteratedTo.</li>
	 * <li><b><code>totalValueToThisValue</code></b> :<br> The sum of all recorded values in the histogram at values
	 * equal or smaller than valueIteratedTo.</li>
	 * <li><b><code>percentile</code></b> :<br> The percentile of recorded values in the histogram at values equal
	 * or smaller than valueIteratedTo.</li>
	 * <li><b><code>percentileLevelIteratedTo</code></b> :<br> The percentile level that the iterator returning this
	 * HistogramIterationValue had iterated to. Generally, percentileLevelIteratedTo will be equal to or smaller than
	 * percentile, but the same value point can contain multiple iteration levels for some iterators. E.g. a
	 * PercentileIterator can stop multiple times in the exact same value point (if the count at that value covers a
	 * range of multiple percentiles in the requested percentile iteration points).</li>
	 * </ul>
	 */
	var HistogramIterationValue = /** @class */ (function () {
	    function HistogramIterationValue() {
	        this.reset();
	    }
	    HistogramIterationValue.prototype.reset = function () {
	        this.valueIteratedTo = 0;
	        this.valueIteratedFrom = 0;
	        this.countAtValueIteratedTo = 0;
	        this.countAddedInThisIterationStep = 0;
	        this.totalCountToThisValue = 0;
	        this.totalValueToThisValue = 0;
	        this.percentile = 0.0;
	        this.percentileLevelIteratedTo = 0.0;
	    };
	    return HistogramIterationValue;
	}());
	exports.default = HistogramIterationValue;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogramIterator_1 = __webpack_require__(8);
	var pow = Math.pow, floor = Math.floor, log2 = Math.log2;
	/**
	 * Used for iterating through histogram values according to percentile levels. The iteration is
	 * performed in steps that start at 0% and reduce their distance to 100% according to the
	 * <i>percentileTicksPerHalfDistance</i> parameter, ultimately reaching 100% when all recorded histogram
	 * values are exhausted.
	 */
	var PercentileIterator = /** @class */ (function (_super) {
	    __extends(PercentileIterator, _super);
	    /**
	     * @param histogram The histogram this iterator will operate on
	     * @param percentileTicksPerHalfDistance The number of equal-sized iteration steps per half-distance to 100%.
	     */
	    function PercentileIterator(histogram, percentileTicksPerHalfDistance) {
	        var _this = _super.call(this) || this;
	        _this.percentileTicksPerHalfDistance = 0;
	        _this.percentileLevelToIterateTo = 0;
	        _this.percentileLevelToIterateFrom = 0;
	        _this.reachedLastRecordedValue = false;
	        _this.doReset(histogram, percentileTicksPerHalfDistance);
	        return _this;
	    }
	    /**
	     * Reset iterator for re-use in a fresh iteration over the same histogram data set.
	     *
	     * @param percentileTicksPerHalfDistance The number of iteration steps per half-distance to 100%.
	     */
	    PercentileIterator.prototype.reset = function (percentileTicksPerHalfDistance) {
	        this.doReset(this.histogram, percentileTicksPerHalfDistance);
	    };
	    PercentileIterator.prototype.doReset = function (histogram, percentileTicksPerHalfDistance) {
	        _super.prototype.resetIterator.call(this, histogram);
	        this.percentileTicksPerHalfDistance = percentileTicksPerHalfDistance;
	        this.percentileLevelToIterateTo = 0;
	        this.percentileLevelToIterateFrom = 0;
	        this.reachedLastRecordedValue = false;
	    };
	    PercentileIterator.prototype.hasNext = function () {
	        if (_super.prototype.hasNext.call(this))
	            return true;
	        if (!this.reachedLastRecordedValue && this.arrayTotalCount > 0) {
	            this.percentileLevelToIterateTo = 100;
	            this.reachedLastRecordedValue = true;
	            return true;
	        }
	        return false;
	    };
	    PercentileIterator.prototype.incrementIterationLevel = function () {
	        this.percentileLevelToIterateFrom = this.percentileLevelToIterateTo;
	        // The choice to maintain fixed-sized "ticks" in each half-distance to 100% [starting
	        // from 0%], as opposed to a "tick" size that varies with each interval, was made to
	        // make the steps easily comprehensible and readable to humans. The resulting percentile
	        // steps are much easier to browse through in a percentile distribution output, for example.
	        //
	        // We calculate the number of equal-sized "ticks" that the 0-100 range will be divided
	        // by at the current scale. The scale is detemined by the percentile level we are
	        // iterating to. The following math determines the tick size for the current scale,
	        // and maintain a fixed tick size for the remaining "half the distance to 100%"
	        // [from either 0% or from the previous half-distance]. When that half-distance is
	        // crossed, the scale changes and the tick size is effectively cut in half.
	        // percentileTicksPerHalfDistance = 5
	        // percentileReportingTicks = 10,
	        var percentileReportingTicks = this.percentileTicksPerHalfDistance *
	            pow(2, floor(log2(100 / (100 - this.percentileLevelToIterateTo))) + 1);
	        this.percentileLevelToIterateTo += 100 / percentileReportingTicks;
	    };
	    PercentileIterator.prototype.reachedIterationLevel = function () {
	        if (this.countAtThisValue === 0) {
	            return false;
	        }
	        var currentPercentile = 100 * this.totalCountToCurrentIndex / this.arrayTotalCount;
	        return currentPercentile >= this.percentileLevelToIterateTo;
	    };
	    PercentileIterator.prototype.getPercentileIteratedTo = function () {
	        return this.percentileLevelToIterateTo;
	    };
	    PercentileIterator.prototype.getPercentileIteratedFrom = function () {
	        return this.percentileLevelToIterateFrom;
	    };
	    return PercentileIterator;
	}(AbstractHistogramIterator_1.default));
	exports.default = PercentileIterator;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var leftPadding = function (size) {
	    return function (input) {
	        if (input.length < size) {
	            return " ".repeat(size - input.length) + input;
	        }
	        return input;
	    };
	};
	exports.integerFormatter = function (size) {
	    var padding = leftPadding(size);
	    return function (integer) { return padding("" + integer); };
	};
	exports.floatFormatter = function (size, fractionDigits) {
	    var numberFormatter = new Intl.NumberFormat("en-US", {
	        maximumFractionDigits: fractionDigits,
	        minimumFractionDigits: fractionDigits,
	        useGrouping: false
	    });
	    var padding = leftPadding(size);
	    return function (float) { return padding(numberFormatter.format(float)); };
	};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	var ulp = function (x) { return Math.pow(2, Math.floor(Math.log2(x)) - 52); };
	exports.default = ulp;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogram_1 = __webpack_require__(4);
	var Int16Histogram = /** @class */ (function (_super) {
	    __extends(Int16Histogram, _super);
	    function Int16Histogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
	        var _this = _super.call(this, lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) || this;
	        _this.totalCount = 0;
	        _this.counts = new Uint16Array(_this.countsArrayLength);
	        return _this;
	    }
	    Int16Histogram.prototype.clearCounts = function () {
	        this.counts.fill(0);
	    };
	    Int16Histogram.prototype.incrementCountAtIndex = function (index) {
	        var currentCount = this.counts[index];
	        var newCount = currentCount + 1;
	        if (newCount < 0) {
	            throw newCount + " would overflow short integer count";
	        }
	        this.counts[index] = newCount;
	    };
	    Int16Histogram.prototype.addToCountAtIndex = function (index, value) {
	        var currentCount = this.counts[index];
	        var newCount = currentCount + value;
	        if (newCount < Number.MIN_SAFE_INTEGER ||
	            newCount > Number.MAX_SAFE_INTEGER) {
	            throw newCount + " would overflow integer count";
	        }
	        this.counts[index] = newCount;
	    };
	    Int16Histogram.prototype.setCountAtIndex = function (index, value) {
	        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
	            throw value + " would overflow integer count";
	        }
	        this.counts[index] = value;
	    };
	    Int16Histogram.prototype.resize = function (newHighestTrackableValue) {
	        this.establishSize(newHighestTrackableValue);
	        var newCounts = new Uint16Array(this.countsArrayLength);
	        newCounts.set(this.counts);
	        this.counts = newCounts;
	    };
	    Int16Histogram.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
	    Int16Histogram.prototype.incrementTotalCount = function () {
	        this.totalCount++;
	    };
	    Int16Histogram.prototype.addToTotalCount = function (value) {
	        this.totalCount += value;
	    };
	    Int16Histogram.prototype.setTotalCount = function (value) {
	        this.totalCount = value;
	    };
	    Int16Histogram.prototype.getTotalCount = function () {
	        return this.totalCount;
	    };
	    Int16Histogram.prototype.getCountAtIndex = function (index) {
	        return this.counts[index];
	    };
	    Int16Histogram.prototype._getEstimatedFootprintInBytes = function () {
	        return 512 + 2 * this.counts.length;
	    };
	    Int16Histogram.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
	        var copy = new Int16Histogram(this.lowestDiscernibleValue, this.highestTrackableValue, this.numberOfSignificantValueDigits);
	        copy.addWhileCorrectingForCoordinatedOmission(this, expectedIntervalBetweenValueSamples);
	        return copy;
	    };
	    return Int16Histogram;
	}(AbstractHistogram_1.default));
	exports.default = Int16Histogram;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogram_1 = __webpack_require__(4);
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


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogram_1 = __webpack_require__(4);
	var Float64Histogram = /** @class */ (function (_super) {
	    __extends(Float64Histogram, _super);
	    function Float64Histogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
	        var _this = _super.call(this, lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) || this;
	        _this.totalCount = 0;
	        _this.counts = new Float64Array(_this.countsArrayLength);
	        return _this;
	    }
	    Float64Histogram.prototype.clearCounts = function () {
	        this.counts.fill(0);
	    };
	    Float64Histogram.prototype.incrementCountAtIndex = function (index) {
	        var currentCount = this.counts[index];
	        var newCount = currentCount + 1;
	        if (newCount < 0) {
	            throw newCount + " would overflow short integer count";
	        }
	        this.counts[index] = newCount;
	    };
	    Float64Histogram.prototype.addToCountAtIndex = function (index, value) {
	        var currentCount = this.counts[index];
	        var newCount = currentCount + value;
	        if (newCount < Number.MIN_SAFE_INTEGER ||
	            newCount > Number.MAX_SAFE_INTEGER) {
	            throw newCount + " would overflow integer count";
	        }
	        this.counts[index] = newCount;
	    };
	    Float64Histogram.prototype.setCountAtIndex = function (index, value) {
	        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
	            throw value + " would overflow integer count";
	        }
	        this.counts[index] = value;
	    };
	    Float64Histogram.prototype.resize = function (newHighestTrackableValue) {
	        this.establishSize(newHighestTrackableValue);
	        var newCounts = new Float64Array(this.countsArrayLength);
	        newCounts.set(this.counts);
	        this.counts = newCounts;
	    };
	    Float64Histogram.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
	    Float64Histogram.prototype.incrementTotalCount = function () {
	        this.totalCount++;
	    };
	    Float64Histogram.prototype.addToTotalCount = function (value) {
	        this.totalCount += value;
	    };
	    Float64Histogram.prototype.setTotalCount = function (value) {
	        this.totalCount = value;
	    };
	    Float64Histogram.prototype.getTotalCount = function () {
	        return this.totalCount;
	    };
	    Float64Histogram.prototype.getCountAtIndex = function (index) {
	        return this.counts[index];
	    };
	    Float64Histogram.prototype._getEstimatedFootprintInBytes = function () {
	        return 512 + 8 * this.counts.length;
	    };
	    Float64Histogram.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
	        var copy = new Float64Histogram(this.lowestDiscernibleValue, this.highestTrackableValue, this.numberOfSignificantValueDigits);
	        copy.addWhileCorrectingForCoordinatedOmission(this, expectedIntervalBetweenValueSamples);
	        return copy;
	    };
	    return Float64Histogram;
	}(AbstractHistogram_1.default));
	exports.default = Float64Histogram;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogram_1 = __webpack_require__(4);
	var PackedArray_1 = __webpack_require__(17);
	/**
	 * <h3>A High Dynamic Range (HDR) Histogram that uses a packed internal representation</h3>
	 * <p>
	 * {@link PackedHistogram} supports the recording and analyzing sampled data value counts across a configurable
	 * integer value range with configurable value precision within the range. Value precision is expressed as the
	 * number of significant digits in the value recording, and provides control over value quantization behavior
	 * across the value range and the subsequent value resolution at any given level.
	 * <p>
	 * {@link PackedHistogram} tracks value counts in a packed internal representation optimized
	 * for typical histogram recoded values are sparse in the value range and tend to be incremented in small unit counts.
	 * This packed representation tends to require significantly smaller amounts of stoarge when compared to unpacked
	 * representations, but can incur additional recording cost due to resizing and repacking operations that may
	 * occur as previously unrecorded values are encountered.
	 * <p>
	 * For example, a {@link PackedHistogram} could be configured to track the counts of observed integer values between 0 and
	 * 3,600,000,000,000 while maintaining a value precision of 3 significant digits across that range. Value quantization
	 * within the range will thus be no larger than 1/1,000th (or 0.1%) of any value. This example Histogram could
	 * be used to track and analyze the counts of observed response times ranging between 1 nanosecond and 1 hour
	 * in magnitude, while maintaining a value resolution of 1 microsecond up to 1 millisecond, a resolution of
	 * 1 millisecond (or better) up to one second, and a resolution of 1 second (or better) up to 1,000 seconds. At its
	 * maximum tracked value (1 hour), it would still maintain a resolution of 3.6 seconds (or better).
	 * <p>
	 * Auto-resizing: When constructed with no specified value range range (or when auto-resize is turned on with {@link
	 * Histogram#setAutoResize}) a {@link PackedHistogram} will auto-resize its dynamic range to include recorded values as
	 * they are encountered. Note that recording calls that cause auto-resizing may take longer to execute, as resizing
	 * incurs allocation and copying of internal data structures.
	 * <p>
	 */
	var PackedHistogram = /** @class */ (function (_super) {
	    __extends(PackedHistogram, _super);
	    function PackedHistogram(lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) {
	        var _this = _super.call(this, lowestDiscernibleValue, highestTrackableValue, numberOfSignificantValueDigits) || this;
	        _this.totalCount = 0;
	        _this.packedCounts = new PackedArray_1.PackedArray(_this.countsArrayLength);
	        return _this;
	    }
	    PackedHistogram.prototype.clearCounts = function () {
	        this.packedCounts.clear();
	        this.totalCount = 0;
	    };
	    PackedHistogram.prototype.incrementCountAtIndex = function (index) {
	        this.packedCounts.increment(index);
	    };
	    PackedHistogram.prototype.addToCountAtIndex = function (index, value) {
	        this.packedCounts.add(index, value);
	    };
	    PackedHistogram.prototype.setCountAtIndex = function (index, value) {
	        /* TODO move in packed array
	        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
	          throw value + " would overflow integer count";
	        }*/
	        this.packedCounts.set(index, value);
	    };
	    PackedHistogram.prototype.resize = function (newHighestTrackableValue) {
	        this.establishSize(newHighestTrackableValue);
	        this.packedCounts.setVirtualLength(this.countsArrayLength);
	    };
	    PackedHistogram.prototype.setNormalizingIndexOffset = function (normalizingIndexOffset) { };
	    PackedHistogram.prototype.incrementTotalCount = function () {
	        this.totalCount++;
	    };
	    PackedHistogram.prototype.addToTotalCount = function (value) {
	        this.totalCount += value;
	    };
	    PackedHistogram.prototype.setTotalCount = function (value) {
	        this.totalCount = value;
	    };
	    PackedHistogram.prototype.getTotalCount = function () {
	        return this.totalCount;
	    };
	    PackedHistogram.prototype.getCountAtIndex = function (index) {
	        return this.packedCounts.get(index);
	    };
	    PackedHistogram.prototype._getEstimatedFootprintInBytes = function () {
	        return 192 + 8 * this.packedCounts.getPhysicalLength();
	    };
	    PackedHistogram.prototype.copyCorrectedForCoordinatedOmission = function (expectedIntervalBetweenValueSamples) {
	        var copy = new PackedHistogram(this.lowestDiscernibleValue, this.highestTrackableValue, this.numberOfSignificantValueDigits);
	        copy.addWhileCorrectingForCoordinatedOmission(this, expectedIntervalBetweenValueSamples);
	        return copy;
	    };
	    return PackedHistogram;
	}(AbstractHistogram_1.default));
	exports.default = PackedHistogram;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var PackedArrayContext_1 = __webpack_require__(18);
	var ResizeError_1 = __webpack_require__(19);
	var NUMBER_OF_SETS = 8;
	var pow = Math.pow, floor = Math.floor;
	/**
	 * A Packed array of signed 64 bit values, and supports {@link #get get()}, {@link #set set()},
	 * {@link #add add()} and {@link #increment increment()} operations on the logical contents of the array.
	 *
	 * An {@link PackedLongArray} Uses {@link PackedArrayContext} to track
	 * the array's logical contents. Contexts may be switched when a context requires resizing
	 * to complete logical array operations (get, set, add, increment). Contexts are
	 * established and used within critical sections in order to facilitate concurrent
	 * implementors.
	 *
	 */
	var PackedArray = /** @class */ (function () {
	    function PackedArray(virtualLength, initialPhysicalLength) {
	        if (initialPhysicalLength === void 0) { initialPhysicalLength = PackedArrayContext_1.MINIMUM_INITIAL_PACKED_ARRAY_CAPACITY; }
	        this.arrayContext = new PackedArrayContext_1.PackedArrayContext(virtualLength, initialPhysicalLength);
	    }
	    PackedArray.prototype.setVirtualLength = function (newVirtualArrayLength) {
	        if (newVirtualArrayLength < this.length()) {
	            throw new Error("Cannot set virtual length, as requested length " +
	                newVirtualArrayLength +
	                " is smaller than the current virtual length " +
	                this.length());
	        }
	        var currentArrayContext = this.arrayContext;
	        if (currentArrayContext.isPacked &&
	            currentArrayContext.determineTopLevelShiftForVirtualLength(newVirtualArrayLength) == currentArrayContext.getTopLevelShift()) {
	            // No changes to the array context contents is needed. Just change the virtual length.
	            currentArrayContext.setVirtualLength(newVirtualArrayLength);
	            return;
	        }
	        this.arrayContext = currentArrayContext.copyAndIncreaseSize(this.getPhysicalLength(), newVirtualArrayLength);
	    };
	    /**
	     * Get value at virtual index in the array
	     * @param index the virtual array index
	     * @return the array value at the virtual index given
	     */
	    PackedArray.prototype.get = function (index) {
	        var value = 0;
	        for (var byteNum = 0; byteNum < NUMBER_OF_SETS; byteNum++) {
	            var byteValueAtPackedIndex = 0;
	            // Deal with unpacked context:
	            if (!this.arrayContext.isPacked) {
	                return this.arrayContext.getAtUnpackedIndex(index);
	            }
	            // Context is packed:
	            var packedIndex = this.arrayContext.getPackedIndex(byteNum, index, false);
	            if (packedIndex < 0) {
	                return value;
	            }
	            byteValueAtPackedIndex =
	                this.arrayContext.getAtByteIndex(packedIndex) * pow(2, byteNum << 3);
	            value += byteValueAtPackedIndex;
	        }
	        return value;
	    };
	    /**
	     * Increment value at a virrual index in the array
	     * @param index virtual index of value to increment
	     */
	    PackedArray.prototype.increment = function (index) {
	        this.add(index, 1);
	    };
	    PackedArray.prototype.safeGetPackedIndexgetPackedIndex = function (setNumber, virtualIndex) {
	        do {
	            try {
	                return this.arrayContext.getPackedIndex(setNumber, virtualIndex, true);
	            }
	            catch (ex) {
	                if (ex instanceof ResizeError_1.ResizeError) {
	                    this.arrayContext.resizeArray(ex.newSize);
	                }
	                else {
	                    throw ex;
	                }
	            }
	        } while (true);
	    };
	    /**
	     * Add to a value at a virtual index in the array
	     * @param index the virtual index of the value to be added to
	     * @param value the value to add
	     */
	    PackedArray.prototype.add = function (index, value) {
	        var remainingValueToAdd = value;
	        for (var byteNum = 0, byteShift = 0; byteNum < NUMBER_OF_SETS; byteNum++, byteShift += 8) {
	            // Deal with unpacked context:
	            if (!this.arrayContext.isPacked) {
	                this.arrayContext.addAndGetAtUnpackedIndex(index, value);
	                return;
	            }
	            // Context is packed:
	            var packedIndex = this.safeGetPackedIndexgetPackedIndex(byteNum, index);
	            var byteToAdd = remainingValueToAdd & 0xff;
	            var afterAddByteValue = this.arrayContext.addAtByteIndex(packedIndex, byteToAdd);
	            // Reduce remaining value to add by amount just added:
	            remainingValueToAdd -= byteToAdd;
	            remainingValueToAdd = remainingValueToAdd / pow(2, 8);
	            // Account for carry:
	            remainingValueToAdd += floor(afterAddByteValue / pow(2, 8));
	            if (remainingValueToAdd == 0) {
	                return; // nothing to add to higher magnitudes
	            }
	        }
	    };
	    /**
	     * Set the value at a virtual index in the array
	     * @param index the virtual index of the value to set
	     * @param value the value to set
	     */
	    PackedArray.prototype.set = function (index, value) {
	        var bytesAlreadySet = 0;
	        do {
	            var valueForNextLevels = value;
	            try {
	                for (var byteNum = 0; byteNum < NUMBER_OF_SETS; byteNum++) {
	                    // Establish context within: critical section
	                    // Deal with unpacked context:
	                    if (!this.arrayContext.isPacked) {
	                        this.arrayContext.setAtUnpackedIndex(index, value);
	                        return;
	                    }
	                    // Context is packed:
	                    if (valueForNextLevels == 0) {
	                        // Special-case zeros to avoid inflating packed array for no reason
	                        var packedIndex_1 = this.arrayContext.getPackedIndex(byteNum, index, false);
	                        if (packedIndex_1 < 0) {
	                            return; // no need to create entries for zero values if they don't already exist
	                        }
	                    }
	                    // Make sure byte is populated:
	                    var packedIndex = this.arrayContext.getPackedIndex(byteNum, index, true);
	                    // Determine value to write, and prepare for next levels
	                    var byteToWrite = valueForNextLevels & 0xff;
	                    valueForNextLevels = floor(valueForNextLevels / pow(2, 8));
	                    if (byteNum < bytesAlreadySet) {
	                        // We want to avoid writing to the same byte twice when not doing so for the
	                        // entire 64 bit value atomically, as doing so opens a race with e.g. concurrent
	                        // adders. So dobn't actually write the byte if has been written before.
	                        continue;
	                    }
	                    this.arrayContext.setAtByteIndex(packedIndex, byteToWrite);
	                    bytesAlreadySet++;
	                }
	                return;
	            }
	            catch (ex) {
	                if (ex instanceof ResizeError_1.ResizeError) {
	                    this.arrayContext.resizeArray(ex.newSize);
	                }
	                else {
	                    throw ex;
	                }
	            }
	        } while (true);
	    };
	    /**
	     * Get the current physical length (in longs) of the array's backing storage
	     * @return the current physical length (in longs) of the array's current backing storage
	     */
	    PackedArray.prototype.getPhysicalLength = function () {
	        return this.arrayContext.physicalLength;
	    };
	    /**
	     * Get the (virtual) length of the array
	     * @return the (virtual) length of the array
	     */
	    PackedArray.prototype.length = function () {
	        return this.arrayContext.getVirtualLength();
	    };
	    /**
	     * Clear the array contents
	     */
	    PackedArray.prototype.clear = function () {
	        this.arrayContext.clear();
	    };
	    PackedArray.prototype.toString = function () {
	        var output = "PackedArray:\n";
	        output += this.arrayContext.toString();
	        return output;
	    };
	    return PackedArray;
	}());
	exports.PackedArray = PackedArray;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var ResizeError_1 = __webpack_require__(19);
	/**
	 * A packed-value, sparse array context used for storing 64 bit signed values.
	 *
	 * An array context is optimised for tracking sparsely set (as in mostly zeros) values that tend to not make
	 * use pof the full 64 bit value range even when they are non-zero. The array context's internal representation
	 * is such that the packed value at each virtual array index may be represented by 0-8 bytes of actual storage.
	 *
	 * An array context encodes the packed values in 8 "set trees" with each set tree representing one byte of the
	 * packed value at the virtual index in question. The {@link #getPackedIndex(int, int, boolean)} method is used
	 * to look up the byte-index corresponding to the given (set tree) value byte of the given virtual index, and can
	 * be used to add entries to represent that byte as needed. As a succesful {@link #getPackedIndex(int, int, boolean)}
	 * may require a resizing of the array, it can throw a {@link ResizeException} to indicate that the requested
	 * packed index cannot be found or added without a resize of the physical storage.
	 *
	 */
	exports.MINIMUM_INITIAL_PACKED_ARRAY_CAPACITY = 16;
	var MAX_SUPPORTED_PACKED_COUNTS_ARRAY_LENGTH = Math.pow(2, 13) - 1; //(Short.MAX_VALUE / 4);  TODO ALEX why ???
	var SET_0_START_INDEX = 0;
	var NUMBER_OF_SETS = 8;
	var LEAF_LEVEL_SHIFT = 3;
	var NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET = 0;
	var NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS = 1;
	var PACKED_ARRAY_GROWTH_INCREMENT = 16;
	var PACKED_ARRAY_GROWTH_FRACTION_POW2 = 4;
	var pow = Math.pow, ceil = Math.ceil, log2 = Math.log2, max = Math.max;
	var bitCount = function (n) {
	    var bits = 0;
	    while (n !== 0) {
	        bits += bitCount32(n | 0);
	        n /= 0x100000000;
	    }
	    return bits;
	};
	var bitCount32 = function (n) {
	    n = n - ((n >> 1) & 0x55555555);
	    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
	    return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
	};
	var PackedArrayContext = /** @class */ (function () {
	    function PackedArrayContext(virtualLength, initialPhysicalLength) {
	        this.populatedShortLength = 0;
	        this.topLevelShift = Number.MAX_VALUE; // Make it non-sensical until properly initialized.
	        this.physicalLength = Math.max(initialPhysicalLength, exports.MINIMUM_INITIAL_PACKED_ARRAY_CAPACITY);
	        this.isPacked =
	            this.physicalLength <= MAX_SUPPORTED_PACKED_COUNTS_ARRAY_LENGTH;
	        if (!this.isPacked) {
	            this.physicalLength = virtualLength;
	        }
	        this.array = new ArrayBuffer(this.physicalLength * 8);
	        this.initArrayViews(this.array);
	        this.init(virtualLength);
	    }
	    PackedArrayContext.prototype.initArrayViews = function (array) {
	        this.byteArray = new Uint8Array(array);
	        this.shortArray = new Uint16Array(array);
	        this.longArray = new Float64Array(array);
	    };
	    PackedArrayContext.prototype.init = function (virtualLength) {
	        if (!this.isPacked) {
	            // Deal with non-packed context init:
	            this.virtualLength = virtualLength;
	            return;
	        }
	        this.populatedShortLength = SET_0_START_INDEX + 8;
	        // Populate empty root entries, and point to them from the root indexes:
	        for (var i = 0; i < NUMBER_OF_SETS; i++) {
	            this.setAtShortIndex(SET_0_START_INDEX + i, 0);
	        }
	        this.setVirtualLength(virtualLength);
	    };
	    PackedArrayContext.prototype.clear = function () {
	        this.byteArray.fill(0);
	    };
	    PackedArrayContext.prototype.copyAndIncreaseSize = function (newPhysicalArrayLength, newVirtualArrayLength) {
	        var ctx = new PackedArrayContext(newVirtualArrayLength, newPhysicalArrayLength);
	        if (this.isPacked) {
	            ctx.populateEquivalentEntriesWithEntriesFromOther(this);
	        }
	        return ctx;
	    };
	    PackedArrayContext.prototype.getPopulatedShortLength = function () {
	        return this.populatedShortLength;
	    };
	    PackedArrayContext.prototype.getPopulatedLongLength = function () {
	        return (this.getPopulatedShortLength() + 3) >> 2; // round up
	    };
	    PackedArrayContext.prototype.setAtByteIndex = function (byteIndex, value) {
	        this.byteArray[byteIndex] = value;
	    };
	    PackedArrayContext.prototype.getAtByteIndex = function (byteIndex) {
	        return this.byteArray[byteIndex];
	    };
	    /**
	     * add a byte value to a current byte value in the array
	     * @param byteIndex index of byte value to add to
	     * @param valueToAdd byte value to add
	     * @return the afterAddValue. ((afterAddValue & 0x100) != 0) indicates a carry.
	     */
	    PackedArrayContext.prototype.addAtByteIndex = function (byteIndex, valueToAdd) {
	        var newValue = this.byteArray[byteIndex] + valueToAdd;
	        this.byteArray[byteIndex] = newValue;
	        return newValue;
	    };
	    PackedArrayContext.prototype.setPopulatedLongLength = function (newPopulatedLongLength) {
	        this.populatedShortLength = newPopulatedLongLength << 2;
	    };
	    PackedArrayContext.prototype.getVirtualLength = function () {
	        return this.virtualLength;
	    };
	    PackedArrayContext.prototype.length = function () {
	        return this.physicalLength;
	    };
	    PackedArrayContext.prototype.setAtShortIndex = function (shortIndex, value) {
	        this.shortArray[shortIndex] = value;
	    };
	    PackedArrayContext.prototype.setAtLongIndex = function (longIndex, value) {
	        this.longArray[longIndex] = value;
	    };
	    PackedArrayContext.prototype.getAtShortIndex = function (shortIndex) {
	        return this.shortArray[shortIndex];
	    };
	    PackedArrayContext.prototype.getIndexAtShortIndex = function (shortIndex) {
	        return this.shortArray[shortIndex];
	    };
	    PackedArrayContext.prototype.setPackedSlotIndicators = function (entryIndex, newPackedSlotIndicators) {
	        this.setAtShortIndex(entryIndex + NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET, newPackedSlotIndicators);
	    };
	    PackedArrayContext.prototype.getPackedSlotIndicators = function (entryIndex) {
	        return (this.shortArray[entryIndex + NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET] &
	            0xffff);
	    };
	    PackedArrayContext.prototype.getIndexAtEntrySlot = function (entryIndex, slot) {
	        return this.getAtShortIndex(entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + slot);
	    };
	    PackedArrayContext.prototype.setIndexAtEntrySlot = function (entryIndex, slot, newIndexValue) {
	        this.setAtShortIndex(entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + slot, newIndexValue);
	    };
	    PackedArrayContext.prototype.expandArrayIfNeeded = function (entryLengthInLongs) {
	        var currentLength = this.length();
	        if (currentLength < this.getPopulatedLongLength() + entryLengthInLongs) {
	            var growthIncrement = max(entryLengthInLongs, PACKED_ARRAY_GROWTH_INCREMENT, this.getPopulatedLongLength() >> PACKED_ARRAY_GROWTH_FRACTION_POW2);
	            throw new ResizeError_1.ResizeError(currentLength + growthIncrement);
	        }
	    };
	    PackedArrayContext.prototype.newEntry = function (entryLengthInShorts) {
	        // Add entry at the end of the array:
	        var newEntryIndex = this.populatedShortLength;
	        this.expandArrayIfNeeded((entryLengthInShorts >> 2) + 1);
	        this.populatedShortLength = newEntryIndex + entryLengthInShorts;
	        for (var i = 0; i < entryLengthInShorts; i++) {
	            this.setAtShortIndex(newEntryIndex + i, -1); // Poison value -1. Must be overriden before reads
	        }
	        return newEntryIndex;
	    };
	    PackedArrayContext.prototype.newLeafEntry = function () {
	        // Add entry at the end of the array:
	        var newEntryIndex;
	        newEntryIndex = this.getPopulatedLongLength();
	        this.expandArrayIfNeeded(1);
	        this.setPopulatedLongLength(newEntryIndex + 1);
	        this.setAtLongIndex(newEntryIndex, 0);
	        return newEntryIndex;
	    };
	    /**
	     * Consolidate entry with previous entry verison if one exists
	     *
	     * @param entryIndex The shortIndex of the entry to be consolidated
	     * @param previousVersionIndex the index of the previous version of the entry
	     */
	    PackedArrayContext.prototype.consolidateEntry = function (entryIndex, previousVersionIndex) {
	        var previousVersionPackedSlotsIndicators = this.getPackedSlotIndicators(previousVersionIndex);
	        // Previous version exists, needs consolidation
	        var packedSlotsIndicators = this.getPackedSlotIndicators(entryIndex);
	        var insertedSlotMask = packedSlotsIndicators ^ previousVersionPackedSlotsIndicators; // the only bit that differs
	        var slotsBelowBitNumber = packedSlotsIndicators & (insertedSlotMask - 1);
	        var insertedSlotIndex = bitCount(slotsBelowBitNumber);
	        var numberOfSlotsInEntry = bitCount(packedSlotsIndicators);
	        // Copy the entry slots from previous version, skipping the newly inserted slot in the target:
	        var sourceSlot = 0;
	        for (var targetSlot = 0; targetSlot < numberOfSlotsInEntry; targetSlot++) {
	            if (targetSlot !== insertedSlotIndex) {
	                var indexAtSlot = this.getIndexAtEntrySlot(previousVersionIndex, sourceSlot);
	                if (indexAtSlot !== 0) {
	                    this.setIndexAtEntrySlot(entryIndex, targetSlot, indexAtSlot);
	                }
	                sourceSlot++;
	            }
	        }
	    };
	    /**
	     * Expand entry as indicated.
	     *
	     * @param existingEntryIndex the index of the entry
	     * @param entryPointerIndex  index to the slot pointing to the entry (needs to be fixed up)
	     * @param insertedSlotIndex  realtive [packed] index of slot being inserted into entry
	     * @param insertedSlotMask   mask value fo slot being inserted
	     * @param nextLevelIsLeaf    the level below this one is a leaf level
	     * @return the updated index of the entry (-1 if epansion failed due to conflict)
	     * @throws RetryException if expansion fails due to concurrent conflict, and caller should try again.
	     */
	    PackedArrayContext.prototype.expandEntry = function (existingEntryIndex, entryPointerIndex, insertedSlotIndex, insertedSlotMask, nextLevelIsLeaf) {
	        var packedSlotIndicators = this.getAtShortIndex(existingEntryIndex) & 0xffff;
	        packedSlotIndicators |= insertedSlotMask;
	        var numberOfslotsInExpandedEntry = bitCount(packedSlotIndicators);
	        if (insertedSlotIndex >= numberOfslotsInExpandedEntry) {
	            throw new Error("inserted slot index is out of range given provided masks");
	        }
	        var expandedEntryLength = numberOfslotsInExpandedEntry + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS;
	        // Create new next-level entry to refer to from slot at this level:
	        var indexOfNewNextLevelEntry = 0;
	        if (nextLevelIsLeaf) {
	            indexOfNewNextLevelEntry = this.newLeafEntry(); // Establish long-index to new leaf entry
	        }
	        else {
	            // TODO: Optimize this by creating the whole sub-tree here, rather than a step that will immediaterly expand
	            // Create a new 1 word (empty, no slots set) entry for the next level:
	            indexOfNewNextLevelEntry = this.newEntry(NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS); // Establish short-index to new leaf entry
	            this.setPackedSlotIndicators(indexOfNewNextLevelEntry, 0);
	        }
	        var insertedSlotValue = indexOfNewNextLevelEntry;
	        var expandedEntryIndex = this.newEntry(expandedEntryLength);
	        // populate the packed indicators word:
	        this.setPackedSlotIndicators(expandedEntryIndex, packedSlotIndicators);
	        // Populate the inserted slot with the index of the new next level entry:
	        this.setIndexAtEntrySlot(expandedEntryIndex, insertedSlotIndex, insertedSlotValue);
	        this.setAtShortIndex(entryPointerIndex, expandedEntryIndex);
	        this.consolidateEntry(expandedEntryIndex, existingEntryIndex);
	        return expandedEntryIndex;
	    };
	    //
	    //   ######   ######## ########    ##     ##    ###    ##             ## #### ##    ## ########  ######## ##     ##
	    //  ##    ##  ##          ##       ##     ##   ## ##   ##            ##   ##  ###   ## ##     ## ##        ##   ##
	    //  ##        ##          ##       ##     ##  ##   ##  ##           ##    ##  ####  ## ##     ## ##         ## ##
	    //  ##   #### ######      ##       ##     ## ##     ## ##          ##     ##  ## ## ## ##     ## ######      ###
	    //  ##    ##  ##          ##        ##   ##  ######### ##         ##      ##  ##  #### ##     ## ##         ## ##
	    //  ##    ##  ##          ##         ## ##   ##     ## ##        ##       ##  ##   ### ##     ## ##        ##   ##
	    //   ######   ########    ##          ###    ##     ## ######## ##       #### ##    ## ########  ######## ##     ##
	    //
	    PackedArrayContext.prototype.getRootEntry = function (setNumber, insertAsNeeded) {
	        if (insertAsNeeded === void 0) { insertAsNeeded = false; }
	        var entryPointerIndex = SET_0_START_INDEX + setNumber;
	        var entryIndex = this.getIndexAtShortIndex(entryPointerIndex);
	        if (entryIndex == 0) {
	            if (!insertAsNeeded) {
	                return 0; // Index does not currently exist in packed array;
	            }
	            entryIndex = this.newEntry(NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS);
	            // Create a new empty (no slots set) entry for the next level:
	            this.setPackedSlotIndicators(entryIndex, 0);
	            this.setAtShortIndex(entryPointerIndex, entryIndex);
	        }
	        return entryIndex;
	    };
	    /**
	     * Get the byte-index (into the packed array) corresponding to a given (set tree) value byte of given virtual index.
	     * Inserts new set tree nodes as needed if indicated.
	     *
	     * @param setNumber      The set tree number (0-7, 0 corresponding with the LSByte set tree)
	     * @param virtualIndex   The virtual index into the PackedArray
	     * @param insertAsNeeded If true, will insert new set tree nodes as needed if they do not already exist
	     * @return the byte-index corresponding to the given (set tree) value byte of the given virtual index
	     */
	    PackedArrayContext.prototype.getPackedIndex = function (setNumber, virtualIndex, insertAsNeeded) {
	        if (virtualIndex >= this.virtualLength) {
	            throw new Error("Attempting access at index " + virtualIndex + ", beyond virtualLength " + this.virtualLength);
	        }
	        var entryPointerIndex = SET_0_START_INDEX + setNumber; // TODO init needed ?
	        var entryIndex = this.getRootEntry(setNumber, insertAsNeeded);
	        if (entryIndex == 0) {
	            return -1; // Index does not currently exist in packed array;
	        }
	        // Work down the levels of non-leaf entries:
	        for (var indexShift = this.topLevelShift; indexShift >= LEAF_LEVEL_SHIFT; indexShift -= 4) {
	            var nextLevelIsLeaf = indexShift === LEAF_LEVEL_SHIFT;
	            // Target is a packedSlotIndicators entry
	            var packedSlotIndicators = this.getPackedSlotIndicators(entryIndex);
	            var slotBitNumber = (virtualIndex / pow(2, indexShift)) & 0xf; //(virtualIndex >>> indexShift) & 0xf;
	            var slotMask = 1 << slotBitNumber;
	            var slotsBelowBitNumber = packedSlotIndicators & (slotMask - 1);
	            var slotNumber = bitCount(slotsBelowBitNumber);
	            if ((packedSlotIndicators & slotMask) === 0) {
	                // The entryIndex slot does not have the contents we want
	                if (!insertAsNeeded) {
	                    return -1; // Index does not currently exist in packed array;
	                }
	                // Expand the entry, adding the index to new entry at the proper slot:
	                entryIndex = this.expandEntry(entryIndex, entryPointerIndex, slotNumber, slotMask, nextLevelIsLeaf);
	            }
	            // Next level's entry pointer index is in the appropriate slot in in the entries array in this entry:
	            entryPointerIndex =
	                entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + slotNumber;
	            entryIndex = this.getIndexAtShortIndex(entryPointerIndex);
	        }
	        // entryIndex is the long-index of a leaf entry that contains the value byte for the given set
	        var byteIndex = (entryIndex << 3) + (virtualIndex & 0x7); // Determine byte index offset within leaf entry
	        return byteIndex;
	    };
	    PackedArrayContext.prototype.determineTopLevelShiftForVirtualLength = function (virtualLength) {
	        var sizeMagnitude = ceil(log2(virtualLength));
	        var eightsSizeMagnitude = sizeMagnitude - 3;
	        var multipleOfFourSizeMagnitude = ceil(eightsSizeMagnitude / 4) * 4;
	        multipleOfFourSizeMagnitude = max(multipleOfFourSizeMagnitude, 8);
	        var topLevelShiftNeeded = multipleOfFourSizeMagnitude - 4 + 3;
	        return topLevelShiftNeeded;
	    };
	    PackedArrayContext.prototype.setVirtualLength = function (virtualLength) {
	        if (!this.isPacked) {
	            throw new Error("Should never be adjusting the virtual size of a non-packed context");
	        }
	        this.topLevelShift = this.determineTopLevelShiftForVirtualLength(virtualLength);
	        this.virtualLength = virtualLength;
	    };
	    PackedArrayContext.prototype.getTopLevelShift = function () {
	        return this.topLevelShift;
	    };
	    //
	    //  ##     ##         ########   #######  ########  ##     ## ##          ###    ######## ########
	    //   ##   ##          ##     ## ##     ## ##     ## ##     ## ##         ## ##      ##    ##
	    //    ## ##           ##     ## ##     ## ##     ## ##     ## ##        ##   ##     ##    ##
	    //     ###    ####### ########  ##     ## ########  ##     ## ##       ##     ##    ##    ######
	    //    ## ##           ##        ##     ## ##        ##     ## ##       #########    ##    ##
	    //   ##   ##          ##        ##     ## ##        ##     ## ##       ##     ##    ##    ##
	    //  ##     ##         ##         #######  ##         #######  ######## ##     ##    ##    ########
	    //
	    PackedArrayContext.prototype.resizeArray = function (newLength) {
	        var tmp = new Uint8Array(newLength * 8);
	        tmp.set(this.byteArray);
	        this.array = tmp.buffer;
	        this.initArrayViews(this.array);
	        this.physicalLength = newLength;
	    };
	    PackedArrayContext.prototype.populateEquivalentEntriesWithEntriesFromOther = function (other) {
	        if (this.virtualLength < other.getVirtualLength()) {
	            throw new Error("Cannot populate array of smaller virtual length");
	        }
	        for (var i = 0; i < NUMBER_OF_SETS; i++) {
	            var otherEntryIndex = other.getAtShortIndex(SET_0_START_INDEX + i);
	            if (otherEntryIndex == 0)
	                continue; // No tree to duplicate
	            var entryIndexPointer = SET_0_START_INDEX + i;
	            for (var i_1 = this.topLevelShift; i_1 > other.topLevelShift; i_1 -= 4) {
	                // for each inserted level:
	                // Allocate entry in other:
	                var sizeOfEntry = NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + 1;
	                var newEntryIndex = this.newEntry(sizeOfEntry);
	                // Link new level in.
	                this.setAtShortIndex(entryIndexPointer, newEntryIndex);
	                // Populate new level entry, use pointer to slot 0 as place to populate under:
	                this.setPackedSlotIndicators(newEntryIndex, 0x1); // Slot 0 populated
	                entryIndexPointer =
	                    newEntryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS; // Where the slot 0 index goes.
	            }
	            this.copyEntriesAtLevelFromOther(other, otherEntryIndex, entryIndexPointer, other.topLevelShift);
	        }
	    };
	    PackedArrayContext.prototype.copyEntriesAtLevelFromOther = function (other, otherLevelEntryIndex, levelEntryIndexPointer, otherIndexShift) {
	        var nextLevelIsLeaf = otherIndexShift == LEAF_LEVEL_SHIFT;
	        var packedSlotIndicators = other.getPackedSlotIndicators(otherLevelEntryIndex);
	        var numberOfSlots = bitCount(packedSlotIndicators);
	        var sizeOfEntry = NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + numberOfSlots;
	        var entryIndex = this.newEntry(sizeOfEntry);
	        this.setAtShortIndex(levelEntryIndexPointer, entryIndex);
	        this.setAtShortIndex(entryIndex + NON_LEAF_ENTRY_SLOT_INDICATORS_OFFSET, packedSlotIndicators);
	        for (var i = 0; i < numberOfSlots; i++) {
	            if (nextLevelIsLeaf) {
	                // Make leaf in other:
	                var leafEntryIndex = this.newLeafEntry();
	                this.setIndexAtEntrySlot(entryIndex, i, leafEntryIndex);
	                // OPTIM
	                // avoid iteration on all the values of the source ctx
	                var otherNextLevelEntryIndex = other.getIndexAtEntrySlot(otherLevelEntryIndex, i);
	                this.longArray[leafEntryIndex] =
	                    other.longArray[otherNextLevelEntryIndex];
	            }
	            else {
	                var otherNextLevelEntryIndex = other.getIndexAtEntrySlot(otherLevelEntryIndex, i);
	                this.copyEntriesAtLevelFromOther(other, otherNextLevelEntryIndex, entryIndex + NON_LEAF_ENTRY_HEADER_SIZE_IN_SHORTS + i, otherIndexShift - 4);
	            }
	        }
	    };
	    PackedArrayContext.prototype.getAtUnpackedIndex = function (index) {
	        return this.longArray[index];
	    };
	    PackedArrayContext.prototype.setAtUnpackedIndex = function (index, newValue) {
	        this.longArray[index] = newValue;
	    };
	    PackedArrayContext.prototype.lazysetAtUnpackedIndex = function (index, newValue) {
	        this.longArray[index] = newValue;
	    };
	    PackedArrayContext.prototype.incrementAndGetAtUnpackedIndex = function (index) {
	        this.longArray[index]++;
	        return this.longArray[index];
	    };
	    PackedArrayContext.prototype.addAndGetAtUnpackedIndex = function (index, valueToAdd) {
	        this.longArray[index] += valueToAdd;
	        return this.longArray[index];
	    };
	    //
	    //   ########  #######           ######  ######## ########  #### ##    ##  ######
	    //      ##    ##     ##         ##    ##    ##    ##     ##  ##  ###   ## ##    ##
	    //      ##    ##     ##         ##          ##    ##     ##  ##  ####  ## ##
	    //      ##    ##     ## #######  ######     ##    ########   ##  ## ## ## ##   ####
	    //      ##    ##     ##               ##    ##    ##   ##    ##  ##  #### ##    ##
	    //      ##    ##     ##         ##    ##    ##    ##    ##   ##  ##   ### ##    ##
	    //      ##     #######           ######     ##    ##     ## #### ##    ##  ######
	    //
	    PackedArrayContext.prototype.nonLeafEntryToString = function (entryIndex, indexShift, indentLevel) {
	        var output = "";
	        for (var i = 0; i < indentLevel; i++) {
	            output += "  ";
	        }
	        try {
	            var packedSlotIndicators = this.getPackedSlotIndicators(entryIndex);
	            output += "slotIndiators: 0x" + toHex(packedSlotIndicators) + ", prevVersionIndex: 0: [ ";
	            var numberOfslotsInEntry = bitCount(packedSlotIndicators);
	            for (var i = 0; i < numberOfslotsInEntry; i++) {
	                output += this.getIndexAtEntrySlot(entryIndex, i);
	                if (i < numberOfslotsInEntry - 1) {
	                    output += ", ";
	                }
	            }
	            output += " ] (indexShift = " + indexShift + ")\n";
	            var nextLevelIsLeaf = indexShift == LEAF_LEVEL_SHIFT;
	            for (var i = 0; i < numberOfslotsInEntry; i++) {
	                var nextLevelEntryIndex = this.getIndexAtEntrySlot(entryIndex, i);
	                if (nextLevelIsLeaf) {
	                    output += this.leafEntryToString(nextLevelEntryIndex, indentLevel + 4);
	                }
	                else {
	                    output += this.nonLeafEntryToString(nextLevelEntryIndex, indexShift - 4, indentLevel + 4);
	                }
	            }
	        }
	        catch (ex) {
	            output += "Exception thrown at nonLeafEnty at index " + entryIndex + " with indexShift " + indexShift + "\n";
	        }
	        return output;
	    };
	    PackedArrayContext.prototype.leafEntryToString = function (entryIndex, indentLevel) {
	        var output = "";
	        for (var i = 0; i < indentLevel; i++) {
	            output += "  ";
	        }
	        try {
	            output += "Leaf bytes : ";
	            for (var i = 0; i < 8; i++) {
	                output += "0x" + toHex(this.byteArray[entryIndex * 8 + i]) + " ";
	            }
	            output += "\n";
	        }
	        catch (ex) {
	            output += "Exception thrown at leafEnty at index " + entryIndex + "\n";
	        }
	        return output;
	    };
	    PackedArrayContext.prototype.toString = function () {
	        var output = "PackedArrayContext:\n";
	        if (!this.isPacked) {
	            return output + "Context is unpacked:\n"; // unpackedToString();
	        }
	        for (var setNumber = 0; setNumber < NUMBER_OF_SETS; setNumber++) {
	            try {
	                var entryPointerIndex = SET_0_START_INDEX + setNumber;
	                var entryIndex = this.getIndexAtShortIndex(entryPointerIndex);
	                output += "Set " + setNumber + ": root = " + entryIndex + " \n";
	                if (entryIndex == 0)
	                    continue;
	                output += this.nonLeafEntryToString(entryIndex, this.topLevelShift, 4);
	            }
	            catch (ex) {
	                output += "Exception thrown in set " + setNumber + "%d\n";
	            }
	        }
	        //output += recordedValuesToString();
	        return output;
	    };
	    return PackedArrayContext;
	}());
	exports.PackedArrayContext = PackedArrayContext;
	var toHex = function (n) {
	    return Number(n)
	        .toString(16)
	        .padStart(2, "0");
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var ResizeError = /** @class */ (function () {
	    function ResizeError(newSize) {
	        this.newSize = newSize;
	    }
	    return ResizeError;
	}());
	exports.ResizeError = ResizeError;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

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
	var AbstractHistogram_1 = __webpack_require__(4);
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


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var AbstractHistogramBase_1 = __webpack_require__(5);
	var Int32Histogram_1 = __webpack_require__(14);
	var encoding_1 = __webpack_require__(22);
	var TAG_PREFIX = "Tag=";
	var TAG_PREFIX_LENGTH = "Tag=".length;
	/**
	 * A histogram log reader.
	 * <p>
	 * Histogram logs are used to capture full fidelity, per-time-interval
	 * histograms of a recorded value.
	 * <p>
	 * For example, a histogram log can be used to capture high fidelity
	 * reaction-time logs for some measured system or subsystem component.
	 * Such a log would capture a full reaction time histogram for each
	 * logged interval, and could be used to later reconstruct a full
	 * HdrHistogram of the measured reaction time behavior for any arbitrary
	 * time range within the log, by adding [only] the relevant interval
	 * histograms.
	 * <h3>Histogram log format:</h3>
	 * A histogram log file consists of text lines. Lines beginning with
	 * the "#" character are optional and treated as comments. Lines
	 * containing the legend (starting with "Timestamp") are also optional
	 * and ignored in parsing the histogram log. All other lines must
	 * be valid interval description lines. Text fields are delimited by
	 * commas, spaces.
	 * <p>
	 * A valid interval description line contains an optional Tag=tagString
	 * text field, followed by an interval description.
	 * <p>
	 * A valid interval description must contain exactly four text fields:
	 * <ul>
	 * <li>StartTimestamp: The first field must contain a number parse-able as a Double value,
	 * representing the start timestamp of the interval in seconds.</li>
	 * <li>intervalLength: The second field must contain a number parse-able as a Double value,
	 * representing the length of the interval in seconds.</li>
	 * <li>Interval_Max: The third field must contain a number parse-able as a Double value,
	 * which generally represents the maximum value of the interval histogram.</li>
	 * <li>Interval_Compressed_Histogram: The fourth field must contain a text field
	 * parse-able as a Base64 text representation of a compressed HdrHistogram.</li>
	 * </ul>
	 * The log file may contain an optional indication of a starting time. Starting time
	 * is indicated using a special comments starting with "#[StartTime: " and followed
	 * by a number parse-able as a double, representing the start time (in seconds)
	 * that may be added to timestamps in the file to determine an absolute
	 * timestamp (e.g. since the epoch) for each interval.
	 */
	var HistogramLogReader = /** @class */ (function () {
	    function HistogramLogReader(logContent, options) {
	        var _a;
	        this.lines = splitLines(logContent);
	        this.currentLineIndex = 0;
	        this.histogramConstr = ((_a = options) === null || _a === void 0 ? void 0 : _a.histogramConstr) || Int32Histogram_1.default;
	    }
	    /**
	     * Read the next interval histogram from the log. Returns a Histogram object if
	     * an interval line was found, or null if not.
	     * <p>Upon encountering any unexpected format errors in reading the next interval
	     * from the file, this method will return a null.
	     * @return a DecodedInterval, or a null if no appropriate interval found
	     */
	    HistogramLogReader.prototype.nextIntervalHistogram = function (rangeStartTimeSec, rangeEndTimeSec) {
	        if (rangeStartTimeSec === void 0) { rangeStartTimeSec = 0; }
	        if (rangeEndTimeSec === void 0) { rangeEndTimeSec = Number.MAX_VALUE; }
	        while (this.currentLineIndex < this.lines.length) {
	            var currentLine = this.lines[this.currentLineIndex];
	            this.currentLineIndex++;
	            if (currentLine.startsWith("#[StartTime:")) {
	                this.parseStartTimeFromLine(currentLine);
	            }
	            else if (currentLine.startsWith("#[BaseTime:")) {
	                this.parseBaseTimeFromLine(currentLine);
	            }
	            else if (currentLine.startsWith("#") ||
	                currentLine.startsWith('"StartTimestamp"')) {
	                // skip legend & meta data for now
	            }
	            else if (currentLine.includes(",")) {
	                var tokens = currentLine.split(",");
	                var firstToken = tokens[0];
	                var tag = void 0;
	                if (firstToken.startsWith(TAG_PREFIX)) {
	                    tag = firstToken.substring(TAG_PREFIX_LENGTH);
	                    tokens.shift();
	                }
	                else {
	                    tag = AbstractHistogramBase_1.NO_TAG;
	                }
	                var rawLogTimeStampInSec = tokens[0], rawIntervalLengthSec = tokens[1], base64Histogram = tokens[3];
	                var logTimeStampInSec = Number.parseFloat(rawLogTimeStampInSec);
	                if (!this.baseTimeSec) {
	                    // No explicit base time noted. Deduce from 1st observed time (compared to start time):
	                    if (logTimeStampInSec < this.startTimeSec - 365 * 24 * 3600.0) {
	                        // Criteria Note: if log timestamp is more than a year in the past (compared to
	                        // StartTime), we assume that timestamps in the log are not absolute
	                        this.baseTimeSec = this.startTimeSec;
	                    }
	                    else {
	                        // Timestamps are absolute
	                        this.baseTimeSec = 0.0;
	                    }
	                }
	                if (rangeEndTimeSec < logTimeStampInSec) {
	                    return null;
	                }
	                if (logTimeStampInSec < rangeStartTimeSec) {
	                    continue;
	                }
	                var histogram = encoding_1.decodeFromCompressedBase64(base64Histogram, this.histogramConstr);
	                histogram.startTimeStampMsec =
	                    (this.baseTimeSec + logTimeStampInSec) * 1000;
	                var intervalLengthSec = Number.parseFloat(rawIntervalLengthSec);
	                histogram.endTimeStampMsec =
	                    (this.baseTimeSec + logTimeStampInSec + intervalLengthSec) * 1000;
	                histogram.tag = tag;
	                return histogram;
	            }
	        }
	        return null;
	    };
	    HistogramLogReader.prototype.parseStartTimeFromLine = function (line) {
	        this.startTimeSec = Number.parseFloat(line.split(" ")[1]);
	    };
	    HistogramLogReader.prototype.parseBaseTimeFromLine = function (line) {
	        this.baseTimeSec = Number.parseFloat(line.split(" ")[1]);
	    };
	    return HistogramLogReader;
	}());
	var splitLines = function (logContent) { return logContent.split(/\r\n|\r|\n/g); };
	var shouldIncludeNoTag = function (lines) {
	    return lines.find(function (line) {
	        return !line.startsWith("#") &&
	            !line.startsWith('"') &&
	            !line.startsWith(TAG_PREFIX) &&
	            line.includes(",");
	    });
	};
	exports.listTags = function (content) {
	    var lines = splitLines(content);
	    var tags = lines
	        .filter(function (line) { return line.includes(",") && line.startsWith(TAG_PREFIX); })
	        .map(function (line) { return line.substring(TAG_PREFIX_LENGTH, line.indexOf(",")); });
	    var tagsWithoutDuplicates = new Set(tags);
	    var result = Array.from(tagsWithoutDuplicates);
	    if (shouldIncludeNoTag(lines)) {
	        result.unshift("NO TAG");
	    }
	    return result;
	};
	exports.default = HistogramLogReader;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var ByteBuffer_1 = __webpack_require__(2);
	var AbstractHistogram_1 = __webpack_require__(4);
	var Int32Histogram_1 = __webpack_require__(14);
	__webpack_require__(23);
	var base64 = __webpack_require__(26);
	var decodeFromCompressedBase64 = function (base64String, histogramConstr, minBarForHighestTrackableValue) {
	    if (histogramConstr === void 0) { histogramConstr = Int32Histogram_1.default; }
	    if (minBarForHighestTrackableValue === void 0) { minBarForHighestTrackableValue = 0; }
	    var buffer = new ByteBuffer_1.default(base64.toByteArray(base64String.trim()));
	    return AbstractHistogram_1.AbstractHistogram.decodeFromCompressedByteBuffer(buffer, histogramConstr, minBarForHighestTrackableValue);
	};
	exports.decodeFromCompressedBase64 = decodeFromCompressedBase64;
	var encodeIntoBase64String = function (histogram, compressionLevel) {
	    var buffer = ByteBuffer_1.default.allocate();
	    var bufferSize = histogram.encodeIntoCompressedByteBuffer(buffer, compressionLevel);
	    var encodedBuffer = buffer.data.slice(0, bufferSize);
	    return base64.fromByteArray(encodedBuffer);
	};
	exports.encodeIntoBase64String = encodeIntoBase64String;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	var ByteBuffer_1 = __webpack_require__(2);
	var AbstractHistogram_1 = __webpack_require__(4);
	var ZigZagEncoding_1 = __webpack_require__(24);
	var max = Math.max;
	var V2EncodingCookieBase = 0x1c849303;
	var V2CompressedEncodingCookieBase = 0x1c849304;
	var V2maxWordSizeInBytes = 9; // LEB128-64b9B + ZigZag require up to 9 bytes per word
	var encodingCookie = V2EncodingCookieBase | 0x10; // LSBit of wordsize byte indicates TLZE Encoding
	var compressedEncodingCookie = V2CompressedEncodingCookieBase | 0x10; // LSBit of wordsize byte indicates TLZE Encoding
	function fillBufferFromCountsArray(self, buffer) {
	    var countsLimit = self.countsArrayIndex(self.maxValue) + 1;
	    var srcIndex = 0;
	    while (srcIndex < countsLimit) {
	        // V2 encoding format uses a ZigZag LEB128-64b9B encoded long. Positive values are counts,
	        // while negative values indicate a repeat zero counts.
	        var count = self.getCountAtIndex(srcIndex++);
	        if (count < 0) {
	            throw new Error("Cannot encode histogram containing negative counts (" +
	                count +
	                ") at index " +
	                srcIndex +
	                ", corresponding the value range [" +
	                self.lowestEquivalentValue(self.valueFromIndex(srcIndex)) +
	                "," +
	                self.nextNonEquivalentValue(self.valueFromIndex(srcIndex)) +
	                ")");
	        }
	        // Count trailing 0s (which follow this count):
	        var zerosCount = 0;
	        if (count == 0) {
	            zerosCount = 1;
	            while (srcIndex < countsLimit && self.getCountAtIndex(srcIndex) == 0) {
	                zerosCount++;
	                srcIndex++;
	            }
	        }
	        if (zerosCount > 1) {
	            ZigZagEncoding_1.default.encode(buffer, -zerosCount);
	        }
	        else {
	            ZigZagEncoding_1.default.encode(buffer, count);
	        }
	    }
	}
	/**
	 * Encode this histogram into a ByteBuffer
	 * @param buffer The buffer to encode into
	 * @return The number of bytes written to the buffer
	 */
	function encodeIntoByteBuffer(buffer) {
	    var self = this;
	    var initialPosition = buffer.position;
	    buffer.putInt32(encodingCookie);
	    buffer.putInt32(0); // Placeholder for payload length in bytes.
	    buffer.putInt32(1);
	    buffer.putInt32(self.numberOfSignificantValueDigits);
	    buffer.putInt64(self.lowestDiscernibleValue);
	    buffer.putInt64(self.highestTrackableValue);
	    buffer.putInt64(1);
	    var payloadStartPosition = buffer.position;
	    fillBufferFromCountsArray(self, buffer);
	    var backupIndex = buffer.position;
	    buffer.position = initialPosition + 4;
	    buffer.putInt32(backupIndex - payloadStartPosition); // Record the payload length
	    buffer.position = backupIndex;
	    return backupIndex - initialPosition;
	}
	exports.encodeIntoByteBuffer = encodeIntoByteBuffer;
	function fillCountsArrayFromSourceBuffer(self, sourceBuffer, lengthInBytes, wordSizeInBytes) {
	    if (wordSizeInBytes != 2 &&
	        wordSizeInBytes != 4 &&
	        wordSizeInBytes != 8 &&
	        wordSizeInBytes != V2maxWordSizeInBytes) {
	        throw new Error("word size must be 2, 4, 8, or V2maxWordSizeInBytes (" +
	            V2maxWordSizeInBytes +
	            ") bytes");
	    }
	    var dstIndex = 0;
	    var endPosition = sourceBuffer.position + lengthInBytes;
	    while (sourceBuffer.position < endPosition) {
	        var zerosCount = 0;
	        var count = ZigZagEncoding_1.default.decode(sourceBuffer);
	        if (count < 0) {
	            zerosCount = -count;
	            dstIndex += zerosCount; // No need to set zeros in array. Just skip them.
	        }
	        else {
	            self.setCountAtIndex(dstIndex++, count);
	        }
	    }
	    return dstIndex; // this is the destination length
	}
	function getCookieBase(cookie) {
	    return cookie & ~0xf0;
	}
	function getWordSizeInBytesFromCookie(cookie) {
	    if (getCookieBase(cookie) == V2EncodingCookieBase ||
	        getCookieBase(cookie) == V2CompressedEncodingCookieBase) {
	        return V2maxWordSizeInBytes;
	    }
	    var sizeByte = (cookie & 0xf0) >> 4;
	    return sizeByte & 0xe;
	}
	function doDecodeFromByteBuffer(buffer, histogramConstr, minBarForHighestTrackableValue) {
	    var cookie = buffer.getInt32();
	    var payloadLengthInBytes;
	    var numberOfSignificantValueDigits;
	    var lowestTrackableUnitValue;
	    var highestTrackableValue;
	    if (getCookieBase(cookie) === V2EncodingCookieBase) {
	        if (getWordSizeInBytesFromCookie(cookie) != V2maxWordSizeInBytes) {
	            throw new Error("The buffer does not contain a Histogram (no valid cookie found)");
	        }
	        payloadLengthInBytes = buffer.getInt32();
	        buffer.getInt32(); // normalizingIndexOffset not used
	        numberOfSignificantValueDigits = buffer.getInt32();
	        lowestTrackableUnitValue = buffer.getInt64();
	        highestTrackableValue = buffer.getInt64();
	        buffer.getInt64(); // integerToDoubleValueConversionRatio not used
	    }
	    else {
	        throw new Error("The buffer does not contain a Histogram (no valid V2 encoding cookie found)");
	    }
	    highestTrackableValue = max(highestTrackableValue, minBarForHighestTrackableValue);
	    var histogram = new histogramConstr(lowestTrackableUnitValue, highestTrackableValue, numberOfSignificantValueDigits);
	    var filledLength = fillCountsArrayFromSourceBuffer(histogram, buffer, payloadLengthInBytes, V2maxWordSizeInBytes);
	    histogram.establishInternalTackingValues(filledLength);
	    return histogram;
	}
	exports.doDecodeFromByteBuffer = doDecodeFromByteBuffer;
	function findDeflateFunction() {
	    try {
	        return eval('require("zlib").deflateSync');
	    }
	    catch (error) {
	        var pako = __webpack_require__(25);
	        return pako.deflate;
	    }
	}
	function findInflateFunction() {
	    try {
	        return eval('require("zlib").inflateSync');
	    }
	    catch (error) {
	        var pako = __webpack_require__(25);
	        return pako.inflate;
	    }
	}
	var deflate = findDeflateFunction();
	var inflate = findInflateFunction();
	function doDecodeFromCompressedByteBuffer(buffer, histogramConstr, minBarForHighestTrackableValue) {
	    var initialTargetPosition = buffer.position;
	    var cookie = buffer.getInt32();
	    if ((cookie & ~0xf0) !== V2CompressedEncodingCookieBase) {
	        throw new Error("Encoding not supported, only V2 is supported");
	    }
	    var lengthOfCompressedContents = buffer.getInt32();
	    var uncompressedBuffer = inflate(buffer.data.slice(initialTargetPosition + 8, initialTargetPosition + 8 + lengthOfCompressedContents));
	    return doDecodeFromByteBuffer(new ByteBuffer_1.default(uncompressedBuffer), histogramConstr, minBarForHighestTrackableValue);
	}
	exports.doDecodeFromCompressedByteBuffer = doDecodeFromCompressedByteBuffer;
	/**
	 * Encode this histogram in compressed form into a byte array
	 * @param targetBuffer The buffer to encode into
	 * @return The number of bytes written to the array
	 */
	function encodeIntoCompressedByteBuffer(targetBuffer, compressionLevel) {
	    var self = this;
	    var intermediateUncompressedByteBuffer = ByteBuffer_1.default.allocate();
	    var uncompressedLength = self.encodeIntoByteBuffer(intermediateUncompressedByteBuffer);
	    targetBuffer.putInt32(compressedEncodingCookie);
	    var compressionOptions = compressionLevel
	        ? { level: compressionLevel }
	        : {};
	    var compressedArray = deflate(intermediateUncompressedByteBuffer.data.slice(0, uncompressedLength), compressionOptions);
	    targetBuffer.putInt32(compressedArray.byteLength);
	    targetBuffer.putArray(compressedArray);
	    return targetBuffer.position;
	}
	exports.encodeIntoCompressedByteBuffer = encodeIntoCompressedByteBuffer;
	AbstractHistogram_1.AbstractHistogram.decodeFromByteBuffer = doDecodeFromByteBuffer;
	AbstractHistogram_1.AbstractHistogram.decodeFromCompressedByteBuffer = doDecodeFromCompressedByteBuffer;
	AbstractHistogram_1.AbstractHistogram.prototype.encodeIntoByteBuffer = encodeIntoByteBuffer;
	AbstractHistogram_1.AbstractHistogram.prototype.encodeIntoCompressedByteBuffer = encodeIntoCompressedByteBuffer;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var pow = Math.pow, floor = Math.floor;
	var TWO_POW_7 = pow(2, 7);
	var TWO_POW_14 = pow(2, 14);
	var TWO_POW_21 = pow(2, 21);
	var TWO_POW_28 = pow(2, 28);
	var TWO_POW_35 = pow(2, 35);
	var TWO_POW_42 = pow(2, 42);
	var TWO_POW_49 = pow(2, 49);
	var TWO_POW_56 = pow(2, 56);
	/**
	 * This class provides encoding and decoding methods for writing and reading
	 * ZigZag-encoded LEB128-64b9B-variant (Little Endian Base 128) values to/from a
	 * {@link ByteBuffer}. LEB128's variable length encoding provides for using a
	 * smaller nuber of bytes for smaller values, and the use of ZigZag encoding
	 * allows small (closer to zero) negative values to use fewer bytes. Details
	 * on both LEB128 and ZigZag can be readily found elsewhere.
	 *
	 * The LEB128-64b9B-variant encoding used here diverges from the "original"
	 * LEB128 as it extends to 64 bit values: In the original LEB128, a 64 bit
	 * value can take up to 10 bytes in the stream, where this variant's encoding
	 * of a 64 bit values will max out at 9 bytes.
	 *
	 * As such, this encoder/decoder should NOT be used for encoding or decoding
	 * "standard" LEB128 formats (e.g. Google Protocol Buffers).
	 */
	var ZigZagEncoding = /** @class */ (function () {
	    function ZigZagEncoding() {
	    }
	    /**
	     * Writes a long value to the given buffer in LEB128 ZigZag encoded format
	     * (negative numbers not supported)
	     * @param buffer the buffer to write to
	     * @param value  the value to write to the buffer
	     */
	    ZigZagEncoding.encode = function (buffer, value) {
	        if (value >= 0) {
	            value = value * 2;
	        }
	        else {
	            value = -value * 2 - 1;
	        }
	        if (value < TWO_POW_7) {
	            buffer.put(value);
	        }
	        else {
	            buffer.put(value | 0x80);
	            if (value < TWO_POW_14) {
	                buffer.put(floor(value / TWO_POW_7));
	            }
	            else {
	                buffer.put(floor(value / TWO_POW_7) | 0x80);
	                if (value < TWO_POW_21) {
	                    buffer.put(floor(value / TWO_POW_14));
	                }
	                else {
	                    buffer.put(floor(value / TWO_POW_14) | 0x80);
	                    if (value < TWO_POW_28) {
	                        buffer.put(floor(value / TWO_POW_21));
	                    }
	                    else {
	                        buffer.put(floor(value / TWO_POW_21) | 0x80);
	                        if (value < TWO_POW_35) {
	                            buffer.put(floor(value / TWO_POW_28));
	                        }
	                        else {
	                            buffer.put(floor(value / TWO_POW_28) | 0x80);
	                            if (value < TWO_POW_42) {
	                                buffer.put(floor(value / TWO_POW_35));
	                            }
	                            else {
	                                buffer.put(floor(value / TWO_POW_35) | 0x80);
	                                if (value < TWO_POW_49) {
	                                    buffer.put(floor(value / TWO_POW_42));
	                                }
	                                else {
	                                    buffer.put(floor(value / TWO_POW_42) | 0x80);
	                                    if (value < TWO_POW_56) {
	                                        buffer.put(floor(value / TWO_POW_49));
	                                    }
	                                    else {
	                                        // should not happen
	                                        buffer.put(floor(value / TWO_POW_49) + 0x80);
	                                        buffer.put(floor(value / TWO_POW_56));
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    };
	    /**
	     * Read an LEB128-64b9B ZigZag encoded long value from the given buffer
	     * (negative numbers not supported)
	     * @param buffer the buffer to read from
	     * @return the value read from the buffer
	     */
	    ZigZagEncoding.decode = function (buffer) {
	        var v = buffer.get();
	        var value = v & 0x7f;
	        if ((v & 0x80) != 0) {
	            v = buffer.get();
	            value += (v & 0x7f) * TWO_POW_7;
	            if ((v & 0x80) != 0) {
	                v = buffer.get();
	                value += (v & 0x7f) * TWO_POW_14;
	                if ((v & 0x80) != 0) {
	                    v = buffer.get();
	                    value += (v & 0x7f) * TWO_POW_21;
	                    if ((v & 0x80) != 0) {
	                        v = buffer.get();
	                        value += (v & 0x7f) * TWO_POW_28;
	                        if ((v & 0x80) != 0) {
	                            v = buffer.get();
	                            value += (v & 0x7f) * TWO_POW_35;
	                            if ((v & 0x80) != 0) {
	                                v = buffer.get();
	                                value += (v & 0x7f) * TWO_POW_42;
	                                if ((v & 0x80) != 0) {
	                                    v = buffer.get();
	                                    value += (v & 0x7f) * TWO_POW_49;
	                                    if ((v & 0x80) != 0) {
	                                        v = buffer.get();
	                                        value += (v & 0x7f) * TWO_POW_56;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        if (value % 2 === 0) {
	            value = value / 2;
	        }
	        else {
	            value = -(value + 1) / 2;
	        }
	        return value;
	    };
	    return ZigZagEncoding;
	}());
	exports.default = ZigZagEncoding;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_25__;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function getLens (b64) {
	  var len = b64.length
	
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=')
	  if (validLen === -1) validLen = len
	
	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4)
	
	  return [validLen, placeHoldersLen]
	}
	
	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64)
	  var validLen = lens[0]
	  var placeHoldersLen = lens[1]
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}
	
	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}
	
	function toByteArray (b64) {
	  var tmp
	  var lens = getLens(b64)
	  var validLen = lens[0]
	  var placeHoldersLen = lens[1]
	
	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
	
	  var curByte = 0
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen
	
	  var i
	  for (i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)]
	    arr[curByte++] = (tmp >> 16) & 0xFF
	    arr[curByte++] = (tmp >> 8) & 0xFF
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[curByte++] = (tmp >> 8) & 0xFF
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF)
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(
	      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
	    ))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    )
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    )
	  }
	
	  return parts.join('')
	}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AbstractHistogramBase_1 = __webpack_require__(5);
	var encoding_1 = __webpack_require__(22);
	var formatters_1 = __webpack_require__(11);
	var HISTOGRAM_LOG_FORMAT_VERSION = "1.3";
	var timeFormatter = formatters_1.floatFormatter(5, 3);
	var HistogramLogWriter = /** @class */ (function () {
	    function HistogramLogWriter(log) {
	        this.log = log;
	        /**
	         * Base time to subtract from supplied histogram start/end timestamps when
	         * logging based on histogram timestamps.
	         * Base time is expected to be in msec since the epoch, as histogram start/end times
	         * are typically stamped with absolute times in msec since the epoch.
	         */
	        this.baseTime = 0;
	    }
	    /**
	     * Output an interval histogram, with the given timestamp information and the [optional] tag
	     * associated with the histogram, using a configurable maxValueUnitRatio. (note that the
	     * specified timestamp information will be used, and the timestamp information in the actual
	     * histogram will be ignored).
	     * The max value reported with the interval line will be scaled by the given maxValueUnitRatio.
	     * @param startTimeStampSec The start timestamp to log with the interval histogram, in seconds.
	     * @param endTimeStampSec The end timestamp to log with the interval histogram, in seconds.
	     * @param histogram The interval histogram to log.
	     * @param maxValueUnitRatio The ratio by which to divide the histogram's max value when reporting on it.
	     */
	    HistogramLogWriter.prototype.outputIntervalHistogram = function (histogram, startTimeStampSec, endTimeStampSec, maxValueUnitRatio) {
	        if (startTimeStampSec === void 0) { startTimeStampSec = (histogram.startTimeStampMsec - this.baseTime) / 1000; }
	        if (endTimeStampSec === void 0) { endTimeStampSec = (histogram.endTimeStampMsec - this.baseTime) / 1000; }
	        if (maxValueUnitRatio === void 0) { maxValueUnitRatio = 1000; }
	        var base64 = encoding_1.encodeIntoBase64String(histogram);
	        var start = timeFormatter(startTimeStampSec);
	        var duration = timeFormatter(endTimeStampSec - startTimeStampSec);
	        var max = timeFormatter(histogram.maxValue / maxValueUnitRatio);
	        var lineContent = start + "," + duration + "," + max + "," + base64 + "\n";
	        if (histogram.tag && histogram.tag !== AbstractHistogramBase_1.NO_TAG) {
	            this.log("Tag=" + histogram.tag + "," + lineContent);
	        }
	        else {
	            this.log(lineContent);
	        }
	    };
	    /**
	     * Log a comment to the log.
	     * Comments will be preceded with with the '#' character.
	     * @param comment the comment string.
	     */
	    HistogramLogWriter.prototype.outputComment = function (comment) {
	        this.log("#" + comment + "\n");
	    };
	    /**
	     * Log a start time in the log.
	     * @param startTimeMsec time (in milliseconds) since the absolute start time (the epoch)
	     */
	    HistogramLogWriter.prototype.outputStartTime = function (startTimeMsec) {
	        this.outputComment("[StartTime: " + formatters_1.floatFormatter(5, 3)(startTimeMsec / 1000) + " (seconds since epoch), " + new Date(startTimeMsec) + "]\n");
	    };
	    /**
	     * Output a legend line to the log.
	     */
	    HistogramLogWriter.prototype.outputLegend = function () {
	        this.log('"StartTimestamp","Interval_Length","Interval_Max","Interval_Compressed_Histogram"\n');
	    };
	    /**
	     * Output a log format version to the log.
	     */
	    HistogramLogWriter.prototype.outputLogFormatVersion = function () {
	        this.outputComment("[Histogram log format version " + HISTOGRAM_LOG_FORMAT_VERSION + "]");
	    };
	    return HistogramLogWriter;
	}());
	exports.default = HistogramLogWriter;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/*
	 * This is a TypeScript port of the original Java version, which was written by
	 * Gil Tene as described in
	 * https://github.com/HdrHistogram/HdrHistogram
	 * and released to the public domain, as explained at
	 * http://creativecommons.org/publicdomain/zero/1.0/
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	var Int32Histogram_1 = __webpack_require__(14);
	var PackedHistogram_1 = __webpack_require__(16);
	/**
	 * Records integer values, and provides stable interval {@link Histogram} samples from
	 * live recorded data without interrupting or stalling active recording of values. Each interval
	 * histogram provided contains all value counts accumulated since the previous interval histogram
	 * was taken.
	 * <p>
	 * This pattern is commonly used in logging interval histogram information while recording is ongoing.
	 * <p>
	 * {@link Recorder} supports concurrent
	 * {@link Recorder#recordValue} or
	 * {@link Recorder#recordValueWithExpectedInterval} calls.
	 *
	 */
	var Recorder = /** @class */ (function () {
	    /**
	     * Construct an auto-resizing {@link Recorder} with a lowest discernible value of
	     * 1 and an auto-adjusting highestTrackableValue. Can auto-resize up to track values up to Number.MAX_SAFE_INTEGER.
	     *
	     * @param numberOfSignificantValueDigits Specifies the precision to use. This is the number of significant
	     *                                       decimal digits to which the histogram will maintain value resolution
	     *                                       and separation. Must be a non-negative integer between 0 and 5.
	     * @param packed Specifies whether the recorder will uses a packed internal representation or not.
	     * @param clock (for testing purpose) an action that give current time in ms since 1970
	     */
	    function Recorder(numberOfSignificantValueDigits, packed, clock) {
	        if (numberOfSignificantValueDigits === void 0) { numberOfSignificantValueDigits = 3; }
	        if (packed === void 0) { packed = false; }
	        if (clock === void 0) { clock = function () { return new Date().getTime(); }; }
	        this.numberOfSignificantValueDigits = numberOfSignificantValueDigits;
	        this.packed = packed;
	        this.clock = clock;
	        this.histogramConstr = packed ? PackedHistogram_1.default : Int32Histogram_1.default;
	        this.activeHistogram = new this.histogramConstr(1, Number.MAX_SAFE_INTEGER, numberOfSignificantValueDigits);
	        Recorder.idGenerator++;
	        this.activeHistogram.containingInstanceId = Recorder.idGenerator;
	        this.activeHistogram.startTimeStampMsec = clock();
	    }
	    /**
	     * Record a value in the histogram
	     *
	     * @param value The value to be recorded
	     * @throws may throw Error if value is exceeds highestTrackableValue
	     */
	    Recorder.prototype.recordValue = function (value) {
	        this.activeHistogram.recordValue(value);
	    };
	    /**
	     * Record a value in the histogram (adding to the value's current count)
	     *
	     * @param value The value to be recorded
	     * @param count The number of occurrences of this value to record
	     * @throws ArrayIndexOutOfBoundsException (may throw) if value is exceeds highestTrackableValue
	     */
	    Recorder.prototype.recordValueWithCount = function (value, count) {
	        this.activeHistogram.recordValueWithCount(value, count);
	    };
	    /**
	     * Record a value
	     * <p>
	     * To compensate for the loss of sampled values when a recorded value is larger than the expected
	     * interval between value samples, Histogram will auto-generate an additional series of decreasingly-smaller
	     * (down to the expectedIntervalBetweenValueSamples) value records.
	     * <p>
	     * See related notes {@link AbstractHistogram#recordValueWithExpectedInterval(long, long)}
	     * for more explanations about coordinated omission and expected interval correction.
	     *      *
	     * @param value The value to record
	     * @param expectedIntervalBetweenValueSamples If expectedIntervalBetweenValueSamples is larger than 0, add
	     *                                           auto-generated value records as appropriate if value is larger
	     *                                           than expectedIntervalBetweenValueSamples
	     * @throws ArrayIndexOutOfBoundsException (may throw) if value is exceeds highestTrackableValue
	     */
	    Recorder.prototype.recordValueWithExpectedInterval = function (value, expectedIntervalBetweenValueSamples) {
	        this.activeHistogram.recordValueWithExpectedInterval(value, expectedIntervalBetweenValueSamples);
	    };
	    /**
	     * Get an interval histogram, which will include a stable, consistent view of all value counts
	     * accumulated since the last interval histogram was taken.
	     * <p>
	     * {@link Recorder#getIntervalHistogram(Histogram histogramToRecycle)
	     * getIntervalHistogram(histogramToRecycle)}
	     * accepts a previously returned interval histogram that can be recycled internally to avoid allocation
	     * and content copying operations, and is therefore significantly more efficient for repeated use than
	     * {@link Recorder#getIntervalHistogram()} and
	     * {@link Recorder#getIntervalHistogramInto getIntervalHistogramInto()}. The provided
	     * {@code histogramToRecycle} must
	     * be either be null or an interval histogram returned by a previous call to
	     * {@link Recorder#getIntervalHistogram(Histogram histogramToRecycle)
	     * getIntervalHistogram(histogramToRecycle)} or
	     * {@link Recorder#getIntervalHistogram()}.
	     * <p>
	     * NOTE: The caller is responsible for not recycling the same returned interval histogram more than once. If
	     * the same interval histogram instance is recycled more than once, behavior is undefined.
	     * <p>
	     * Calling {@link Recorder#getIntervalHistogram(Histogram histogramToRecycle)
	     * getIntervalHistogram(histogramToRecycle)} will reset the value counts, and start accumulating value
	     * counts for the next interval
	     *
	     * @param histogramToRecycle a previously returned interval histogram that may be recycled to avoid allocation and
	     *                           copy operations.
	     * @return a histogram containing the value counts accumulated since the last interval histogram was taken.
	     */
	    Recorder.prototype.getIntervalHistogram = function (histogramToRecycle) {
	        if (histogramToRecycle) {
	            var histogramToRecycleWithId = histogramToRecycle;
	            if (histogramToRecycleWithId.containingInstanceId !==
	                this.activeHistogram.containingInstanceId) {
	                throw "replacement histogram must have been obtained via a previous getIntervalHistogram() call from this Recorder";
	            }
	        }
	        this.inactiveHistogram = histogramToRecycle;
	        this.performIntervalSample();
	        var sampledHistogram = this.inactiveHistogram;
	        this.inactiveHistogram = null; // Once we expose the sample, we can't reuse it internally until it is recycled
	        return sampledHistogram;
	    };
	    /**
	     * Place a copy of the value counts accumulated since accumulated (since the last interval histogram
	     * was taken) into {@code targetHistogram}.
	     *
	     * Calling {@link Recorder#getIntervalHistogramInto getIntervalHistogramInto()} will reset
	     * the value counts, and start accumulating value counts for the next interval.
	     *
	     * @param targetHistogram the histogram into which the interval histogram's data should be copied
	     */
	    Recorder.prototype.getIntervalHistogramInto = function (targetHistogram) {
	        this.performIntervalSample();
	        if (this.inactiveHistogram) {
	            targetHistogram.add(this.inactiveHistogram);
	            targetHistogram.startTimeStampMsec = this.inactiveHistogram.startTimeStampMsec;
	            targetHistogram.endTimeStampMsec = this.inactiveHistogram.endTimeStampMsec;
	        }
	    };
	    /**
	     * Reset any value counts accumulated thus far.
	     */
	    Recorder.prototype.reset = function () {
	        this.activeHistogram.reset();
	        this.activeHistogram.startTimeStampMsec = this.clock();
	    };
	    Recorder.prototype.performIntervalSample = function () {
	        if (!this.inactiveHistogram) {
	            this.inactiveHistogram = new this.histogramConstr(1, Number.MAX_SAFE_INTEGER, this.numberOfSignificantValueDigits);
	            this.inactiveHistogram.containingInstanceId = this.activeHistogram.containingInstanceId;
	        }
	        this.inactiveHistogram.reset();
	        var tempHistogram = this.activeHistogram;
	        this.activeHistogram = this.inactiveHistogram;
	        this.inactiveHistogram = tempHistogram;
	        var currentTimeInMs = this.clock();
	        this.inactiveHistogram.endTimeStampMsec = currentTimeInMs;
	        this.activeHistogram.startTimeStampMsec = currentTimeInMs;
	    };
	    Recorder.idGenerator = 0;
	    return Recorder;
	}());
	exports.default = Recorder;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=hdrhistogram.js.map