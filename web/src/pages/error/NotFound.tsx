import { useNavigate } from "react-router-dom";

const Illustration404 = () => (
    <svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
        {/* Chiffres 404 */}
        {/* 4 gauche */}
        <path d="M60 60 L60 160 M60 110 L110 60 L110 160" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        {/* 0 central */}
        <ellipse cx="240" cy="110" rx="70" ry="60" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" opacity="0.9"/>
        {/* 4 droite */}
        <path d="M310 60 L310 160 M310 110 L360 60 L360 160" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>

        {/* Loupe cherchant quelque chose */}
        <circle cx="240" cy="110" r="28" fill="#E8F4F3" stroke="#3A8C85" strokeWidth="3" opacity="0.6"/>
        <line x1="260" y1="132" x2="278" y2="150" stroke="#3A8C85" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>

        {/* Point d'interrogation dans la loupe */}
        <text x="240" y="118" textAnchor="middle" fill="#3A8C85" fontSize="22" fontWeight="bold" opacity="0.7">?</text>

        {/* Sol et ombre */}
        <ellipse cx="240" cy="238" rx="140" ry="12" fill="#3A8C85" fillOpacity="0.06"/>
        <line x1="60" y1="230" x2="420" y2="230" stroke="#E2E8F0" strokeWidth="1.5"/>

        {/* Petits éléments flottants */}
        <circle cx="90" cy="200" r="6" fill="#3A8C85" fillOpacity="0.15"/>
        <circle cx="380" cy="185" r="8" fill="#3A8C85" fillOpacity="0.1"/>
        <circle cx="150" cy="240" r="4" fill="#3A8C85" fillOpacity="0.12"/>
        <circle cx="330" cy="245" r="5" fill="#3A8C85" fillOpacity="0.1"/>

        {/* Lignes décoratives */}
        <path d="M60 255 Q120 248 180 255 Q240 262 300 255 Q360 248 420 255" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
    </svg>
);

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-10 text-center">

                <Illustration404 />

                <h1 className="text-5xl font-bold text-gray-800 mt-6 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-3">Page introuvable</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                    La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à l'accueil.
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
                        Accueil
                    </button>
                </div>

            </div>
        </div>
    );
}
