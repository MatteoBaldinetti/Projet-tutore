import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Report, Resource, User } from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/ProfessorReports.css";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    OPEN:        { label: "Ouvert",    className: "bg-yellow-100 text-yellow-700" },
    IN_PROGRESS: { label: "En cours",  className: "bg-blue-100 text-blue-700" },
    RESOLVED:    { label: "Résolu",    className: "bg-green-100 text-green-700" },
};

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

export default function ProfessorReports() {
    const { userId } = useAuth();

    const [reports, setReports] = useState<Report[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [reportToView, setReportToView] = useState<Report | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [reportsRes, resourcesRes, usersRes] = await Promise.all([
                    axios.get(`${API_URL}/reports`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/resources`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/users`, { headers: { "x-api-key": API_KEY } }),
                ]);

                const mine: Resource[] = resourcesRes.data.filter((r: Resource) => r.manageById === userId);
                setResources(mine);
                const myIds = new Set(mine.map(r => r.id));

                const myReports: Report[] = reportsRes.data.filter(
                    (r: Report) => myIds.has(r.resourceId)
                ).sort((a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setReports(myReports);
                setUsers(usersRes.data);
            } catch (err) {
                console.error("Erreur signalements :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId]);

    const updateStatus = async (id: number, status: string) => {
        try {
            await axios.patch(`${API_URL}/reports/${id}`, { status }, {
                headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
            });
            setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            if (reportToView?.id === id) setReportToView(prev => prev ? { ...prev, status } : null);
        } catch (err) {
            console.error("Erreur mise à jour statut :", err);
        }
    };

    const getResourceName = (id: number) => resources.find(r => r.id === id)?.name || "—";
    const getUserName = (id: number) => {
        const u = users.find(u => u.id === id);
        return u ? `${u.firstName} ${u.lastName}` : "—";
    };

    const filtered = reports.filter(r =>
        statusFilter ? r.status === statusFilter : true
    );

    useEffect(() => {
        if (reportToView) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [reportToView]);

    return (
        <ProfessorLayout titleHeader="Signalements reçus">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(STATUS_LABELS).map(([key, { label, className }]) => (
                        <div key={key} className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
                            <div className={`text-2xl font-bold ${className.split(" ")[1]}`}>
                                {reports.filter(r => r.status === key).length}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6 gap-3">
                        <h1 className="text-3xl font-semibold">Signalements reçus</h1>
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
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400 italic py-10">Chargement…</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-10">Aucun signalement trouvé.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-1/3">Description</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Ressource</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Signalé par</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Statut</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left">Date</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(r => (
                                        <tr key={r.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9] max-w-xs truncate">{r.description}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{getResourceName(r.resourceId)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{getUserName(r.reportedById)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[r.status]?.className}`}>
                                                    {STATUS_LABELS[r.status]?.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(r.createdAt)}</td>
                                            <td className="px-4 py-3 text-center border-b border-[#F1F5F9]">
                                                <button onClick={() => setReportToView(r)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="currentColor"/>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* POP-UP DÉTAIL */}
                {reportToView && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">Détail du signalement</h2>
                            <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                                <div><span className="font-medium">Ressource :</span> {getResourceName(reportToView.resourceId)}</div>
                                <div><span className="font-medium">Signalé par :</span> {getUserName(reportToView.reportedById)}</div>
                                <div><span className="font-medium">Date :</span> {formatDate(reportToView.createdAt)}</div>
                                <div><span className="font-medium">Description :</span> {reportToView.description}</div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">Statut :</span>
                                    <select
                                        value={reportToView.status}
                                        onChange={e => updateStatus(reportToView.id, e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] text-sm"
                                    >
                                        {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => setReportToView(null)} className="px-4 py-2 cancel-prof-btn rounded transition cursor-pointer">Fermer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProfessorLayout>
    );
}
