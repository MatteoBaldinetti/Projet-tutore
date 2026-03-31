import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Reservation, Resource, ReservationGroup, ReservationGroupStudent, Student } from "../../../types/types";
import SecurityLayout from "../../components/SecurityLayout";
import "../../styles/SecurityToday.css";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    APPROVED:  { label: "Approuvée",  className: "bg-green-100 text-green-700 border border-green-200" },
    PENDING:   { label: "En attente", className: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
    REJECTED:  { label: "Refusée",    className: "bg-red-100 text-red-700 border border-red-200" },
    CANCELLED: { label: "Annulée",    className: "bg-gray-100 text-gray-500 border border-gray-200" },
};

const HOUR_START = 8;
const HOUR_END   = 20;
const HOUR_PX    = 80; // px par heure dans la timeline

const pad = (n: number) => String(n).padStart(2, "0");

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatHour = (h: number) => `${pad(h)}:00`;

type EnrichedReservation = Reservation & {
    resourceName: string;
    groupName: string;
    studentNames: string;
    startMinutes: number; // minutes depuis HOUR_START*60
    durationMinutes: number;
    top: number;         // px
    height: number;      // px
};

const toMinutesSinceStart = (iso: string): number => {
    const d = new Date(iso);
    return (d.getHours() - HOUR_START) * 60 + d.getMinutes();
};

// Algorithme de colonnes pour éviter les chevauchements visuels
function assignColumns(reservations: EnrichedReservation[]) {
    const sorted = [...reservations].sort((a, b) => a.startMinutes - b.startMinutes);
    const cols: { end: number }[][] = [];

    return sorted.map(r => {
        const endMin = r.startMinutes + r.durationMinutes;
        let col = cols.findIndex(column => {
            const lastInCol = column[column.length - 1];
            return lastInCol.end <= r.startMinutes;
        });
        if (col === -1) { cols.push([]); col = cols.length - 1; }
        cols[col].push({ end: endMin });
        return { ...r, col, totalCols: 0 };
    }).map(r => ({ ...r, totalCols: cols.length }));
}

