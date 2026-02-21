import { Request, Response } from "express";
import VA from "../../../models/va-schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id: string, role: string = "va") => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

export const loginVa = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password" });
            return;
        }

        const va = await VA.findOne({ email });

        // Ensure VA is found and has a password
        if (!va || !va.password) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Check account status
        if (va.status !== "active") {
            res.status(403).json({ message: `Account is ${va.status}. Please contact admin.` });
            return;
        }

        const isMatch = await bcrypt.compare(password, va.password);

        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        res.json({ token: generateToken(String(va._id)) });
    } catch (error) {
        console.error("VA login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const getVaMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const va = await VA.findById(userId).select("-password").populate("assignedAdminId", "name email");

        if (!va) {
            res.status(404).json({ message: "VA not found" });
            return;
        }

        res.json(va);
    } catch (error) {
        console.error("Get VA me error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};
