import { useNavigate } from "react-router-dom";

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-10 text-center">

                <h1 className="text-5xl font-bold text-gray-800 mt-6 mb-2">403</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-3">Accès refusé</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page. Connectez-vous avec un compte approprié ou contactez un administrateur.
                </p>

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
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3A8C85] text-white rounded-lg font-medium hover:bg-[#44a36d] transition cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V16H9V21H4C3.44772 21 3 20.5523 3 20V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Se connecter
                    </button>
                </div>

            </div>
        </div>
    );
}
