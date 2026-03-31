import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import "../styles/Login.css";

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="currentColor" />
    </svg>
);

const IllustrationConfirm = () => (
    <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
        {/* Enveloppe ouverte */}
        <rect x="90" y="170" width="220" height="160" rx="12" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
        {/* Rabat ouvert */}
        <path d="M90 170 L200 120 L310 170" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Lettre qui sort */}
        <rect x="130" y="130" width="140" height="110" rx="6" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
        <rect x="148" y="152" width="104" height="6" rx="3" fill="white" fillOpacity="0.35" />
        <rect x="148" y="166" width="80" height="6" rx="3" fill="white" fillOpacity="0.25" />
        <rect x="148" y="180" width="90" height="6" rx="3" fill="white" fillOpacity="0.2" />
        {/* Cercle check */}
        <circle cx="310" cy="130" r="38" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
        <path d="M295 130 L306 141 L325 120" stroke="white" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Lignes de texte du bas */}
        <rect x="120" y="290" width="160" height="7" rx="3.5" fill="white" fillOpacity="0.18" />
        <rect x="140" y="307" width="120" height="7" rx="3.5" fill="white" fillOpacity="0.12" />
        {/* Éléments déco */}
        <circle cx="72" cy="220" r="5" fill="white" fillOpacity="0.2" />
        <circle cx="340" cy="290" r="4" fill="white" fillOpacity="0.2" />
        <path d="M55 150 L57 144 L59 150 L65 152 L59 154 L57 160 L55 154 L49 152 Z" fill="white" fillOpacity="0.22" />
        <path d="M342 200 L343.5 196 L345 200 L349 201.5 L345 203 L343.5 207 L342 203 L338 201.5 Z" fill="white" fillOpacity="0.18" />
    </svg>
);

export default function ConfirmResetPassword() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">

            {/* ── PANNEAU GAUCHE ── */}
            <div className="login-panel-left hidden lg:flex flex-col justify-between p-12">
                <div className="flex items-center gap-3">
                    <Logo className="w-12 h-12" />
                    <span className="text-white text-2xl font-bold tracking-wider uppercase">Pret&Go</span>
                </div>

                <div className="flex flex-col items-center text-center">
                    <IllustrationConfirm />
                    <h2 className="text-white text-2xl font-semibold mt-6 leading-snug">
                        Email envoyé !
                    </h2>
                    <p className="text-white/70 mt-3 text-sm max-w-xs leading-relaxed">
                        Consultez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                    </p>
                </div>

                <p className="text-white/40 text-xs text-center">© {new Date().getFullYear()} Prêt&Go — Agora</p>
            </div>

            {/* ── PANNEAU DROIT ── */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    <div className="bg-white rounded-2xl shadow-md p-8">

                        {/* ICÔNE DE SUCCÈS */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email envoyé</h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception ainsi que vos spams.
                            </p>
                        </div>

                        {/* CONSEILS */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                            {[
                                "Vérifiez votre dossier spam si vous ne voyez pas l'email",
                                "Le lien est valable pendant 24 heures",
                                "Un seul email peut être envoyé toutes les 5 minutes",
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-[#3A8C85]">
                                        <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    {tip}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full login-btn text-white py-2.5 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-2"
                        >
                            <IconArrowLeft />
                            Retour à la connexion
                        </button>

                        <button
                            onClick={() => navigate("/forget-password")}
                            className="w-full mt-3 text-sm login-forgot-link hover:underline transition cursor-pointer py-1"
                        >
                            Renvoyer l'email
                        </button>

                    </div>
                </div>
            </div>

        </div>
    );
}
