import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Resource } from "../../../types/types";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/StudentReport.css";

const IconWarning = () => (
    <svg width="28" height="28" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 16L9 0L18 16H0ZM2.45 14H15.55L9 2.9L2.45 14ZM9 13C9.283 13 9.521 12.904 9.713 12.713C9.904 12.521 10 12.283 10 12C10 11.717 9.904 11.479 9.713 11.287C9.521 11.096 9.283 11 9 11C8.717 11 8.479 11.096 8.287 11.287C8.096 11.479 8 11.717 8 12C8 12.283 8.096 12.521 8.287 12.713C8.479 12.904 8.717 13 9 13ZM8 10H10V7H8V10Z" fill="currentColor"/>
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function StudentReport() {
    const { userId } = useAuth();

    const [resourceList, setResourceList] = useState<Resource[]>([]);
    const [resourceId, setResourceId] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await axios.get(`${API_URL}/resources`, { headers: { "x-api-key": API_KEY } });
                setResourceList(res.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des ressources :", err);
            }
        };
        fetchResources();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!resourceId) { setErrorMessage("Veuillez sélectionner une ressource."); return; }
        if (!description.trim()) { setErrorMessage("Veuillez décrire le problème."); return; }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/reports`, {
                description,
                resourceId,
                reportedById: userId,
                status: "OPEN",
                createdAt: new Date().toISOString(),
            }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });

            setSuccessMessage("Signalement envoyé avec succès. L'équipe va traiter votre demande.");
            setResourceId("");
            setDescription("");
        } catch (err) {
            console.error("Erreur lors du signalement :", err);
            setErrorMessage("Une erreur est survenue lors de l'envoi du signalement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <StudentLayout titleHeader="Signaler un problème">
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">

                    {/* EN-TÊTE */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="report-icon-wrapper w-12 h-12 rounded-full flex items-center justify-center text-orange-500">
                            <IconWarning />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">Signaler un problème</h1>
                            <p className="text-gray-500 text-sm">Décrivez le problème rencontré sur une ressource.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* RESSOURCE */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Ressource concernée <span className="text-red-500">*</span></label>
                            <select
                                value={resourceId}
                                onChange={e => setResourceId(e.target.value ? Number(e.target.value) : "")}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            >
                                <option value="">— Sélectionner une ressource —</option>
                                {resourceList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Description du problème <span className="text-red-500">*</span></label>
                            <textarea
                                rows={6}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Décrivez le problème en détail : nature du défaut, circonstances, etc."
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] resize-none"
                            />
                        </div>

                        {/* MESSAGES */}
                        {errorMessage && (
                            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{errorMessage}</p>
                        )}
                        {successMessage && (
                            <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded px-3 py-2">
                                <IconCheck />
                                {successMessage}
                            </div>
                        )}

                        {/* BOUTON */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-report-btn text-white px-6 py-2 rounded transition cursor-pointer disabled:opacity-60"
                            >
                                {loading ? "Envoi en cours…" : "Envoyer le signalement"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </StudentLayout>
    );
}
