import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Reservation, Resource, ReservationGroupStudent } from "../../../types/types";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/MyReservations.css";

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

export default function MyReservations() {
    const { userId } = useAuth();

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    //const [groups, setGroups] = useState<ReservationGroup[]>([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);
    const [reservationToView, setReservationToView] = useState<Reservation | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [resRes, resourcesRes, groupStudentsRes] = await Promise.all([
                    axios.get(`${API_URL}/reservations`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/resources`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservationGroupStudents`, { headers: { "x-api-key": API_KEY } }),
                ]);

                // Filtrer les groupes dont l'étudiant fait partie
                const myGroupStudents: ReservationGroupStudent[] = groupStudentsRes.data.filter(
                    (gs: ReservationGroupStudent) => gs.studentId === userId
                );
                const myGroupIds = new Set(myGroupStudents.map(gs => gs.reservationGroupId));

                // Filtrer les réservations associées à ces groupes
                const myReservations = resRes.data.filter((r: Reservation) => myGroupIds.has(r.reservedById));

                setReservations(myReservations);
                setResources(resourcesRes.data);
                //setGroups(groupsRes.data);
            } catch (err) {
                console.error("Erreur lors de la récupération :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId]);

    const filteredReservations = reservations.filter(r => {
        const resource = resources.find(res => res.id === r.resourceId);
        const matchSearch = resource?.name.toLowerCase().includes(search.toLowerCase()) || false;
        const matchStatus = statusFilter ? r.status === statusFilter : true;
        return (search ? matchSearch : true) && matchStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const cancelReservation = async (id: number) => {
        try {
            await axios.patch(`${API_URL}/reservations/${id}`, { status: "CANCELLED" }, {
                headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
            });
            setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "CANCELLED" } : r));
            setReservationToCancel(null);
        } catch (err) {
            console.error("Erreur lors de l'annulation :", err);
        }
    };

    const getResourceName = (id: number) => resources.find(r => r.id === id)?.name || "—";

    useEffect(() => {
        if (reservationToCancel !== null || reservationToView !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [reservationToCancel, reservationToView]);

    const upcoming = reservations.filter(r => new Date(r.startDate) >= new Date() && r.status === "APPROVED").length;
    const pending = reservations.filter(r => r.status === "PENDING").length;
    const total = reservations.length;

    return (
        <StudentLayout titleHeader="Mes réservations">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "À venir", value: upcoming, color: "text-green-700", bg: "bg-green-50 border-green-200" },
                        { label: "En attente", value: pending, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
                        { label: "Total", value: total, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
                    ].map(s => (
                        <div key={s.label} className={`bg-white rounded-xl shadow-md p-5 border ${s.bg}`}>
                            <div className={`text-3xl font-bold ${s.color}`}>{loading ? "…" : s.value}</div>
                            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* LISTE */}
                <div className="w-full bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                        <h1 className="text-3xl font-semibold whitespace-nowrap">Mes réservations</h1>
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
                    ) : filteredReservations.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-10">Aucune réservation trouvée.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Ressource</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Du</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Au</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Statut</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReservations.map(r => (
                                        <tr key={r.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9] font-medium">{getResourceName(r.resourceId)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(r.startDate)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(r.endDate)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[r.status]?.className}`}>
                                                    {STATUS_LABELS[r.status]?.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center border-b border-[#F1F5F9]">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button onClick={() => setReservationToView(r)} className="cursor-pointer">
                                                        <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" viewBox="0 0 24 24" fill="none">
                                                            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                    {(r.status === "PENDING" || r.status === "APPROVED") && (
                                                        <button onClick={() => setReservationToCancel(r.id)} className="cursor-pointer">
                                                            <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" viewBox="0 0 24 24" fill="none">
                                                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                                                            </svg>
                                                        </button>
                                                    )}
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
                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div><span className="font-medium">Ressource :</span> {getResourceName(reservationToView.resourceId)}</div>
                                <div><span className="font-medium">Du :</span> {formatDate(reservationToView.startDate)}</div>
                                <div><span className="font-medium">Au :</span> {formatDate(reservationToView.endDate)}</div>
                                <div><span className="font-medium">Statut :</span> {STATUS_LABELS[reservationToView.status]?.label}</div>
                                <div><span className="font-medium">Créée le :</span> {formatDate(reservationToView.createdAt)}</div>
                                {reservationToView.validationDate && (
                                    <div><span className="font-medium">Validée le :</span> {formatDate(reservationToView.validationDate)}</div>
                                )}
                            </div>
                            <div className="flex justify-end mt-6">
                                <button onClick={() => setReservationToView(null)} className="px-4 py-2 cancel-myreservation-btn rounded transition cursor-pointer">Fermer</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* POP-UP ANNULATION */}
                {reservationToCancel !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Confirmer l'annulation</h2>
                            <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
                            <div className="flex justify-end gap-4 mt-6">
                                <button onClick={() => setReservationToCancel(null)} className="px-4 py-2 rounded cancel-myreservation-btn transition cursor-pointer">Retour</button>
                                <button onClick={() => cancelReservation(reservationToCancel)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer">Annuler la réservation</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </StudentLayout>
    );
}
