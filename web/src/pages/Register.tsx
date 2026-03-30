import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import { API_URL, API_KEY } from "../constants/apiConstants";
import "../styles/Login.css";

const ALLOWED_DOMAIN = "@edu.univ-eiffel.fr";

const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
        <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const IconLock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
        <path d="M16 10V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10M5 10H19C19.5523 10 20 10.4477 20 11V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11C4 10.4477 4.44772 10 5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const IconUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const IconHash = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
        <path d="M4 9H20M4 15H20M10 3L8 21M16 3L14 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const IconEyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
);
const IconEyeClosed = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-7 0-1.04.773-2.378 2.1-3.7M6.18 6.18A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 7 0 1.306-1.214 2.93-3.1 4.3"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
);

const IllustrationRegister = () => (
    <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
        {/* Carte principale */}
        <rect x="80" y="120" width="240" height="210" rx="16" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
        {/* Lignes de formulaire */}
        <rect x="110" y="160" width="180" height="10" rx="5" fill="white" fillOpacity="0.3"/>
        <rect x="110" y="185" width="180" height="10" rx="5" fill="white" fillOpacity="0.2"/>
        <rect x="110" y="210" width="180" height="10" rx="5" fill="white" fillOpacity="0.2"/>
        <rect x="110" y="235" width="180" height="10" rx="5" fill="white" fillOpacity="0.2"/>
        <rect x="110" y="260" width="180" height="10" rx="5" fill="white" fillOpacity="0.15"/>
        {/* Bouton bas de carte */}
        <rect x="130" y="290" width="140" height="26" rx="13" fill="white" fillOpacity="0.3"/>
        {/* Avatar en haut de carte */}
        <circle cx="200" cy="115" r="32" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
        <circle cx="200" cy="108" r="12" fill="white" fillOpacity="0.4"/>
        <path d="M175 140 Q200 128 225 140" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
        {/* Éléments flottants */}
        <circle cx="68" cy="200" r="6" fill="white" fillOpacity="0.2"/>
        <circle cx="340" cy="240" r="5" fill="white" fillOpacity="0.15"/>
        <circle cx="85" cy="310" r="4" fill="white" fillOpacity="0.18"/>
        <circle cx="345" cy="170" r="3" fill="white" fillOpacity="0.2"/>
        {/* Check mark */}
        <circle cx="330" cy="130" r="20" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <path d="M322 130 L328 136 L340 122" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Sol */}
        <line x1="40" y1="368" x2="360" y2="368" stroke="white" strokeOpacity="0.2" strokeWidth="1.5"/>
        <ellipse cx="200" cy="374" rx="120" ry="8" fill="white" fillOpacity="0.05"/>
        <path d="M56 155 L58 149 L60 155 L66 157 L60 159 L58 165 L56 159 L50 157 Z" fill="white" fillOpacity="0.22"/>
    </svg>
);

type FieldError = { [key: string]: string };

const passwordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8)   score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
        { label: "", color: "bg-gray-200" },
        { label: "Faible", color: "bg-red-400" },
        { label: "Moyen", color: "bg-yellow-400" },
        { label: "Fort", color: "bg-blue-400" },
        { label: "Très fort", color: "bg-green-500" },
    ];
    return { score, ...levels[score] };
};

