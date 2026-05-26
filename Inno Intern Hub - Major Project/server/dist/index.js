"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_handler_1 = require("./middleware/error-handler");
const auth_routes_1 = require("./routes/auth.routes");
const user_routes_1 = require("./routes/user.routes");
const project_routes_1 = require("./routes/project.routes");
const application_routes_1 = require("./routes/application.routes");
const certificate_routes_1 = require("./routes/certificate.routes");
const message_routes_1 = require("./routes/message.routes");
const notification_routes_1 = require("./routes/notification.routes");
const admin_routes_1 = require("./routes/admin.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    message: { error: "Too many requests, please try again later." },
});
app.use(limiter);
// Body parsing
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// API Routes
app.use("/api/auth", auth_routes_1.authRouter);
app.use("/api/users", user_routes_1.userRouter);
app.use("/api/projects", project_routes_1.projectRouter);
app.use("/api/applications", application_routes_1.applicationRouter);
app.use("/api/certificates", certificate_routes_1.certificateRouter);
app.use("/api/messages", message_routes_1.messageRouter);
app.use("/api/notifications", notification_routes_1.notificationRouter);
app.use("/api/admin", admin_routes_1.adminRouter);
// Error handling
app.use(error_handler_1.errorHandler);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map