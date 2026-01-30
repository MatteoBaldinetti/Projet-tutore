import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "../styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [formError, setFormError] = useState<string>("");

    // Validation email
    const validateEmail = (value: string, showRequired = false) => {
        if (!value.trim()) {
            if (showRequired) {
                setEmailError("Veuillez entrer votre email");
            } else {
                setEmailError("");
            }
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

    // Validation mot de passe
    const validatePassword = (value: string, showRequired = false) => {
        if (!value.trim()) {
            if (showRequired) {
                setPasswordError("Veuillez entrer votre mot de passe");
            } else {
                setPasswordError("");
            }
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // showRequired = true pour afficher les erreurs si champs vides
        const isEmailValid = validateEmail(email, true);
        const isPasswordValid = validatePassword(password, true);

        if (!isEmailValid || !isPasswordValid) {
            setFormError("Veuillez remplir tous les champs correctement");
            return;
        }

        setFormError("");
        alert("Connexion réussie !"); // Ici tu peux mettre navigate ou API login
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) validateEmail(e.target.value); // supprime l'erreur dès que l'utilisateur tape
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (passwordError) validatePassword(e.target.value); // supprime l'erreur dès que l'utilisateur tape
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
                <h1 className="text-3xl font-semibold mb-4 text-center">
                    Se connecter
                </h1>

                {formError && (
                    <p className="text-red-500 text-sm mb-2 text-center">{formError}</p>
                )}

                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <label className="font-semibold">Adresse email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => validateEmail(email)} // validate sans afficher erreur si vide
                        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 login-input ${
                            emailError ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}

                    {/* Mot de passe */}
                    <label className="font-semibold">Mot de passe</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => validatePassword(password)} // validate sans afficher erreur si vide
                            className={`w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 login-input ${
                                passwordError ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 grid place-items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-7 0-1.04.773-2.378 2.1-3.7M6.18 6.18A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 7 0 1.306-1.214 2.93-3.1 4.3"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}

                    <a
                        className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                        href="/forget-password"
                    >
                        Mot de passe oublié ?
                    </a>

                    <button
                        type="submit"
                        className="login-btn text-white py-2 rounded transition"
                        disabled={!!emailError || !!passwordError}
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}