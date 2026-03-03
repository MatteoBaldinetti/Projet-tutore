import HeaderSidebar from "./HeaderSidebar";
import Sidebar from "./Sidebar";

type LayoutProps = {
    children: React.ReactNode;
    titleHeader?: string;
};

function Layout({ children, titleHeader }: LayoutProps) {
    return (
        <div className="h-screen grid grid-cols-[250px_1fr]">
            {/* SIDEBAR */}
            <aside>
                <Sidebar />
            </aside>

            {/* CONTENU */}
            <main className="overflow-auto">
                <HeaderSidebar
                    title={titleHeader}
                />
                {children}
            </main>
        </div>
    );
}

export default Layout;