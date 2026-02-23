"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_admin_route_1 = __importDefault(require("./modules/auth/admin/auth-admin-route"));
const auth_va_route_1 = __importDefault(require("./modules/auth/va/auth-va-route"));
const va_management_route_1 = __importDefault(require("./modules/va-management/va-management-route"));
const training_routes_1 = __importDefault(require("./modules/training/training-routes"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use('/auth/admin', auth_admin_route_1.default);
router.use('/auth/va', auth_va_route_1.default);
router.use('/admin/vas', va_management_route_1.default);
router.use('/va/training', training_routes_1.default);
exports.default = router;
//# sourceMappingURL=route.js.map