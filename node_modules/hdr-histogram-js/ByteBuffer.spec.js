"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var ByteBuffer_1 = require("./ByteBuffer");
describe("ByteBuffer", function () {
    it("should put value moving the position", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(3);
        // when
        buffer.put(123);
        // then
        chai_1.expect(buffer.data[0]).to.be.equal(123);
        chai_1.expect(buffer.position).to.be.equal(1);
    });
    it("should resize when values overflow ", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1);
        buffer.put(123);
        // when
        buffer.put(42);
        // then
        chai_1.expect(buffer.data[0]).to.be.equal(123);
        chai_1.expect(buffer.data[1]).to.be.equal(42);
    });
    it("should get value moving the position", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1);
        buffer.put(123);
        buffer.resetPosition();
        // when
        var value = buffer.get();
        // then
        chai_1.expect(value).to.be.equal(123);
        chai_1.expect(buffer.position).to.be.equal(1);
    });
    it("should put int32 value moving the position", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(8);
        // when
        buffer.putInt32(123);
        // then
        chai_1.expect(buffer.data[3]).to.be.equal(123);
        chai_1.expect(buffer.position).to.be.equal(4);
    });
    it("should resize when int32 values overflow ", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1);
        // when
        buffer.putInt32(42);
        // then
        chai_1.expect(buffer.data[3]).to.be.equal(42);
        chai_1.expect(buffer.position).to.be.equal(4);
    });
    it("should get int32 value moving the position", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1);
        buffer.putInt32(123);
        buffer.resetPosition();
        // when
        var value = buffer.getInt32();
        // then
        chai_1.expect(value).to.be.equal(123);
        chai_1.expect(buffer.position).to.be.equal(4);
    });
    it("should put int64 value moving the position", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(8);
        // when
        buffer.putInt64(123);
        // then
        chai_1.expect(buffer.data[7]).to.be.equal(123);
        chai_1.expect(buffer.position).to.be.equal(8);
    });
    it("should resize when int64 values overflow ", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1);
        // when
        buffer.putInt64(42);
        // then
        chai_1.expect(buffer.data[7]).to.be.equal(42);
        chai_1.expect(buffer.position).to.be.equal(8);
    });
    it("should get int64 value moving the position", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1);
        buffer.putInt64(Number.MAX_SAFE_INTEGER);
        buffer.resetPosition();
        // when
        var value = buffer.getInt64();
        // then
        chai_1.expect(value).to.be.equal(Number.MAX_SAFE_INTEGER);
        chai_1.expect(buffer.position).to.be.equal(8);
    });
    it("should copy all data when putting array", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1024);
        var array = new Uint8Array([1, 2, 3, 4]);
        // when
        buffer.putArray(array);
        // then
        buffer.resetPosition();
        chai_1.expect(buffer.get()).to.be.equal(1);
        chai_1.expect(buffer.get()).to.be.equal(2);
        chai_1.expect(buffer.get()).to.be.equal(3);
        chai_1.expect(buffer.get()).to.be.equal(4);
    });
    it("should resize when putting array bigger than capacity", function () {
        // given
        var buffer = ByteBuffer_1.default.allocate(1024);
        var array = new Uint8Array([1, 2, 3, 4]);
        // when
        buffer.position = 1022;
        buffer.putArray(array);
        // then
        buffer.position = 1022;
        chai_1.expect(buffer.get()).to.be.equal(1);
        chai_1.expect(buffer.get()).to.be.equal(2);
        chai_1.expect(buffer.get()).to.be.equal(3);
        chai_1.expect(buffer.get()).to.be.equal(4);
    });
});
//# sourceMappingURL=ByteBuffer.spec.js.map