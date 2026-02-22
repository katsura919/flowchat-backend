"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_admin_controller_1 = require("./auth-admin-controller");
const auth_middleware_1 = require("../../../middleware/auth-middleware");
const router = express_1.default.Router();
router.post("/login", auth_admin_controller_1.loginAdmin);
router.post("/register", auth_admin_controller_1.registerAdmin);
router.get("/me", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, auth_admin_controller_1.getAdminMe);
exports.default = router;
//# sourceMappingURL=auth-admin-route.js.map