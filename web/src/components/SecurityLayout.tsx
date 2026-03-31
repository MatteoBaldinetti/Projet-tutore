import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

type SecurityLayoutProps = {
    children: React.ReactNode;
    title?: string;
};

function SecurityLayout({ children, title }: SecurityLayoutProps) {
    const { userFirstname, userLastname, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* HEADER */}
            <header className="bg-[#39393A] text-white px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Logo className="w-12 h-12" />
                    <span className="text-white text-2xl font-bold tracking-wider uppercase">Pret&Go</span>

                    {title && (
                        <>
                            <span className="text-[#4a4a4b] select-none">/</span>
                            <span className="font-medium text-[#CBD5E1]">{title}</span>
                        </>
                    )}
                </div>

                {/* Droite */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium">{userFirstname} {userLastname}</p>
                        <p className="text-xs text-[#64748B]">Agent de sécurité</p>
                    </div>
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
