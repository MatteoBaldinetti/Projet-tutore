import { useState } from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
    children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
    const [open, setOpen] = useState(true);

    return (
        <div className="h-screen">
            {/* SIDEBAR */}
            <Sidebar open={open} onClose={() => setOpen(false)} />

            {/* BOUTON OUVRIR MENU (flèche sur le bord gauche) */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="
                        fixed left-0 top-1/2 -translate-y-1/2
                        z-50
                        bg-gray-800 text-white rounded-r-lg
                        p-1.5
                        shadow-md
                        hover:bg-gray-700
                        focus:outline-none
                    "
                >
                    ▶
                </button>
            )}

            {/* CONTENU */}
            <main
                className={`
                    h-screen overflow-y-auto
                    transition-all duration-300
                    ${open ? "ml-64" : "ml-0"}
                `}
            >
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}

export default Layout;