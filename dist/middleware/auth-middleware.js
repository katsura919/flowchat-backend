"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVA = exports.requireAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Not authorized, no token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
exports.verifyToken = verifyToken;
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};
exports.requireAdmin = requireAdmin;
const requireVA = (req, res, next) => {
    if (req.user && req.user.role === "va") {
        next();
    }
    else {
        res.status(403).json({ message: "Not authorized as a VA" });
    }
};
exports.requireVA = requireVA;
//# sourceMappingURL=auth-middleware.js.map