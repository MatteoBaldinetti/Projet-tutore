import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type { Resource } from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/ProfessorResources.css";

type ResourceType = "items" | "classrooms";

const IconBox = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-[#3A8C85] opacity-40">
        <path d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z" fill="currentColor"/>
    </svg>
);

const IconDoor = () => (
    <svg width="18" height="18" viewBox="0 0 16 18" fill="none" className="w-5 h-5 shrink-0 text-[#3A8C85] opacity-40">
        <path d="M0 18V16H2V2C2 1.45 2.196 0.979 2.588 0.587C2.979 0.196 3.45 0 4 0H14C14.55 0 15.021 0.196 15.413 0.587C15.804 0.979 16 1.45 16 2V16H18V18H0ZM4 16H14V2H4V16ZM6 10C6.283 10 6.521 9.904 6.713 9.713C6.904 9.521 7 9.283 7 9C7 8.717 6.904 8.479 6.713 8.287C6.521 8.096 6.283 8 6 8C5.717 8 5.479 8.096 5.287 8.287C5.096 8.479 5 8.717 5 9C5 9.283 5.096 9.521 5.287 9.713C5.479 9.904 5.717 10 6 10Z" fill="currentColor"/>
    </svg>
);

export default function ProfessorResources({ type = "items" }: { type?: ResourceType }) {
    const { userId } = useAuth();

    const [resources, setResources] = useState<Resource[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const isItems = type === "items";
    const endpoint = isItems ? "/items" : "/classrooms";
    const title = isItems ? "Mes matériels" : "Mes salles";
    const titleHeader = isItems ? "Mes matériels" : "Mes salles";

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await axios.get(`${API_URL}${endpoint}`, {
                    headers: { "x-api-key": API_KEY },
                });
                const mine: Resource[] = res.data.filter((r: Resource) => userId !== null && r.managedByIds?.includes(userId));
                setResources(mine);
            } catch (err) {
                console.error("Erreur ressources :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [userId, type]);

    const toggleAvailability = async (resource: Resource) => {
        try {
            await axios.patch(
                `${API_URL}${endpoint}/${resource.id}`,
                { available: !resource.available },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            setResources(prev =>
                prev.map(r => r.id === resource.id ? { ...r, available: !r.available } : r)
            );
        } catch (err) {
            console.error("Erreur toggle disponibilité :", err);
        }
    };

    const filtered = resources.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
    );

    const available = resources.filter(r => r.available).length;
    const unavailable = resources.filter(r => !r.available).length;

    return (
        <ProfessorLayout titleHeader={titleHeader}>
            <div className="min-h-screen bg-gray-100 p-6">

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Total", value: resources.length, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
                        { label: "Disponibles", value: available, color: "text-green-700", bg: "bg-green-50 border-green-200" },
                        { label: "Indisponibles", value: unavailable, color: "text-red-700", bg: "bg-red-50 border-red-200" },
                    ].map(s => (
                        <div key={s.label} className={`bg-white rounded-xl shadow-md p-5 border ${s.bg}`}>
                            <div className={`text-3xl font-bold ${s.color}`}>{loading ? "…" : s.value}</div>
                            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6 gap-3">
                        <h1 className="text-3xl font-semibold whitespace-nowrap">{title}</h1>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                        />
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400 italic py-10">Chargement…</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-10">Aucune ressource trouvée.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map(r => (
                                <div key={r.id} className="border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col">
                                    {/* PLACEHOLDER */}
                                    <div className="h-32 bg-linear-to-br from-[#E8F4F3] to-[#c8e8e6] flex items-center justify-center">
                                        {isItems ? <IconBox /> : <IconDoor />}
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold">{r.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${r.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {r.available ? "Disponible" : "Indisponible"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 flex-1 line-clamp-2 mb-4">{r.description}</p>

                                        <button
                                            onClick={() => toggleAvailability(r)}
                                            className={`w-full py-2 rounded text-sm font-medium transition cursor-pointer ${
                                                r.available
                                                    ? "mark-unavailable-btn"
                                                    : "mark-available-btn text-white"
                                            }`}
                                        >
                                            {r.available ? "Marquer indisponible" : "Marquer disponible"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProfessorLayout>
    );
}
