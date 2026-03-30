import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Login.css";

const IconEyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconEyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-7 0-1.04.773-2.378 2.1-3.7M6.18 6.18A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 7 0 1.306-1.214 2.93-3.1 4.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconKey = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 2L19 4M11.388 11.612C11.9079 12.1243 12.3199 12.7357 12.6001 13.4102C12.8803 14.0846 13.0232 14.8087 13.0202 15.5396C13.0172 16.2704 12.8684 16.9934 12.5828 17.6656C12.2972 18.3378 11.8803 18.9459 11.3563 19.4539C10.8322 19.9619 10.2115 20.3597 9.53062 20.624C8.84974 20.8882 8.12265 21.0136 7.39195 20.9929C6.66126 20.9723 5.9424 20.806 5.27768 20.5039C4.61296 20.2017 4.01568 19.7699 3.522 19.234C2.47757 18.1001 1.92543 16.6009 1.98333 15.0588C2.04124 13.5167 2.70466 12.0627 3.83 11.01C4.95534 9.95735 6.45513 9.38416 8.0 9.415C9.09 9.438 10.119 9.765 11 10.334L14 7M14 7L17 10L20 7L17 4M14 7L17 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconLock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
        <path d="M16 10V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10M5 10H19C19.5523 10 20 10.4477 20 11V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11C4 10.4477 4.44772 10 5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
        <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

/* ── Illustration SVG panneau gauche ── */
const IllustrationLogin = () => (
    <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
        {/* Bâtiment */}
        <rect x="80" y="160" width="240" height="220" rx="8" fill="white" fillOpacity="0.15"/>
        <rect x="80" y="160" width="240" height="220" rx="8" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
        {/* Toit */}
        <path d="M60 165 L200 80 L340 165" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round"/>
        {/* Fenêtres */}
        <rect x="110" y="195" width="45" height="40" rx="4" fill="white" fillOpacity="0.25"/>
        <rect x="177" y="195" width="45" height="40" rx="4" fill="white" fillOpacity="0.25"/>
        <rect x="244" y="195" width="45" height="40" rx="4" fill="white" fillOpacity="0.25"/>
        <rect x="110" y="255" width="45" height="40" rx="4" fill="white" fillOpacity="0.25"/>
        <rect x="177" y="255" width="45" height="40" rx="4" fill="white" fillOpacity="0.25"/>
        <rect x="244" y="255" width="45" height="40" rx="4" fill="white" fillOpacity="0.25"/>
        {/* Porte */}
        <rect x="167" y="320" width="66" height="60" rx="33" fill="white" fillOpacity="0.3"/>
        <circle cx="224" cy="350" r="4" fill="white" fillOpacity="0.7"/>
        {/* Sol */}
        <line x1="40" y1="380" x2="360" y2="380" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        {/* Éléments déco : boîte matériel */}
        <rect x="30" y="300" width="48" height="48" rx="6" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <path d="M54 316 L54 332 M46 324 L62 324" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Éléments déco : clé */}
        <circle cx="340" cy="280" r="14" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" fill="none"/>
        <line x1="349" y1="271" x2="365" y2="255" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="362" y1="258" x2="358" y2="262" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Points décoratifs */}
        <circle cx="60" cy="220" r="3" fill="white" fillOpacity="0.3"/>
        <circle cx="348" cy="200" r="4" fill="white" fillOpacity="0.2"/>
        <circle cx="360" cy="340" r="2.5" fill="white" fillOpacity="0.3"/>
        <circle cx="35" cy="170" r="3" fill="white" fillOpacity="0.25"/>
    </svg>
);

export default function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
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

    const validatePassword = (value: string, showRequired = false) => {
        if (!value.trim()) {
            if (showRequired) setPasswordError("Veuillez entrer votre mot de passe");
            else setPasswordError("");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email, true);
        const isPasswordValid = validatePassword(password, true);
        if (!isEmailValid || !isPasswordValid) {
            setFormError("Veuillez remplir tous les champs correctement");
            return;
        }
        setFormError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setFormError(err.message || "Email ou mot de passe incorrect");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) validateEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (passwordError) validatePassword(e.target.value);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">

            {/* ── PANNEAU GAUCHE ── */}
            <div className="login-panel-left hidden lg:flex flex-col justify-between p-12">
                {/* Logo / Nom appli */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <IconKey />
                    </div>
                    <span className="text-white text-2xl font-bold tracking-tight">PrêtEtGo</span>
                </div>

                {/* Illustration centrale */}
                <div className="flex flex-col items-center text-center">
                    <IllustrationLogin />
                    <h2 className="text-white text-2xl font-semibold mt-6 leading-snug">
                        Gérez vos réservations<br />de matériel et de salles
                    </h2>
                    <p className="text-white/70 mt-3 text-sm max-w-xs leading-relaxed">
                        Réservez du matériel pédagogique et des salles en quelques clics, depuis un seul espace.
                    </p>
                </div>

                {/* Footer panneau */}
                <p className="text-white/40 text-xs text-center">© {new Date().getFullYear()} PrêtEtGo — Agora</p>
            </div>

            {/* ── PANNEAU DROIT ── */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    {/* Logo mobile */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg login-logo-mobile flex items-center justify-center">
                            <IconKey />
                        </div>
                        <span className="text-xl font-bold login-brand-text">PrêtEtGo</span>
                    </div>

                    {/* Carte formulaire */}
                    <div className="bg-white rounded-2xl shadow-md p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
                            <p className="text-gray-500 text-sm mt-1">Entrez vos identifiants pour accéder à votre espace.</p>
                        </div>

                        {/* Erreur globale */}
                        {formError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
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

                            {/* Mot de passe */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <IconLock />
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onBlur={() => validatePassword(password)}
                                        placeholder="••••••••"
                                        className={`w-full border rounded-lg pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 login-input transition ${passwordError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition"
                                    >
                                        {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            {/* Mot de passe oublié */}
                            <div className="flex justify-end">
                                <a href="/forget-password" className="text-sm login-forgot-link hover:underline transition">
                                    Mot de passe oublié ?
                                </a>
                            </div>

                            {/* Bouton */}
                            <button
                                type="submit"
                                disabled={!!emailError || !!passwordError || loading}
                                className="w-full login-btn text-white py-2.5 rounded-lg font-medium transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                        </svg>
                                        Connexion…
                                    </>
                                ) : "Se connecter"}
                            </button>

                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}
