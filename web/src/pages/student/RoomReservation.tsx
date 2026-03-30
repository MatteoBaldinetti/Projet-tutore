import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_KEY, API_URL } from "../../constants/apiConstants";
import type { Classroom, Student } from "../../../types/types";
import { useEffect, useRef, useState } from "react";
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

    const [studentList, setStudentList] = useState<Student[]>([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

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

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setErrorMessage("");
    };

    const handleReservation = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!startReservation || !endReservation) {
            setErrorMessage("Veuillez sélectionner une période pour la réservation.");
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) { setErrorMessage("Canvas non disponible."); return; }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const isCanvasEmpty = ctx.getImageData(0, 0, canvas.width, canvas.height).data.every(v => v === 0);
        if (isCanvasEmpty) {
            setErrorMessage("Veuillez signer avant de valider la réservation.");
            return;
        }

        try {
            // Créer le groupe de réservation
            const groupRes = await axios.post(`${API_URL}/reservationGroups`, {
                name: `Groupe ${selectedRoom?.name} - ${new Date().toLocaleDateString("fr-FR")}`,
                createdAt: new Date().toISOString(),
            }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });

            const groupId = groupRes.data.id;

            // Ajouter les étudiants au groupe
            const studentsToAdd = selectedStudents.length > 0 ? selectedStudents : [];
            if (userId) {
                await axios.post(`${API_URL}/reservationGroupStudents`, {
                    reservationGroupId: groupId,
                    studentId: userId,
                    role: "LEADER",
                    createdAt: new Date().toISOString(),
                }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });
            }

            for (const student of studentsToAdd) {
                if (student.id !== userId) {
                    await axios.post(`${API_URL}/reservationGroupStudents`, {
                        reservationGroupId: groupId,
                        studentId: student.id,
                        role: "MEMBER",
                        createdAt: new Date().toISOString(),
                    }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });
                }
            }

            // Créer la réservation
            await axios.post(`${API_URL}/reservations`, {
                startDate: new Date(startReservation).toISOString(),
                endDate: new Date(endReservation).toISOString(),
                reservedById: groupId,
                resourceId: selectedRoom?.id,
                status: "PENDING",
                validationDate: null,
                createdAt: new Date().toISOString(),
            }, { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } });

            setSuccessMessage("Réservation envoyée avec succès ! En attente de validation.");
        } catch (err) {
            console.error("Erreur lors de la réservation :", err);
            setErrorMessage("Une erreur est survenue lors de la réservation.");
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
                        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="currentColor" />
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

                {/* RÉCAPITULATIF + SIGNATURE */}
                <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl mb-3 font-semibold">Récapitulatif de la réservation</h1>

                    <div className="flex flex-row justify-between">
                        <div>
                            <p className="mx-5 mb-2">
                                <span className="font-bold">Salle réservée : </span>
                                {selectedRoom?.name}
                            </p>
                            <p className="mx-5 mb-2">
                                <span className="font-bold">Étudiants : </span>
                                {selectedStudents.length > 0
                                    ? selectedStudents.map(s => `${s.firstName} ${s.lastName}`).join(", ")
                                    : "—"}
                            </p>
                            <div className="flex mb-5 flex-row">
                                <p className="mx-5"><span className="font-bold">Du </span>{formatDateTime(startReservation)}</p>
                                <p className="mx-5"><span className="font-bold">Au </span>{formatDateTime(endReservation)}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Signature</h2>
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={200}
                                className="border rounded-md bg-white"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                            />
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={clearSignature}
                                    className="px-2 py-2 mx-5 rounded bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
                                >
                                    Effacer la signature
                                </button>
                                <button
                                    onClick={handleReservation}
                                    className="reserve-room-btn text-white px-2 py-2 mx-5 rounded transition cursor-pointer flex items-center"
                                >
                                    Valider la réservation
                                </button>
                            </div>
                            {errorMessage && <p className="mt-3 mx-5 text-red-600 font-medium">{errorMessage}</p>}
                            {successMessage && <p className="mt-3 mx-5 text-green-600 font-medium">{successMessage}</p>}
                        </div>
                    </div>
                </div>

            </div>
        </StudentLayout>
    );
}
