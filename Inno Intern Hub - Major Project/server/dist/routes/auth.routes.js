"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const error_handler_1 = require("../middleware/error-handler");
const auth_1 = require("../middleware/auth");
const validations_1 = require("../lib/validations");
const email_1 = require("../lib/email");
exports.authRouter = (0, express_1.Router)();
// Generate tokens
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" });
};
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" });
};
// REGISTER
exports.authRouter.post("/register", async (req, res, next) => {
    try {
        const data = validations_1.registerSchema.parse(req.body);
        // Check if email exists
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new error_handler_1.AppError("Email already registered", 400);
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        // Generate verification token
        const emailVerifyToken = crypto_1.default.randomBytes(32).toString("hex");
        const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // Create user
        const user = await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                emailVerifyToken,
                emailVerifyExpiry,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        // Send verification email
        await (0, email_1.sendVerificationEmail)(user.email, emailVerifyToken);
        res.status(201).json({
            message: "Registration successful. Please verify your email.",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
// LOGIN
exports.authRouter.post("/login", async (req, res, next) => {
    try {
        const data = validations_1.loginSchema.parse(req.body);
        // Find user
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user || !user.passwordHash) {
            throw new error_handler_1.AppError("Invalid credentials", 401);
        }
        // Check if email is verified
        if (!user.emailVerified) {
            throw new error_handler_1.AppError("Please verify your email before logging in", 401);
        }
        // Check if user is active
        if (!user.isActive) {
            throw new error_handler_1.AppError("Your account has been deactivated", 401);
        }
        // Verify password
        const isValid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new error_handler_1.AppError("Invalid credentials", 401);
        }
        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        // Store refresh token
        await prisma_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        // Update last login
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// LOGOUT
exports.authRouter.post("/logout", auth_1.authenticate, async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            // Delete refresh token from database
            await prisma_1.prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
});
// REFRESH TOKEN
exports.authRouter.post("/refresh", async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new error_handler_1.AppError("Refresh token required", 401);
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Check if token exists in database
        const storedToken = await prisma_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new error_handler_1.AppError("Invalid or expired refresh token", 401);
        }
        // Generate new access token
        const accessToken = generateAccessToken(decoded.userId);
        res.json({
            accessToken,
            user: {
                id: storedToken.user.id,
                email: storedToken.user.email,
                firstName: storedToken.user.firstName,
                lastName: storedToken.user.lastName,
                role: storedToken.user.role,
                avatar: storedToken.user.avatar,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// VERIFY EMAIL
exports.authRouter.post("/verify-email", async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new error_handler_1.AppError("Verification token required", 400);
        }
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                emailVerifyToken: token,
                emailVerifyExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw new error_handler_1.AppError("Invalid or expired verification token", 400);
        }
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerifyToken: null,
                emailVerifyExpiry: null,
            },
        });
        res.json({ message: "Email verified successfully. You can now login." });
    }
    catch (error) {
        next(error);
    }
});
// FORGOT PASSWORD
exports.authRouter.post("/forgot-password", async (req, res, next) => {
    try {
        const data = validations_1.forgotPasswordSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ message: "If the email exists, a reset link has been sent." });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        await (0, email_1.sendPasswordResetEmail)(user.email, resetToken);
        res.json({ message: "If the email exists, a reset link has been sent." });
    }
    catch (error) {
        next(error);
    }
});
// RESET PASSWORD
exports.authRouter.post("/reset-password", async (req, res, next) => {
    try {
        const data = validations_1.resetPasswordSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                resetToken: data.token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw new error_handler_1.AppError("Invalid or expired reset token", 400);
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        // Invalidate all refresh tokens
        await prisma_1.prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });
        res.json({ message: "Password reset successfully. You can now login." });
    }
    catch (error) {
        next(error);
    }
});
// GET CURRENT USER
exports.authRouter.get("/me", auth_1.authenticate, async (req, res, next) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                bio: true,
                phone: true,
                skills: true,
                education: true,
                university: true,
                graduationYear: true,
                portfolioUrl: true,
                companyName: true,
                companyWebsite: true,
                designation: true,
                investorType: true,
                investmentRange: true,
                sectors: true,
                points: true,
                level: true,
                badges: true,
                isVerified: true,
                createdAt: true,
            },
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=auth.routes.js.map