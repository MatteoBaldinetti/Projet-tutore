import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import type {
  Reservation,
  Resource,
  ReservationGroup,
  ReservationGroupStudent,
} from "../../../types/types";
import StudentLayout from "../../components/StudentLayout";
import "../../styles/RetourEmprunt.css";

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z"
      fill="currentColor"
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

function CheckItem({
  label,
  checked,
  onChange,
}: {
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
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
          checked
            ? "bg-[#3A8C85] border-[#3A8C85] text-white"
            : "border-gray-300"
        }`}
      >
        {checked && <IconCheck />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

export default function RetourEmprunt() {
  const { userId } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [groups, setGroups] = useState<ReservationGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Reservation | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resrvRes, resrcRes, grpRes, gsRes] = await Promise.all([
          axios.get(`${API_URL}/reservations`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/resources`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/reservationGroups`, {
            headers: { "x-api-key": API_KEY },
          }),
          axios.get(`${API_URL}/reservationGroupStudents`, {
            headers: { "x-api-key": API_KEY },
          }),
        ]);
        const myGroupIds = new Set(
          gsRes.data
            .filter((gs: ReservationGroupStudent) => gs.studentId === userId)
            .map((gs: ReservationGroupStudent) => gs.reservationGroupId),
        );
        setReservations(
          resrvRes.data.filter(
            (r: Reservation) =>
              myGroupIds.has(r.reservedById) && r.status === "APPROVED",
          ),
        );
        setResources(resrcRes.data);
        setGroups(grpRes.data);
      } catch (err) {
        console.error("Erreur retour emprunt :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  const openModal = (r: Reservation) => {
    setSelected(r);
    setChecked({ item: false, cables: false, damage: false, clean: false });
    setAcknowledged(false);
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

  const allChecked =
    Object.values(checked).length > 0 && Object.values(checked).every(Boolean);
  const canSubmit = allChecked && acknowledged && !submitting;

  const handleSubmit = async () => {
    if (!selected || !canSubmit) return;
    setSubmitting(true);
    try {
      await axios.patch(
        `${API_URL}/reservations/${selected.id}`,
        { status: "CANCELLED" },
        {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        },
      );
      setSuccess(true);
      setReservations((prev) => prev.filter((r) => r.id !== selected.id));
    } catch (err) {
      console.error("Erreur validation retour :", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getResource = (id: number) => resources.find((r) => r.id === id);
  const getGroup = (id: number) => groups.find((g) => g.id === id);
  const overdue = reservations.filter((r) => new Date(r.endDate) < new Date());
  const onTime = reservations.filter((r) => new Date(r.endDate) >= new Date());

  return (
    <StudentLayout titleHeader="Retour d'emprunt">
      <div className="min-h-screen bg-gray-100 p-6">
        {/* EN-TÊTE */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Mes emprunts en cours</h1>
            <p className="text-gray-500 mt-1">
              Signalez le retour de vos emprunts et confirmez l'état du
              matériel.
            </p>
          </div>
          {overdue.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
              <IconWarning />
              {overdue.length} emprunt{overdue.length > 1 ? "s" : ""} en retard
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
              Aucun emprunt en cours
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Vous n'avez rien à retourner pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {overdue.length > 0 && (
              <section>
                <p className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <IconWarning /> Retours en retard
                </p>
                <div className="space-y-3">
                  {overdue.map((r) => (
                    <EmpruntCard
                      key={r.id}
                      reservation={r}
                      resourceName={getResource(r.resourceId)?.name || "—"}
                      groupName={getGroup(r.reservedById)?.name || "—"}
                      overdue
                      onRetour={() => openModal(r)}
                    />
                  ))}
                </div>
              </section>
            )}
            {onTime.length > 0 && (
              <section>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Emprunts en cours
                </p>
                <div className="space-y-3">
                  {onTime.map((r) => (
                    <EmpruntCard
                      key={r.id}
                      reservation={r}
                      resourceName={getResource(r.resourceId)?.name || "—"}
                      groupName={getGroup(r.reservedById)?.name || "—"}
                      overdue={false}
                      onRetour={() => openModal(r)}
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
              <div className="retour-modal-header px-6 py-5 text-white">
                <h2 className="text-xl font-semibold">Déclarer un retour</h2>
                <p className="text-sm opacity-80 mt-0.5">
                  {getResource(selected.resourceId)?.name || "—"} ·{" "}
                  {getGroup(selected.reservedById)?.name || "—"}
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
                    Retour déclaré !
                  </p>
                  <p className="text-gray-500 text-sm mt-1 mb-6">
                    Votre déclaration a bien été enregistrée.
                  </p>
                  <button
                    onClick={closeModal}
                    className="retour-confirm-btn text-white px-6 py-2 rounded-lg cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-5">
                  {/* Récap dates */}
                  <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Emprunté du</p>
                      <p className="font-medium flex items-center gap-1.5 text-gray-700">
                        <IconCalendar />
                        {formatDate(selected.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">À rendre le</p>
                      <p
                        className={`font-medium flex items-center gap-1.5 ${new Date(selected.endDate) < new Date() ? "text-red-600" : "text-gray-700"}`}
                      >
                        <IconCalendar />
                        {formatDate(selected.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Vérifiez chaque point avant de valider
                    </p>
                    <div className="space-y-2">
                      <CheckItem
                        label={`Le matériel « ${getResource(selected.resourceId)?.name || "—"} » est restitué`}
                        checked={checked.item}
                        onChange={(v) => setChecked((p) => ({ ...p, item: v }))}
                      />
                      <CheckItem
                        label="Les câbles et accessoires sont bien inclus"
                        checked={checked.cables}
                        onChange={(v) =>
                          setChecked((p) => ({ ...p, cables: v }))
                        }
                      />
                      <CheckItem
                        label="Le matériel n'a subi aucun dommage"
                        checked={checked.damage}
                        onChange={(v) =>
                          setChecked((p) => ({ ...p, damage: v }))
                        }
                      />
                      <CheckItem
                        label="Le matériel est propre et en bon état général"
                        checked={checked.clean}
                        onChange={(v) =>
                          setChecked((p) => ({ ...p, clean: v }))
                        }
                      />
                    </div>
                    {!allChecked && (
                      <p className="text-xs text-gray-400 mt-2 text-right">
                        {Object.values(checked).filter(Boolean).length} /{" "}
                        {Object.keys(checked).length} points vérifiés
                      </p>
                    )}
                  </div>

                  {/* Case d'engagement */}
                  <div
                    onClick={() => setAcknowledged((p) => !p)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition select-none ${
                      acknowledged
                        ? "border-[#3A8C85] bg-[#E8F4F3]"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        acknowledged
                          ? "bg-[#3A8C85] border-[#3A8C85] text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {acknowledged && <IconCheck />}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>J'ai pris connaissance</strong> de mes
                      responsabilités concernant ce matériel et je certifie
                      l'avoir restitué dans l'état décrit ci-dessus. Cette
                      déclaration est transmise au responsable pour
                      confirmation.
                    </p>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={closeModal}
                      className="flex-1 retour-cancel-btn py-2.5 rounded-lg text-sm cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className={`flex-1 retour-confirm-btn text-white py-2.5 rounded-lg text-sm font-medium transition ${canSubmit ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                    >
                      {submitting ? "Envoi…" : "Déclarer le retour"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

function EmpruntCard({
  reservation,
  resourceName,
  groupName,
  overdue,
  onRetour,
}: {
  reservation: Reservation;
  resourceName: string;
  groupName: string;
  overdue: boolean;
  onRetour: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-5 border-l-4 flex items-center justify-between gap-4 ${overdue ? "border-red-400" : "border-[#3A8C85]"}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${overdue ? "bg-red-50 text-red-500" : "bg-[#E8F4F3] text-[#3A8C85]"}`}
        >
          <IconBox />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800">{resourceName}</p>
            {overdue && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                En retard
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{groupName}</p>
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
        onClick={onRetour}
        className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-white transition cursor-pointer ${overdue ? "retour-overdue-btn" : "retour-confirm-btn"}`}
      >
        Déclarer le retour
      </button>
    </div>
  );
}
