"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
var AbstractHistogramBase_1 = require("./AbstractHistogramBase");
var Int32Histogram_1 = require("./Int32Histogram");
var encoding_1 = require("./encoding");
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
//# sourceMappingURL=HistogramLogReader.js.map