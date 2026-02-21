import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: unknown) => {
      console.error("Unhandled Rejection:", reason);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
