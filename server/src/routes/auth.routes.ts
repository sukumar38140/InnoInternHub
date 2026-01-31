import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, AuthRequest } from "../middleware/auth";
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../lib/validations";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email";

export const authRouter = Router();

// Generate tokens
const generateAccessToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" }
    );
};

const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" }
    );
};

// REGISTER
authRouter.post("/register", async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError("Email already registered", 400);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 12);

        // Generate verification token
        const emailVerifyToken = crypto.randomBytes(32).toString("hex");
        const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role as any,
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
        await sendVerificationEmail(user.email, emailVerifyToken);

        res.status(201).json({
            message: "Registration successful. Please verify your email.",
            user,
        });
    } catch (error) {
        next(error);
    }
});

// LOGIN
authRouter.post("/login", async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !user.passwordHash) {
            throw new AppError("Invalid credentials", 401);
        }

        // Check if email is verified
        if (!user.emailVerified) {
            throw new AppError("Please verify your email before logging in", 401);
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError("Your account has been deactivated", 401);
        }

        // Verify password
        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new AppError("Invalid credentials", 401);
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // Update last login
        await prisma.user.update({
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
    } catch (error) {
        next(error);
    }
});

// LOGOUT
authRouter.post("/logout", authenticate, async (req: AuthRequest, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Delete refresh token from database
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
});

// REFRESH TOKEN
authRouter.post("/refresh", async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError("Refresh token required", 401);
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
        ) as { userId: string };

        // Check if token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new AppError("Invalid or expired refresh token", 401);
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
    } catch (error) {
        next(error);
    }
});

// VERIFY EMAIL
authRouter.post("/verify-email", async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new AppError("Verification token required", 400);
        }

        const user = await prisma.user.findFirst({
            where: {
                emailVerifyToken: token,
                emailVerifyExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            throw new AppError("Invalid or expired verification token", 400);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerifyToken: null,
                emailVerifyExpiry: null,
            },
        });

        res.json({ message: "Email verified successfully. You can now login." });
    } catch (error) {
        next(error);
    }
});

// FORGOT PASSWORD
authRouter.post("/forgot-password", async (req, res, next) => {
    try {
        const data = forgotPasswordSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ message: "If the email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        await sendPasswordResetEmail(user.email, resetToken);

        res.json({ message: "If the email exists, a reset link has been sent." });
    } catch (error) {
        next(error);
    }
});

// RESET PASSWORD
authRouter.post("/reset-password", async (req, res, next) => {
    try {
        const data = resetPasswordSchema.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                resetToken: data.token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            throw new AppError("Invalid or expired reset token", 400);
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        // Invalidate all refresh tokens
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });

        res.json({ message: "Password reset successfully. You can now login." });
    } catch (error) {
        next(error);
    }
});

// GET CURRENT USER
authRouter.get("/me", authenticate, async (req: AuthRequest, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
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
    } catch (error) {
        next(error);
    }
});
