import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type {
  Student,
  Professor,
  Reservation,
  Resource,
  Report,
} from "../../../types/types";
import Layout from "../../components/Layout";
import "../../styles/AdminDashboard.css";

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const STATUS_RESERVATION_LABELS: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: { label: "En attente", className: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Approuvée", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Refusée", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Annulée", className: "bg-gray-100 text-gray-500" },
};

const STATUS_REPORT_LABELS: Record<
  string,
  { label: string; className: string }
> = {
  OPEN: { label: "Ouvert", className: "bg-red-100 text-red-700" },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-yellow-100 text-yellow-700",
  },
  RESOLVED: { label: "Résolu", className: "bg-green-100 text-green-700" },
  CLOSED: { label: "Fermé", className: "bg-gray-100 text-gray-500" },
};

// ── Icônes ──────────────────────────────────────────────────────────────────

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGraduation = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 10V16M22 10L12 5L2 10L12 15L22 10ZM6 12.5V17.5C6 17.5 8.5 20 12 20C15.5 20 18 17.5 18 17.5V12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z"
      fill="currentColor"
    />
  </svg>
);

const IconWarning = () => (
  <svg width="22" height="22" viewBox="0 0 18 16" fill="none">
    <path
      d="M0 16L9 0L18 16H0ZM2.45 14H15.55L9 2.9L2.45 14ZM9 13C9.283 13 9.521 12.904 9.713 12.713C9.904 12.521 10 12.283 10 12C10 11.717 9.904 11.479 9.713 11.287C9.521 11.096 9.283 11 9 11C8.717 11 8.479 11.096 8.287 11.287C8.096 11.479 8 11.717 8 12C8 12.283 8.096 12.521 8.287 12.713C8.479 12.904 8.717 13 9 13ZM8 10H10V7H8V10Z"
      fill="currentColor"
    />
  </svg>
);

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 6V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 16 18" fill="none">
    <path
      d="M0 15V13H2V7C2 5.617 2.417 4.387 3.25 3.312C4.083 2.238 5.167 1.533 6.5 1.2V0.5C6.5 0.217 6.788 0 7.5 0H8.5C9.213 0 9.5 0.217 9.5 0.5V1.2C10.833 1.533 11.917 2.238 12.75 3.312C13.583 4.387 14 5.617 14 7V13H16V15H0ZM8 18C7.45 18 6.979 17.804 6.588 17.413C6.196 17.021 6 16.55 6 16H10C10 16.55 9.804 17.021 9.413 17.413C9.021 17.804 8.55 18 8 18ZM4 13H12V7C12 5.9 11.608 4.958 10.825 4.175C10.042 3.392 9.1 3 8 3C6.9 3 5.958 3.392 5.175 4.175C4.392 4.958 4 5.9 4 7V13Z"
      fill="currentColor"
    />
  </svg>
);