export default function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState<FieldError>({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const pwdStrength = passwordStrength(password);

    const validate = (): boolean => {
        const newErrors: FieldError = {};

        if (!firstName.trim())
            newErrors.firstName = "Le prénom est requis";

        if (!lastName.trim())
            newErrors.lastName = "Le nom est requis";

        if (!email.trim()) {
            newErrors.email = "L'adresse email est requise";
        } else if (!email.endsWith(ALLOWED_DOMAIN)) {
            newErrors.email = `L'email doit être une adresse ${ALLOWED_DOMAIN}`;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Adresse email invalide";
        }

        if (!studentNumber.trim()) {
            newErrors.studentNumber = "Le numéro étudiant est requis";
        } else if (!/^\d+$/.test(studentNumber)) {
            newErrors.studentNumber = "Le numéro étudiant doit être numérique";
        }

        if (!password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (password.length < 8) {
            newErrors.password = "Minimum 8 caractères";
        } else if (pwdStrength.score < 2) {
            newErrors.password = "Mot de passe trop faible (ajoutez majuscules, chiffres ou symboles)";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError("");
        if (!validate()) return;

        setLoading(true);
        try {
            // Hash du mot de passe côté client
            const hashedPassword = await bcrypt.hash(password, 10);

            await axios.post(`${API_URL}/students`, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password: hashedPassword,
                studentNumber: parseInt(studentNumber),
                enabled: true,
                createdAt: new Date().toISOString(),
            }, {
                headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
            });

            setSuccess(true);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Une erreur est survenue lors de la création du compte.";
            setFormError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (field === "firstName") setFirstName(value);
        if (field === "lastName") setLastName(value);
        if (field === "email") setEmail(value);
        if (field === "studentNumber") setStudentNumber(value);
        if (field === "password") setPassword(value);
        if (field === "confirmPassword") setConfirmPassword(value);
        if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    };

    if (success) {
        return (
            <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">
                <div className="login-panel-left hidden lg:flex flex-col justify-between p-12">
                    <div className="flex items-center gap-3">
                        <span className="text-white text-2xl font-bold tracking-tight">PrêtEtGo</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <IllustrationRegister />
                        <h2 className="text-white text-2xl font-semibold mt-6">Compte créé !</h2>
                        <p className="text-white/70 mt-3 text-sm max-w-xs">Votre compte a bien été créé. Vous pouvez maintenant vous connecter.</p>
                    </div>
                    <p className="text-white/40 text-xs text-center">© {new Date().getFullYear()} PrêtEtGo — Agora</p>
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Compte créé avec succès</h1>
                        <p className="text-gray-500 text-sm mb-8">Votre compte étudiant PrêtEtGo a été créé. Vous pouvez maintenant vous connecter avec vos identifiants.</p>
                        <button onClick={() => navigate("/")} className="w-full login-btn text-white py-2.5 rounded-lg font-medium transition cursor-pointer">
                            Se connecter
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const inputClass = (field: string) =>
        `w-full border rounded-lg py-2.5 text-sm focus:outline-none focus:ring-2 login-input transition ${
            errors[field] ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        }`;

    const ErrorMsg = ({ field }: { field: string }) =>
        errors[field] ? (
            <p className="text-xs text-red-500 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {errors[field]}
            </p>
        ) : null;

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">

            {/* PANNEAU GAUCHE */}
            <div className="login-panel-left hidden lg:flex flex-col justify-between p-12">
                <div className="flex items-center gap-3">
                    <span className="text-white text-2xl font-bold tracking-tight">PrêtEtGo</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <IllustrationRegister />
                    <h2 className="text-white text-2xl font-semibold mt-6 leading-snug">
                        Créez votre compte étudiant
                    </h2>
                    <p className="text-white/70 mt-3 text-sm max-w-xs leading-relaxed">
                        Rejoignez PrêtEtGo avec votre adresse universitaire <strong className="text-white/90">@edu.univ-eiffel.fr</strong>
                    </p>
                </div>
                <p className="text-white/40 text-xs text-center">© {new Date().getFullYear()} PrêtEtGo — Agora</p>
            </div>

            {/* PANNEAU DROIT */}
            <div className="flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">

                    <div className="bg-white rounded-2xl shadow-md p-8">

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
                            <p className="text-gray-500 text-sm mt-1">Inscription réservée aux étudiants de l'Université Gustave Eiffel.</p>
                        </div>

                        {formError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Prénom + Nom */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Prénom</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><IconUser /></span>
                                        <input type="text" value={firstName} onChange={handleChange("firstName")} placeholder="Jean" className={`${inputClass("firstName")} pl-10 pr-4`}/>
                                    </div>
                                    <ErrorMsg field="firstName" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Nom</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><IconUser /></span>
                                        <input type="text" value={lastName} onChange={handleChange("lastName")} placeholder="Dupont" className={`${inputClass("lastName")} pl-10 pr-4`}/>
                                    </div>
                                    <ErrorMsg field="lastName" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Email universitaire</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><IconMail /></span>
                                    <input type="email" value={email} onChange={handleChange("email")} placeholder={`prenom.nom${ALLOWED_DOMAIN}`} className={`${inputClass("email")} pl-10 pr-4`}/>
                                </div>
                                {!errors.email && (
                                    <p className="text-xs text-gray-400">Doit se terminer par <span className="font-medium">{ALLOWED_DOMAIN}</span></p>
                                )}
                                <ErrorMsg field="email" />
                            </div>

                            {/* Numéro étudiant */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Numéro étudiant</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><IconHash /></span>
                                    <input type="text" value={studentNumber} onChange={handleChange("studentNumber")} placeholder="20240001" className={`${inputClass("studentNumber")} pl-10 pr-4`}/>
                                </div>
                                <ErrorMsg field="studentNumber" />
                            </div>

                            {/* Mot de passe */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><IconLock /></span>
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={handleChange("password")} placeholder="••••••••" className={`${inputClass("password")} pl-10 pr-11`}/>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition">
                                        {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                                    </button>
                                </div>
                                {/* Barre de force */}
                                {password && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwdStrength.score ? pwdStrength.color : "bg-gray-200"}`}/>
                                            ))}
                                        </div>
                                        {pwdStrength.label && (
                                            <p className="text-xs text-gray-500">{pwdStrength.label}</p>
                                        )}
                                    </div>
                                )}
                                <ErrorMsg field="password" />
                            </div>

                            {/* Confirmation */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><IconLock /></span>
                                    <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={handleChange("confirmPassword")} placeholder="••••••••" className={`${inputClass("confirmPassword")} pl-10 pr-11`}/>
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition">
                                        {showConfirm ? <IconEyeClosed /> : <IconEyeOpen />}
                                    </button>
                                </div>
                                <ErrorMsg field="confirmPassword" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full login-btn text-white py-2.5 rounded-lg font-medium transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                        </svg>
                                        Création en cours…
                                    </>
                                ) : "Créer mon compte"}
                            </button>

                            <p className="text-center text-sm text-gray-500 pt-1">
                                Déjà un compte ?{" "}
                                <button type="button" onClick={() => navigate("/")} className="login-forgot-link hover:underline cursor-pointer font-medium">
                                    Se connecter
                                </button>
                            </p>

                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}
