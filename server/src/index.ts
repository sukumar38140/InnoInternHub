import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { projectRouter } from "./routes/project.routes";
import { applicationRouter } from "./routes/application.routes";
import { certificateRouter } from "./routes/certificate.routes";
import { messageRouter } from "./routes/message.routes";
import { notificationRouter } from "./routes/notification.routes";
import { adminRouter } from "./routes/admin.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/certificates", certificateRouter);
app.use("/api/messages", messageRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
