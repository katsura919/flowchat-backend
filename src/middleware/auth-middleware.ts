import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "admin" | "va";
    };
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Not authorized, no token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
            id: string;
            role: "admin" | "va";
        };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};

export const requireVA = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "va") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as a VA" });
    }
};
