import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bell,
    CheckCircle2,
    Briefcase,
    Award,
    MessageSquare,
    TrendingUp,
    Info,
    Trash2
} from "lucide-react";

// Notifications page
export default function NotificationsPage() {
    // In production, fetch from API
    const notifications: any[] = [];
    const unreadCount = 0;

    const getIcon = (type: string) => {
        switch (type) {
            case "APPLICATION_RECEIVED":
            case "APPLICATION_ACCEPTED":
            case "APPLICATION_REJECTED":
                return Briefcase;
            case "CERTIFICATE_ISSUED":
                return Award;
            case "NEW_MESSAGE":
                return MessageSquare;
            case "MILESTONE_APPROVED":
                return CheckCircle2;
            case "INVESTMENT_INTEREST":
                return TrendingUp;
            default:
                return Info;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
                    <p className="text-slate-500">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </p>
                </div>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm">
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card className="p-12 bg-white border-slate-200 text-center">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">No notifications yet</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        When you receive notifications about applications, messages, or updates, they will appear here.
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = getIcon(notification.type);
                        return (
                            <Card
                                key={notification.id}
                                className={`p-4 bg-white border-slate-200 hover:shadow-sm transition-shadow ${!notification.isRead ? "border-l-4 border-l-blue-500" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${!notification.isRead ? "bg-blue-50" : "bg-slate-50"
                                        }`}>
                                        <Icon className={`w-5 h-5 ${!notification.isRead ? "text-blue-600" : "text-slate-400"
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium ${!notification.isRead ? "text-slate-900" : "text-slate-600"
                                            }`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                                        <p className="text-xs text-slate-400 mt-2">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <Trash2 className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
