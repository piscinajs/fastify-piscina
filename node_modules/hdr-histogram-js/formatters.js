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
//# sourceMappingURL=formatters.js.map