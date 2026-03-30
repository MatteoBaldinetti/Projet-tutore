import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
        <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="currentColor"/>
    </svg>
);

const IllustrationForgot = () => (
    <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
        {/* Enveloppe */}
        <rect x="80" y="150" width="240" height="170" rx="12" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
        {/* Rabat enveloppe */}
        <path d="M80 162 L200 240 L320 162" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Lignes de texte simulées */}
        <rect x="130" y="270" width="140" height="8" rx="4" fill="white" fillOpacity="0.2"/>
        <rect x="150" y="288" width="100" height="8" rx="4" fill="white" fillOpacity="0.15"/>
        <rect x="140" y="306" width="120" height="8" rx="4" fill="white" fillOpacity="0.1"/>
        {/* Point d'interrogation flottant */}
        <circle cx="310" cy="130" r="36" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <text x="310" y="141" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="28" fontWeight="bold">?</text>
        {/* Petits éléments décoratifs */}
        <circle cx="70" cy="200" r="5" fill="white" fillOpacity="0.2"/>
        <circle cx="340" cy="270" r="4" fill="white" fillOpacity="0.2"/>
        <circle cx="90" cy="310" r="3" fill="white" fillOpacity="0.15"/>
        <circle cx="350" cy="160" r="3" fill="white" fillOpacity="0.15"/>
        {/* Petites étoiles / sparkles */}
        <path d="M55 140 L57 134 L59 140 L65 142 L59 144 L57 150 L55 144 L49 142 Z" fill="white" fillOpacity="0.25"/>
        <path d="M340 310 L341.5 306 L343 310 L347 311.5 L343 313 L341.5 317 L340 313 L336 311.5 Z" fill="white" fillOpacity="0.2"/>
    </svg>
);

export default function ForgetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (value: string, showRequired = false) => {
        if (!value.trim()) {
            if (showRequired) setEmailError("Veuillez entrer votre email");
            else setEmailError("");
            return false;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            setEmailError("Adresse email invalide");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) validateEmail(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateEmail(email, true)) return;
        setLoading(true);
        // Simule l'envoi
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        navigate("/confirm-reset-password");
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">

            {/* ── PANNEAU GAUCHE ── */}
            <div className="login-panel-left hidden lg:flex flex-col justify-between p-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M21 2L19 4M11.388 11.612C12.5567 12.7559 13.0829 14.3714 12.8402 15.9691C12.5976 17.5667 11.6123 18.9576 10.1906 19.7519C8.76888 20.5463 7.06539 20.6618 5.54631 20.0645C4.02722 19.4673 2.86646 18.2238 2.40193 16.6742C1.9374 15.1247 2.21921 13.4517 3.16666 12.1384C4.11411 10.8252 5.62327 10.0262 7.25 10.0003C8.33 9.979 9.358 10.284 10.238 10.853L13.238 7.853M13.238 7.853L16.238 10.853L19.238 7.853L16.238 4.853M13.238 7.853L16.238 4.853" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-white text-2xl font-bold tracking-tight">PrêtEtGo</span>
                </div>

                <div className="flex flex-col items-center text-center">
                    <IllustrationForgot />
                    <h2 className="text-white text-2xl font-semibold mt-6 leading-snug">
                        Mot de passe oublié ?
                    </h2>
                    <p className="text-white/70 mt-3 text-sm max-w-xs leading-relaxed">
                        Pas de panique. Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </div>

                <p className="text-white/40 text-xs text-center">© {new Date().getFullYear()} PrêtEtGo — Agora</p>
            </div>

            {/* ── PANNEAU DROIT ── */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    <div className="bg-white rounded-2xl shadow-md p-8">
                        {/* RETOUR */}
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition mb-6 cursor-pointer"
                        >
                            <IconArrowLeft />
                            Retour à la connexion
                        </button>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Réinitialisation du mot de passe</h1>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                Entrez votre adresse email universitaire pour recevoir un lien de réinitialisation.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <IconMail />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        onBlur={() => validateEmail(email)}
                                        placeholder="votre@email.fr"
                                        className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 login-input transition ${emailError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!!emailError || loading}
                                className="w-full login-btn text-white py-2.5 rounded-lg font-medium transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                        </svg>
                                        Envoi en cours…
                                    </>
                                ) : "Envoyer le lien de réinitialisation"}
                            </button>

                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}
