import axios from "axios";
import { API_KEY, API_URL } from "../../constants/apiConstants";
import type { Item, ItemType } from "../../../types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../../components/ItemCard";
import StudentLayout from "../../components/StudentLayout";

type ItemWithImage = Item & { imageIds?: number[] };

type GroupedItem = {
    itemTypeId: number;
    name: string;
    description: string;
    quantity: number;
    imgUrl: string;
    items: ItemWithImage[];
};

// Fallback SVG en data URI quand aucune image n'est disponible
const FALLBACK_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23E8F4F3'/%3E%3Cpath d='M150 90L120 130V100H90V80H120V50L150 90Z M150 90L180 130V100H210V80H180V50L150 90Z' fill='%233A8C8540'/%3E%3Cpath d='M125 135 L175 135 L175 145 L125 145 Z' fill='%233A8C8530'/%3E%3C/svg%3E`;

export default function MaterielList() {
    const navigate = useNavigate();

    const [itemList, setItemList] = useState<GroupedItem[]>([]);
    const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchImageUrl = async (imageIds: number[]): Promise<string> => {
        if (!imageIds || imageIds.length === 0) return FALLBACK_IMG;
        try {
            const res = await axios.get(`${API_URL}/fileMetaData/${imageIds[0]}`, {
                headers: { "x-api-key": API_KEY },
            });
            const imgUrl = API_URL.replace(/\/api$/, "") + res.data?.url;
            return imgUrl || FALLBACK_IMG;
        } catch {
            return FALLBACK_IMG;
        }
    };

    const fetchItems = async () => {
        try {
            const [itemsRes, typesRes] = await Promise.all([
                axios.get(`${API_URL}/items`, { headers: { "x-api-key": API_KEY } }),
                axios.get(`${API_URL}/itemTypes`, { headers: { "x-api-key": API_KEY } }),
            ]);

            const items: ItemWithImage[] = itemsRes.data;
            const grouped = await fuseItemListByTypeId(items);
            setItemList(grouped);
            setItemTypes(typesRes.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des items :", err);
        }
    };

    const fuseItemListByTypeId = async (items: ItemWithImage[]): Promise<GroupedItem[]> => {
        const grouped: Record<number, { itemTypeId: number; name: string; description: string; quantity: number; imgUrl: string; items: ItemWithImage[]; firstImageIds: number[] }> = {};

        for (const item of items) {
            if (!item.available) continue;

            if (!grouped[item.itemTypeId]) {
                grouped[item.itemTypeId] = {
                    itemTypeId: item.itemTypeId,
                    name: item.name,
                    description: item.description,
                    quantity: 0,
                    imgUrl: FALLBACK_IMG,
                    items: [],
                    firstImageIds: item.imageIds || [],
                };
            }

            grouped[item.itemTypeId].quantity += 1;
            grouped[item.itemTypeId].items.push(item);
        }

        // Charger les images en parallèle pour chaque groupe
        const groupArray = Object.values(grouped);
        const withImages = await Promise.all(
            groupArray.map(async (g) => {
                const imgUrl = await fetchImageUrl(g.firstImageIds);
                return { ...g, imgUrl };
            })
        );

        return withImages;
    };

    const filteredItems = itemList.filter((item) => {
        const value = search.toLowerCase();
        const matchSearch = item.name.toLowerCase().includes(value) || item.description.toLowerCase().includes(value);
        const matchCategory = categoryFilter !== "" ? item.itemTypeId === categoryFilter : true;
        return matchSearch && matchCategory;
    });

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    useEffect(() => { fetchItems(); }, []);

    const handleReserve = (item: ItemWithImage) => {
        navigate(`/student/materiel-reservation/${item.id}`);
    };

    const getCategoryName = (itemTypeId: number) => {
        return itemTypes.find(t => t.id === itemTypeId)?.name;
    };

    return (
        <StudentLayout
            titleHeader="Matériels disponibles"
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-end mb-5 gap-3">
                            <select
                                value={categoryFilter}
                                onChange={e => { setCategoryFilter(e.target.value ? Number(e.target.value) : ""); setCurrentPage(1); }}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            >
                                <option value="">Toutes les catégories</option>
                                {itemTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                            />
                        </div>

                        {currentItems.map((item) => (
                            <div key={item.itemTypeId} className="mb-5">
                                <ItemCard
                                    name={item.name}
                                    description={item.description}
                                    quantity={item.quantity}
                                    imgUrl={item.imgUrl}
                                    categoryName={getCategoryName(item.itemTypeId)}
                                    onReserve={() => handleReserve(item.items[0])}
                                    onDetails={() => navigate(`/student/materiel-details/${item.itemTypeId}`)}
                                />
                            </div>
                        ))}

                        {filteredItems.length === 0 && (
                            <p className="text-center text-gray-500 italic py-6">Aucun matériel trouvé</p>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 space-x-2">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">&lt;</button>
                                {getVisiblePages().map((page, index) =>
                                    page === "..." ? (
                                        <span key={index} className="px-2">...</span>
                                    ) : (
                                        <button key={index} onClick={() => setCurrentPage(page as number)} className={`px-3 py-1 rounded border ${currentPage === page ? "bg-[#3A8C85] text-white" : "bg-white text-gray-700"}`}>{page}</button>
                                    )
                                )}
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">&gt;</button>
                            </div>
                        )}
                    </div>
                </div>
            }
        />
    );
}
