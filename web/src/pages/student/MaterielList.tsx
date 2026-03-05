import axios from "axios";
import { API_KEY, API_URL } from "../../constants/apiConstants";
import type { Item } from "../../types/types";
import { useEffect, useState } from "react";
import ItemCard from "../../components/ItemCard";

type GroupedItem = {
    typeId: number;
    name: string;
    description: string;
    quantity: number;
    items: Item[];
};

export default function MaterielList() {
    const [itemList, setItemList] = useState<GroupedItem[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;

    const fetchItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/items`, {
                headers: { "x-api-key": API_KEY },
            });

            const items: Item[] = res.data;
            setItemList(fuseItemListByTypeId(items));
        } catch (err) {
            console.error("Erreur lors de la récupération des items :", err);
        }
    };

    const fuseItemListByTypeId = (itemList: Item[]) => {
        const grouped: Record<
            number,
            {
                typeId: number;
                name: string;
                description: string;
                quantity: number;
                items: Item[];
            }
        > = {};

        for (const item of itemList) {
            if (!item.available) continue;

            if (!grouped[item.typeId]) {
                grouped[item.typeId] = {
                    typeId: item.typeId,
                    name: item.name,
                    description: item.description,
                    quantity: 0,
                    items: [],
                };
            }

            grouped[item.typeId].quantity += 1;
            grouped[item.typeId].items.push(item);
        }

        return Object.values(grouped);
    };

    const filteredItems = itemList.filter((item) => {
        const value = search.toLowerCase();

        return (
            item.name.toLowerCase().includes(value) ||
            item.description.toLowerCase().includes(value)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

    const getVisiblePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-end mb-5">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                    />
                </div>

                {currentItems.map((item) => (
                    <div key={item.typeId} className="mb-5">
                        <ItemCard
                            name={item.name}
                            description={item.description}
                            quantity={item.quantity}
                            imgUrl="https://media.licdn.com/dms/image/v2/D4E03AQEQxqd5LF9LNw/profile-displayphoto-scale_200_200/B4EZrPJ5d7KcAY-/0/1764412073411?e=2147483647&v=beta&t=f7dgU60qY16PdF6E-a6lec87c-zZG8LvWOtavAzycQU"
                        />
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <p className="text-center text-gray-500 italic">
                        Aucun matériel trouvé
                    </p>
                )}

                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        &lt;
                    </button>

                    {getVisiblePages().map((page, index) =>
                        page === "..." ? (
                            <span key={index} className="px-2">
                                ...
                            </span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(page as number)}
                                className={`px-3 py-1 rounded border ${currentPage === page
                                    ? "bg-[#3A8C85] text-white"
                                    : "bg-white text-gray-700"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        &gt;
                    </button>
                </div>

            </div>
        </div>
    );
}