import { Router } from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

export const certificateRouter = Router();

// GET MY CERTIFICATES (Student)
certificateRouter.get(
    "/",
    authenticate,
    authorize("STUDENT"),
    async (req: AuthRequest, res, next) => {
        try {
            const certificates = await prisma.certificate.findMany({
                where: { studentId: req.user!.id },
                include: {
                    project: {
                        select: {
                            id: true,
                            domain: true,
                            skills: true,
                        },
                    },
                },
                orderBy: { issuedAt: "desc" },
            });

            res.json(certificates);
        } catch (error) {
            next(error);
        }
    }
);

// VERIFY CERTIFICATE (Public)
certificateRouter.get("/verify/:certificateNo", async (req, res, next) => {
    try {
        const { certificateNo } = req.params;

        const certificate = await prisma.certificate.findUnique({
            where: { certificateNo },
            include: {
                project: {
                    select: {
                        domain: true,
                        skills: true,
                    },
                },
            },
        });

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: "Certificate not found",
            });
        }

        if (certificate.status === "REVOKED") {
            return res.json({
                valid: false,
                message: "This certificate has been revoked",
                certificate: {
                    certificateNo: certificate.certificateNo,
                    studentName: certificate.studentName,
                    projectTitle: certificate.projectTitle,
                    revokedAt: certificate.revokedAt,
                },
            });
        }

        res.json({
            valid: true,
            certificate: {
                certificateNo: certificate.certificateNo,
                studentName: certificate.studentName,
                projectTitle: certificate.projectTitle,
                innovatorName: certificate.innovatorName,
                skills: certificate.skills,
                startDate: certificate.startDate,
                endDate: certificate.endDate,
                issuedAt: certificate.issuedAt,
                domain: certificate.project.domain,
            },
        });
    } catch (error) {
        next(error);
    }
});

// DOWNLOAD CERTIFICATE (Student)
certificateRouter.get(
    "/:id/download",
    authenticate,
    authorize("STUDENT", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const certificate = await prisma.certificate.findUnique({
                where: { id },
                include: {
                    project: {
                        select: {
                            domain: true,
                        },
                    },
                },
            });

            if (!certificate) {
                throw new AppError("Certificate not found", 404);
            }

            if (certificate.studentId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized", 403);
            }

            if (certificate.status !== "ISSUED") {
                throw new AppError("Certificate not yet issued", 400);
            }

            // Generate QR code
            const verifyUrl = `${process.env.APP_URL}/verify/${certificate.certificateNo}`;
            const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
                width: 100,
                margin: 1,
            });

            // Create PDF
            const doc = new PDFDocument({
                size: "A4",
                layout: "landscape",
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });

            // Set response headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="certificate-${certificate.certificateNo}.pdf"`
            );

            doc.pipe(res);

            // Certificate Design
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;

            // Border
            doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke("#3b82f6");
            doc.rect(35, 35, pageWidth - 70, pageHeight - 70).stroke("#e5e7eb");

            // Header
            doc.fontSize(14).fillColor("#3b82f6").text("InnoInternHUB", 0, 60, {
                align: "center",
            });

            doc.fontSize(36).fillColor("#111827").text("Certificate of Completion", 0, 100, {
                align: "center",
            });

            // Decorative line
            doc.moveTo(pageWidth / 2 - 100, 150).lineTo(pageWidth / 2 + 100, 150).stroke("#3b82f6");

            // Body
            doc.fontSize(14).fillColor("#6b7280").text("This is to certify that", 0, 180, {
                align: "center",
            });

            doc.fontSize(28).fillColor("#111827").text(certificate.studentName, 0, 210, {
                align: "center",
            });

            doc.fontSize(14).fillColor("#6b7280").text("has successfully completed the internship project", 0, 260, {
                align: "center",
            });

            doc.fontSize(22).fillColor("#3b82f6").text(`"${certificate.projectTitle}"`, 0, 290, {
                align: "center",
            });

            doc.fontSize(12).fillColor("#6b7280").text(
                `Duration: ${formatDate(certificate.startDate)} - ${formatDate(certificate.endDate)}`,
                0,
                340,
                { align: "center" }
            );

            doc.fontSize(12).fillColor("#6b7280").text(
                `Skills: ${certificate.skills.join(", ")}`,
                0,
                365,
                { align: "center" }
            );

            // Signatures section
            const signY = 420;

            // Innovator signature
            doc.fontSize(10).fillColor("#111827").text(certificate.innovatorName, 150, signY, {
                align: "center",
                width: 150,
            });
            doc.moveTo(100, signY - 5).lineTo(250, signY - 5).stroke("#6b7280");
            doc.fontSize(9).fillColor("#6b7280").text("Project Lead", 150, signY + 15, {
                align: "center",
                width: 150,
            });

            // Platform signature
            doc.fontSize(10).fillColor("#111827").text("InnoInternHUB", pageWidth - 250, signY, {
                align: "center",
                width: 150,
            });
            doc.moveTo(pageWidth - 300, signY - 5).lineTo(pageWidth - 150, signY - 5).stroke("#6b7280");
            doc.fontSize(9).fillColor("#6b7280").text("Platform Verification", pageWidth - 250, signY + 15, {
                align: "center",
                width: 150,
            });

            // QR Code (convert data URL to buffer)
            const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
            doc.image(qrBuffer, pageWidth / 2 - 40, 400, { width: 80, height: 80 });

            // Certificate ID
            doc.fontSize(8).fillColor("#9ca3af").text(
                `Certificate ID: ${certificate.certificateNo}`,
                0,
                490,
                { align: "center" }
            );
            doc.fontSize(8).fillColor("#9ca3af").text(
                `Issued on: ${formatDate(certificate.issuedAt || new Date())}`,
                0,
                505,
                { align: "center" }
            );
            doc.fontSize(8).fillColor("#9ca3af").text(
                `Verify at: ${verifyUrl}`,
                0,
                520,
                { align: "center" }
            );

            doc.end();
        } catch (error) {
            next(error);
        }
    }
);

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
}