// ── Composant principal ──────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { userFirstname, userLastname } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studRes, profRes, resrcRes, resvRes, repRes] = await Promise.all(
          [
            axios.get(`${API_URL}/students`, {
              headers: { "x-api-key": API_KEY },
            }),
            axios.get(`${API_URL}/professors`, {
              headers: { "x-api-key": API_KEY },
            }),
            axios.get(`${API_URL}/resources`, {
              headers: { "x-api-key": API_KEY },
            }),
            axios.get(`${API_URL}/reservations`, {
              headers: { "x-api-key": API_KEY },
            }),
            axios.get(`${API_URL}/reports`, {
              headers: { "x-api-key": API_KEY },
            }),
          ],
        );
        setStudents(studRes.data);
        setProfessors(profRes.data);
        setResources(resrcRes.data);
        setReservations(resvRes.data);
        setReports(repRes.data);
      } catch (err) {
        console.error("Erreur dashboard admin :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Stats calculées
  const pendingReservations = reservations.filter(
    (r) => r.status === "PENDING",
  );
  const openReports = reports.filter((r) => r.status === "OPEN");
  const availableResources = resources.filter((r) => r.available);

  const stats = [
    {
      label: "Étudiants inscrits",
      value: students.length,
      icon: <IconUsers />,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
      textColor: "text-blue-700",
    },
    {
      label: "Professeurs",
      value: professors.length,
      icon: <IconGraduation />,
      color: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
      textColor: "text-teal-700",
    },
    {
      label: "Réservations en attente",
      value: pendingReservations.length,
      icon: <IconClock />,
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-500",
      textColor: "text-yellow-700",
    },
    {
      label: "Signalements ouverts",
      value: openReports.length,
      icon: <IconWarning />,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-500",
      textColor: "text-red-700",
    },
  ];

  // 5 dernières réservations en attente
  const latestPending = [...pendingReservations]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // 5 derniers signalements ouverts
  const latestReports = [...openReports]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const getResourceName = (id: number) =>
    resources.find((r) => r.id === id)?.name || "—";

  return (
    <Layout titleHeader="Tableau de bord">
      <div className="min-h-screen bg-gray-100 p-6">
        {/* WELCOME */}
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Bonjour, {userFirstname} {userLastname}
            </h1>
            <p className="text-gray-500 mt-1">
              Bienvenue sur votre espace administrateur Prêt&Go.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-400">
            <span>
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-xl shadow-md p-5 border ${stat.color}`}
            >
              <div className={`mb-3 ${stat.iconColor}`}>{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.textColor}`}>
                {loading ? "…" : stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* RESSOURCES — ligne de contexte rapide */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-3">
            <span className={`admin-icon-badge text-[#3A8C85]`}>
              <IconBox />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "…" : resources.length}
              </p>
              <p className="text-sm text-gray-500">Ressources totales</p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="admin-icon-badge text-green-600">
              <IconBox />
            </span>
            <div>
              <p className="text-2xl font-bold text-green-700">
                {loading ? "…" : availableResources.length}
              </p>
              <p className="text-sm text-gray-500">Disponibles</p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="admin-icon-badge text-red-400">
              <IconBox />
            </span>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {loading ? "…" : resources.length - availableResources.length}
              </p>
              <p className="text-sm text-gray-500">Indisponibles</p>
            </div>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => navigate("/admin/manage-items")}
            className="admin-link-btn text-sm cursor-pointer"
          >
            Gérer les ressources →
          </button>
        </div>

        {/* GRILLE : réservations en attente + signalements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RÉSERVATIONS EN ATTENTE */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Réservations en attente</h2>
              <button
                onClick={() => navigate("/admin/manage-reservations")}
                className="text-sm admin-link-btn cursor-pointer"
              >
                Voir tout →
              </button>
            </div>
            {loading ? (
              <p className="text-gray-400 italic text-sm">Chargement…</p>
            ) : latestPending.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-2 flex justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 italic text-sm">
                  Aucune réservation en attente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {latestPending.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-100"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {getResourceName(r.resourceId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(r.startDate)} → {formatDate(r.endDate)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_RESERVATION_LABELS[r.status]?.className}`}
                    >
                      {STATUS_RESERVATION_LABELS[r.status]?.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIGNALEMENTS OUVERTS */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Signalements ouverts</h2>
              <button
                onClick={() => navigate("/admin/manage-reports")}
                className="text-sm admin-link-btn cursor-pointer"
              >
                Voir tout →
              </button>
            </div>
            {loading ? (
              <p className="text-gray-400 italic text-sm">Chargement…</p>
            ) : latestReports.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-2 flex justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 italic text-sm">
                  Aucun signalement ouvert.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {latestReports.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-red-50 border border-red-100 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {getResourceName(r.resourceId)}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {r.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${STATUS_REPORT_LABELS[r.status]?.className}`}
                    >
                      {STATUS_REPORT_LABELS[r.status]?.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RACCOURCIS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <IconUsers />,
              label: "Gérer les étudiants",
              sub: "Ajouter, modifier ou désactiver des comptes",
              href: "/admin/manage-students",
            },
            {
              icon: <IconGraduation />,
              label: "Gérer les professeurs",
              sub: "Administrer les comptes professeurs",
              href: "/admin/manage-professors",
            },
            {
              icon: <IconBox />,
              label: "Gérer les matériels",
              sub: "Ressources, types et disponibilités",
              href: "/admin/manage-items",
            },
            {
              icon: <IconBell />,
              label: "Envoyer des notifications",
              sub: "Communiquer avec les utilisateurs",
              href: "/admin/manage-notifications",
            },
          ].map((s) => (
            <button
              key={s.href}
              onClick={() => navigate(s.href)}
              className="admin-shortcut-btn text-white rounded-xl p-5 text-left transition cursor-pointer"
            >
              <div className="mb-3 opacity-90">{s.icon}</div>
              <div className="font-semibold">{s.label}</div>
              <div className="text-sm opacity-75 mt-1">{s.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
