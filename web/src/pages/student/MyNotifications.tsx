import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { UserNotification, Notification } from "../../../types/types";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/MyNotifications.css";

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

const IconBell = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 15V13H2V7C2 5.617 2.417 4.387 3.25 3.312C4.083 2.238 5.167 1.533 6.5 1.2V0.5C6.5 0.217 6.596 0 6.788 0C6.979 0 7.217 0 7.5 0H8.5C8.783 0 9.021 0 9.213 0C9.404 0 9.5 0.217 9.5 0.5V1.2C10.833 1.533 11.917 2.238 12.75 3.312C13.583 4.387 14 5.617 14 7V13H16V15H0ZM8 18C7.45 18 6.979 17.804 6.588 17.413C6.196 17.021 6 16.55 6 16H10C10 16.55 9.804 17.021 9.413 17.413C9.021 17.804 8.55 18 8 18ZM4 13H12V7C12 5.9 11.608 4.958 10.825 4.175C10.042 3.392 9.1 3 8 3C6.9 3 5.958 3.392 5.175 4.175C4.392 4.958 4 5.9 4 7V13Z" fill="currentColor"/>
    </svg>
);

const IconBellEmpty = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
        <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function MyNotifications() {
    const { userId } = useAuth();

    const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [userNotifRes, notifRes] = await Promise.all([
                    axios.get(`${API_URL}/userNotifications`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/notifications`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setUserNotifications(userNotifRes.data.filter((un: UserNotification) => un.userId === userId));
                setNotifications(notifRes.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des notifications :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId]);

    const getNotification = (id: number) => notifications.find(n => n.id === id);

    const markAsRead = async (userNotifId: number) => {
        try {
            await axios.patch(`${API_URL}/userNotifications/${userNotifId}`, {
                isRead: true,
                readAt: new Date().toISOString(),
            }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });
            setUserNotifications(prev =>
                prev.map(un => un.id === userNotifId ? { ...un, isRead: true, readAt: new Date().toISOString() } : un)
            );
        } catch (err) {
            console.error("Erreur lors du marquage :", err);
        }
    };

    const markAllAsRead = async () => {
        const unread = userNotifications.filter(un => !un.isRead);
        await Promise.all(unread.map(un => markAsRead(un.id)));
    };

    const filteredNotifications = userNotifications
        .filter(un => {
            if (filter === "unread") return !un.isRead;
            if (filter === "read") return un.isRead;
            return true;
        })
        .sort((a, b) => {
            const notifA = getNotification(a.notificationid);
            const notifB = getNotification(b.notificationid);
            return new Date(notifB?.createdAt || 0).getTime() - new Date(notifA?.createdAt || 0).getTime();
        });

    const unreadCount = userNotifications.filter(un => !un.isRead).length;

    return (
        <StudentLayout titleHeader="Mes notifications">
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="w-full bg-white rounded-xl shadow-md p-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold">Mes notifications</h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-500 mt-1">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                {([["all", "Toutes"], ["unread", "Non lues"], ["read", "Lues"]] as const).map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => setFilter(val)}
                                        className={`px-4 py-2 text-sm transition cursor-pointer ${filter === val ? "notif-filter-active text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="mark-all-read-btn text-white px-4 py-2 rounded text-sm transition cursor-pointer whitespace-nowrap">
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                    </div>

                    {/* LISTE */}
                    {loading ? (
                        <p className="text-center text-gray-400 italic py-10">Chargement…</p>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center gap-3">
                            <IconBellEmpty />
                            <p className="text-gray-500 italic">Aucune notification{filter === "unread" ? " non lue" : filter === "read" ? " lue" : ""}.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredNotifications.map(un => {
                                const notif = getNotification(un.notificationid);
                                return (
                                    <div
                                        key={un.id}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition ${un.isRead ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"}`}
                                    >
                                        <div className={`mt-0.5 shrink-0 ${un.isRead ? "text-gray-300" : "text-blue-500"}`}>
                                            <IconBell size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${un.isRead ? "text-gray-600" : "text-gray-800 font-medium"}`}>
                                                {notif?.message || "—"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDate(notif?.createdAt || "")}
                                                {un.isRead && un.readAt && ` · Lu le ${formatDate(un.readAt)}`}
                                            </p>
                                        </div>
                                        {!un.isRead && (
                                            <button onClick={() => markAsRead(un.id)} className="text-xs mark-read-btn px-3 py-1 rounded transition cursor-pointer shrink-0">
                                                Marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </StudentLayout>
    );
}
