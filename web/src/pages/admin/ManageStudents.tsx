import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, API_KEY } from "../../constants/apiConstants";
import type { Student } from "../../types/types";
import "../../styles/ManageStudents.css";

export default function ManageStudents() {
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [search, setSearch] = useState("");

    const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [studentNumber, setStudentNumber] = useState("");

    const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

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
        fetchStudents();
    }, []);

    const handleAddStudentButtonPress = () => {
        setEditingStudent(null);
        setFirstName("");
        setLastName("");
        setEmail("");
        setStudentNumber("");
        setShowAddStudent(true);
    }

    const handleEditStudentButtonPress = (student: Student) => {
        setEditingStudent(student);
        setFirstName(student.firstName);
        setLastName(student.lastName);
        setEmail(student.email);
        setStudentNumber(String(student.studentNumber));
        setShowAddStudent(true);
    }

    const addOrUpdateStudent = async () => {
        try {
            const studentPayload = {
                firstName,
                lastName,
                email,
                password: "string",
                createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString(),
                enabled: true,
                studentNumber: Number(studentNumber),
            };

            if (editingStudent) {
                await axios.put(`${API_URL}/students/${editingStudent.id}`, studentPayload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            } else {
                await axios.post(`${API_URL}/students`, studentPayload, {
                    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
                });
            }

            await fetchStudents();
            setShowAddStudent(false);
            setEditingStudent(null);
            setFirstName("");
            setLastName("");
            setEmail("");
            setStudentNumber("");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de l'étudiant :", err);
        }
    }

    const deleteStudent = async (idStudent: number) => {
        try {
            await axios.delete(`${API_URL}/students/${idStudent}`, {
                headers: { "x-api-key": API_KEY },
            });
            await fetchStudents();
            setStudentToDelete(null);
        } catch (err) {
            console.error("Erreur lors de la suppression des étudiants :", err);
        }
    };

    const filteredStudents = studentList.filter((student) => {
        const value = search.toLowerCase();
        return (
            student.lastName.toLowerCase().includes(value) ||
            student.firstName.toLowerCase().includes(value)
        );
    });

    useEffect(() => {
        if (showAddStudent || studentToDelete !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showAddStudent, studentToDelete]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">

                <div className="flex justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-semibold text-left whitespace-nowrap">
                        Gestion des étudiants
                    </h1>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85] w-64"
                        />

                        <button onClick={handleAddStudentButtonPress} className="add-student-btn text-white px-4 py-2 rounded transition cursor-pointer whitespace-nowrap">
                            + Ajouter un étudiant
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/4">Prénom</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/4">Nom</th>
                                <th className="border border-gray-300 px-4 py-2 text-left w-1/4">Email</th>
                                <th className="border border-gray-300 px-4 py-2 text-center w-1/4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="border border-gray-300 px-4 py-2 text-left">{student.firstName}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-left">{student.lastName}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-left">{student.email}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-4">
                                        <button
                                            onClick={() => handleEditStudentButtonPress(student)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition cursor-pointer"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => setStudentToDelete(student.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition cursor-pointer"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-500">
                                        Aucun étudiant trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pop-up ajout / modification */}
                {showAddStudent && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-250">
                            <h2 className="text-xl font-semibold mb-4">{editingStudent ? "Modifier l'étudiant" : "Ajouter un étudiant"}</h2>
                            <form onSubmit={(e) => { e.preventDefault(); addOrUpdateStudent(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="firstname" className="mb-1 font-medium">Prénom</label>
                                    <input
                                        id="firstname"
                                        type="text"
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="lastname" className="mb-1 font-medium">Nom</label>
                                    <input
                                        id="lastname"
                                        type="text"
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="mb-1 font-medium">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="number" className="mb-1 font-medium">Numéro étudiant</label>
                                    <input
                                        id="number"
                                        type="number"
                                        min="0"
                                        step="1"
                                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A8C85]"
                                        value={studentNumber}
                                        onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)) { setStudentNumber(value); } }}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => { setShowAddStudent(false); setEditingStudent(null); }} className="px-4 py-2 cancel-send-student-btn rounded transition cursor-pointer">Annuler</button>
                                    <button type="submit" className="px-4 py-2 send-student-btn text-white rounded transition cursor-pointer">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Pop-up suppression */}
                {studentToDelete !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
                            <p>Êtes-vous sûr de vouloir supprimer cet étudiant ?</p>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => setStudentToDelete(null)}
                                    className="px-4 py-2 rounded cancel-delete-student-btn transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => studentToDelete && deleteStudent(studentToDelete)}
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}