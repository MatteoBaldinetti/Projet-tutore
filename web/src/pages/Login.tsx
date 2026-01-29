import { useState } from "react";
import "../styles/Login.css";

const Login = () => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            setEmailError("Adresse email invalide");
        } else {
            setEmailError("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
                <form className="flex flex-col gap-4">
                    <label className="font-semibold">Adresse email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => validateEmail(e.target.value)}
                        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 login-input${emailError ? "border-red-500" : "border-gray-300"}`}
                    />

                    <label className="font-semibold">Mot de passe</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 login-input"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                /* Oeil barré */
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
                                        d="M3.98 8.223A10.477 10.477 0 002 12c1.636 4.06 5.596 7 10 7 1.468 0 2.87-.307 4.145-.859M6.228 6.228 A9.957 9.957 0 0112 5c4.404 0 8.364 2.94 10 7-1.086 2.695-3.26 4.99-5.98 6.223"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 00-4.243-2.829M9.88 9.88 A3 3 0 0012 15c.73 0 1.412-.26 1.95-.693"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3l18 18"
                                    />
                                </svg>
                            ) : (
                                /* Oeil ouvert */
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
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="login-btn text-white py-2 rounded transition"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;