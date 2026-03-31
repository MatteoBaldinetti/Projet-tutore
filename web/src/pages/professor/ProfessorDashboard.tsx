import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Reservation, Resource, UserNotification } from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/ProfessorDashboard.css";

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

const IconCalendar = () => (
    <svg width="22" height="22" viewBox="0 0 18 20" fill="none"><path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="currentColor"/></svg>
);
const IconClock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 6V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconBox = () => (
    <svg width="22" height="22" viewBox="0 0 18 18" fill="none"><path d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z" fill="currentColor"/></svg>
);
const IconBell = () => (
    <svg width="22" height="22" viewBox="0 0 16 18" fill="none"><path d="M0 15V13H2V7C2 5.617 2.417 4.387 3.25 3.312C4.083 2.238 5.167 1.533 6.5 1.2V0.5C6.5 0.217 6.788 0 7.5 0H8.5C9.213 0 9.5 0.217 9.5 0.5V1.2C10.833 1.533 11.917 2.238 12.75 3.312C13.583 4.387 14 5.617 14 7V13H16V15H0ZM8 18C7.45 18 6.979 17.804 6.588 17.413C6.196 17.021 6 16.55 6 16H10C10 16.55 9.804 17.021 9.413 17.413C9.021 17.804 8.55 18 8 18ZM4 13H12V7C12 5.9 11.608 4.958 10.825 4.175C10.042 3.392 9.1 3 8 3C6.9 3 5.958 3.392 5.175 4.175C4.392 4.958 4 5.9 4 7V13Z" fill="currentColor"/></svg>
);

export default function ProfessorDashboard() {
    const { userId, userFirstname, userLastname } = useAuth();
    const navigate = useNavigate();

    const [myResources, setMyResources] = useState<Resource[]>([]);
    const [allReservations, setAllReservations] = useState<Reservation[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [resourcesRes, reservationsRes, userNotifRes] = await Promise.all([
                    axios.get(`${API_URL}/resources`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservations`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/userNotifications`, { headers: { "x-api-key": API_KEY } }),
                ]);

                // Ressources gérées par ce prof
                const mine: Resource[] = resourcesRes.data.filter(
                    (r: Resource) => userId !== null && r.managedByIds?.includes(userId)
                );
                setMyResources(mine);

                const myResourceIds = new Set(mine.map(r => r.id));

                // Réservations sur ses ressources
                const myReservations: Reservation[] = reservationsRes.data.filter(
                    (r: Reservation) => myResourceIds.has(r.ressourceId)
                );
                setAllReservations(myReservations);

                // Notifications non lues
                const unread = userNotifRes.data.filter(
                    (un: UserNotification) => un.userId === userId && !un.isRead
                ).length;
                setUnreadCount(unread);
            } catch (err) {
                console.error("Erreur dashboard prof :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId]);

    const pendingReservations = allReservations
        .filter(r => r.status === "PENDING")
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(0, 5);

    const stats = [
        {
            label: "En attente de validation",
            value: allReservations.filter(r => r.status === "PENDING").length,
            icon: <IconClock />,
            color: "bg-yellow-50 border-yellow-200",
            iconColor: "text-yellow-500",
            textColor: "text-yellow-700",
        },
        {
            label: "Réservations approuvées",
            value: allReservations.filter(r => r.status === "APPROVED").length,
            icon: <IconCalendar />,
            color: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
            textColor: "text-green-700",
        },
        {
            label: "Ressources gérées",
            value: myResources.length,
            icon: <IconBox />,
            color: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-500",
            textColor: "text-blue-700",
        },
        {
            label: "Notifications non lues",
            value: unreadCount,
            icon: <IconBell />,
            color: "bg-gray-50 border-gray-200",
            iconColor: "text-gray-400",
            textColor: "text-gray-700",
        },
    ];

    const getResourceName = (id: number) =>
        myResources.find(r => r.id === id)?.name || "—";

    return (
        <ProfessorLayout titleHeader="Tableau de bord">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* WELCOME */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-semibold">Bonjour, {userFirstname} {userLastname}</h1>
                    <p className="text-gray-500 mt-1">Bienvenue sur votre espace professeur Prêt&Go.</p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map(s => (
                        <div key={s.label} className={`bg-white rounded-xl shadow-md p-5 border ${s.color}`}>
                            <div className={`mb-3 ${s.iconColor}`}>{s.icon}</div>
                            <div className={`text-3xl font-bold ${s.textColor}`}>{loading ? "…" : s.value}</div>
                            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* RÉSERVATIONS EN ATTENTE */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Réservations à valider</h2>
                            <button
                                onClick={() => navigate("/professor/reservations/pending")}
                                className="text-sm prof-link-btn cursor-pointer"
                            >
                                Voir tout →
                            </button>
                        </div>
                        {loading ? (
                            <p className="text-gray-400 italic text-sm">Chargement…</p>
                        ) : pendingReservations.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-green-500 mb-2 flex justify-center">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <p className="text-gray-400 italic text-sm">Aucune réservation en attente.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingReservations.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                                        <div>
                                            <p className="font-medium text-sm">{getResourceName(r.ressourceId)}</p>
                                            <p className="text-xs text-gray-500">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate("/professor/reservations/pending")}
                                            className="text-xs prof-validate-btn text-white px-3 py-1 rounded transition cursor-pointer"
                                        >
                                            Traiter
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MES RESSOURCES */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Mes ressources</h2>
                            <button
                                onClick={() => navigate("/professor/resources/items")}
                                className="text-sm prof-link-btn cursor-pointer"
                            >
                                Voir tout →
                            </button>
                        </div>
                        {loading ? (
                            <p className="text-gray-400 italic text-sm">Chargement…</p>
                        ) : myResources.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">Aucune ressource assignée.</p>
                        ) : (
                            <div className="space-y-2">
                                {myResources.slice(0, 6).map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <p className="text-sm font-medium">{r.name}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {r.available ? "Disponible" : "Indisponible"}
                                        </span>
                                    </div>
                                ))}
                                {myResources.length > 6 && (
                                    <p className="text-xs text-gray-400 text-center pt-1">+{myResources.length - 6} autres</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RACCOURCIS */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: <IconClock />, label: "Valider les réservations", sub: "Approuver ou refuser les demandes en attente", href: "/professor/reservations/pending" },
                        { icon: <IconCalendar />, label: "Toutes les réservations", sub: "Historique complet des réservations", href: "/professor/reservations" },
                        { icon: <IconBox />, label: "Mes ressources", sub: "Gérer mes matériels et salles", href: "/professor/resources/items" },
                    ].map(s => (
                        <button key={s.href} onClick={() => navigate(s.href)} className="prof-shortcut-btn text-white rounded-xl p-5 text-left transition cursor-pointer">
                            <div className="mb-3 opacity-90">{s.icon}</div>
                            <div className="font-semibold">{s.label}</div>
                            <div className="text-sm opacity-75 mt-1">{s.sub}</div>
                        </button>
                    ))}
                </div>

            </div>
        </ProfessorLayout>
    );
}
