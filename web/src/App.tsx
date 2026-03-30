import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer.tsx";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";

// Erreurs
import NotFound from "./pages/error/NotFound.tsx";
import Forbidden from "./pages/error/Forbidden.tsx";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ManageStudents from "./pages/admin/ManageStudents.tsx";
import ManageProfessors from "./pages/admin/ManageProfessors.tsx";
import ManageSubjects from "./pages/admin/ManageSubjects.tsx";
import ManageTags from "./pages/admin/ManageTags.tsx";
import ManageItemTypes from "./pages/admin/ManageItemTypes.tsx";
import ManageClassroomTypes from "./pages/admin/ManageClassroomTypes.tsx";
import ManageItems from "./pages/admin/ManageItems.tsx";
import ManageClassrooms from "./pages/admin/ManageClassrooms.tsx";
import ManageReservations from "./pages/admin/ManageReservations.tsx";
import ManageReports from "./pages/admin/ManageReports.tsx";
import ManageNotifications from "./pages/admin/ManageNotifications.tsx";

// Professor
import ProfessorDashboard from "./pages/professor/ProfessorDashboard.tsx";
import ProfessorPendingReservations from "./pages/professor/ProfessorPendingReservations.tsx";
import ProfessorReservations from "./pages/professor/ProfessorReservations.tsx";
import ProfessorResources from "./pages/professor/ProfessorResources.tsx";
import ProfessorReports from "./pages/professor/ProfessorReports.tsx";
import ProfessorProfile from "./pages/professor/ProfessorProfile.tsx";
import ProfessorValidationRetour from "./pages/professor/ProfessorValidationRetour.tsx";

// Security
import SecurityToday from "./pages/security/SecurityToday.tsx";

// Student
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import MaterielList from "./pages/student/MaterielList.tsx";
import MaterielReservation from "./pages/student/MaterielReservation.tsx";
import RoomList from "./pages/student/RoomList.tsx";
import RoomDetails from "./pages/student/RoomDetails.tsx";
import RoomReservation from "./pages/student/RoomReservation.tsx";
import MyReservations from "./pages/student/MyReservations.tsx";
import MyNotifications from "./pages/student/MyNotifications.tsx";
import MyProfile from "./pages/student/MyProfile.tsx";
import StudentReport from "./pages/student/StudentReport.tsx";
import RetourEmprunt from "./pages/student/RetourEmprunt.tsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>

            {/* ── Auth ── */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/confirm-reset-password" element={<ConfirmResetPassword />} />

            {/* ── Admin ── */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-students" element={<ManageStudents />} />
            <Route path="/admin/manage-professors" element={<ManageProfessors />} />
            <Route path="/admin/manage-subjects" element={<ManageSubjects />} />
            <Route path="/admin/manage-tags" element={<ManageTags />} />
            <Route path="/admin/manage-item-types" element={<ManageItemTypes />} />
            <Route path="/admin/manage-classroom-types" element={<ManageClassroomTypes />} />
            <Route path="/admin/manage-items" element={<ManageItems />} />
            <Route path="/admin/manage-classrooms" element={<ManageClassrooms />} />
            <Route path="/admin/manage-reservations" element={<ManageReservations />} />
            <Route path="/admin/manage-reports" element={<ManageReports />} />
            <Route path="/admin/manage-notifications" element={<ManageNotifications />} />

            {/* ── Professor ── */}
            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            <Route path="/professor/reservations/pending" element={<ProfessorPendingReservations />} />
            <Route path="/professor/reservations" element={<ProfessorReservations />} />
            <Route path="/professor/resources/items" element={<ProfessorResources type="items" />} />
            <Route path="/professor/resources/classrooms" element={<ProfessorResources type="classrooms" />} />
            <Route path="/professor/reports" element={<ProfessorReports />} />
            <Route path="/professor/profile" element={<ProfessorProfile />} />
            <Route path="/professor/validation-retour" element={<ProfessorValidationRetour />} />

            {/* ── Security ── */}
            <Route path="/security/today" element={<SecurityToday />} />

            {/* ── Student ── */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/materiel-list" element={<MaterielList />} />
            <Route path="/student/materiel-reservation/:id" element={<MaterielReservation />} />
            <Route path="/student/room-list" element={<RoomList />} />
            <Route path="/student/room-details/:id" element={<RoomDetails />} />
            <Route path="/student/room-reservation/:id" element={<RoomReservation />} />
            <Route path="/student/my-reservations" element={<MyReservations />} />
            <Route path="/student/notifications" element={<MyNotifications />} />
            <Route path="/student/profile" element={<MyProfile />} />
            <Route path="/student/report" element={<StudentReport />} />
            <Route path="/student/retour-emprunt" element={<RetourEmprunt />} />

            {/* ── Erreurs ── */}
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
