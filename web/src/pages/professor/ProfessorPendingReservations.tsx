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
import "../../styles/ProfessorReservations.css";

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
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}`;
};

export default function ProfessorPendingReservations() {
  const { userId } = useAuth();

  const [pendingReservations, setPendingReservations] = useState<Reservation[]>(
    [],
  );
  const [resources, setResources] = useState<Resource[]>([]);
  const [groups, setGroups] = useState<ReservationGroup[]>([]);
  const [groupStudents, setGroupStudents] = useState<ReservationGroupStudent[]>(
    [],
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchAll = async () => {
    try {
      const [resourcesRes, reservationsRes, groupsRes, gsRes, studentsRes] =
        await Promise.all([
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

      const mine: Resource[] = resourcesRes.data.filter(
        (r: Resource) => userId !== null && r.managedByIds?.includes(userId),
      );
      setResources(mine);
      const myIds = new Set(mine.map((r) => r.id));

      const pending: Reservation[] = reservationsRes.data
        .filter(
          (r: Reservation) =>
            myIds.has(r.ressourceId) && r.status === "PENDING",
        )
        .sort(
          (a: Reservation, b: Reservation) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      setPendingReservations(pending);
      setGroups(groupsRes.data);
      setGroupStudents(gsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("Erreur pending reservations :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [userId]);

  const updateStatus = async (id: number, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      await axios.patch(
        `${API_URL}/reservations/${id}`,
        {
          status,
          validationDate:
            status === "APPROVED" ? new Date().toISOString() : null,
        },
        {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        },
      );
      setPendingReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erreur mise à jour statut :", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getResourceName = (id: number) =>
    resources.find((r) => r.id === id)?.name || "—";
  const getGroupName = (id: number) =>
    groups.find((g) => g.id === id)?.name || "—";

  const getGroupStudentNames = (groupId: number): string => {
    const memberIds = groupStudents
      .filter((gs) => gs.reservationGroupId === groupId)
      .map((gs) => gs.studentId);
    const names = students
      .filter((s) => memberIds.includes(s.id))
      .map((s) => `${s.firstName} ${s.lastName}`);
    return names.length > 0 ? names.join(", ") : "—";
  };

  return (
    <ProfessorLayout titleHeader="Réservations à valider">
      <div className="min-h-screen bg-gray-100 p-6">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Réservations à valider</h1>
            <p className="text-gray-500 mt-1">
              {loading
                ? "…"
                : `${pendingReservations.length} demande${pendingReservations.length !== 1 ? "s" : ""} en attente`}
            </p>
          </div>
          {!loading && pendingReservations.length > 0 && (
            <div className="w-12 h-12 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center">
              <span className="text-yellow-700 font-bold text-lg">
                {pendingReservations.length}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 italic py-10">Chargement…</p>
        ) : pendingReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-16 text-center">
            <div className="flex justify-center mb-4">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                className="text-green-400"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">
              Tout est à jour !
            </p>
            <p className="text-gray-400 italic text-sm">
              Aucune réservation en attente de validation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReservations.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* INFOS PRINCIPALES */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Ressource
                      </p>
                      <p className="font-semibold text-gray-800">
                        {getResourceName(r.ressourceId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Groupe demandeur
                      </p>
                      <p className="font-medium text-gray-700">
                        {getGroupName(r.reserveById)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Étudiants
                      </p>
                      <p className="text-sm text-gray-600">
                        {getGroupStudentNames(r.reserveById)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Demandé le
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Créneau demandé
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        Du{" "}
                        <span className="text-[#3A8C85]">
                          {formatDate(r.startDate)}
                        </span>{" "}
                        au{" "}
                        <span className="text-[#3A8C85]">
                          {formatDate(r.endDate)}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          ({formatDuration(r.startDate, r.endDate)})
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-3 min-w-36">
                    <button
                      onClick={() => updateStatus(r.id, "APPROVED")}
                      disabled={processingId === r.id}
                      className="approve-btn text-white py-2.5 px-5 rounded-lg font-medium transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {processingId === r.id ? (
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      Approuver
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "REJECTED")}
                      disabled={processingId === r.id}
                      className="reject-btn text-white py-2.5 px-5 rounded-lg font-medium transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Refuser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfessorLayout>
  );
}
