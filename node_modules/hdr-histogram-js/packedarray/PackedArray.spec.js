"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
require("core-js");
var chai_1 = require("chai");
var PackedArrayContext_1 = require("./PackedArrayContext");
var PackedArray_1 = require("./PackedArray");
var pow = Math.pow;
describe("Packed array context", function () {
    it("Should initialize array", function () {
        var ctx = new PackedArrayContext_1.PackedArrayContext(1024, 128);
        chai_1.expect(ctx.isPacked).to.be.true;
        chai_1.expect(ctx.getPopulatedShortLength()).to.be.greaterThan(0);
    });
});
describe("Packed array", function () {
    it("Should initialize array", function () {
        var array = new PackedArray_1.PackedArray(1024, 128);
        chai_1.expect(array.getPhysicalLength()).to.equal(128);
        chai_1.expect(array.length()).to.equal(1024);
    });
    it("Should retrieve data stored in array", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        // when
        array.set(16, 1);
        array.set(12, 42);
        // then
        chai_1.expect(array.get(12)).to.be.equal(42);
        chai_1.expect(array.get(16)).to.be.equal(1);
    });
    it("Should resize array when storing data", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        // when
        array.set(12, 361);
        // then
        var storedData = array.get(12);
        chai_1.expect(storedData).to.be.equal(361);
    });
    it("Should retrieve big numbers stored in array", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        // when
        array.set(12, Math.pow(2, 16) + 1);
        // then
        var storedData = array.get(12);
        chai_1.expect(storedData).to.be.equal(Math.pow(2, 16) + 1);
    });
    it("Should copy data when resizing array", function () {
        var array = new PackedArray_1.PackedArray(1024);
        for (var value = 1; value <= 272; value++) {
            array.set(value, value);
        }
        for (var value = 256; value <= 272; value++) {
            chai_1.expect(array.get(value)).to.be.equal(value);
        }
    });
    it("Should increment data stored in array", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        array.set(16, 1);
        // when
        array.add(16, 41);
        // then
        chai_1.expect(array.get(16)).to.be.equal(42);
    });
    it("Should increment data stored in array with big numbers", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        array.set(16, 42);
        // when
        array.add(16, pow(2, 33));
        // then
        chai_1.expect(array.get(16)).to.be.equal(pow(2, 33) + 42);
    });
    it("Should increment data stored in array with big numbers when a resize is needed", function () {
        // given
        var array = new PackedArray_1.PackedArray(10000, 16);
        array.set(6144, 243);
        array.set(60, 243);
        array.set(1160, 243);
        // when
        array.add(6144, 25);
        // then
        chai_1.expect(array.get(6144)).to.be.equal(268);
    });
    it("Should increment data stored in array with big numbers", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        array.set(16, 42);
        // when
        array.add(16, pow(2, 33));
        // then
        chai_1.expect(array.get(16)).to.be.equal(pow(2, 33) + 42);
    });
    it("Should clear data stored in array", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, 16);
        array.set(16, 42);
        // when
        array.clear();
        // then
        chai_1.expect(array.get(16)).to.be.equal(0);
    });
    it("Should resize array when virtual length change", function () {
        // given
        var array = new PackedArray_1.PackedArray(16, 16);
        array.set(7, 42);
        // when
        array.setVirtualLength(pow(2, 20));
        array.add(pow(2, 19), 42);
        // then
        chai_1.expect(array.get(7)).to.be.equal(42);
        chai_1.expect(array.get(pow(2, 19))).to.be.equal(42);
    });
});
describe("Unpacked array", function () {
    it("Should increment data stored in array", function () {
        // given
        var array = new PackedArray_1.PackedArray(1024, pow(2, 20));
        array.set(16, 1);
        // when
        array.add(16, 41);
        // then
        chai_1.expect(array.get(16)).to.be.equal(42);
    });
});
//# sourceMappingURL=PackedArray.spec.js.map