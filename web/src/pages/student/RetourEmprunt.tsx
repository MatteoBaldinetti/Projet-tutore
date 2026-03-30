import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Reservation, Resource, ReservationGroup, ReservationGroupStudent, Student } from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/RetourEmprunt.css";

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

// ── Icônes ────────────────────────────────────────────────────────────────────

const IconBox = () => (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z" fill="currentColor"/>
    </svg>
);

const IconUsers = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 18 20" fill="none">
        <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="currentColor"/>
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconWarning = () => (
    <svg width="22" height="22" viewBox="0 0 18 16" fill="none">
        <path d="M0 16L9 0L18 16H0ZM2.45 14H15.55L9 2.9L2.45 14ZM9 13C9.283 13 9.521 12.904 9.713 12.713C9.904 12.521 10 12.283 10 12C10 11.717 9.904 11.479 9.713 11.287C9.521 11.096 9.283 11 9 11C8.717 11 8.479 11.096 8.287 11.287C8.096 11.479 8 11.717 8 12C8 12.283 8.096 12.521 8.287 12.713C8.479 12.904 8.717 13 9 13ZM8 10H10V7H8V10Z" fill="currentColor"/>
    </svg>
);

// ── Composant principal ───────────────────────────────────────────────────────

export default function RetourEmprunt() {
    const { userId } = useAuth();
    const navigate = useNavigate();

    // Données brutes
    const [myResources, setMyResources] = useState<Resource[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [groups, setGroups] = useState<ReservationGroup[]>([]);
    const [groupStudents, setGroupStudents] = useState<ReservationGroupStudent[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    // Réservation en cours de traitement
    const [selected, setSelected] = useState<Reservation | null>(null);

    // État de la checklist : resourceId → coché
    const [checked, setChecked] = useState<Record<number, boolean>>({});

    // Case "J'ai pris connaissance"
    const [acknowledged, setAcknowledged] = useState(false);

    // Succès
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [resrcRes, resvRes, grpRes, gsRes, studRes] = await Promise.all([
                    axios.get(`${API_URL}/resources`,                { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservations`,             { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservationGroups`,        { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/reservationGroupStudents`, { headers: { "x-api-key": API_KEY } }),
                    axios.get(`${API_URL}/students`,                 { headers: { "x-api-key": API_KEY } }),
                ]);

                const mine: Resource[] = resrcRes.data.filter((r: Resource) => r.manageById === userId);
                setMyResources(mine);

                const myIds = new Set(mine.map(r => r.id));
                // Réservations APPROVED sur mes ressources = emprunts en cours
                const active: Reservation[] = resvRes.data.filter(
                    (r: Reservation) => myIds.has(r.ressourceId) && r.status === "APPROVED"
                );
                setReservations(active);
                setGroups(grpRes.data);
                setGroupStudents(gsRes.data);
                setStudents(studRes.data);
            } catch (err) {
                console.error("Erreur chargement retours :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId]);

    // Ouvrir le modal de retour pour une réservation
    const openRetour = (r: Reservation) => {
        setSelected(r);
        // Initialise la checklist : 1 ressource principale + éventuellement d'autres
        setChecked({ [r.ressourceId]: false });
        setAcknowledged(false);
        setSuccess(false);
    };

    const closeModal = () => {
        setSelected(null);
        setChecked({});
        setAcknowledged(false);
        setSuccess(false);
    };

    // Bloquer le scroll quand le modal est ouvert
    useEffect(() => {
        if (selected) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [selected]);

    const allChecked = selected
        ? Object.values(checked).every(Boolean) && Object.keys(checked).length > 0
        : false;

    const canSubmit = allChecked && acknowledged && !submitting;

    const handleSubmit = async () => {
        if (!selected || !canSubmit) return;
        setSubmitting(true);
        try {
            // Passer la réservation en CANCELLED (retour effectué)
            await axios.patch(
                `${API_URL}/reservations/${selected.id}`,
                { status: "CANCELLED" },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            // Remettre la ressource disponible
            await axios.patch(
                `${API_URL}/resources/${selected.ressourceId}`,
                { available: true },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            setSuccess(true);
            // Retirer la réservation de la liste locale
            setReservations(prev => prev.filter(r => r.id !== selected.id));
        } catch (err) {
            console.error("Erreur validation retour :", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Helpers
    const getResource = (id: number) => myResources.find(r => r.id === id);
    const getGroup = (id: number) => groups.find(g => g.id === id);
    const getGroupMembers = (groupId: number) => {
        const memberIds = groupStudents
            .filter(gs => gs.reservationGroupId === groupId)
            .map(gs => gs.studentId);
        return students.filter(s => memberIds.includes(s.id));
    };

    // Réservations filtrées : dont la date de fin est passée ou aujourd'hui
    const overdue = reservations.filter(r => new Date(r.endDate) <= new Date());
    const upcoming = reservations.filter(r => new Date(r.endDate) > new Date());

    return (
        <ProfessorLayout titleHeader="Validation des retours">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* EN-TÊTE */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Validation des retours</h1>
                        <p className="text-gray-500 mt-1">
                            Vérifiez le retour de chaque emprunt et confirmez l'état du matériel.
                        </p>
                    </div>
                    {overdue.length > 0 && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                            <IconWarning />
                            <span><strong>{overdue.length}</strong> retour{overdue.length > 1 ? "s" : ""} en retard</span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <p className="text-center text-gray-400 italic py-16">Chargement…</p>
                ) : reservations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="flex justify-center mb-4 text-green-500">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className="text-xl font-semibold text-gray-700">Tout est rendu !</p>
                        <p className="text-gray-400 text-sm mt-1">Aucun emprunt en cours sur vos ressources.</p>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {/* RETARDS */}
                        {overdue.length > 0 && (
                            <section>
                                <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <IconWarning /> Retours en retard
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {overdue.map(r => (
                                        <ReservationCard
                                            key={r.id}
                                            reservation={r}
                                            resource={getResource(r.ressourceId)}
                                            group={getGroup(r.reserveById)}
                                            members={getGroupMembers(r.reserveById)}
                                            overdue
                                            onRetour={() => openRetour(r)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EN COURS */}
                        {upcoming.length > 0 && (
                            <section>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Emprunts en cours
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {upcoming.map(r => (
                                        <ReservationCard
                                            key={r.id}
                                            reservation={r}
                                            resource={getResource(r.ressourceId)}
                                            group={getGroup(r.reserveById)}
                                            members={getGroupMembers(r.reserveById)}
                                            overdue={false}
                                            onRetour={() => openRetour(r)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* ── MODAL DE RETOUR ──────────────────────────────────────────── */}
                {selected && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                            {/* En-tête modal */}
                            <div className="retour-modal-header px-6 py-5 text-white">
                                <h2 className="text-xl font-semibold">Validation du retour</h2>
                                <p className="text-sm opacity-80 mt-0.5">
                                    {getResource(selected.ressourceId)?.name || "—"}
                                </p>
                            </div>

                            {success ? (
                                /* ── Écran de succès ── */
                                <div className="px-6 py-10 text-center">
                                    <div className="flex justify-center mb-4 text-green-500">
                                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                                            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <p className="text-xl font-semibold text-gray-800">Retour validé !</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        La ressource a été remise comme disponible.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="mt-6 retour-confirm-btn text-white px-6 py-2 rounded-lg transition cursor-pointer"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            ) : (
                                /* ── Formulaire de vérification ── */
                                <div className="px-6 py-5 space-y-5">

                                    {/* Infos réservation */}
                                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <IconCalendar />
                                            <div>
                                                <p className="text-xs text-gray-400">Emprunté du</p>
                                                <p className="font-medium">{formatDate(selected.startDate)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <IconCalendar />
                                            <div>
                                                <p className="text-xs text-gray-400">À retourner le</p>
                                                <p className={`font-medium ${new Date(selected.endDate) < new Date() ? "text-red-600" : ""}`}>
                                                    {formatDate(selected.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                                            <IconUsers />
                                            <div>
                                                <p className="text-xs text-gray-400">Groupe emprunteur</p>
                                                <p className="font-medium">{getGroup(selected.reserveById)?.name || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Membres du groupe */}
                                    {getGroupMembers(selected.reserveById).length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Membres du groupe</p>
                                            <div className="flex flex-wrap gap-2">
                                                {getGroupMembers(selected.reserveById).map(s => (
                                                    <span key={s.id} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                                        {s.firstName} {s.lastName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Checklist des éléments à vérifier */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-3">
                                            Vérification des éléments retournés
                                        </p>
                                        <div className="space-y-2">
                                            {/* Item principal */}
                                            <CheckItem
                                                id={`item-${selected.ressourceId}`}
                                                label={`${getResource(selected.ressourceId)?.name || "Ressource"} — restitué et en bon état`}
                                                checked={!!checked[selected.ressourceId]}
                                                onChange={v => setChecked(prev => ({ ...prev, [selected.ressourceId]: v }))}
                                            />
                                            {/* Éléments génériques de vérification */}
                                            {[
                                                { key: "cables", label: "Câbles et accessoires inclus restitués" },
                                                { key: "damage",  label: "Aucun dommage visible constaté" },
                                                { key: "clean",   label: "Matériel propre et nettoyé" },
                                            ].map(item => (
                                                <CheckItem
                                                    key={item.key}
                                                    id={`chk-${item.key}-${selected.id}`}
                                                    label={item.label}
                                                    checked={!!checked[item.key as any]}
                                                    onChange={v => setChecked(prev => ({ ...prev, [item.key]: v }))}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Case d'engagement */}
                                    <div
                                        onClick={() => setAcknowledged(prev => !prev)}
                                        className={`retour-acknowledge flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition select-none ${
                                            acknowledged
                                                ? "border-[#3A8C85] bg-[#E8F4F3]"
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                            acknowledged ? "bg-[#3A8C85] border-[#3A8C85] text-white" : "border-gray-300"
                                        }`}>
                                            {acknowledged && <IconCheck />}
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            <strong>J'ai pris connaissance</strong> de l'état du matériel retourné et je certifie que
                                            l'ensemble des éléments ci-dessus ont été vérifiés. Cette validation est définitive
                                            et clôture l'emprunt.
                                        </p>
                                    </div>

                                    {/* Progression visuelle */}
                                    {!allChecked && (
                                        <p className="text-xs text-gray-400 text-center">
                                            {Object.values(checked).filter(Boolean).length} / {Object.keys(checked).length} éléments cochés
                                        </p>
                                    )}

                                    {/* Boutons */}
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 retour-cancel-btn py-2.5 rounded-lg text-sm transition cursor-pointer"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!canSubmit}
                                            className={`flex-1 retour-confirm-btn text-white py-2.5 rounded-lg text-sm font-medium transition ${
                                                canSubmit ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
                                            }`}
                                        >
                                            {submitting ? "Validation…" : "Valider le retour"}
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </ProfessorLayout>
    );
}

// ── Carte de réservation ──────────────────────────────────────────────────────

function ReservationCard({
    reservation,
    resource,
    group,
    members,
    overdue,
    onRetour,
}: {
    reservation: Reservation;
    resource: Resource | undefined;
    group: ReservationGroup | undefined;
    members: Student[];
    overdue: boolean;
    onRetour: () => void;
}) {
    return (
        <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${overdue ? "border-red-400" : "border-[#3A8C85]"}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    {/* Ressource */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={overdue ? "text-red-500" : "text-[#3A8C85]"}>
                            <IconBox />
                        </span>
                        <h3 className="font-semibold text-gray-800">{resource?.name || "—"}</h3>
                        {overdue && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                En retard
                            </span>
                        )}
                    </div>

                    {/* Groupe */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                        <IconUsers />
                        <span>{group?.name || "—"}</span>
                        {members.length > 0 && (
                            <span className="text-gray-400">
                                · {members.map(s => `${s.firstName} ${s.lastName}`).join(", ")}
                            </span>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <IconCalendar />
                        <span>Du {formatDate(reservation.startDate)} au <span className={overdue ? "text-red-500 font-medium" : ""}>{formatDate(reservation.endDate)}</span></span>
                    </div>
                </div>

                {/* Bouton */}
                <button
                    onClick={onRetour}
                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-white transition cursor-pointer ${
                        overdue ? "retour-overdue-btn" : "retour-confirm-btn"
                    }`}
                >
                    Valider retour
                </button>
            </div>
        </div>
    );
}

// ── Item checkbox ─────────────────────────────────────────────────────────────

function CheckItem({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition select-none ${
                checked
                    ? "bg-[#E8F4F3] border-[#3A8C85]"
                    : "bg-white border-gray-200 hover:border-gray-300"
            }`}
        >
            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                checked ? "bg-[#3A8C85] border-[#3A8C85] text-white" : "border-gray-300"
            }`}>
                {checked && <IconCheck />}
            </div>
            <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
                {label}
            </label>
        </div>
    );
}