import { useState } from "react";
import HeaderSidebar from "./HeaderSidebar";
import ProfessorSidebar from "./ProfessorSidebar";

type ProfessorLayoutProps = {
    children: React.ReactNode;
    titleHeader?: string;
};

function ProfessorLayout({ children, titleHeader }: ProfessorLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col lg:grid lg:grid-cols-[250px_1fr]">

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64
                lg:static lg:w-auto lg:z-auto
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <ProfessorSidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Backdrop mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* CONTENU */}
            <main className="overflow-auto flex-1 flex flex-col min-h-0">
                <HeaderSidebar
                    title={titleHeader}
                    onMenuToggle={() => setSidebarOpen(prev => !prev)}
                />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default ProfessorLayout;
