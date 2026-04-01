import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Classroom } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/RoomList.css";

type ClassroomType = { id: number; name: string };

const FALLBACK_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160' viewBox='0 0 300 160'%3E%3Crect width='300' height='160' fill='%23E8F4F3'/%3E%3Cpath d='M120 55L90 95V75H60V55H90V35L120 55Z M180 55L150 95V75H120V55H150V35L180 55Z' fill='%233A8C8540'/%3E%3C/svg%3E`;

type ClassroomWithImage = Classroom & { imgUrl: string };

export default function RoomList() {
    const navigate = useNavigate();

    const [roomList, setRoomList] = useState<ClassroomWithImage[]>([]);
    const [classroomTypes, setClassroomTypes] = useState<ClassroomType[]>([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<number | "">("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchImageUrl = async (imageIds: number[] | undefined): Promise<string> => {
        if (!imageIds || imageIds.length === 0) return FALLBACK_IMG;
        try {
            const res = await axios.get(`${API_URL}/fileMetaData/${imageIds[0]}`, {
                headers: { "x-api-key": API_KEY },
            });
            return API_URL.replace(/\/api$/, "") + res.data?.url || FALLBACK_IMG;
        } catch {
            return FALLBACK_IMG;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, typeRes] = await Promise.all([
                    axios.get(`${API_URL}/classrooms`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/classroomTypes`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setClassroomTypes(typeRes.data);
                const rooms: Classroom[] = roomRes.data;
                const roomsWithImages = await Promise.all(
                    rooms.map(async (r) => ({ ...r, imgUrl: await fetchImageUrl(r.imageIds) }))
                );
                setRoomList(roomsWithImages);
            } catch (err) {
                console.error("Erreur lors de la récupération des salles :", err);
            }
        };
        fetchData();
    }, []);

    const getTypeName = (id: number) => classroomTypes.find(t => t.id === id)?.name || "—";

    const filteredRooms = roomList.filter(r => {
        const value = search.toLowerCase();
        const matchSearch = r.name.toLowerCase().includes(value) || r.description.toLowerCase().includes(value);
        const matchType = typeFilter ? r.classroomTypeId === typeFilter : true;
        const matchAvailable = availableOnly ? r.available : true;
        return matchSearch && matchType && matchAvailable;
    });

    const totalPages = Math.max(1, Math.ceil(filteredRooms.length / itemsPerPage));
    const currentRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getVisiblePages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | string)[] = [1];
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <StudentLayout titleHeader="Salles disponibles">
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="w-full bg-white rounded-xl shadow-md p-6">

                    {/* FILTRES */}
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                        <h1 className="text-3xl font-semibold whitespace-nowrap">Liste des salles</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={typeFilter}
                                onChange={e => { setTypeFilter(e.target.value ? Number(e.target.value) : ""); setCurrentPage(1); }}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                            >
                                <option value="">Tous les types</option>
                                {classroomTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input type="checkbox" checked={availableOnly} onChange={e => { setAvailableOnly(e.target.checked); setCurrentPage(1); }} className="w-4 h-4 cursor-pointer" />
                                Disponibles uniquement
                            </label>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                            />
                        </div>
                    </div>

                    {/* GRILLE */}
                    {currentRooms.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-10">Aucune salle trouvée.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                            {currentRooms.map(room => (
                                <div key={room.id} className="border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col">
                                    <div className="h-40 bg-gradient-to-br from-[#E8F4F3] to-[#c8e8e6] overflow-hidden">
                                        <img
                                            src={room.imgUrl}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                                        />
                                    </div>

                                    {/* CONTENU */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{room.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {room.available ? "Disponible" : "Indisponible"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">N° {room.roomNumber} · {getTypeName(room.classroomTypeId)}</p>
                                        <p className="text-sm text-gray-600 flex-1 line-clamp-2">{room.description}</p>

                                        <div className="flex gap-2 mt-4">
                                            <button onClick={() => navigate(`/student/room-details/${room.id}`)} className="flex-1 more-room-btn py-2 rounded text-sm transition cursor-pointer">Voir les détails</button>
                                            {room.available && (
                                                <button onClick={() => navigate(`/student/room-reservation/${room.id}`)} className="flex-1 reserve-room-btn text-white py-2 rounded text-sm transition cursor-pointer">Réserver</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">&lt;</button>
                            {getVisiblePages().map((page, i) =>
                                page === "..." ? <span key={i} className="px-2">…</span> : (
                                    <button key={i} onClick={() => setCurrentPage(page as number)} className={`px-3 py-1 rounded border ${currentPage === page ? "bg-[#3A8C85] text-white" : "bg-white text-gray-700"}`}>{page}</button>
                                )
                            )}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">&gt;</button>
                        </div>
                    )}

                </div>
            </div>
        </StudentLayout>
    );
}
