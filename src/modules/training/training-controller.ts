import { Response } from "express";
import TrainingProgress from "../../models/training-progress-schema";
import Certification from "../../models/certifications-schema";
import { AuthRequest } from "../../middleware/auth";
import VA from "../../models/va-schema";

const DEFAULT_MODULES = [
    { slug: 'm1', label: 'Strategic Roadmap', group: 'Getting Started', order: 1 },
    { slug: 'm2', label: 'Operational System', group: 'Getting Started', order: 2 },
    { slug: 'm3', label: 'The Playbook', group: 'Getting Started', order: 3 },
    { slug: 'm4', label: 'Day 1: Overview & Strategy', group: 'Client Walkthrough', order: 4 },
    { slug: 'm5', label: 'Day 2: Lead Import', group: 'Client Walkthrough', order: 5 },
    { slug: 'm6', label: 'Day 3: Manual Messaging', group: 'Client Walkthrough', order: 6 },
    { slug: 'm7', label: 'Day 4: Automation & Scaling', group: 'Client Walkthrough', order: 7 },
    { slug: 'm8', label: 'Lead Qualification Logic', group: 'Operations', order: 8 },
    { slug: 'm9', label: 'Ghosting Protocols', group: 'Operations', order: 9 },
    { slug: 'm10', label: 'Appointment Setting Flows', group: 'Operations', order: 10 },
    { slug: 'm11', label: 'Reporting & Analytics', group: 'Operations', order: 11 },
    { slug: 'm12', label: 'VA Management Best Practices', group: 'Management', order: 12 },
    { slug: 'm13', label: 'Crisis Management Protocols', group: 'Safety', order: 13 },
    { slug: 'm14', label: 'Account Safety & Compliance', group: 'Safety', order: 14 },
    { slug: 'm15', label: 'Custom CRM Integrations', group: 'Tech', order: 15 },
    { slug: 'm16', label: 'Rebuttal Mastery', group: 'Communication', order: 16 },
    { slug: 'm17', label: 'Certification Final Review', group: 'Certification', order: 17 },
];

export const getMyTrainingProgress = async (req: AuthRequest, res: Response) => {
    try {
        const vaId = req.user?.id;
        if (!vaId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        let progress = await TrainingProgress.findOne({ vaId });

        // Auto-seed if not exists
        if (!progress) {
            progress = new TrainingProgress({
                vaId,
                modules: DEFAULT_MODULES.map(m => ({ ...m, completed: false, completedAt: null }))
            });
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        console.error("Get training progress error:", error);
        res.status(500).json({ message: "Server error fetching training progress" });
    }
};

export const updateModuleStatus = async (req: AuthRequest, res: Response) => {
    try {
        const vaId = req.user?.id;
        const { slug } = req.params;
        const { completed } = req.body;

        if (!vaId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const progress = await TrainingProgress.findOne({ vaId });
        if (!progress) {
            res.status(404).json({ message: "Training progress not found" });
            return;
        }

        const moduleIndex = progress.modules.findIndex((m) => m.slug === slug);
        if (moduleIndex === -1) {
            res.status(404).json({ message: "Module not found" });
            return;
        }

        progress.modules[moduleIndex].completed = completed;
        progress.modules[moduleIndex].completedAt = completed ? new Date() : null;

        await progress.save();

        // Update VA training status in the VA model
        const va = await VA.findById(vaId);
        if (va) {
            if (progress.completedCount === 0) {
                va.trainingStatus = "not_started";
            } else if (progress.completedCount === progress.totalCount) {
                va.trainingStatus = "completed";
            } else {
                va.trainingStatus = "in_progress";
            }
            await va.save();
        }

        res.json({
            message: "Module status updated",
            progress: {
                completedCount: progress.completedCount,
                totalCount: progress.totalCount,
                progressPercent: progress.progressPercent,
                module: progress.modules[moduleIndex]
            }
        });
    } catch (error) {
        console.error("Update module status error:", error);
        res.status(500).json({ message: "Server error updating module status" });
    }
};

export const getMyCertification = async (req: AuthRequest, res: Response) => {
    try {
        const vaId = req.user?.id;
        if (!vaId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        let certification = await Certification.findOne({ vaId });

        // Auto-seed if not exists (optional, but good for UX)
        if (!certification) {
            // Create default certification structure if needed
            // For now, let's just return 404 or a default object
            // This depends on how the user wants to handle certification initialization
            // I'll leave it as search for now.
            res.status(404).json({ message: "Certification not found" });
            return;
        }

        res.json(certification);
    } catch (error) {
        console.error("Get certification error:", error);
        res.status(500).json({ message: "Server error fetching certification" });
    }
};
