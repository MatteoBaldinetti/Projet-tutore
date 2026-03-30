import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Report, Resource, User } from "../../../types/types";
import "../../styles/ManageReports.css";
import Layout from "../../components/Layout";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    OPEN:        { label: "Ouvert",       className: "bg-yellow-100 text-yellow-700" },
    IN_PROGRESS: { label: "En cours",     className: "bg-blue-100 text-blue-700" },
    RESOLVED:    { label: "Résolu",       className: "bg-green-100 text-green-700" },
};

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

export default function ManageReports() {
    const [reportList, setReportList] = useState<Report[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [resourceList, setResourceList] = useState<Resource[]>([]);
    const [userList, setUserList] = useState<User[]>([]);

    const [reportToDelete, setReportToDelete] = useState<number | null>(null);
    const [reportToView, setReportToView] = useState<Report | null>(null);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports`, {
                headers: { "x-api-key": API_KEY },
            });
            setReportList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des signalements :", err);
        }
    };

    const fetchResources = async () => {
        try {
            const res = await axios.get(`${API_URL}/resources`, {
                headers: { "x-api-key": API_KEY },
            });
            setResourceList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des ressources :", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`, {
                headers: { "x-api-key": API_KEY },
            });
            setUserList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs :", err);
        }
    };

    useEffect(() => {
        fetchReports();
        fetchResources();
        fetchUsers();
    }, []);

    const filteredReports = reportList.filter((r) => {
        const resource = resourceList.find((res) => res.id === r.resourceId);
        const value = search.toLowerCase();
        const matchSearch =
            r.description.toLowerCase().includes(value) ||
            resource?.name.toLowerCase().includes(value);
        const matchStatus = statusFilter ? r.status === statusFilter : true;
        return matchSearch && matchStatus;
    });

    const updateStatus = async (id: number, status: string) => {
        try {
            await axios.patch(
                `${API_URL}/reports/${id}`,
                { status },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            await fetchReports();
            if (reportToView?.id === id) {
                setReportToView((prev) => prev ? { ...prev, status } : null);
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut :", err);
        }
    };

    const deleteReport = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/reports/${id}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchReports();
            setReportToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression du signalement :", err);
        }
    };

    const getResourceName = (id: number) => resourceList.find((r) => r.id === id)?.name || "—";
    const getUserName = (id: number) => {
        const user = userList.find((u) => u.id === id);
        return user ? `${user.firstName} ${user.lastName}` : "—";
    };

    useEffect(() => {
        if (reportToDelete !== null || reportToView !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [reportToDelete, reportToView]);

    return (
        <Layout
            titleHeader="Gestion des signalements"
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                        <div className="flex justify-between items-center mb-6 gap-4">
                            <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                                Liste des signalements
                            </h1>
                            <div className="flex items-center gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                >
                                    <option value="">Tous les statuts</option>
                                    {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                                />
                            </div>
                        </div>

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
                                    {filteredReports.map((report) => (
                                        <tr key={report.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9] max-w-xs truncate">{report.description}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{getResourceName(report.resourceId)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{getUserName(report.reportedById)}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[report.status]?.className || ""}`}>
                                                    {STATUS_LABELS[report.status]?.label || report.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{formatDate(report.createdAt)}</td>
                                            <td className="px-4 py-3 text-center border-b border-[#F1F5F9]">
                                                <div className="flex justify-center items-center gap-3">
                                                    <button onClick={() => setReportToView(report)} className="cursor-pointer">
                                                        <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5ZM12 9.5C10.34 9.5 9 10.84 9 12.5C9 14.16 10.34 15.5 12 15.5C13.66 15.5 15 14.16 15 12.5C15 10.84 13.66 9.5 12 9.5Z" fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => setReportToDelete(report.id)} className="cursor-pointer">
                                                        <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3.00023 18C2.45023 18 1.9794 17.8042 1.58773 17.4125C1.19607 17.0208 1.00023 16.55 1.00023 16V3H0.000234494V1H5.00023V0H11.0002V1H16.0002V3H15.0002V16C15.0002 16.55 14.8044 17.0208 14.4127 17.4125C14.0211 17.8042 13.5502 18 13.0002 18H3.00023ZM13.0002 3H3.00023V16H13.0002V3ZM5.00023 14H7.00023V5H5.00023V14ZM9.00023 14H11.0002V5H9.00023V14ZM3.00023 3V16V3Z" fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500 italic">Aucun signalement trouvé</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pop-up détail */}
                        {reportToView !== null && (
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
                                                onChange={(e) => updateStatus(reportToView.id, e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] text-sm"
                                            >
                                                {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button onClick={() => setReportToView(null)} className="px-4 py-2 cancel-delete-report-btn rounded transition cursor-pointer">Fermer</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pop-up suppression */}
                        {reportToDelete !== null && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                                    <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                                    <p>Êtes-vous sûr de vouloir supprimer ce signalement ?</p>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button onClick={() => setReportToDelete(null)} className="px-4 py-2 rounded cancel-delete-report-btn transition cursor-pointer">Annuler</button>
                                        <button onClick={() => reportToDelete && deleteReport(reportToDelete)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            } />
    );
}
