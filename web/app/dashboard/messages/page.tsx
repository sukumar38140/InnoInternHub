import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Send } from "lucide-react";

// Messages page
export default function MessagesPage() {
    // In production, fetch from API
    const conversations: any[] = [];
    const selectedConversation = null;

    return (
        <div className="h-[calc(100vh-8rem)]">
            <div className="flex h-full bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Conversations Sidebar */}
                <div className="w-80 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900 mb-3">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search conversations..."
                                className="pl-9 bg-slate-50 border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                    <MessageSquare className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">No conversations</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Start messaging to connect
                                </p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.partner.id}
                                    className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {conv.partner.firstName?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {conv.partner.firstName} {conv.partner.lastName}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {conv.lastMessage?.content}
                                            </p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {!selectedConversation ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Select a conversation</h3>
                            <p className="text-sm text-slate-500 max-w-sm">
                                Choose a conversation from the sidebar to start messaging, or search for someone to connect with.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Name</p>
                                        <p className="text-xs text-slate-500">Active now</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 overflow-y-auto">
                                {/* Messages would be rendered here */}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-slate-200">
                                <div className="flex items-center gap-3">
                                    <Input
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button size="icon" className="shrink-0">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
