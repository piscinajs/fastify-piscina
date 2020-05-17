"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var ByteBuffer_1 = require("./ByteBuffer");
var ZigZagEncoding_1 = require("./ZigZagEncoding");
describe("Zig Zag Encoding", function () {
    it("should encode int using one byte when value is less than 64", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(4);
        // when
        ZigZagEncoding_1.default.encode(buffer, 56);
        // then
        chai_1.expect(buffer.data).to.have.length(4);
        chai_1.expect(buffer.data[0]).to.equals(112);
    });
    it("should encode int using several bytes when value is more than 64", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(4);
        // when
        ZigZagEncoding_1.default.encode(buffer, 456);
        // then
        chai_1.expect(buffer.data).to.have.length(4);
        chai_1.expect(Array.from(buffer.data)).to.deep.equals([144, 7, 0, 0]);
    });
    it("should encode negative int using several bytes when value is more than 64", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(4);
        // when
        ZigZagEncoding_1.default.encode(buffer, -456);
        // then
        chai_1.expect(buffer.data).to.have.length(4);
        chai_1.expect(Array.from(buffer.data)).to.deep.equals([143, 7, 0, 0]);
    });
    it("should encode large safe int greater than 2^32", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(4);
        // when
        ZigZagEncoding_1.default.encode(buffer, Math.pow(2, 50));
        // then
        chai_1.expect(buffer.data).to.have.length(8);
        chai_1.expect(Array.from(buffer.data)).to.deep.equals([
            128,
            128,
            128,
            128,
            128,
            128,
            128,
            4
        ]);
    });
    it("should decode int using one byte", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(8);
        ZigZagEncoding_1.default.encode(buffer, 56);
        buffer.resetPosition();
        // when
        var value = ZigZagEncoding_1.default.decode(buffer);
        // then
        chai_1.expect(value).to.equals(56);
    });
    it("should decode int using multiple bytes", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(8);
        ZigZagEncoding_1.default.encode(buffer, 70000);
        ZigZagEncoding_1.default.encode(buffer, 56);
        buffer.resetPosition();
        // when
        var value = ZigZagEncoding_1.default.decode(buffer);
        // then
        chai_1.expect(value).to.equals(70000);
    });
    it("should decode negative int using multiple bytes", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(8);
        ZigZagEncoding_1.default.encode(buffer, -1515);
        ZigZagEncoding_1.default.encode(buffer, 56);
        buffer.resetPosition();
        // when
        var value = ZigZagEncoding_1.default.decode(buffer);
        // then
        chai_1.expect(value).to.equals(-1515);
    });
    it("should decode large safe int greater than 2^32", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(4);
        ZigZagEncoding_1.default.encode(buffer, Math.pow(2, 50) + 1234);
        ZigZagEncoding_1.default.encode(buffer, 56);
        buffer.resetPosition();
        // when
        var value = ZigZagEncoding_1.default.decode(buffer);
        // then
        chai_1.expect(value).to.equals(Math.pow(2, 50) + 1234);
    });
});
//# sourceMappingURL=ZigZagEncoding.spec.js.map