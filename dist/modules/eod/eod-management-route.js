"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const eod_management_controller_1 = require("./eod-management-controller");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.use((0, auth_1.authorize)("admin"));
router.get("/", eod_management_controller_1.getAllEodReports);
router.get("/summary", eod_management_controller_1.getEodSummary);
exports.default = router;
//# sourceMappingURL=eod-management-route.js.map