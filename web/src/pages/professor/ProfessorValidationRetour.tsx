import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type {
  Reservation,
  Resource,
  ReservationGroup,
  ReservationGroupStudent,
  Student,
} from "../../../types/types";
import ProfessorLayout from "../../components/ProfessorLayout";
import "../../styles/ProfessorValidationRetour.css";

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatDuration = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}`;
};

// ── Icônes ────────────────────────────────────────────────────────────────────

const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z"
      fill="currentColor"
    />
  </svg>
);

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 18 20" fill="none">
    <path
      d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z"
      fill="currentColor"
    />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 18 16" fill="none">
    <path
      d="M0 16L9 0L18 16H0ZM2.45 14H15.55L9 2.9L2.45 14ZM9 13C9.283 13 9.521 12.904 9.713 12.713C9.904 12.521 10 12.283 10 12C10 11.717 9.904 11.479 9.713 11.287C9.521 11.096 9.283 11 9 11C8.717 11 8.479 11.096 8.287 11.287C8.096 11.479 8 11.717 8 12C8 12.283 8.096 12.521 8.287 12.713C8.479 12.904 8.717 13 9 13ZM8 10H10V7H8V10Z"
      fill="currentColor"
    />
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// ── Composant principal ───────────────────────────────────────────────────────

export default function ProfessorValidationRetour() {
  const { userId } = useAuth();

  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [groups, setGroups] = useState<ReservationGroup[]>([]);
  const [groupStudents, setGroupStudents] = useState<ReservationGroupStudent[]>(
    [],
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [etat, setEtat] = useState<"bon" | "degrade" | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resrcRes, resrvRes, grpRes, gsRes, studRes] = await Promise.all([
          axios.get(`${API_URL}/resources`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/reservations`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/reservationGroups`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/reservationGroupStudents`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/students`, {
            headers: { "x-api-key": API_KEY },
          }),
        ]);
        const mine: Resource[] = resrcRes.data.filter(
          (r: Resource) => r.manageById === userId,
        );
        setMyResources(mine);
        const myIds = new Set(mine.map((r) => r.id));
        // On récupère les réservations CANCELLED sur ses ressources = déclarées retournées par l'étudiant
        // mais pas encore confirmées. En pratique : status === "CANCELLED" ET validationDate === null
        // (ou on peut filtrer les APPROVED dont la date de fin est passée = en attente de retour).
        // Ici on affiche les APPROVED dont la fin est passée → retours attendus à confirmer.
        const toValidate: Reservation[] = resrvRes.data.filter(
          (r: Reservation) =>
            myIds.has(r.ressourceId) && r.status === "APPROVED",
        );
        setReservations(toValidate);
        setGroups(grpRes.data);
        setGroupStudents(gsRes.data);
        setStudents(studRes.data);
      } catch (err) {
        console.error("Erreur validation retour prof :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  const openModal = (r: Reservation) => {
    setSelected(r);
    setEtat(null);
    setCommentaire("");
    setSuccess(false);
  };

  const closeModal = () => {
    setSelected(null);
  };

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const canSubmit = etat !== null && !submitting;

  const handleValider = async () => {
    if (!selected || !canSubmit) return;
    setSubmitting(true);
    try {
      // Clôture la réservation
      await axios.patch(
        `${API_URL}/reservations/${selected.id}`,
        { status: "CANCELLED", validationDate: new Date().toISOString() },
        {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        },
      );
      // Remettre la ressource disponible
      await axios.patch(
        `${API_URL}/resources/${selected.ressourceId}`,
        { available: true },
        {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        },
      );
      setSuccess(true);
      setReservations((prev) => prev.filter((r) => r.id !== selected.id));
    } catch (err) {
      console.error("Erreur confirmation retour :", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefuser = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      // Signalement de problème : on crée un rapport
      if (commentaire.trim()) {
        await axios.post(
          `${API_URL}/reports`,
          {
            description: commentaire,
            resourceId: selected.ressourceId,
            reportedById: userId,
            status: "OPEN",
            createdAt: new Date().toISOString(),
          },
          {
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          },
        );
      }
      // On clôture quand même la réservation en la rejetant
      await axios.patch(
        `${API_URL}/reservations/${selected.id}`,
        { status: "REJECTED", validationDate: new Date().toISOString() },
        {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        },
      );
      setSuccess(true);
      setReservations((prev) => prev.filter((r) => r.id !== selected.id));
    } catch (err) {
      console.error("Erreur refus retour :", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getResource = (id: number) => myResources.find((r) => r.id === id);
  const getGroup = (id: number) => groups.find((g) => g.id === id);
  const getMembers = (groupId: number) => {
    const ids = new Set(
      groupStudents
        .filter((gs) => gs.reservationGroupId === groupId)
        .map((gs) => gs.studentId),
    );
    return students.filter((s) => ids.has(s.id));
  };

  const overdue = reservations.filter((r) => new Date(r.endDate) < new Date());
  const onTime = reservations.filter((r) => new Date(r.endDate) >= new Date());

  return (
    <ProfessorLayout titleHeader="Validation des retours">
      <div className="min-h-screen bg-gray-100 p-6">
        {/* EN-TÊTE */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Validation des retours</h1>
            <p className="text-gray-500 mt-1">
              {loading
                ? "…"
                : `${reservations.length} emprunt${reservations.length !== 1 ? "s" : ""} à traiter`}
            </p>
          </div>
          {!loading && overdue.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
              <IconWarning />
              {overdue.length} retour{overdue.length > 1 ? "s" : ""} en retard
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 italic py-16">Chargement…</p>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-14 text-center">
            <div className="flex justify-center mb-4 text-green-500">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-700">
              Tout est à jour !
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Aucun retour à valider sur vos ressources.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* EN RETARD */}
            {overdue.length > 0 && (
              <section>
                <p className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <IconWarning /> En retard
                </p>
                <div className="space-y-3">
                  {overdue.map((r) => (
                    <RetourCard
                      key={r.id}
                      reservation={r}
                      resource={getResource(r.ressourceId)}
                      group={getGroup(r.reserveById)}
                      members={getMembers(r.reserveById)}
                      overdue
                      onValider={() => openModal(r)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* EN COURS */}
            {onTime.length > 0 && (
              <section>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Emprunts en cours
                </p>
                <div className="space-y-3">
                  {onTime.map((r) => (
                    <RetourCard
                      key={r.id}
                      reservation={r}
                      resource={getResource(r.ressourceId)}
                      group={getGroup(r.reserveById)}
                      members={getMembers(r.reserveById)}
                      overdue={false}
                      onValider={() => openModal(r)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="val-modal-header px-6 py-5 text-white">
                <h2 className="text-xl font-semibold">Confirmer le retour</h2>
                <p className="text-sm opacity-80 mt-0.5">
                  {getResource(selected.ressourceId)?.name || "—"}
                </p>
              </div>

              {success ? (
                <div className="px-6 py-12 text-center">
                  <div className="flex justify-center mb-4 text-green-500">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 12L11 15L16 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-800">
                    Retour traité !
                  </p>
                  <p className="text-gray-500 text-sm mt-1 mb-6">
                    La ressource a été remise comme disponible.
                  </p>
                  <button
                    onClick={closeModal}
                    className="val-confirm-btn text-white px-6 py-2 rounded-lg cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-5">
                  {/* Récap */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Emprunté du
                        </p>
                        <p className="font-medium text-gray-700 flex items-center gap-1.5">
                          <IconCalendar />
                          {formatDate(selected.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Prévu jusqu'au
                        </p>
                        <p
                          className={`font-medium flex items-center gap-1.5 ${new Date(selected.endDate) < new Date() ? "text-red-600" : "text-gray-700"}`}
                        >
                          <IconCalendar />
                          {formatDate(selected.endDate)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Durée totale</p>
                      <p className="font-medium text-gray-700">
                        {formatDuration(selected.startDate, selected.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <IconUsers /> Groupe emprunteur
                      </p>
                      <p className="font-medium text-gray-700">
                        {getGroup(selected.reserveById)?.name || "—"}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {getMembers(selected.reserveById)
                          .map((s) => `${s.firstName} ${s.lastName}`)
                          .join(", ") || "—"}
                      </p>
                    </div>
                  </div>

                  {/* État du retour */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      État du matériel à la réception
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setEtat("bon")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition cursor-pointer ${
                          etat === "bon"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${etat === "bon" ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}
                        >
                          {etat === "bon" && <IconCheck />}
                        </div>
                        Bon état
                      </button>
                      <button
                        onClick={() => setEtat("degrade")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition cursor-pointer ${
                          etat === "degrade"
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${etat === "degrade" ? "border-red-400 bg-red-400 text-white" : "border-gray-300"}`}
                        >
                          {etat === "degrade" && <IconClose />}
                        </div>
                        Dégradé / Manque
                      </button>
                    </div>
                  </div>

                  {/* Commentaire (affiché si dégradé, optionnel si bon état) */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Commentaire{" "}
                      {etat === "degrade" ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="text-gray-400 font-normal">
                          (optionnel)
                        </span>
                      )}
                    </label>
                    <textarea
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      rows={3}
                      placeholder={
                        etat === "degrade"
                          ? "Décrivez le problème constaté…"
                          : "Remarques éventuelles…"
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A8C85] resize-none"
                    />
                    {etat === "degrade" && !commentaire.trim() && (
                      <p className="text-xs text-red-500 mt-1">
                        Un commentaire est requis en cas de problème.
                      </p>
                    )}
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={closeModal}
                      className="flex-1 val-cancel-btn py-2.5 rounded-lg text-sm cursor-pointer"
                    >
                      Annuler
                    </button>
                    {etat === "degrade" ? (
                      <button
                        onClick={handleRefuser}
                        disabled={!commentaire.trim() || submitting}
                        className={`flex-1 val-reject-btn text-white py-2.5 rounded-lg text-sm font-medium transition ${!commentaire.trim() || submitting ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {submitting ? "Traitement…" : "Signaler et clôturer"}
                      </button>
                    ) : (
                      <button
                        onClick={handleValider}
                        disabled={!canSubmit}
                        className={`flex-1 val-confirm-btn text-white py-2.5 rounded-lg text-sm font-medium transition ${canSubmit ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                      >
                        {submitting ? "Traitement…" : "Confirmer le retour"}
                      </button>
                    )}
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

// ── Carte ─────────────────────────────────────────────────────────────────────

function RetourCard({
  reservation,
  resource,
  group,
  members,
  overdue,
  onValider,
}: {
  reservation: Reservation;
  resource: Resource | undefined;
  group: ReservationGroup | undefined;
  members: Student[];
  overdue: boolean;
  onValider: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${overdue ? "border-red-400" : "border-[#3A8C85]"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`p-2 rounded-full mt-0.5 ${overdue ? "bg-red-50 text-red-500" : "bg-[#E8F4F3] text-[#3A8C85]"}`}
          >
            <IconBox />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-800">
                {resource?.name || "—"}
              </p>
              {overdue && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  En retard
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <IconUsers />
              <span>{group?.name || "—"}</span>
              {members.length > 0 && (
                <span className="text-gray-400 text-xs">
                  ·{" "}
                  {members
                    .map((s) => `${s.firstName} ${s.lastName}`)
                    .join(", ")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <IconCalendar />
              Du {formatDate(reservation.startDate)} au{" "}
              <span className={overdue ? "text-red-500 font-medium" : ""}>
                {formatDate(reservation.endDate)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onValider}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-white transition cursor-pointer ${overdue ? "val-overdue-btn" : "val-confirm-btn"}`}
        >
          Valider le retour
        </button>
      </div>
    </div>
  );
}
