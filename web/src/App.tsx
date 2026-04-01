import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

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
import AdminProfile from "./pages/admin/AdminProfile.tsx";
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
import SecurityProfile from "./pages/security/SecurityProfile.tsx";

// Student
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import MaterielList from "./pages/student/MaterielList.tsx";
import MaterielDetails from "./pages/student/MaterielDetails.tsx";
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

            {/* ── Auth publiques → redirige si déjà connecté ── */}
            <Route path="/" element={
              <ProtectedRoute authOnly><Login /></ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute authOnly><Register /></ProtectedRoute>
            } />
            <Route path="/forget-password" element={
              <ProtectedRoute authOnly><ForgetPassword /></ProtectedRoute>
            } />
            <Route path="/confirm-reset-password" element={
              <ProtectedRoute authOnly><ConfirmResetPassword /></ProtectedRoute>
            } />

            {/* ── Admin ── */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute><AdminProfile /></ProtectedRoute>
            } />
            <Route path="/admin/manage-students" element={
              <ProtectedRoute><ManageStudents /></ProtectedRoute>
            } />
            <Route path="/admin/manage-professors" element={
              <ProtectedRoute><ManageProfessors /></ProtectedRoute>
            } />
            <Route path="/admin/manage-subjects" element={
              <ProtectedRoute><ManageSubjects /></ProtectedRoute>
            } />
            <Route path="/admin/manage-tags" element={
              <ProtectedRoute><ManageTags /></ProtectedRoute>
            } />
            <Route path="/admin/manage-item-types" element={
              <ProtectedRoute><ManageItemTypes /></ProtectedRoute>
            } />
            <Route path="/admin/manage-classroom-types" element={
              <ProtectedRoute><ManageClassroomTypes /></ProtectedRoute>
            } />
            <Route path="/admin/manage-items" element={
              <ProtectedRoute><ManageItems /></ProtectedRoute>
            } />
            <Route path="/admin/manage-classrooms" element={
              <ProtectedRoute><ManageClassrooms /></ProtectedRoute>
            } />
            <Route path="/admin/manage-reservations" element={
              <ProtectedRoute><ManageReservations /></ProtectedRoute>
            } />
            <Route path="/admin/manage-reports" element={
              <ProtectedRoute><ManageReports /></ProtectedRoute>
            } />
            <Route path="/admin/manage-notifications" element={
              <ProtectedRoute><ManageNotifications /></ProtectedRoute>
            } />

            {/* ── Professor ── */}
            <Route path="/professor/dashboard" element={
              <ProtectedRoute><ProfessorDashboard /></ProtectedRoute>
            } />
            <Route path="/professor/reservations/pending" element={
              <ProtectedRoute><ProfessorPendingReservations /></ProtectedRoute>
            } />
            <Route path="/professor/reservations" element={
              <ProtectedRoute><ProfessorReservations /></ProtectedRoute>
            } />
            <Route path="/professor/resources/items" element={
              <ProtectedRoute><ProfessorResources type="items" /></ProtectedRoute>
            } />
            <Route path="/professor/resources/classrooms" element={
              <ProtectedRoute><ProfessorResources type="classrooms" /></ProtectedRoute>
            } />
            <Route path="/professor/reports" element={
              <ProtectedRoute><ProfessorReports /></ProtectedRoute>
            } />
            <Route path="/professor/profile" element={
              <ProtectedRoute><ProfessorProfile /></ProtectedRoute>
            } />
            <Route path="/professor/validation-retour" element={
              <ProtectedRoute><ProfessorValidationRetour /></ProtectedRoute>
            } />

            {/* ── Security ── */}
            <Route path="/security/today" element={
              <ProtectedRoute><SecurityToday /></ProtectedRoute>
            } />
            <Route path="/security/profile" element={
              <ProtectedRoute><SecurityProfile /></ProtectedRoute>
            } />

            {/* ── Student ── */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/student/materiel-list" element={
              <ProtectedRoute><MaterielList /></ProtectedRoute>
            } />
            <Route path="/student/materiel-details/:itemTypeId" element={
              <ProtectedRoute><MaterielDetails /></ProtectedRoute>
            } />
            <Route path="/student/materiel-reservation/:id" element={
              <ProtectedRoute><MaterielReservation /></ProtectedRoute>
            } />
            <Route path="/student/room-list" element={
              <ProtectedRoute><RoomList /></ProtectedRoute>
            } />
            <Route path="/student/room-details/:id" element={
              <ProtectedRoute><RoomDetails /></ProtectedRoute>
            } />
            <Route path="/student/room-reservation/:id" element={
              <ProtectedRoute><RoomReservation /></ProtectedRoute>
            } />
            <Route path="/student/my-reservations" element={
              <ProtectedRoute><MyReservations /></ProtectedRoute>
            } />
            <Route path="/student/notifications" element={
              <ProtectedRoute><MyNotifications /></ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute><MyProfile /></ProtectedRoute>
            } />
            <Route path="/student/report" element={
              <ProtectedRoute><StudentReport /></ProtectedRoute>
            } />
            <Route path="/student/retour-emprunt" element={
              <ProtectedRoute><RetourEmprunt /></ProtectedRoute>
            } />

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
