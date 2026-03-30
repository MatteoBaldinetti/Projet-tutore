import HeaderSidebar from "./HeaderSidebar";
import StudentSidebar from "./StudentSidebar";

type StudentLayoutProps = {
    children: React.ReactNode;
    titleHeader?: string;
};

function Layout({ children, titleHeader }: StudentLayoutProps) {
    return (
        <div className="h-screen grid grid-cols-[250px_1fr]">
            {/* SIDEBAR */}
            <aside>
                <StudentSidebar />
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