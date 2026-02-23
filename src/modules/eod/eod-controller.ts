import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import EODReport from "../../models/eod-reports-schema";
import { createError } from "../../middleware/errorHandler";

/**
 * Submit a new EOD report
 * POST /api/eod
 */
export const submitEodReport = async (req: AuthRequest, res: Response) => {
    try {
        const vaId = req.user?.id;
        if (!vaId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const {
            date,
            dailyNumbers,
            pipelineMovement,
            accountHealth,
            insights,
            blockers
        } = req.body;

        // Normalize date to UTC midnight for unique tracking
        const reportDate = new Date(date);
        reportDate.setUTCHours(0, 0, 0, 0);

        // Create new report
        const report = new EODReport({
            vaId,
            date: reportDate,
            dailyNumbers,
            pipelineMovement,
            accountHealth,
            insights,
            blockers,
            submittedAt: new Date()
        });

        await report.save();

        return res.status(201).json({
            success: true,
            data: report
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted a report for this date."
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to submit EOD report"
        });
    }
};

/**
 * Get EOD reports for the logged-in VA
 * GET /api/eod
 */
export const getMyEodReports = async (req: AuthRequest, res: Response) => {
    try {
        const vaId = req.user?.id;
        const reports = await EODReport.find({ vaId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch EOD reports"
        });
    }
};

/**
 * Get the latest EOD report for stats
 * GET /api/eod/latest
 */
export const getLatestEodReport = async (req: AuthRequest, res: Response) => {
    try {
        const vaId = req.user?.id;
        const latestReport = await EODReport.findOne({ vaId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: latestReport
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch latest EOD report"
        });
    }
};
