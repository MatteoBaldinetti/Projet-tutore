import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../constants/apiConstants";
import { useAuth } from "../contexts/AuthContext";
import type { UserNotification, Notification } from "../../types/types";

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

const IconBell = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 15V13H2V7C2 5.617 2.417 4.387 3.25 3.312C4.083 2.238 5.167 1.533 6.5 1.2V0.5C6.5 0.217 6.596 0 6.788 0C6.979 0 7.217 0 7.5 0H8.5C8.783 0 9.021 0 9.213 0C9.404 0 9.5 0.217 9.5 0.5V1.2C10.833 1.533 11.917 2.238 12.75 3.312C13.583 4.387 14 5.617 14 7V13H16V15H0ZM8 18C7.45 18 6.979 17.804 6.588 17.413C6.196 17.021 6 16.55 6 16H10C10 16.55 9.804 17.021 9.413 17.413C9.021 17.804 8.55 18 8 18ZM4 13H12V7C12 5.9 11.608 4.958 10.825 4.175C10.042 3.392 9.1 3 8 3C6.9 3 5.958 3.392 5.175 4.175C4.392 4.958 4 5.9 4 7V13Z" fill="currentColor"/>
    </svg>
);

export default function NotificationDropdown() {
    const { userId } = useAuth();
    const [open, setOpen] = useState(false);
    const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Fermer le dropdown en cliquant ailleurs
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Charger les notifs
    useEffect(() => {
        if (!userId) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const [unRes, nRes] = await Promise.all([
                    axios.get(`${API_URL}/userNotifications`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/notifications`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setUserNotifications(unRes.data.filter((un: UserNotification) => un.userId === userId));
                setNotifications(nRes.data);
            } catch (err) {
                console.error("Erreur notifications :", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [open, userId]);

    const getNotification = (id: number) => notifications.find(n => n.id === id);

    const markAsRead = async (userNotifId: number) => {
        const un = userNotifications.find(n => n.id === userNotifId);
        if (!un) return;
        try {
            await axios.patch(`${API_URL}/userNotifications/${userNotifId}`, {
                isRead: true,
                readAt: new Date().toISOString(),
            }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });
            setUserNotifications(prev =>
                prev.map(un => un.id === userNotifId ? { ...un, isRead: true, readAt: new Date().toISOString() } : un)
            );
        } catch (err) {
            console.error("Erreur marquage :", err);
        }
    };

    const markAllAsRead = async () => {
        const unread = userNotifications.filter(un => !un.isRead);
        await Promise.all(unread.map(un => markAsRead(un.id)));
    };

    const unreadCount = userNotifications.filter(un => !un.isRead).length;

    const sorted = [...userNotifications].sort((a, b) => {
        const nA = getNotification(a.notificationId);
        const nB = getNotification(b.notificationId);
        return new Date(nB?.createdAt || 0).getTime() - new Date(nA?.createdAt || 0).getTime();
    });

    return (
        <div className="relative" ref={ref}>
            {/* Bouton cloche */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="relative bg-[#F1F5F9] p-3 rounded-full cursor-pointer hover:bg-gray-200 transition text-[#39393A]"
                aria-label="Notifications"
            >
                <IconBell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    {/* En-tête du dropdown */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div>
                            <span className="font-semibold text-sm text-gray-800">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="ml-2 text-xs text-gray-400">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-[#3A8C85] hover:underline cursor-pointer"
                            >
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    {/* Liste */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <p className="text-center text-gray-400 italic py-8 text-sm">Chargement…</p>
                        ) : sorted.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm italic">
                                Aucune notification
                            </div>
                        ) : (
                            sorted.map(un => {
                                const notif = getNotification(un.notificationId);
                                return (
                                    <div
                                        key={un.id}
                                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition ${un.isRead ? "bg-white" : "bg-blue-50"}`}
                                    >
                                        <div className={`mt-0.5 shrink-0 ${un.isRead ? "text-gray-300" : "text-blue-500"}`}>
                                            <IconBell size={15} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${un.isRead ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                                                {notif?.message || "—"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {formatDate(notif?.createdAt || "")}
                                            </p>
                                        </div>
                                        {!un.isRead && (
                                            <button
                                                onClick={() => markAsRead(un.id)}
                                                className="shrink-0 text-xs text-[#3A8C85] hover:underline cursor-pointer whitespace-nowrap"
                                            >
                                                Lu
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}