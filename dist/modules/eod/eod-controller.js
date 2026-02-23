"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestEodReport = exports.getMyEodReports = exports.submitEodReport = void 0;
const eod_reports_schema_1 = __importDefault(require("../../models/eod-reports-schema"));
const submitEodReport = async (req, res) => {
    try {
        const vaId = req.user?.id;
        if (!vaId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const { date, dailyNumbers, pipelineMovement, accountHealth, insights, blockers } = req.body;
        const reportDate = new Date(date);
        reportDate.setUTCHours(0, 0, 0, 0);
        const report = new eod_reports_schema_1.default({
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
    }
    catch (error) {
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
exports.submitEodReport = submitEodReport;
const getMyEodReports = async (req, res) => {
    try {
        const vaId = req.user?.id;
        const reports = await eod_reports_schema_1.default.find({ vaId }).sort({ date: -1 });
        return res.status(200).json({
            success: true,
            data: reports
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch EOD reports"
        });
    }
};
exports.getMyEodReports = getMyEodReports;
const getLatestEodReport = async (req, res) => {
    try {
        const vaId = req.user?.id;
        const latestReport = await eod_reports_schema_1.default.findOne({ vaId }).sort({ date: -1 });
        return res.status(200).json({
            success: true,
            data: latestReport
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch latest EOD report"
        });
    }
};
exports.getLatestEodReport = getLatestEodReport;
//# sourceMappingURL=eod-controller.js.map