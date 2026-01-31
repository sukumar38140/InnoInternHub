import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "./error-handler";
import { Role } from "@prisma/client";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: Role;
        firstName: string;
        lastName: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Access token required", 401);
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!
        ) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            throw new AppError("User not found or inactive", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError("Authentication required", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError("Insufficient permissions", 403));
        }

        next();
    };
};

export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next();
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!
        ) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
            },
        });

        if (user && user.isActive) {
            req.user = user;
        }

        next();
    } catch {
        // Silently continue without auth
        next();
    }
};
