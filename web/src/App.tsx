import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import Footer from "./components/Footer.tsx";

// Admin - existants
import ManageStudents from "./pages/admin/ManageStudents.tsx";
import ManageProfessors from "./pages/admin/ManageProfessors.tsx";
import ManageSubjects from "./pages/admin/ManageSubjects.tsx";

// Admin - nouveaux
import ManageTags from "./pages/admin/ManageTags.tsx";
import ManageItemTypes from "./pages/admin/ManageItemTypes.tsx";
import ManageClassroomTypes from "./pages/admin/ManageClassroomTypes.tsx";
import ManageItems from "./pages/admin/ManageItems.tsx";
import ManageClassrooms from "./pages/admin/ManageClassrooms.tsx";
import ManageReservations from "./pages/admin/ManageReservations.tsx";
import ManageReports from "./pages/admin/ManageReports.tsx";
import ManageNotifications from "./pages/admin/ManageNotifications.tsx";

// Student
import MaterielList from "./pages/student/MaterielList.tsx";
import MaterielReservation from "./pages/student/MaterielReservation.tsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/confirm-reset-password"
              element={<ConfirmResetPassword />}
            />

            {/* Admin - existants */}
            <Route path="/admin/manage-students" element={<ManageStudents />} />
            <Route
              path="/admin/manage-professors"
              element={<ManageProfessors />}
            />
            <Route path="/admin/manage-subjects" element={<ManageSubjects />} />

            {/* Admin - nouveaux */}
            <Route path="/admin/manage-tags" element={<ManageTags />} />
            <Route
              path="/admin/manage-item-types"
              element={<ManageItemTypes />}
            />
            <Route
              path="/admin/manage-classroom-types"
              element={<ManageClassroomTypes />}
            />
            <Route path="/admin/manage-items" element={<ManageItems />} />
            <Route
              path="/admin/manage-classrooms"
              element={<ManageClassrooms />}
            />
            <Route
              path="/admin/manage-reservations"
              element={<ManageReservations />}
            />
            <Route path="/admin/manage-reports" element={<ManageReports />} />
            <Route
              path="/admin/manage-notifications"
              element={<ManageNotifications />}
            />

            {/* Student */}
            <Route path="/student/materiel-list" element={<MaterielList />} />
            <Route
              path="/student/materiel-reservation/:id"
              element={<MaterielReservation />}
            />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
