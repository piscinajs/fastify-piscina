"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
var fc = require("fast-check");
var PackedArray_1 = require("./PackedArray");
var runFromStryker = __dirname.includes("stryker");
var runnerOptions = {
    numRuns: runFromStryker ? 10 : 1000,
    verbose: true
};
describe("Packed array", function () {
    it("should store data as a regular sparse array", function () {
        var SIZE = 1000;
        fc.assert(fc.property(arbData(SIZE), function (entries) {
            var packedArray = new PackedArray_1.PackedArray(SIZE + 1);
            var sparseArray = new Array();
            entries.forEach(function (_a) {
                var index = _a[0], value = _a[1];
                return packedArray.add(index, value);
            });
            entries.forEach(function (_a) {
                var index = _a[0], value = _a[1];
                if (sparseArray[index]) {
                    sparseArray[index] = sparseArray[index] + value;
                }
                else {
                    sparseArray[index] = value;
                }
            });
            return entries.every(function (_a) {
                var index = _a[0];
                return sparseArray[index] === packedArray.get(index);
            });
        }), runnerOptions);
    });
});
var arbData = function (size) {
    return fc.array(fc.tuple(fc.integer(1, size), fc.integer(1, 100000000)), 1, size);
};
//# sourceMappingURL=PackedArray.fc.spec.js.map