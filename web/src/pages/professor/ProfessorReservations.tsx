import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Reservation, Resource, ReservationGroup } from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/ProfessorReservations.css";

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

export default function ProfessorReservations() {
    const { userId } = useAuth();

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [groups, setGroups] = useState<ReservationGroup[]>([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const [reservationToView, setReservationToView] = useState<Reservation | null>(null);

    const fetchAll = async () => {
        try {
            const [resourcesRes, reservationsRes, groupsRes] = await Promise.all([
                axios.get(`${API_URL}/resources`, { headers: { "x-api-key": API_KEY } }),
                axios.get(`${API_URL}/reservations`, { headers: { "x-api-key": API_KEY } }),
                axios.get(`${API_URL}/reservationGroups`, { headers: { "x-api-key": API_KEY } }),
            ]);

            const mine: Resource[] = resourcesRes.data.filter((r: Resource) => userId !== null && r.managedByIds?.includes(userId));
            setResources(mine);

            const myIds = new Set(mine.map(r => r.id));
            const myReservations: Reservation[] = reservationsRes.data.filter(
                (r: Reservation) => myIds.has(r.resourceId)
            );
            setReservations(myReservations);
            setGroups(groupsRes.data);
        } catch (err) {
            console.error("Erreur réservations prof :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [userId]);

    const updateStatus = async (id: number, status: string) => {
        try {
            await axios.patch(
                `${API_URL}/reservations/${id}`,
                { status, validationDate: status === "APPROVED" ? new Date().toISOString() : null },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            setReservations(prev => prev.map(r =>
                r.id === id ? { ...r, status, validationDate: status === "APPROVED" ? new Date().toISOString() : r.validationDate } : r
            ));
            if (reservationToView?.id === id) {
                setReservationToView(prev => prev ? { ...prev, status } : null);
            }
        } catch (err) {
            console.error("Erreur mise à jour statut :", err);
        }
    };

    const getResourceName = (id: number) => resources.find(r => r.id === id)?.name || "—";
    const getGroupName = (id: number) => groups.find(g => g.id === id)?.name || "—";

    const filtered = reservations
        .filter(r => {
            const name = getResourceName(r.resourceId).toLowerCase();
            const matchSearch = search ? name.includes(search.toLowerCase()) : true;
            const matchStatus = statusFilter ? r.status === statusFilter : true;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    useEffect(() => {
        if (reservationToView) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [reservationToView]);

    return (
        <ProfessorLayout titleHeader="Toutes les réservations">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* STATS RAPIDES */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {Object.entries(STATUS_LABELS).map(([key, { label, className }]) => (
                        <div key={key} className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
                            <div className={`text-2xl font-bold ${className.split(" ")[1]}`}>
                                {reservations.filter(r => r.status === key).length}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                        <h1 className="text-3xl font-semibold whitespace-nowrap">Réservations</h1>
                        <div className="flex items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            >
                                <option value="">Tous les statuts</option>
                                {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Rechercher une ressource..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400 italic py-10">Chargement…</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-10">Aucune réservation trouvée.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Ressource</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Groupe</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Du</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Au</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Statut</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(r => (
                                        <tr key={r.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9] font-medium">{getResourceName(r.resourceId)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{getGroupName(r.reservedById)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(r.startDate)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(r.endDate)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[r.status]?.className}`}>
                                                    {STATUS_LABELS[r.status]?.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center border-b border-[#F1F5F9]">
                                                <div className="flex justify-center items-center gap-2">
                                                    {r.status === "PENDING" && (
                                                        <>
                                                            <button onClick={() => updateStatus(r.id, "APPROVED")} className="approve-btn text-white text-xs px-3 py-1 rounded transition cursor-pointer">Approuver</button>
                                                            <button onClick={() => updateStatus(r.id, "REJECTED")} className="reject-btn text-white text-xs px-3 py-1 rounded transition cursor-pointer">Refuser</button>
                                                        </>
                                                    )}
                                                    <button onClick={() => setReservationToView(r)} className="cursor-pointer">
                                                        <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" viewBox="0 0 24 24" fill="none">
                                                            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="currentColor"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* POP-UP DÉTAIL */}
                {reservationToView && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Détail de la réservation</h2>
                            <div className="grid grid-cols-1 gap-3 text-sm mb-5">
                                <div><span className="font-medium">Ressource :</span> {getResourceName(reservationToView.resourceId)}</div>
                                <div><span className="font-medium">Groupe :</span> {getGroupName(reservationToView.reservedById)}</div>
                                <div><span className="font-medium">Du :</span> {formatDate(reservationToView.startDate)}</div>
                                <div><span className="font-medium">Au :</span> {formatDate(reservationToView.endDate)}</div>
                                <div><span className="font-medium">Créée le :</span> {formatDate(reservationToView.createdAt)}</div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">Statut :</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[reservationToView.status]?.className}`}>
                                        {STATUS_LABELS[reservationToView.status]?.label}
                                    </span>
                                </div>
                            </div>
                            {reservationToView.status === "PENDING" && (
                                <div className="flex gap-3 mb-4">
                                    <button onClick={() => updateStatus(reservationToView.id, "APPROVED")} className="flex-1 approve-btn text-white py-2 rounded transition cursor-pointer">Approuver</button>
                                    <button onClick={() => updateStatus(reservationToView.id, "REJECTED")} className="flex-1 reject-btn text-white py-2 rounded transition cursor-pointer">Refuser</button>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button onClick={() => setReservationToView(null)} className="px-4 py-2 cancel-prof-btn rounded transition cursor-pointer">Fermer</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </ProfessorLayout>
    );
}
