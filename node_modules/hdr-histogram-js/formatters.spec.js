"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var chai_1 = require("chai");
var formatters_1 = require("./formatters");
describe("Integer formatter", function () {
    it("should format integer as a string", function () {
        // given
        var formatter = formatters_1.integerFormatter(3);
        // when
        var result = formatter(123);
        // then
        chai_1.expect(result).to.be.equal("123");
    });
    it("should add padding on the left when input has a few digits", function () {
        // given
        var formatter = formatters_1.integerFormatter(5);
        // when
        var result = formatter(123);
        // then
        chai_1.expect(result).to.be.equal("  123");
    });
});
describe("Float formatter", function () {
    it("should format float as a string", function () {
        // given
        var formatter = formatters_1.floatFormatter(5, 2);
        // when
        var result = formatter(12.34);
        // then
        chai_1.expect(result).to.be.equal("12.34");
    });
    it("should format float as a string with given number of fraction digits", function () {
        // given
        var formatter = formatters_1.floatFormatter(5, 2);
        // when
        var result = formatter(12.342);
        // then
        chai_1.expect(result).to.be.equal("12.34");
    });
    it("should format float as a string adding fraction digits", function () {
        // given
        var formatter = formatters_1.floatFormatter(5, 2);
        // when
        var result = formatter(12.3);
        // then
        chai_1.expect(result).to.be.equal("12.30");
    });
    it("should format the whole float input even with lots of digits", function () {
        // given
        var formatter = formatters_1.floatFormatter(5, 2);
        // when
        var result = formatter(12456789.34);
        // then
        chai_1.expect(result).to.be.equal("12456789.34");
    });
    it("should add padding on the left when not enough digits", function () {
        // given
        var formatter = formatters_1.floatFormatter(5, 2);
        // when
        var result = formatter(9.34);
        // then
        chai_1.expect(result).to.be.equal(" 9.34");
    });
});
//# sourceMappingURL=formatters.spec.js.map