import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import VA from "../../models/va-schema";
import TrainingProgress from "../../models/training-progress-schema";
import Certification from "../../models/certifications-schema";
import { AuthRequest } from "../../middleware/auth";

export const createVa = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }

        const vaExists = await VA.findOne({ email });

        if (vaExists) {
            res.status(400).json({ message: "A VA with this email already exists" });
            return;
        }

        const adminId = req.user?.id;
        if (!adminId) {
            res.status(401).json({ message: "Unauthorized: No admin ID found in token" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const va = await VA.create({
            name,
            email,
            password: hashedPassword,
            assignedAdminId: adminId,
            status: "active",
            trainingStatus: "not_started",
            isCertified: false,
        });

        // Initialize Training Progress
        const INITIAL_MODULES = [
            { slug: "blueprint", label: "SOP Growth Blueprint", group: "Getting Started" },
            { slug: "va-role", label: "VA Role & Daily Rhythm", group: "Getting Started" },
            { slug: "limitations", label: "Platform Limits & Safety", group: "Getting Started" },
            { slug: "overview", label: "Overview & Purpose", group: "Client Walkthrough" },
            { slug: "client-guide", label: "Client Quick-Start Guide", group: "Client Walkthrough" },
            { slug: "setup", label: "Pre-Call Setup Protocol", group: "VA Setup" },
            { slug: "compliance", label: "Compliance & Platform Limits", group: "VA Setup" },
            { slug: "day-1", label: "Day 1 — Overview & Strategy", group: "Daily Walkthrough" },
            { slug: "day-2", label: "Day 2 — Lead Import & Logic", group: "Daily Walkthrough" },
            { slug: "day-3", label: "Day 3 — Messaging & Nurturing", group: "Daily Walkthrough" },
            { slug: "day-4", label: "Day 4 — Automation & Scaling", group: "Daily Walkthrough" },
            { slug: "maturity", label: "Maturity Roadmap", group: "Growth System" },
            { slug: "audit", label: "Weekly Growth Audit", group: "Growth System" },
            { slug: "scripts", label: "Script Playbook", group: "Playbooks" },
            { slug: "report", label: "Daily Operations Report", group: "Playbooks" },
            { slug: "optimization", label: "30-Day Optimization Review", group: "Operations" },
            { slug: "best-practices", label: "Best Practices & Skills", group: "Operations" },
        ];

        await TrainingProgress.create({
            vaId: va._id,
            modules: INITIAL_MODULES,
            completedCount: 0,
            totalCount: 17,
            progressPercent: 0,
        });

        // Initialize Certifications
        const PHASE_1_ITEMS = [
            { id: "t1", text: "Import 50 leads using a keyword filter" },
            { id: "t2", text: "Move a lead correctly through Stages 01–10" },
            { id: "t3", text: "Edit and rotate message templates in the Builder" },
            { id: "t4", text: "Confirm booking link is active and working end-to-end" },
            { id: "t5", text: "Archive leads that have been inactive for 21+ days" },
        ];

        const PHASE_2_ITEMS = [
            { id: "s1", text: "Recite the safe daily limits for warm and cold accounts from memory" },
            { id: "s2", text: "Identify and correctly respond to a Facebook 'Please slow down' warning" },
            { id: "s3", text: "Explain why template rotation matters for account health" },
            { id: "s4", text: "Demonstrate correct manual message spacing (not bulk-sending)" },
        ];

        const PHASE_3_ITEMS = [
            { id: "c1", text: "Convert a 'How much does it cost?' message into a booking" },
            { id: "c2", text: "Execute the full Ghosting Protocol correctly" },
            { id: "c3", text: "Perform the Double-Tap booking method correctly" },
            { id: "c4", text: "Rewrite a robotic message into a natural, human-sounding response" },
            { id: "c5", text: "Handle a 'Is this a bot?' reply correctly" },
        ];

        await Certification.create({
            vaId: va._id,
            phase1: { items: PHASE_1_ITEMS, completedCount: 0, totalCount: 5, isPassed: null },
            phase2: { items: PHASE_2_ITEMS, completedCount: 0, totalCount: 4, isPassed: false },
            phase3: { items: PHASE_3_ITEMS, completedCount: 0, totalCount: 5, isPassed: false },
            isCertified: false,
        });

        res.status(201).json({
            message: "VA created successfully",
            va: {
                _id: va._id,
                name: va.name,
                email: va.email,
                status: va.status,
                assignedAdminId: va.assignedAdminId,
            }
        });

    } catch (error) {
        console.error("Create VA error:", error);
        res.status(500).json({ message: "Server error creating VA" });
    }
};

export const getVas = async (req: AuthRequest, res: Response) => {
    try {
        const adminId = req.user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const filter = req.query.filter as string; // 'all' or 'my'

        const query: any = {};

        if (filter === "my" && adminId) {
            query.assignedAdminId = adminId;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [vas, totalCount] = await Promise.all([
            VA.find(query)
                .select("-password")
                .populate("assignedAdminId", "name email")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            VA.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            data: vas,
            metadata: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
            }
        });

    } catch (error) {
        console.error("Get VAs error:", error);
        res.status(500).json({ message: "Server error fetching VAs" });
    }
};

export const getVaById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const va = await VA.findById(id).select("-password").populate("assignedAdminId", "name email");

        if (!va) {
            res.status(404).json({ message: "VA not found" });
            return;
        }

        res.json(va);
    } catch (error) {
        console.error("Get VA by ID error:", error);
        res.status(500).json({ message: "Server error fetching VA details" });
    }
};

export const updateVaStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, assignedAdminId } = req.body;

        const va = await VA.findById(id);

        if (!va) {
            res.status(404).json({ message: "VA not found" });
            return;
        }

        if (status) {
            // Validate status
            if (!["active", "inactive", "suspended"].includes(status)) {
                res.status(400).json({ message: "Invalid status value" });
                return;
            }
            va.status = status;
        }

        if (assignedAdminId) {
            va.assignedAdminId = assignedAdminId;
        }

        await va.save();

        res.json({
            message: "VA updated successfully",
            va: {
                _id: va._id,
                name: va.name,
                status: va.status,
                assignedAdminId: va.assignedAdminId
            }
        });
    } catch (error) {
        console.error("Update VA status error:", error);
        res.status(500).json({ message: "Server error updating VA" });
    }
};
