"use client";

import { MessageCircle, Phone } from "lucide-react";

export function Footer() {
    const phoneNumber = "8978943122";
    const message = "Hi, how can I help you?";
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    const telUrl = `tel:${phoneNumber}`;

    return (
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto w-full">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Credits Section */}
                    <div className="text-center md:text-left space-y-1">
                        <p className="text-sm font-semibold text-slate-800 tracking-tight">
                            Build by: <span className="text-blue-600">Mits Innovation Team</span>
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                            Developer: Kumar Saatharla
                        </p>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex flex-col items-center md:items-end space-y-2">
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-900 tabular-nums">
                                {phoneNumber}
                            </span>

                            <div className="flex items-center gap-2">
                                {/* WhatsApp Action */}
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                    aria-label="Chat on WhatsApp"
                                    title="Chat on WhatsApp"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </a>

                                {/* Call Action */}
                                <a
                                    href={telUrl}
                                    className="group flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    aria-label="Call Number"
                                    title="Call Now"
                                >
                                    <Phone className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Note */}
                        <p className="text-[11px] text-slate-400 font-medium italic">
                            (Contact for unique projects)
                        </p>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-slate-100 mt-6 pt-6 text-center">
                    <p className="text-[10px] text-slate-400">
                        All Rights Reserved mits innovation team@2026
                    </p>
                </div>
            </div>
        </footer>
    );
}
