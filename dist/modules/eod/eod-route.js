"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const eod_controller_1 = require("./eod-controller");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.use((0, auth_1.authorize)("va"));
router.route("/")
    .post(eod_controller_1.submitEodReport)
    .get(eod_controller_1.getMyEodReports);
router.get("/latest", eod_controller_1.getLatestEodReport);
exports.default = router;
//# sourceMappingURL=eod-route.js.map