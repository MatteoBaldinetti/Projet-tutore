import { useNavigate } from "react-router-dom";

export default function ConfirmResetPassword() {
    const navigate = useNavigate();

    const handleReturnToLogin = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
                <h1 className="text-3xl font-semibold mb-4 text-center">
                    Email de réinitialisation envoyé
                </h1>

                <p className="mb-4 text-gray-600 text-justify">
                    Votre email de réinitialisation a été envoyé avec succès. Veuillez vérifier votre boîte de réception.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        className="login-btn text-white py-2 rounded transition cursor-pointer"
                        onClick={handleReturnToLogin}
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        </div>
    );
}