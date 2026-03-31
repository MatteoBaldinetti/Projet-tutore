import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROLE_DASHBOARDS } from "../../components/ProtectedRoute";

const ROLE_LABELS: Record<string, string> = {
    ADMIN:     "Administrateur",
    PROFESSOR: "Professeur",
    STUDENT:   "Étudiant",
    SECURITY:  "Agent de sécurité",
};

export default function Forbidden() {
    const navigate = useNavigate();
    const { userType } = useAuth();

    const dashboard = userType ? ROLE_DASHBOARDS[userType] : null;
    const roleLabel = userType ? ROLE_LABELS[userType] : null;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-10 text-center">

                <h1 className="text-5xl font-bold text-gray-800 mt-6 mb-2">403</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-3">Accès refusé</h2>

                {userType ? (
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                        Votre compte <span className="font-medium text-gray-600">{roleLabel}</span> n'a pas accès à cette page.
                        Retournez à votre espace ou contactez un administrateur.
                    </p>
                ) : (
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                        Vous devez être connecté avec les droits appropriés pour accéder à cette page.
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[#3A8C85] text-[#3A8C85] rounded-lg font-medium hover:bg-[#3A8C85] hover:text-white transition cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="currentColor"/>
                        </svg>
                        Page précédente
                    </button>

                    {dashboard ? (
                        <button
                            onClick={() => navigate(dashboard)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3A8C85] text-white rounded-lg font-medium hover:bg-[#44a36d] transition cursor-pointer"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V16H9V21H4C3.44772 21 3 20.5523 3 20V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="text-sm">Mon tableau de bord</p>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3A8C85] text-white rounded-lg font-medium hover:bg-[#44a36d] transition cursor-pointer"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V16H9V21H4C3.44772 21 3 20.5523 3 20V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Se connecter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
