import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Classroom } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/RoomList.css";

type ClassroomType = { id: number; name: string };

const IconDoor = () => (
    <svg width="40" height="40" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3A8C85] opacity-40">
        <path d="M0 18V16H2V2C2 1.45 2.196 0.979 2.588 0.587C2.979 0.196 3.45 0 4 0H14C14.55 0 15.021 0.196 15.413 0.587C15.804 0.979 16 1.45 16 2V16H18V18H0ZM4 16H14V2H4V16ZM6 10C6.283 10 6.521 9.904 6.713 9.713C6.904 9.521 7 9.283 7 9C7 8.717 6.904 8.479 6.713 8.287C6.521 8.096 6.283 8 6 8C5.717 8 5.479 8.096 5.287 8.287C5.096 8.479 5 8.717 5 9C5 9.283 5.096 9.521 5.287 9.713C5.479 9.904 5.717 10 6 10Z" fill="currentColor"/>
    </svg>
);

export default function RoomList() {
    const navigate = useNavigate();

    const [roomList, setRoomList] = useState<Classroom[]>([]);
    const [classroomTypes, setClassroomTypes] = useState<ClassroomType[]>([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<number | "">("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, typeRes] = await Promise.all([
                    axios.get(`${API_URL}/classrooms`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/classroomTypes`, { headers: { "x-api-key": API_KEY } }),
                ]);
                setRoomList(roomRes.data);
                setClassroomTypes(typeRes.data);
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
                                    {/* PLACEHOLDER ILLUSTRATIF */}
                                    <div className="h-40 bg-gradient-to-br from-[#E8F4F3] to-[#c8e8e6] flex items-center justify-center">
                                        <IconDoor />
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
