import { useNavigate } from "react-router-dom";

const Illustration403 = () => (
    <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
        {/* Chiffres 403 */}
        {/* 4 */}
        <path d="M55 55 L55 155 M55 105 L105 55 L105 155" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        {/* 0 */}
        <ellipse cx="210" cy="105" rx="65" ry="58" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" opacity="0.9"/>
        {/* 3 */}
        <path d="M300 65 Q360 65 360 105 Q360 145 300 145" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d="M300 105 L350 105" stroke="#3A8C85" strokeWidth="14" strokeLinecap="round" opacity="0.9"/>

        {/* Cadenas centré sur le 0 */}
        {/* Corps cadenas */}
        <rect x="188" y="112" width="44" height="34" rx="6" fill="#E8F4F3" stroke="#3A8C85" strokeWidth="2.5"/>
        {/* Arceau cadenas */}
        <path d="M197 112 L197 99 Q210 88 223 99 L223 112" stroke="#3A8C85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Trou de serrure */}
        <circle cx="210" cy="126" r="5" fill="#3A8C85" opacity="0.5"/>
        <rect x="207" y="126" width="6" height="8" rx="2" fill="#3A8C85" opacity="0.5"/>

        {/* Sol */}
        <line x1="40" y1="218" x2="440" y2="218" stroke="#E2E8F0" strokeWidth="1.5"/>
        <ellipse cx="240" cy="226" rx="150" ry="10" fill="#3A8C85" fillOpacity="0.05"/>

        {/* Bouclier décoratif */}
        <path d="M400 60 L430 72 L430 105 Q430 128 400 140 Q370 128 370 105 L370 72 Z" fill="#3A8C85" fillOpacity="0.08" stroke="#3A8C85" strokeOpacity="0.2" strokeWidth="1.5"/>
        <path d="M393 100 L399 106 L411 92" stroke="#3A8C85" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Éléments déco */}
        <circle cx="65" cy="188" r="6" fill="#3A8C85" fillOpacity="0.12"/>
        <circle cx="355" cy="195" r="5" fill="#3A8C85" fillOpacity="0.1"/>
        <circle cx="130" cy="235" r="4" fill="#3A8C85" fillOpacity="0.1"/>
        <circle cx="320" cy="238" r="4" fill="#3A8C85" fillOpacity="0.1"/>

        {/* Lignes pointillées */}
        <path d="M40 242 Q130 236 240 242 Q350 248 440 242" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
    </svg>
);

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-10 text-center">

                <Illustration403 />

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
