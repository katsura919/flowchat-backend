"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
        });
        const shutdown = (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("unhandledRejection", (reason) => {
            console.error("Unhandled Rejection:", reason);
            server.close(() => process.exit(1));
        });
        process.on("uncaughtException", (error) => {
            console.error("Uncaught Exception:", error);
            process.exit(1);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map