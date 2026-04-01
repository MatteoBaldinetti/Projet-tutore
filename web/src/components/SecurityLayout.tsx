import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

type SecurityLayoutProps = {
    children: React.ReactNode;
    title?: string;
};

function SecurityLayout({ children, title }: SecurityLayoutProps) {
    const { userFirstname, userLastname, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* HEADER */}
            <header className="bg-[#39393A] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-md gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Logo className="w-9 h-9 sm:w-12 sm:h-12 shrink-0" />
                    <span className="text-white text-lg sm:text-2xl font-bold tracking-wider uppercase shrink-0">Pret&Go</span>
                    {title && (
                        <>
                            <span className="text-[#4a4a4b] select-none hidden sm:inline">/</span>
                            <span className="font-medium text-[#CBD5E1] truncate hidden sm:inline">{title}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button
                        onClick={() => navigate("/security/profile")}
                        className="text-right hover:opacity-80 transition cursor-pointer hidden sm:block"
                    >
                        <p className="text-sm font-medium">{userFirstname} {userLastname}</p>
                        <p className="text-xs text-[#64748B]">Agent de sécurité</p>
                    </button>
                    <button
                        onClick={logout}
                        className="bg-[#4a4a4b] hover:bg-[#5a5a5b] p-2.5 rounded-full cursor-pointer transition"
                        title="Se déconnecter"
                    >
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor" className="text-[#CBD5E1]">
                            <path d="M2 18C1.45 18 0.979 17.804 0.588 17.413C0.196 17.021 0 16.55 0 16V2C0 1.45 0.196 0.979 0.588 0.588C0.979 0.196 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z"/>
                        </svg>
                    </button>
                </div>
            </header>

            {/* CONTENU */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

export default SecurityLayout;
