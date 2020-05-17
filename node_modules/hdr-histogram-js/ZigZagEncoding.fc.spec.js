"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var fc = require("fast-check");
var ByteBuffer_1 = require("./ByteBuffer");
var ZigZagEncoding_1 = require("./ZigZagEncoding");
var runFromStryker = __dirname.includes("stryker");
var runnerOptions = {
    numRuns: runFromStryker ? 10 : 1000
};
describe("Zig Zag Encoding", function () {
    it("should get the same number after an encoding & decoding", function () {
        var buffer = ByteBuffer_1.default.allocate(8);
        fc.assert(fc.property(fc.nat(Number.MAX_SAFE_INTEGER), function (number) {
            buffer.resetPosition();
            ZigZagEncoding_1.default.encode(buffer, number);
            buffer.resetPosition();
            var result = ZigZagEncoding_1.default.decode(buffer);
            return number === result;
        }), runnerOptions);
    });
});
//# sourceMappingURL=ZigZagEncoding.fc.spec.js.map