import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Reservation, UserNotification, Notification, Resource } from "../../../types/types";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/StudentDashboard.css";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    PENDING:   { label: "En attente",  className: "bg-yellow-100 text-yellow-700" },
    APPROVED:  { label: "Approuvée",   className: "bg-green-100 text-green-700" },
    REJECTED:  { label: "Refusée",     className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Annulée",     className: "bg-gray-100 text-gray-500" },
};

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

const IconCalendar = () => (
    <svg width="22" height="22" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="currentColor"/>
    </svg>
);

const IconClock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconBell = () => (
    <svg width="22" height="22" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 15V13H2V7C2 5.617 2.417 4.387 3.25 3.312C4.083 2.238 5.167 1.533 6.5 1.2V0.5C6.5 0.217 6.596 0 6.788 0C6.979 0 7.217 0 7.5 0H8.5C8.783 0 9.021 0 9.213 0C9.404 0 9.5 0.217 9.5 0.5V1.2C10.833 1.533 11.917 2.238 12.75 3.312C13.583 4.387 14 5.617 14 7V13H16V15H0ZM8 18C7.45 18 6.979 17.804 6.588 17.413C6.196 17.021 6 16.55 6 16H10C10 16.55 9.804 17.021 9.413 17.413C9.021 17.804 8.55 18 8 18ZM4 13H12V7C12 5.9 11.608 4.958 10.825 4.175C10.042 3.392 9.1 3 8 3C6.9 3 5.958 3.392 5.175 4.175C4.392 4.958 4 5.9 4 7V13Z" fill="currentColor"/>
    </svg>
);

const IconList = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconBox = () => (
    <svg width="28" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z" fill="currentColor"/>
    </svg>
);

const IconDoor = () => (
    <svg width="28" height="28" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 18V16H2V2C2 1.45 2.196 0.979 2.588 0.587C2.979 0.196 3.45 0 4 0H14C14.55 0 15.021 0.196 15.413 0.587C15.804 0.979 16 1.45 16 2V16H18V18H0ZM4 16H14V2H4V16ZM6 10C6.283 10 6.521 9.904 6.713 9.713C6.904 9.521 7 9.283 7 9C7 8.717 6.904 8.479 6.713 8.287C6.521 8.096 6.283 8 6 8C5.717 8 5.479 8.096 5.287 8.287C5.096 8.479 5 8.717 5 9C5 9.283 5.096 9.521 5.287 9.713C5.479 9.904 5.717 10 6 10Z" fill="currentColor"/>
    </svg>
);

export default function StudentDashboard() {
    const { userId, userFirstname, userLastname } = useAuth();
    const navigate = useNavigate();

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [resRes, notifUserRes, notifRes, resourcesRes] = await Promise.all([
                    axios.get(`${API_URL}/reservations`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/userNotifications`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/notifications`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/resources`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setReservations(resRes.data);
                setUserNotifications(notifUserRes.data.filter((n: UserNotification) => n.userId === userId));
                setNotifications(notifRes.data);
                setResources(resourcesRes.data);
            } catch (err) {
                console.error("Erreur dashboard :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId]);

    const upcomingReservations = reservations
        .filter(r => new Date(r.startDate) >= new Date() && r.status !== "CANCELLED")
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5);

    const unreadNotifications = userNotifications.filter(un => !un.isRead).slice(0, 5);

    const getNotificationMessage = (notificationId: number) =>
        notifications.find(n => n.id === notificationId)?.message || "—";

    const getResourceName = (id: number) =>
        resources.find(r => r.id === id)?.name || "—";

    const stats = [
        {
            label: "Réservations à venir",
            value: reservations.filter(r => new Date(r.startDate) >= new Date() && r.status === "APPROVED").length,
            icon: <IconCalendar />,
            color: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
            textColor: "text-green-700",
        },
        {
            label: "En attente de validation",
            value: reservations.filter(r => r.status === "PENDING").length,
            icon: <IconClock />,
            color: "bg-yellow-50 border-yellow-200",
            iconColor: "text-yellow-500",
            textColor: "text-yellow-700",
        },
        {
            label: "Notifications non lues",
            value: unreadNotifications.length,
            icon: <IconBell />,
            color: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-500",
            textColor: "text-blue-700",
        },
        {
            label: "Total réservations",
            value: reservations.length,
            icon: <IconList />,
            color: "bg-gray-50 border-gray-200",
            iconColor: "text-gray-400",
            textColor: "text-gray-700",
        },
    ];

    return (
        <StudentLayout titleHeader="Tableau de bord">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* WELCOME */}
                <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-semibold">
                        Bonjour, {userFirstname} {userLastname}
                    </h1>
                    <p className="text-gray-500 mt-1">Bienvenue sur votre espace étudiant Prêt&Go.</p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-white rounded-xl shadow-md p-5 border ${stat.color}`}>
                            <div className={`mb-3 ${stat.iconColor}`}>{stat.icon}</div>
                            <div className={`text-3xl font-bold ${stat.textColor}`}>{loading ? "…" : stat.value}</div>
                            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* PROCHAINES RESERVATIONS */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Prochaines réservations</h2>
                            <button onClick={() => navigate("/student/my-reservations")} className="text-sm dashboard-link-btn cursor-pointer">Voir tout →</button>
                        </div>
                        {loading ? (
                            <p className="text-gray-400 italic text-sm">Chargement…</p>
                        ) : upcomingReservations.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">Aucune réservation à venir.</p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingReservations.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <div>
                                            <p className="font-medium text-sm">{getResourceName(r.resourceId)}</p>
                                            <p className="text-xs text-gray-500">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[r.status]?.className}`}>
                                            {STATUS_LABELS[r.status]?.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Notifications récentes</h2>
                            <button onClick={() => navigate("/student/notifications")} className="text-sm dashboard-link-btn cursor-pointer">Voir tout →</button>
                        </div>
                        {loading ? (
                            <p className="text-gray-400 italic text-sm">Chargement…</p>
                        ) : unreadNotifications.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">Aucune nouvelle notification.</p>
                        ) : (
                            <div className="space-y-3">
                                {unreadNotifications.map(un => (
                                    <div key={un.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                        <div className="text-blue-500 mt-0.5 shrink-0"><IconBell /></div>
                                        <p className="text-sm text-gray-700">{getNotificationMessage(un.notificationId)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* RACCOURCIS */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: <IconBox />, label: "Réserver du matériel", sub: "Consulter et réserver les équipements disponibles", href: "/student/materiel-list" },
                        { icon: <IconDoor />, label: "Réserver une salle", sub: "Consulter et réserver les salles disponibles", href: "/student/room-list" },
                        { icon: <IconList />, label: "Mes réservations", sub: "Consulter l'historique de vos réservations", href: "/student/my-reservations" },
                    ].map(s => (
                        <button key={s.href} onClick={() => navigate(s.href)} className="dashboard-shortcut-btn text-white rounded-xl p-5 text-left transition cursor-pointer">
                            <div className="mb-3 opacity-90">{s.icon}</div>
                            <div className="font-semibold">{s.label}</div>
                            <div className="text-sm opacity-75 mt-1">{s.sub}</div>
                        </button>
                    ))}
                </div>

            </div>
        </StudentLayout>
    );
}
