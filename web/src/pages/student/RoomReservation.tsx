import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_KEY, API_URL } from "../../constants/apiConstants";
import type { Classroom, Student } from "../../../types/types";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentLayout from "../../components/StudentLayout";
import ReservationCalendarSelection from "../../components/ReservationCalendarSelection";
import "../../styles/RoomReservation.css";

export default function RoomReservation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();

    const [selectedRoom, setSelectedRoom] = useState<Classroom | null>(null);
    const [startReservation, setStartReservation] = useState<number | null>(null);
    const [endReservation, setEndReservation] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [studentList, setStudentList] = useState<Student[]>([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

    // Checkbox d'attestation (remplace la signature)
    const [attested, setAttested] = useState(false);

    const fetchRoomById = async (roomId: number) => {
        try {
            const res = await axios.get(`${API_URL}/classrooms/${roomId}`, {
                headers: { "x-api-key": API_KEY },
            });
            setSelectedRoom(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération de la salle :", err);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/students`, {
                headers: { "x-api-key": API_KEY },
            });
            setStudentList(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des étudiants :", err);
        }
    };

    useEffect(() => {
        if (id) fetchRoomById(parseInt(id));
        fetchStudents();
    }, [id]);

    const formatDateTime = (time: number | null) => {
        if (!time) return "-";
        const d = new Date(time);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} à ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };

    const handleReservation = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!startReservation || !endReservation) {
            setErrorMessage("Veuillez sélectionner une période pour la réservation.");
            return;
        }

        if (!attested) {
            setErrorMessage("Vous devez cocher la case d'attestation pour valider la réservation.");
            return;
        }

        setLoading(true);
        try {
            const groupRes = await axios.post(
                `${API_URL}/reservationGroups`,
                {
                    name: `Groupe ${selectedRoom?.name} - ${new Date().toLocaleDateString("fr-FR")}`,
                    createdAt: new Date().toISOString(),
                },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );
            const groupId = groupRes.data.id;

            if (userId) {
                await axios.post(
                    `${API_URL}/reservationGroupStudents`,
                    { reservationGroupId: groupId, studentId: userId, role: "LEADER", createdAt: new Date().toISOString() },
                    { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
                );
            }

            for (const student of selectedStudents) {
                if (student.id !== userId) {
                    await axios.post(
                        `${API_URL}/reservationGroupStudents`,
                        { reservationGroupId: groupId, studentId: student.id, role: "MEMBER", createdAt: new Date().toISOString() },
                        { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
                    );
                }
            }

            await axios.post(
                `${API_URL}/reservations`,
                {
                    startDate: new Date(startReservation).toISOString(),
                    endDate: new Date(endReservation).toISOString(),
                    reservedById: groupId,
                    resourceId: selectedRoom?.id,
                    status: "PENDING",
                    validationDate: null,
                    createdAt: new Date().toISOString(),
                },
                { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
            );

            setSuccessMessage("Réservation envoyée avec succès ! En attente de validation par un professeur.");
            setAttested(false);
            setSelectedStudents([]);
            setStartReservation(null);
            setEndReservation(null);
        } catch (err) {
            console.error("Erreur lors de la réservation :", err);
            setErrorMessage("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = studentList
        .filter(s =>
            s.firstName.toLowerCase().includes(searchStudent.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchStudent.toLowerCase())
        )
        .sort((a, b) => a.lastName.localeCompare(b.lastName));

    return (
        <StudentLayout titleHeader="Réservation de salle">
            <div className="min-h-screen bg-gray-100 p-6">

                {/* BOUTON RETOUR */}
                <button
                    onClick={() => navigate(`/student/room-details/${id}`)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3A8C85] transition mb-4 cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="currentColor"/>
                    </svg>
                    Retour aux détails
                </button>

                {/* INFO SALLE */}
                <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-semibold">Réservation de {selectedRoom?.name}</h1>
                    <p className="my-3 text-gray-600">{selectedRoom?.description}</p>
                    {selectedRoom?.roomNumber && (
                        <p className="text-sm text-gray-400">N° {selectedRoom.roomNumber}</p>
                    )}
                </div>

                {/* AJOUT ÉTUDIANTS */}
                <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Étudiants participant à la réservation</h2>
                    <input
                        type="text"
                        placeholder="Rechercher un étudiant..."
                        value={searchStudent}
                        onChange={e => setSearchStudent(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                    />
                    <div className="max-h-38 overflow-y-auto border border-gray-300 rounded-md p-2">
                        {filteredStudents.map(student => (
                            <label key={student.id} className="flex items-center gap-2 cursor-pointer mb-3">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.some(s => s.id === student.id)}
                                    onChange={() => {
                                        if (selectedStudents.some(s => s.id === student.id)) {
                                            setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
                                        } else {
                                            setSelectedStudents([...selectedStudents, student]);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                                {student.firstName} {student.lastName}
                            </label>
                        ))}
                        {filteredStudents.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Aucun étudiant trouvé</p>
                        )}
                    </div>
                </div>

                {/* CALENDRIER */}
                <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                    <ReservationCalendarSelection
                        onSelectionChange={(start, end) => {
                            setStartReservation(start);
                            setEndReservation(end);
                        }}
                    />
                </div>

                {/* RÉCAPITULATIF */}
                <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl mb-5 font-semibold">Récapitulatif de la réservation</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Salle réservée</p>
                            <p className="font-semibold text-gray-800">{selectedRoom?.name || "—"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Étudiants</p>
                            <p className="font-medium text-gray-700 text-sm">
                                {selectedStudents.length > 0
                                    ? selectedStudents.map(s => `${s.firstName} ${s.lastName}`).join(", ")
                                    : "—"}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Créneau</p>
                            <p className="font-medium text-gray-700 text-sm">
                                {startReservation && endReservation
                                    ? `${formatDateTime(startReservation)} → ${formatDateTime(endReservation)}`
                                    : "Non sélectionné"}
                            </p>
                        </div>
                    </div>

                    {/* ATTESTATION */}
                    <div className={`rounded-xl border-2 p-5 mb-5 transition-colors ${attested ? "border-[#3A8C85] bg-[#E8F4F3]" : "border-gray-200 bg-gray-50"}`}>
                        <label className="flex items-start gap-4 cursor-pointer select-none">
                            <div className="mt-0.5 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={attested}
                                    onChange={e => setAttested(e.target.checked)}
                                    className="w-5 h-5 cursor-pointer accent-[#3A8C85]"
                                />
                            </div>
                            <div>
                                <p className={`font-semibold mb-1 ${attested ? "text-[#3A8C85]" : "text-gray-700"}`}>
                                    Attestation sur l'honneur
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Je comprends et atteste que je suis responsable de la salle réservée
                                    pour la durée indiquée. Je m'engage à laisser les lieux en bon état,
                                    à respecter les règles d'utilisation des espaces de l'établissement
                                    et à signaler immédiatement tout problème ou incident constaté.
                                </p>
                            </div>
                        </label>
                    </div>

                    {errorMessage && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handleReservation}
                            disabled={loading || !attested}
                            className="reserve-room-btn text-white px-6 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && (
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                            )}
                            Valider la réservation
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
