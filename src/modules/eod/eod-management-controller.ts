import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import EODReport from "../../models/eod-reports-schema";
import mongoose from "mongoose";

/**
 * Get all EOD reports with filters for Admin
 * GET /api/admin/eod
 */
export const getAllEodReports = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate, vaId, status, search, page = 1, limit = 10 } = req.query;

        const pipeline: any[] = [];

        // Match by date range if provided
        const dateFilter: any = {};
        if (startDate) {
            dateFilter.$gte = new Date(startDate as string);
        }
        if (endDate) {
            dateFilter.$lte = new Date(endDate as string);
        }
        if (Object.keys(dateFilter).length > 0) {
            pipeline.push({ $match: { date: dateFilter } });
        }

        // Match by VA ID if provided
        if (vaId) {
            pipeline.push({ $match: { vaId: new mongoose.Types.ObjectId(vaId as string) } });
        }

        // Match by account health status if provided
        if (status) {
            pipeline.push({ $match: { "accountHealth.status": status } });
        }

        // Lookup VA details for search and display
        pipeline.push({
            $lookup: {
                from: "vas",
                localField: "vaId",
                foreignField: "_id",
                as: "vaDetails"
            }
        });

        // Unwind VA details
        pipeline.push({ $unwind: "$vaDetails" });

        // Search by VA name or email if provided
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

        // Sort by date descending
        pipeline.push({ $sort: { date: -1, submittedAt: -1 } });

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Use facet for metadata and data in one go
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: Number(limit) }]
            }
        });

        const result = await EODReport.aggregate(pipeline);
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
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch EOD reports"
        });
    }
};

/**
 * Get EOD stats summary for Admin
 * GET /api/admin/eod/summary
 */
export const getEodSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate, vaId } = req.query;

        const match: any = {};

        const dateFilter: any = {};
        if (startDate) {
            dateFilter.$gte = new Date(startDate as string);
        }
        if (endDate) {
            dateFilter.$lte = new Date(endDate as string);
        }
        if (Object.keys(dateFilter).length > 0) {
            match.date = dateFilter;
        }

        if (vaId) {
            match.vaId = new mongoose.Types.ObjectId(vaId as string);
        }

        const summary = await EODReport.aggregate([
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
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch EOD summary"
        });
    }
};
