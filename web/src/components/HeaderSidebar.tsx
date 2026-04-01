import { useAuth } from "../contexts/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

const IconMenu = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H18V2H0V0ZM0 6H18V8H0V6ZM0 12H18V14H0V12Z" fill="currentColor" />
  </svg>
);

export default function HeaderSidebar({ title, onMenuToggle }: { title?: string; onMenuToggle?: () => void }) {
  const { userFirstname, userLastname, userType, logout } = useAuth();

  const getUserTypeLabel = (type: string | null) => {
    switch (type) {
      case "ADMIN": return "Administrateur";
      case "PROFESSOR": return "Professeur";
      case "STUDENT": return "Étudiant";
      case "SECURITY": return "Agent de sécurité";
      default: return type;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 px-4 border-b border-gray-100">
      {/* Gauche : hamburger + titre */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer transition text-[#39393A] shrink-0"
            aria-label="Menu"
          >
            <IconMenu />
          </button>
        )}
        <h1 className="text-lg sm:text-xl font-semibold truncate">{title}</h1>
      </div>

      {/* Droite */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-sm leading-tight">{userFirstname} {userLastname}</p>
          <p className="text-[#64748B] text-xs">{getUserTypeLabel(userType)}</p>
        </div>

        <NotificationDropdown />

        <button
          className="bg-[#F1F5F9] p-3 rounded-full cursor-pointer hover:bg-gray-200 transition"
          onClick={logout}
          title="Se déconnecter"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className="text-[#39393A]">
            <path d="M2.00023 18C1.45023 18 0.979401 17.8042 0.587734 17.4125C0.196068 17.0208 0.000234375 16.55 0.000234375 16V2C0.000234375 1.45 0.196068 0.979167 0.587734 0.5875C0.979401 0.195833 1.45023 0 2.00023 0H9.00023V2H2.00023V16H9.00023V18H2.00023ZM13.0002 14L11.6252 12.55L14.1752 10H6.00023V8H14.1752L11.6252 5.45L13.0002 4L18.0002 9L13.0002 14Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
