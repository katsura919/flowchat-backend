"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVaMe = exports.loginVa = void 0;
const va_schema_1 = __importDefault(require("../../../models/va-schema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, role = "va") => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};
const loginVa = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password" });
            return;
        }
        const va = await va_schema_1.default.findOne({ email });
        if (!va || !va.password) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        if (va.status !== "active") {
            res.status(403).json({ message: `Account is ${va.status}. Please contact admin.` });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, va.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        res.json({ token: generateToken(String(va._id)) });
    }
    catch (error) {
        console.error("VA login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.loginVa = loginVa;
const getVaMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const va = await va_schema_1.default.findById(userId).select("-password").populate("assignedAdminId", "name email");
        if (!va) {
            res.status(404).json({ message: "VA not found" });
            return;
        }
        res.json(va);
    }
    catch (error) {
        console.error("Get VA me error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};
exports.getVaMe = getVaMe;
//# sourceMappingURL=auth-va-controller.js.map