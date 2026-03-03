import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function ConfirmResetPassword() {
    const navigate = useNavigate();

    const handleReturnToLogin = () => {
        navigate("/");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen grid place-items-center bg-gray-100">
                <div className="w-full max-w-xl min-h-60 p-6 bg-white rounded-xl shadow-md flex flex-col justify-center">
                    <h1 className="text-3xl font-semibold text-center my-3">
                        Email de réinitialisation envoyé
                    </h1>

                    <p className="my-3 text-gray-600 text-justify">
                        Votre email de réinitialisation a été envoyé avec succès. Veuillez vérifier votre boîte de réception.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            className="login-btn text-white py-2 rounded transition cursor-pointer my-3"
                            onClick={handleReturnToLogin}
                        >
                            Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}