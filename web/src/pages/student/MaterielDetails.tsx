import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Item, ItemType } from "../../../types/types";
import StudentLayout from "../../components/StudentLayout";
import ReservationCalendar from "../../components/ReservationCalendar";

export default function MaterielDetails() {
    const { itemTypeId } = useParams();
    const navigate = useNavigate();

    const [itemType, setItemType] = useState<ItemType | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [activeTab, setActiveTab] = useState<"description" | "calendar">("description");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!itemTypeId) return;
            try {
                const [typeRes, itemsRes] = await Promise.all([
                    axios.get(`${API_URL}/itemTypes/${itemTypeId}`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/items`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setItemType(typeRes.data);
                const filtered: Item[] = itemsRes.data.filter(
                    (item: Item) => item.itemTypeId === Number(itemTypeId)
                );
                setItems(filtered);
            } catch (err) {
                console.error("Erreur lors de la récupération du matériel :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [itemTypeId]);

    const availableItems = items.filter(item => item.available);

    if (loading) {
        return (
            <StudentLayout titleHeader="Détails du matériel">
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <p className="text-gray-500 italic">Chargement…</p>
                </div>
            </StudentLayout>
        );
    }

    if (!itemType) {
        return (
            <StudentLayout titleHeader="Détails du matériel">
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <p className="text-gray-500 italic">Matériel introuvable.</p>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout titleHeader="Détails du matériel">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* BOUTON RETOUR */}
                <button
                    onClick={() => navigate("/student/materiel-list")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3A8C85] transition mb-4 cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="currentColor" />
                    </svg>
                    Retour au catalogue
                </button>

                {/* HEADER */}
                <div className="flex gap-6 mb-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-center" style={{ flex: 6, minWidth: 0, minHeight: "220px" }}>
                        <div className="w-full h-52 bg-gradient-to-br from-[#E8F4F3] to-[#3A8C8520] rounded-xl flex items-center justify-center">
                            <span className="text-8xl">📦</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between" style={{ flex: 4 }}>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-800">{itemType.name}</h1>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${availableItems.length > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {availableItems.length > 0 ? "Disponible" : "Indisponible"}
                                </span>
                            </div>
                            <p className="text-gray-500 mb-4">{availableItems.length} / {items.length} disponibles</p>
                        </div>

                        {availableItems.length > 0 && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => navigate(`/student/materiel-reservation/${availableItems[0].id}`)}
                                    className="bg-[#3A8C85] hover:bg-[#2d6e68] text-white px-5 py-2 rounded transition cursor-pointer font-medium"
                                >
                                    Réserver ce matériel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ONGLETS */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${activeTab === "description" ? "border-b-2 text-[#3A8C85] border-[#3A8C85]" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setActiveTab("description")}
                        >
                            Description
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${activeTab === "calendar" ? "border-b-2 text-[#3A8C85] border-[#3A8C85]" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setActiveTab("calendar")}
                        >
                            Disponibilités
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === "description" && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3 text-[#3A8C85]">Équipements disponibles</h2>
                                {items.length === 0 ? (
                                    <p className="text-gray-500 italic">Aucun équipement dans cette catégorie.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.description}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                    {item.available ? "Disponible" : "Indisponible"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "calendar" && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3 text-[#3A8C85]">Calendrier des disponibilités</h2>
                                <ReservationCalendar />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </StudentLayout>
    );
}
