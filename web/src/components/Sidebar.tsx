type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <aside
            className={`
                fixed top-0 left-0
                h-screen w-64
                bg-white text-black shadow-md
                transform transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "-translate-x-full"}
            `}
        >
            {/* HEADER */}
            <div className="p-4 font-bold text-lg flex justify-between items-center border-b">
                Menu
                <button onClick={onClose}>✕</button>
            </div>

            {/* NAV */}
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