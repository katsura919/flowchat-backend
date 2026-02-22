"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_va_controller_1 = require("./auth-va-controller");
const auth_middleware_1 = require("../../../middleware/auth-middleware");
const router = express_1.default.Router();
router.post("/login", auth_va_controller_1.loginVa);
router.get("/me", auth_middleware_1.verifyToken, auth_middleware_1.requireVA, auth_va_controller_1.getVaMe);
exports.default = router;
//# sourceMappingURL=auth-va-route.js.map