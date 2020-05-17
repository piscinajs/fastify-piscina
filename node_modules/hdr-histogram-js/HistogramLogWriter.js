"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractHistogramBase_1 = require("./AbstractHistogramBase");
var encoding_1 = require("./encoding");
var formatters_1 = require("./formatters");
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
//# sourceMappingURL=HistogramLogWriter.js.map