"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminMe = exports.registerAdmin = exports.loginAdmin = void 0;
const admin_schema_1 = __importDefault(require("../../../models/admin-schema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id, role: "admin" }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password" });
            return;
        }
        const admin = await admin_schema_1.default.findOne({ email });
        if (!admin || !admin.password) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        res.json({ token: generateToken(String(admin._id)) });
    }
    catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.loginAdmin = loginAdmin;
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }
        const adminExists = await admin_schema_1.default.findOne({ email });
        if (adminExists) {
            res.status(400).json({ message: "Admin already exists" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const admin = await admin_schema_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        if (admin) {
            res.status(201).json({ token: generateToken(String(admin._id)) });
        }
        else {
            res.status(400).json({ message: "Invalid admin data" });
        }
    }
    catch (error) {
        console.error("Admin registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};
exports.registerAdmin = registerAdmin;
const getAdminMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const admin = await admin_schema_1.default.findById(userId).select("-password");
        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.json(admin);
    }
    catch (error) {
        console.error("Get admin me error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};
exports.getAdminMe = getAdminMe;
//# sourceMappingURL=auth-admin-controller.js.map