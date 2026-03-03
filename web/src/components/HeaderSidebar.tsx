import { useAuth } from "../contexts/AuthContext";

export default function HeaderSidebar(props: any) {
    const { userFirstname, userLastname, userType, logout } = useAuth();

    return (
        <div className="flex items-center justify-between p-3 mx-5">

            {/* Titre à gauche */}
            <h1 className="text-xl font-semibold">
                {props.title}
            </h1>

            {/* Partie droite */}
            <div className="flex items-center gap-5">
                <div className="text-right">
                    <p>{userFirstname} {userLastname}</p>
                    <p className="text-[#64748B] text-sm">{userType}</p>
                </div>

                <button className="bg-[#F1F5F9] p-3 rounded-full cursor-pointer hover:bg-gray-200 transition" onClick={logout}>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="currentColor"
                        className="text-[#39393A]"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2.00023 18C1.45023 18 0.979401 17.8042 0.587734 17.4125C0.196068 17.0208 0.000234375 16.55 0.000234375 16V2C0.000234375 1.45 0.196068 0.979167 0.587734 0.5875C0.979401 0.195833 1.45023 0 2.00023 0H9.00023V2H2.00023V16H9.00023V18H2.00023ZM13.0002 14L11.6252 12.55L14.1752 10H6.00023V8H14.1752L11.6252 5.45L13.0002 4L18.0002 9L13.0002 14Z" />
                    </svg>
                </button>
            </div>

        </div>
    );
}