export default function SecurityToday() {
    const [reservations, setReservations] = useState<EnrichedReservation[]>([]);
    //const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(new Date());
    const [filter, setFilter] = useState<"all" | "approved">("approved");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<EnrichedReservation | null>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Horloge en temps réel
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(interval);
    }, []);

    // Scroll auto vers l'heure actuelle au chargement
    useEffect(() => {
        if (!loading && timelineRef.current) {
            const currentPx = (now.getHours() - HOUR_START) * HOUR_PX + (now.getMinutes() / 60) * HOUR_PX - 40;
            timelineRef.current.scrollTop = Math.max(0, currentPx);
        }
    }, [loading]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [resRes, resourcesRes, groupsRes, gsRes, studentsRes] = await Promise.all([
                    axios.get(`${API_URL}/reservations`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/resources`,    { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservationGroups`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservationGroupStudents`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/students`,     { headers: { "x-api-key": API_KEY } }),
                ]);

                //setResources(resourcesRes.data);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                // Filtrer les réservations du jour
                const todayReservations: Reservation[] = resRes.data.filter((r: Reservation) => {
                    const start = new Date(r.startDate);
                    return start >= today && start < tomorrow;
                });

                const groupMap: Record<number, ReservationGroup> = {};
                groupsRes.data.forEach((g: ReservationGroup) => { groupMap[g.id] = g; });

                const gsMap: Record<number, ReservationGroupStudent[]> = {};
                gsRes.data.forEach((gs: ReservationGroupStudent) => {
                    if (!gsMap[gs.reservationGroupId]) gsMap[gs.reservationGroupId] = [];
                    gsMap[gs.reservationGroupId].push(gs);
                });

                const studentMap: Record<number, Student> = {};
                studentsRes.data.forEach((s: Student) => { studentMap[s.id] = s; });

                const resourceMap: Record<number, Resource> = {};
                resourcesRes.data.forEach((r: Resource) => { resourceMap[r.id] = r; });

                const enriched: EnrichedReservation[] = todayReservations.map(r => {
                    const startMin = toMinutesSinceStart(r.startDate);
                    const endDate  = new Date(r.endDate);
                    const startDate = new Date(r.startDate);
                    const durationMin = Math.max(15, Math.round((endDate.getTime() - startDate.getTime()) / 60000));

                    // Noms des étudiants du groupe
                    const groupStudents = gsMap[r.reserveById] || [];
                    const studentNames = groupStudents
                        .map(gs => studentMap[gs.studentId])
                        .filter(Boolean)
                        .map(s => `${s.firstName} ${s.lastName}`)
                        .join(", ") || "—";

                    return {
                        ...r,
                        resourceName: resourceMap[r.ressourceId]?.name || "—",
                        groupName:    groupMap[r.reserveById]?.name    || "—",
                        studentNames,
                        startMinutes: Math.max(0, startMin),
                        durationMinutes: durationMin,
                        top:    (Math.max(0, startMin) / 60) * HOUR_PX,
                        height: Math.max(30, (durationMin / 60) * HOUR_PX),
                    };
                });

                setReservations(enriched);
            } catch (err) {
                console.error("Erreur chargement planning :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const today = new Date();
    const todayLabel = today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

    // Indicateur de l'heure actuelle en px depuis le haut de la timeline
    const nowPx = (now.getHours() - HOUR_START) * HOUR_PX + (now.getMinutes() / 60) * HOUR_PX;
    const isNowVisible = now.getHours() >= HOUR_START && now.getHours() < HOUR_END;

    const filteredReservations = reservations.filter(r => {
        const matchFilter = filter === "all" || r.status === "APPROVED";
        const matchSearch = search
            ? r.resourceName.toLowerCase().includes(search.toLowerCase()) ||
              r.studentNames.toLowerCase().includes(search.toLowerCase()) ||
              r.groupName.toLowerCase().includes(search.toLowerCase())
            : true;
        return matchFilter && matchSearch;
    });

    const withCols = assignColumns(filteredReservations);

    // Stats du jour
    const stats = {
        total:    reservations.length,
        approved: reservations.filter(r => r.status === "APPROVED").length,
        ongoing:  reservations.filter(r => {
            const start = new Date(r.startDate);
            const end   = new Date(r.endDate);
            return r.status === "APPROVED" && start <= now && end >= now;
        }).length,
        upcoming: reservations.filter(r => {
            const start = new Date(r.startDate);
            return r.status === "APPROVED" && start > now;
        }).length,
    };

    useEffect(() => {
        if (selected) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [selected]);

    return (
        <SecurityLayout title="Planning du jour">
            <div className="p-6 max-w-7xl mx-auto">

                {/* EN-TÊTE */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 capitalize">{todayLabel}</h1>
                            <p className="text-gray-400 text-sm mt-0.5">
                                Il est actuellement <span className="font-semibold text-[#3A8C85]">{pad(now.getHours())}:{pad(now.getMinutes())}</span>
                            </p>
                        </div>

                        {/* STATS */}
                        <div className="flex gap-3 flex-wrap">
                            {[
                                { label: "Total", value: stats.total,    color: "text-gray-700",  bg: "bg-gray-50 border-gray-200" },
                                { label: "Approuvées", value: stats.approved, color: "text-green-700", bg: "bg-green-50 border-green-200" },
                                { label: "En cours",   value: stats.ongoing,  color: "text-blue-700",  bg: "bg-blue-50 border-blue-200" },
                                { label: "À venir",    value: stats.upcoming, color: "text-[#3A8C85]", bg: "bg-[#E8F4F3] border-[#3A8C85]/20" },
                            ].map(s => (
                                <div key={s.label} className={`rounded-lg border px-4 py-2 text-center min-w-20 ${s.bg}`}>
                                    <div className={`text-xl font-bold ${s.color}`}>{loading ? "…" : s.value}</div>
                                    <div className="text-xs text-gray-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FILTRES */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                            onClick={() => setFilter("approved")}
                            className={`px-4 py-2 text-sm transition cursor-pointer ${filter === "approved" ? "security-filter-active text-white" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            Approuvées seulement
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 text-sm transition cursor-pointer ${filter === "all" ? "security-filter-active text-white" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            Toutes
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher une ressource, étudiant..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-72 shadow-sm"
                    />
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-16 text-center">
                        <p className="text-gray-400 italic">Chargement du planning…</p>
                    </div>
                ) : (
                    <div className="flex gap-5">

                        {/* ── TIMELINE ── */}
                        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Planning horaire</h2>
                            </div>

                            <div
                                ref={timelineRef}
                                className="overflow-y-auto relative"
                                style={{ height: "calc(100vh - 320px)", minHeight: "400px" }}
                            >
                                {/* Grille heures */}
                                <div className="relative" style={{ height: (HOUR_END - HOUR_START) * HOUR_PX }}>

                                    {/* Lignes des heures */}
                                    {hours.map(h => (
                                        <div
                                            key={h}
                                            className="absolute left-0 right-0 border-t border-gray-100 flex"
                                            style={{ top: (h - HOUR_START) * HOUR_PX }}
                                        >
                                            <div className="w-14 shrink-0 pr-2 -mt-2.5 text-right">
                                                <span className="text-xs text-gray-400 font-medium">{formatHour(h)}</span>
                                            </div>
                                            <div className="flex-1 border-l border-gray-100" />
                                        </div>
                                    ))}

                                    {/* Ligne "maintenant" */}
                                    {isNowVisible && (
                                        <div
                                            className="absolute left-0 right-0 flex items-center pointer-events-none z-20"
                                            style={{ top: nowPx }}
                                        >
                                            <div className="w-14 shrink-0 pr-2 text-right">
                                                <span className="text-xs font-bold text-red-500">{pad(now.getHours())}:{pad(now.getMinutes())}</span>
                                            </div>
                                            <div className="flex-1 h-0.5 bg-red-400 relative">
                                                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Blocs de réservations */}
                                    <div className="absolute left-14 right-2 top-0 bottom-0">
                                        {withCols.map((r, i) => {
                                            const colWidth = `${100 / r.totalCols}%`;
                                            const colLeft  = `${(r.col / r.totalCols) * 100}%`;
                                            const isOngoing = new Date(r.startDate) <= now && new Date(r.endDate) >= now;
                                            const isPast    = new Date(r.endDate) < now;

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelected(r)}
                                                    className={`absolute rounded-lg px-2 py-1.5 text-left overflow-hidden cursor-pointer transition-all hover:z-10 hover:shadow-lg border-l-4 ${
                                                        r.status === "APPROVED"
                                                            ? isOngoing
                                                                ? "bg-[#E8F4F3] border-[#3A8C85] shadow-md ring-2 ring-[#3A8C85]/20"
                                                                : isPast
                                                                    ? "bg-gray-50 border-gray-300 opacity-60"
                                                                    : "bg-green-50 border-green-400"
                                                            : r.status === "PENDING"
                                                                ? "bg-yellow-50 border-yellow-400"
                                                                : "bg-red-50 border-red-300 opacity-50"
                                                    }`}
                                                    style={{
                                                        top:    r.top + 1,
                                                        height: r.height - 2,
                                                        left:   colLeft,
                                                        width:  colWidth,
                                                    }}
                                                >
                                                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
                                                        {r.resourceName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {formatTime(r.startDate)} – {formatTime(r.endDate)}
                                                    </p>
                                                    {r.height > 50 && (
                                                        <p className="text-xs text-gray-400 truncate mt-0.5">{r.groupName}</p>
                                                    )}
                                                    {isOngoing && (
                                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3A8C85] animate-pulse" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* ── LISTE ── */}
                        <div className="w-80 shrink-0 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    Liste ({filteredReservations.length})
                                </h2>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                {filteredReservations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 italic text-sm">
                                        Aucune réservation trouvée.
                                    </div>
                                ) : (
                                    filteredReservations
                                        .sort((a, b) => a.startMinutes - b.startMinutes)
                                        .map((r, i) => {
                                            const isOngoing = new Date(r.startDate) <= now && new Date(r.endDate) >= now;
                                            const isPast    = new Date(r.endDate) < now;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelected(r)}
                                                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${isPast ? "opacity-50" : ""}`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                                {r.resourceName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {formatTime(r.startDate)} → {formatTime(r.endDate)}
                                                            </p>
                                                            <p className="text-xs text-gray-400 truncate mt-0.5">{r.groupName}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_LABELS[r.status]?.className}`}>
                                                                {STATUS_LABELS[r.status]?.label}
                                                            </span>
                                                            {isOngoing && (
                                                                <span className="text-xs text-[#3A8C85] font-semibold flex items-center gap-1">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#3A8C85] inline-block animate-pulse" />
                                                                    En cours
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* POP-UP DÉTAIL */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{selected.resourceName}</h2>
                                <p className="text-sm text-gray-400 mt-0.5">{selected.groupName}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[selected.status]?.className}`}>
                                {STATUS_LABELS[selected.status]?.label}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg width="16" height="16" viewBox="0 0 18 20" fill="none" className="text-[#3A8C85] shrink-0">
                                    <path d="M2 20C1.45 20 0.979 19.804 0.588 19.413C0.196 19.021 0 18.55 0 18V4C0 3.45 0.196 2.979 0.588 2.588C0.979 2.196 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.021 2.196 17.413 2.588C17.804 2.979 18 3.45 18 4V18C18 18.55 17.804 19.021 17.413 19.413C17.021 19.804 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="currentColor"/>
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-400">Créneau</p>
                                    <p className="font-semibold text-gray-700">
                                        {formatTime(selected.startDate)} – {formatTime(selected.endDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#3A8C85] shrink-0 mt-0.5">
                                    <path d="M8 8C6.9 8 5.958 7.608 5.175 6.825C4.392 6.042 4 5.1 4 4C4 2.9 4.392 1.958 5.175 1.175C5.958 0.392 6.9 0 8 0C9.1 0 10.042 0.392 10.825 1.175C11.608 1.958 12 2.9 12 4C12 5.1 11.608 6.042 10.825 6.825C10.042 7.608 9.1 8 8 8ZM0 16V13.2C0 12.633 0.146 12.113 0.438 11.638C0.729 11.163 1.117 10.8 1.6 10.55C2.633 10.033 3.683 9.646 4.75 9.388C5.817 9.129 6.9 9 8 9C9.1 9 10.183 9.129 11.25 9.388C12.317 9.646 13.367 10.033 14.4 10.55C14.883 10.8 15.271 11.163 15.563 11.638C15.854 12.113 16 12.633 16 13.2V16H0Z" fill="currentColor"/>
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-400">Étudiants</p>
                                    <p className="font-medium text-gray-700">{selected.studentNames}</p>
                                </div>
                            </div>

                            {(() => {
                                const isOngoing = new Date(selected.startDate) <= now && new Date(selected.endDate) >= now;
                                const isPast    = new Date(selected.endDate) < now;
                                if (isOngoing) return (
                                    <div className="flex items-center gap-2 p-3 bg-[#E8F4F3] rounded-lg text-[#3A8C85]">
                                        <span className="w-2 h-2 rounded-full bg-[#3A8C85] animate-pulse" />
                                        <span className="text-sm font-semibold">Réservation en cours</span>
                                    </div>
                                );
                                if (isPast) return (
                                    <div className="p-3 bg-gray-50 rounded-lg text-gray-400 text-sm text-center">
                                        Réservation terminée
                                    </div>
                                );
                                return (
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 text-sm text-center">
                                        À venir
                                    </div>
                                );
                            })()}
                        </div>

                        <button
                            onClick={() => setSelected(null)}
                            className="w-full mt-5 py-2.5 rounded-lg security-close-btn text-white font-medium transition cursor-pointer"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </SecurityLayout>
    );
}
