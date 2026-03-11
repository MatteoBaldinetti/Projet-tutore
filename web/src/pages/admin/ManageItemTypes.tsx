import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { ItemType, Professor } from "../../types/types";
import "../../styles/ManageItemTypes.css";
import Layout from "../../components/Layout";

export default function ManageItemTypes() {
    const [itemTypeList, setItemTypeList] = useState<ItemType[]>([]);
    const [search, setSearch] = useState("");

    const [showAddItemType, setShowAddItemType] = useState<boolean>(false);
    const [editingItemType, setEditingItemType] = useState<ItemType | null>(null);

    const [name, setName] = useState("");
    const [professorList, setProfessorList] = useState<Professor[]>([]);
    const [createdById, setCreatedById] = useState<number | "">("");

    const [itemTypeToDelete, setItemTypeToDelete] = useState<number | null>(null);

    const fetchItemTypes = async () => {
        try {
            const res = await axios.get(`${API_URL}/itemTypes`, {
                headers: { "x-api-key": API_KEY },
            });
            setItemTypeList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des types de matériel :", err);
        }
    };

    const fetchProfessors = async () => {
        try {
            const res = await axios.get(`${API_URL}/professors`, {
                headers: { "x-api-key": API_KEY },
            });
            setProfessorList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des professeurs :", err);
        }
    };

    useEffect(() => {
        fetchItemTypes();
        fetchProfessors();
    }, []);

    const filteredItemTypes = itemTypeList.filter((it) =>
        it.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddItemTypeButtonPress = () => {
        setEditingItemType(null);
        setName("");
        setCreatedById("");
        setShowAddItemType(true);
    };

    const handleEditItemTypeButtonPress = (itemType: ItemType) => {
        setEditingItemType(itemType);
        setName(itemType.name);
        setCreatedById(Number(itemType.createdById) || "");
        setShowAddItemType(true);
    };

    const addOrUpdateItemType = async () => {
        try {
            const payload = {
                name,
                createdById: createdById || null,
                createdAt: editingItemType ? editingItemType.createdAt : new Date().toISOString(),
            };

            if (editingItemType) {
                await axios.put(`${API_URL}/itemTypes/${editingItemType.id}`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            } else {
                await axios.post(`${API_URL}/itemTypes`, payload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            }

            await fetchItemTypes();
            setShowAddItemType(false);
            setEditingItemType(null);
            setName("");
            setCreatedById("");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du type de matériel :", err);
        }
    };

    const deleteItemType = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/itemTypes/${id}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchItemTypes();
            setItemTypeToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression du type de matériel :", err);
        }
    };

    const getProfessorName = (id: string | number) => {
        const prof = professorList.find((p) => p.id === Number(id));
        return prof ? `${prof.firstName} ${prof.lastName}` : "—";
    };

    useEffect(() => {
        if (showAddItemType || itemTypeToDelete !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showAddItemType, itemTypeToDelete]);

    return (
        <Layout
            titleHeader="Gestion des types de matériel"
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                        <div className="flex justify-between items-center mb-6 gap-4">
                            <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                                Liste des types de matériel
                            </h1>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                                />
                                <button onClick={handleAddItemTypeButtonPress} className="add-itemtype-btn text-white px-4 py-2 rounded transition cursor-pointer whitespace-nowrap">
                                    + Ajouter un type
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-md">
                                <thead className="bg-[#E8F4F3] border border-[#E8F4F3]">
                                    <tr>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-2/4">Nom</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-left w-2/4">Créé par</th>
                                        <th className="text-[#3A8C85] px-4 py-4 font-normal uppercase text-center w-1/4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItemTypes.map((itemType) => (
                                        <tr key={itemType.id}>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{itemType.name}</td>
                                            <td className="px-4 py-3 text-left border-b border-[#F1F5F9]">{getProfessorName(itemType.createdById)}</td>
                                            <td className="px-4 py-3 text-center space-x-4 border-b border-[#F1F5F9]">
                                                <button onClick={() => handleEditItemTypeButtonPress(itemType)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-[#3A8C85] transition-colors" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.00023 16H3.42523L13.2002 6.225L11.7752 4.8L2.00023 14.575V16ZM0.000234375 18V13.75L13.2002 0.575C13.4002 0.391666 13.6211 0.25 13.8627 0.150001C14.1044 0.0500002 14.3586 0 14.6252 0C14.8919 0 15.1502 0.0500002 15.4002 0.150001C15.6502 0.25 15.8669 0.4 16.0502 0.599999L17.4252 2C17.6252 2.18333 17.7711 2.4 17.8627 2.65C17.9544 2.9 18.0002 3.15 18.0002 3.4C18.0002 3.66667 17.9544 3.92083 17.8627 4.1625C17.7711 4.40417 17.6252 4.625 17.4252 4.825L4.25023 18H0.000234375ZM16.0002 3.4L14.6002 2L16.0002 3.4ZM12.4752 5.525L11.7752 4.8L13.2002 6.225L12.4752 5.525Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setItemTypeToDelete(itemType.id)} className="cursor-pointer">
                                                    <svg className="w-5 h-5 text-gray-400 hover:text-red-600 transition-colors" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3.00023 18C2.45023 18 1.9794 17.8042 1.58773 17.4125C1.19607 17.0208 1.00023 16.55 1.00023 16V3H0.000234494V1H5.00023V0H11.0002V1H16.0002V3H15.0002V16C15.0002 16.55 14.8044 17.0208 14.4127 17.4125C14.0211 17.8042 13.5502 18 13.0002 18H3.00023ZM13.0002 3H3.00023V16H13.0002V3ZM5.00023 14H7.00023V5H5.00023V14ZM9.00023 14H11.0002V5H9.00023V14ZM3.00023 3V16V3Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredItemTypes.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500 italic">Aucun type de matériel trouvé</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {showAddItemType && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-150">
                                    <h2 className="text-xl font-semibold mb-4">{editingItemType ? "Modifier le type de matériel" : "Ajouter un type de matériel"}</h2>
                                    <form onSubmit={(e) => { e.preventDefault(); addOrUpdateItemType(); }}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <label htmlFor="name" className="mb-1 font-medium">Nom</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="createdBy" className="mb-1 font-medium">Créé par</label>
                                                <select
                                                    id="createdBy"
                                                    value={createdById}
                                                    onChange={(e) => setCreatedById(Number(e.target.value))}
                                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                                >
                                                    <option value="">— Sélectionner un professeur —</option>
                                                    {professorList.map((prof) => (
                                                        <option key={prof.id} value={prof.id}>
                                                            {prof.firstName} {prof.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button type="button" onClick={() => { setShowAddItemType(false); setEditingItemType(null); }} className="px-4 py-2 cancel-send-itemtype-btn rounded transition cursor-pointer">Annuler</button>
                                            <button type="submit" className="px-4 py-2 send-itemtype-btn text-white rounded transition cursor-pointer">Enregistrer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {itemTypeToDelete !== null && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                                    <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                                    <p>Êtes-vous sûr de vouloir supprimer ce type de matériel ?</p>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button onClick={() => setItemTypeToDelete(null)} className="px-4 py-2 rounded cancel-delete-itemtype-btn transition cursor-pointer">Annuler</button>
                                        <button onClick={() => itemTypeToDelete && deleteItemType(itemTypeToDelete)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            } />
    );
}
