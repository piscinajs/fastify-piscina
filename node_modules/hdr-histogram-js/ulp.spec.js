"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ulp_1 = require("./ulp");
describe("math ulp helper", function () {
    it("should compute ulp of integer", function () {
        chai_1.expect(ulp_1.default(1)).equals(2.220446049250313e-16);
    });
    it("should compute ulp of floating point number", function () {
        chai_1.expect(ulp_1.default(0.000333)).equals(5.421010862427522e-20);
    });
});
//# sourceMappingURL=ulp.spec.js.map