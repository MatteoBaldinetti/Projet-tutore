import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function ForgetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");

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

    // Gestion changement email
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) validateEmail(e.target.value); 
    };

    // Gestion soumission formulaire
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email, true); 

        if (!isEmailValid) return; 

        navigate("/confirm-reset-password");
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gray-100">
            <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-md">
                <h1 className="text-3xl font-semibold mb-4 text-center">
                    Réinitialisation du <br /> mot de passe
                </h1>

                <p className="mb-4 text-gray-600 text-justify">
                    Veuillez entrer votre adresse email universitaire pour recevoir
                    un lien de réinitialisation de mot de passe.
                </p>

                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    <label className="font-semibold">Adresse email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => validateEmail(email)} 
                        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 login-input ${
                            emailError ? "border-red-500" : "border-gray-300"
                        }`}
                    />

                    {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                    )}

                    <button
                        type="submit"
                        className="login-btn text-white py-2 rounded transition cursor-pointer"
                    >
                        Réinitialiser le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
}