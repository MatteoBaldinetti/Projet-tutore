import HeaderSidebar from "./HeaderSidebar";
import ProfessorSidebar from "./ProfessorSidebar";

type ProfessorLayoutProps = {
    children: React.ReactNode;
    titleHeader?: string;
};

function ProfessorLayout({ children, titleHeader }: ProfessorLayoutProps) {
    return (
        <div className="h-screen grid grid-cols-[250px_1fr]">
            <aside>
                <ProfessorSidebar />
            </aside>
            <main className="overflow-auto">
                <HeaderSidebar title={titleHeader} />
                {children}
            </main>
        </div>
    );
}

export default ProfessorLayout;
