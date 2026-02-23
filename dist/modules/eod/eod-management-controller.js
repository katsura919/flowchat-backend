"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEodSummary = exports.getAllEodReports = void 0;
const eod_reports_schema_1 = __importDefault(require("../../models/eod-reports-schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllEodReports = async (req, res) => {
    try {
        const { startDate, endDate, vaId, status, search, page = 1, limit = 10 } = req.query;
        const pipeline = [];
        const dateFilter = {};
        if (startDate) {
            dateFilter.$gte = new Date(startDate);
        }
        if (endDate) {
            dateFilter.$lte = new Date(endDate);
        }
        if (Object.keys(dateFilter).length > 0) {
            pipeline.push({ $match: { date: dateFilter } });
        }
        if (vaId) {
            pipeline.push({ $match: { vaId: new mongoose_1.default.Types.ObjectId(vaId) } });
        }
        if (status) {
            pipeline.push({ $match: { "accountHealth.status": status } });
        }
        pipeline.push({
            $lookup: {
                from: "vas",
                localField: "vaId",
                foreignField: "_id",
                as: "vaDetails"
            }
        });
        pipeline.push({ $unwind: "$vaDetails" });
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "vaDetails.name": { $regex: search, $options: "i" } },
                        { "vaDetails.email": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }
        pipeline.push({ $sort: { date: -1, submittedAt: -1 } });
        const skip = (Number(page) - 1) * Number(limit);
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: Number(limit) }]
            }
        });
        const result = await eod_reports_schema_1.default.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].metadata[0]?.total || 0;
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch EOD reports"
        });
    }
};
exports.getAllEodReports = getAllEodReports;
const getEodSummary = async (req, res) => {
    try {
        const { startDate, endDate, vaId } = req.query;
        const match = {};
        const dateFilter = {};
        if (startDate) {
            dateFilter.$gte = new Date(startDate);
        }
        if (endDate) {
            dateFilter.$lte = new Date(endDate);
        }
        if (Object.keys(dateFilter).length > 0) {
            match.date = dateFilter;
        }
        if (vaId) {
            match.vaId = new mongoose_1.default.Types.ObjectId(vaId);
        }
        const summary = await eod_reports_schema_1.default.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalLeadsImported: { $sum: "$dailyNumbers.newLeadsImported" },
                    totalFriendRequestsSent: { $sum: "$dailyNumbers.friendRequestsSent" },
                    totalConversationsStarted: { $sum: "$dailyNumbers.newConversationsStarted" },
                    totalCallsBooked: { $sum: "$dailyNumbers.callsBooked" },
                    totalNewReplies: { $sum: "$pipelineMovement.newReplies" },
                    reportCount: { $sum: 1 }
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: summary[0] || {
                totalLeadsImported: 0,
                totalFriendRequestsSent: 0,
                totalConversationsStarted: 0,
                totalCallsBooked: 0,
                totalNewReplies: 0,
                reportCount: 0
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch EOD summary"
        });
    }
};
exports.getEodSummary = getEodSummary;
//# sourceMappingURL=eod-management-controller.js.map