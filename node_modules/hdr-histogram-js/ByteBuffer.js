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
//# sourceMappingURL=ByteBuffer.js.map