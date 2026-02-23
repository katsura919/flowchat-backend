"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCertification = exports.toggleCertificationItem = exports.getVaCertification = exports.getAllCertifications = void 0;
const certifications_schema_1 = __importDefault(require("../../models/certifications-schema"));
const va_schema_1 = __importDefault(require("../../models/va-schema"));
const PHASE1_ITEMS = [
    { id: "p1_1", text: "Identity Verified" },
    { id: "p1_2", text: "Portfolio Reviewed" },
    { id: "p1_3", text: "Discord Setup Complete" },
    { id: "p1_4", text: "Introduction Video Submitted" },
    { id: "p1_5", text: "Basic SOP Knowledge Test Passed" },
];
const PHASE2_ITEMS = [
    { id: "p2_1", text: "Lead Generation Accuracy > 95%" },
    { id: "p2_2", text: "Objection Handling Mastered" },
    { id: "p2_3", text: "FlowChat Extension Proficiency" },
    { id: "p2_4", text: "CRM Usage Verified" },
];
const PHASE3_ITEMS = [
    { id: "p3_1", text: "Successfully Booked 5 Calls" },
    { id: "p3_2", text: "Zero Account Bans in 7 Days" },
    { id: "p3_3", text: "Weekly KPI Targets Met" },
    { id: "p3_4", text: "Client Satisfaction Approval" },
    { id: "p3_5", text: "Final Interview with Team Lead" },
];
const getAllCertifications = async (req, res) => {
    try {
        const certifications = await certifications_schema_1.default.find()
            .populate("vaId", "firstName lastName email avatar profilePicture")
            .sort({ updatedAt: -1 });
        return res.json(certifications);
    }
    catch (error) {
        console.error("Get all certifications error:", error);
        return res.status(500).json({ message: "Server error fetching certifications" });
    }
};
exports.getAllCertifications = getAllCertifications;
const getVaCertification = async (req, res) => {
    try {
        const { vaId } = req.params;
        let certification = await certifications_schema_1.default.findOne({ vaId })
            .populate("vaId", "firstName lastName email avatar profilePicture");
        if (!certification) {
            const va = await va_schema_1.default.findById(vaId);
            if (!va) {
                return res.status(404).json({ message: "VA not found" });
            }
            certification = new certifications_schema_1.default({
                vaId,
                phase1: { items: PHASE1_ITEMS.map(i => ({ ...i, checked: false, checkedAt: null })), totalCount: PHASE1_ITEMS.length },
                phase2: { items: PHASE2_ITEMS.map(i => ({ ...i, checked: false, checkedAt: null })), totalCount: PHASE2_ITEMS.length },
                phase3: { items: PHASE3_ITEMS.map(i => ({ ...i, checked: false, checkedAt: null })), totalCount: PHASE3_ITEMS.length },
            });
            await certification.save();
            await certification.populate("vaId", "firstName lastName email avatar profilePicture");
        }
        return res.json(certification);
    }
    catch (error) {
        console.error("Get VA certification error:", error);
        return res.status(500).json({ message: "Server error fetching VA certification" });
    }
};
exports.getVaCertification = getVaCertification;
const toggleCertificationItem = async (req, res) => {
    try {
        const { vaId } = req.params;
        const { phase, itemId, checked } = req.body;
        const adminId = req.user?.id;
        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const certification = await certifications_schema_1.default.findOne({ vaId });
        if (!certification) {
            return res.status(404).json({ message: "Certification record not found" });
        }
        let phaseData;
        if (phase === "phase1")
            phaseData = certification.phase1;
        else if (phase === "phase2")
            phaseData = certification.phase2;
        else if (phase === "phase3")
            phaseData = certification.phase3;
        else
            return res.status(400).json({ message: "Invalid phase specified" });
        const itemIndex = phaseData.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in phase" });
        }
        phaseData.items[itemIndex].checked = checked;
        phaseData.items[itemIndex].checkedAt = checked ? new Date() : null;
        certification.reviewedBy = adminId;
        await certification.save();
        if (certification.isCertified) {
            await va_schema_1.default.findByIdAndUpdate(vaId, { isCertified: true });
        }
        else {
            await va_schema_1.default.findByIdAndUpdate(vaId, { isCertified: false });
        }
        return res.json({
            message: "Certification item updated",
            certification
        });
    }
    catch (error) {
        console.error("Toggle certification item error:", error);
        return res.status(500).json({ message: "Server error updating certification item" });
    }
};
exports.toggleCertificationItem = toggleCertificationItem;
const getMyCertification = async (req, res) => {
    try {
        const vaId = req.user?.id;
        if (!vaId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const certification = await certifications_schema_1.default.findOne({ vaId });
        if (!certification) {
            return res.status(404).json({ message: "Certification not found" });
        }
        return res.json(certification);
    }
    catch (error) {
        console.error("Get my certification error:", error);
        return res.status(500).json({ message: "Server error fetching my certification" });
    }
};
exports.getMyCertification = getMyCertification;
//# sourceMappingURL=certification-controller.js.map