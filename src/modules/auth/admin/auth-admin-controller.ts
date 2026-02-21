import { Request, Response } from "express";
import Admin from "../../../models/admin-schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
    return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password" });
            return;
        }

        const admin = await Admin.findOne({ email });

        if (!admin || !admin.password) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        res.json({ token: generateToken(String(admin._id)) });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }

        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            res.status(400).json({ message: "Admin already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        if (admin) {
            res.status(201).json({ token: generateToken(String(admin._id)) });
        } else {
            res.status(400).json({ message: "Invalid admin data" });
        }
    } catch (error) {
        console.error("Admin registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const getAdminMe = async (req: Request, res: Response) => {
    try {
        // Requires verifyToken middleware to populate req.user
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const admin = await Admin.findById(userId).select("-password");

        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }

        res.json(admin);
    } catch (error) {
        console.error("Get admin me error:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};
