import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);

    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation failed",
            details: err.errors.map(e => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    // Custom app errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // Prisma errors
    if (err.name === "PrismaClientKnownRequestError") {
        return res.status(400).json({
            error: "Database operation failed",
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            error: "Invalid token",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            error: "Token expired",
        });
    }

    // Default error
    return res.status(500).json({
        error: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message,
    });
};
