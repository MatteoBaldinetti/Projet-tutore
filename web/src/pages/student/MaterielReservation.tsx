import { useParams } from "react-router-dom";
import axios from "axios";
import { API_KEY, API_URL } from "../../constants/apiConstants";
import type { Item, Student } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import ReservationCalendarSelection from "../../components/ReservationCalendarSelection";
import "../../styles/MaterielReservation.css";

export default function MaterielReservation() {
    const { id } = useParams();

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [startReservation, setStartReservation] = useState<number | null>(null);
    const [endReservation, setEndReservation] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Etudiants
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    /** FETCH ITEM */
    const fetchItemById = async (id: number) => {
        try {
            const res = await axios.get(`${API_URL}/items/${id}`, {
                headers: { "x-api-key": API_KEY },
            });
            setSelectedItem(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'item :", err);
        }
    };

    /** FETCH STUDENTS */
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
        if (id) fetchItemById(parseInt(id));
        fetchStudents();
    }, [id]);

    const formatDateTime = (time: number | null) => {
        if (!time) return "-";
        const d = new Date(time);
        return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")} à ${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
        ).padStart(2, "0")}`;
    };

    /** CANVAS SIGNATURE */
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

    /** HANDLE RESERVATION */
    const handleReservation = () => {
        setErrorMessage("");
        if (!startReservation || !endReservation) {
            setErrorMessage("Veuillez sélectionner une période pour la réservation.");
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            setErrorMessage("Canvas non disponible.");
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const isCanvasEmpty = ctx.getImageData(0, 0, canvas.width, canvas.height).data.every(v => v === 0);
        if (isCanvasEmpty) {
            setErrorMessage("Veuillez signer avant de valider la réservation.");
            return;
        }

        const signature = canvas.toDataURL();

        console.log("Réservation :", {
            itemId: selectedItem?.id,
            start: startReservation,
            end: endReservation,
            students: selectedStudents.map(s => s.id),
            signature,
        });

        setErrorMessage("Réservation envoyée !");
    };

    /* Filtrage et tri des étudiants */
    const filteredStudents = studentList
        .filter(s =>
            s.firstName.toLowerCase().includes(searchStudent.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchStudent.toLowerCase())
        )
        .sort((a, b) => a.lastName.localeCompare(b.lastName)); // tri croissant par nom de famille

    return (
        <StudentLayout
            titleHeader="Reservations"
            children={
                <div className="min-h-screen bg-gray-100 p-6">
                    {/* ITEM INFO */}
                    <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                        <h1 className="text-3xl font-semibold">
                            Réservation de {selectedItem?.name}
                        </h1>
                        <p className="my-3 text-gray-600">{selectedItem?.description}</p>
                    </div>

                    {/* AJOUT ETUDIANTS */}
                    <div className="w-full mx-auto mb-5 bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">Étudiants participant à la réservation</h2>

                        {/* Barre de recherche */}
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant..."
                            value={searchStudent}
                            onChange={(e) => setSearchStudent(e.target.value)}
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

                    {/* CALENDAR */}
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
                        <h1 className="text-3xl mb-3 font-semibold">Récapilatif de la réservation</h1>

                        <div className="flex flex-row justify-between">
                            <div>
                                <p className="mx-5">
                                    <span className="font-bold">Matériel réservé : </span>
                                    {selectedItem?.name}
                                </p>

                                <p className="mx-5">
                                    <span className="font-bold">Étudiants : </span>
                                    {selectedStudents.length > 0
                                        ? selectedStudents.map(s => `${s.firstName} ${s.lastName}`).join(", ")
                                        : "-"}
                                </p>

                                <div className="flex mb-5 flex-row">
                                    <p className="mx-5">
                                        <span className="font-bold">Du</span> {formatDateTime(startReservation)}
                                    </p>
                                    <p className="mx-5">
                                        <span className="font-bold">Au</span> {formatDateTime(endReservation)}
                                    </p>
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
                                        className="reserve-btn text-white px-2 py-2 mx-5 rounded transition cursor-pointer flex items-center"
                                    >
                                        Valider la réservation
                                    </button>
                                </div>

                                {errorMessage && (
                                    <p className="mt-3 mx-5 text-red-600 font-medium">{errorMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
}