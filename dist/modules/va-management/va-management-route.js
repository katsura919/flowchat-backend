"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const va_management_controller_1 = require("./va-management-controller");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.use((0, auth_1.authorize)("admin"));
router.route("/")
    .post(va_management_controller_1.createVa)
    .get(va_management_controller_1.getVas);
router.route("/:id")
    .get(va_management_controller_1.getVaById)
    .patch(va_management_controller_1.updateVaStatus);
exports.default = router;
//# sourceMappingURL=va-management-route.js.map