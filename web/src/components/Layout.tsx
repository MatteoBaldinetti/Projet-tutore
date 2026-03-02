import Sidebar from "./Sidebar";

type LayoutProps = {
    children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
    return (
        <div className="h-screen grid grid-cols-[250px_1fr]">
            {/* SIDEBAR */}
            <aside>
                <Sidebar />
            </aside>

            {/* CONTENU */}
            <main className="overflow-auto">
                {children}
            </main>
        </div>
    );
}

export default Layout;