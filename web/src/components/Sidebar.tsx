function Sidebar() {
    return (
        <aside className="h-screen bg-[#39393A] text-[#CBD5E1]">
            <nav className="p-4 space-y-3">
                <a href="#" className="block hover:text-gray-500">
                    Dashboard
                </a>
                <a href="#" className="block hover:text-gray-500">
                    Réservations
                </a>
                <a href="#" className="block hover:text-gray-500">
                    Paramètres
                </a>
            </nav>
        </aside>
    );
} 

export default Sidebar;