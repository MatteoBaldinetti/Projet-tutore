import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavItem = { label: string; href: string; icon: React.ReactNode };
type NavGroup = { label: string; icon: React.ReactNode; items: NavItem[] };

const IconDashboard = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z"
      fill="currentColor"
    />
  </svg>
);
const IconCalendar = () => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z"
      fill="currentColor"
    />
  </svg>
);
const IconBox = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M9 18L0 13V5L9 0L18 5V13L9 18ZM9 9.9L15.9 6L9 2.1L2.1 6L9 9.9ZM9 16L16 12.05V7.15L9 11.1V16ZM2 12.05L9 16V11.1L2 7.15V12.05Z"
      fill="currentColor"
    />
  </svg>
);
const IconDoor = () => (
  <svg
    width="16"
    height="18"
    viewBox="0 0 16 18"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M0 18V16H2V2C2 1.45 2.196 0.979 2.588 0.587C2.979 0.196 3.45 0 4 0H14C14.55 0 15.021 0.196 15.413 0.587C15.804 0.979 16 1.45 16 2V16H18V18H0ZM4 16H14V2H4V16ZM6 10C6.283 10 6.521 9.904 6.713 9.713C6.904 9.521 7 9.283 7 9C7 8.717 6.904 8.479 6.713 8.287C6.521 8.096 6.283 8 6 8C5.717 8 5.479 8.096 5.287 8.287C5.096 8.479 5 8.717 5 9C5 9.283 5.096 9.521 5.287 9.713C5.479 9.904 5.717 10 6 10Z"
      fill="currentColor"
    />
  </svg>
);
const IconBell = () => (
  <svg
    width="16"
    height="18"
    viewBox="0 0 16 18"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M0 15V13H2V7C2 5.617 2.417 4.387 3.25 3.312C4.083 2.238 5.167 1.533 6.5 1.2V0.5C6.5 0.217 6.596 0 6.788 0C6.979 0 7.217 0 7.5 0H8.5C8.783 0 9.021 0 9.213 0C9.404 0 9.5 0.217 9.5 0.5V1.2C10.833 1.533 11.917 2.238 12.75 3.312C13.583 4.387 14 5.617 14 7V13H16V15H0ZM8 18C7.45 18 6.979 17.804 6.588 17.413C6.196 17.021 6 16.55 6 16H10C10 16.55 9.804 17.021 9.413 17.413C9.021 17.804 8.55 18 8 18ZM4 13H12V7C12 5.9 11.608 4.958 10.825 4.175C10.042 3.392 9.1 3 8 3C6.9 3 5.958 3.392 5.175 4.175C4.392 4.958 4 5.9 4 7V13Z"
      fill="currentColor"
    />
  </svg>
);
const IconUser = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z"
      fill="currentColor"
    />
  </svg>
);
const IconWarning = () => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    className="w-5 h-5 shrink-0"
  >
    <path
      d="M0 16L9 0L18 16H0ZM2.45 14H15.55L9 2.9L2.45 14ZM9 13C9.283 13 9.521 12.904 9.713 12.713C9.904 12.521 10 12.283 10 12C10 11.717 9.904 11.479 9.713 11.287C9.521 11.096 9.283 11 9 11C8.717 11 8.479 11.096 8.287 11.287C8.096 11.479 8 11.717 8 12C8 12.283 8.096 12.521 8.287 12.713C8.479 12.904 8.717 13 9 13ZM8 10H10V7H8V10Z"
      fill="currentColor"
    />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    className={`w-3 h-3 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <path
      d="M1 1L6 6L11 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const navGroups: NavGroup[] = [
  {
    label: "Réservations",
    icon: <IconCalendar />,
    items: [
      {
        label: "À valider",
        href: "/professor/reservations/pending",
        icon: <IconCalendar />,
      },
      {
        label: "Toutes",
        href: "/professor/reservations",
        icon: <IconCalendar />,
      },
    ],
  },
  {
    label: "Retours",
    icon: <IconCalendar />,
    items: [
      {
        label: "Validation des retours",
        href: "/professor/validation-retour",
        icon: <IconCalendar />,
      },
    ],
  },
  {
    label: "Mes ressources",
    icon: <IconBox />,
    items: [
      {
        label: "Mes matériels",
        href: "/professor/resources/items",
        icon: <IconBox />,
      },
      {
        label: "Mes salles",
        href: "/professor/resources/classrooms",
        icon: <IconDoor />,
      },
    ],
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const navigate = useNavigate();
  return (
    <div
      className={`border-l-4 rounded-r-lg transition-colors cursor-pointer ${
        active
          ? "border-[#3A8C85] bg-[#3A8C851A] text-[#3A8C85]"
          : "border-transparent hover:border-[#3A8C85] hover:bg-[#3A8C851A] hover:text-[#3A8C85]"
      }`}
      onClick={() => navigate(item.href)}
    >
      <span className="flex items-center gap-2 pl-3 py-2.5 text-sm">
        {item.icon}
        {item.label}
      </span>
    </div>
  );
}

function NavGroupSection({
  group,
  currentPath,
}: {
  group: NavGroup;
  currentPath: string;
}) {
  const isGroupActive = group.items.some((item) => item.href === currentPath);
  const [open, setOpen] = useState(isGroupActive);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 pl-3 pr-3 py-2.5 rounded-lg transition-colors ${
          isGroupActive
            ? "text-[#3A8C85]"
            : "hover:text-[#3A8C85] hover:bg-[#3A8C851A]"
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          {group.icon}
          {group.label}
        </span>
        <IconChevron open={open} />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: open
            ? `${contentRef.current?.scrollHeight ?? 500}px`
            : "0px",
          overflow: "hidden",
          transition: "max-height 0.25s ease-in-out",
        }}
      >
        <div className="ml-4 mt-1 mb-1 space-y-1">
          {group.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={currentPath === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfessorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const simpleLinks = [
    {
      href: "/professor/dashboard",
      label: "Tableau de bord",
      icon: <IconDashboard />,
    },
    {
      href: "/professor/notifications",
      label: "Notifications",
      icon: <IconBell />,
    },
    {
      href: "/professor/reports",
      label: "Signalements reçus",
      icon: <IconWarning />,
    },
    { href: "/professor/profile", label: "Mon profil", icon: <IconUser /> },
  ];

  return (
    <aside className="h-screen bg-[#39393A] text-[#CBD5E1] overflow-y-auto">
      <nav className="p-4 space-y-1">
        {/* Tableau de bord */}
        <div
          className={`border-l-4 rounded-r-lg transition-colors cursor-pointer ${
            currentPath === "/professor/dashboard"
              ? "border-[#3A8C85] bg-[#3A8C851A] text-[#3A8C85]"
              : "border-transparent hover:border-[#3A8C85] hover:bg-[#3A8C851A] hover:text-[#3A8C85]"
          }`}
          onClick={() => navigate("/professor/dashboard")}
        >
          <span className="flex items-center gap-2 pl-3 py-3 text-sm">
            <IconDashboard />
            Tableau de bord
          </span>
        </div>

        <div className="border-t border-[#4a4a4b] my-2" />

        {navGroups.map((group) => (
          <NavGroupSection
            key={group.label}
            group={group}
            currentPath={currentPath}
          />
        ))}

        <div className="border-t border-[#4a4a4b] my-2" />

        {[
          {
            href: "/professor/notifications",
            label: "Notifications",
            icon: <IconBell />,
          },
          {
            href: "/professor/reports",
            label: "Signalements reçus",
            icon: <IconWarning />,
          },
        ].map((link) => (
          <div
            key={link.href}
            className={`border-l-4 rounded-r-lg transition-colors cursor-pointer ${
              currentPath === link.href
                ? "border-[#3A8C85] bg-[#3A8C851A] text-[#3A8C85]"
                : "border-transparent hover:border-[#3A8C85] hover:bg-[#3A8C851A] hover:text-[#3A8C85]"
            }`}
            onClick={() => navigate(link.href)}
          >
            <span className="flex items-center gap-2 pl-3 py-3 text-sm">
              {link.icon}
              {link.label}
            </span>
          </div>
        ))}

        <div className="border-t border-[#4a4a4b] my-2" />

        <div
          className={`border-l-4 rounded-r-lg transition-colors cursor-pointer ${
            currentPath === "/professor/profile"
              ? "border-[#3A8C85] bg-[#3A8C851A] text-[#3A8C85]"
              : "border-transparent hover:border-[#3A8C85] hover:bg-[#3A8C851A] hover:text-[#3A8C85]"
          }`}
          onClick={() => navigate("/professor/profile")}
        >
          <span className="flex items-center gap-2 pl-3 py-3 text-sm">
            <IconUser />
            Mon profil
          </span>
        </div>
      </nav>
    </aside>
  );
}

export default ProfessorSidebar;
