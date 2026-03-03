import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import Footer from "./components/Footer.tsx";
import ManageStudents from "./pages/admin/ManageStudents.tsx";
import ManageProfessors from "./pages/admin/ManageProfessors.tsx";
import ManageSubjects from "./pages/admin/ManageSubjects.tsx";
import Test from "./pages/Test.tsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/confirm-reset-password" element={<ConfirmResetPassword />} />
            
            <Route path="/admin/manage-students" element={<ManageStudents />} />
            <Route path="/admin/manage-professors" element={<ManageProfessors />} />
            <Route path="/admin/manage-subjects" element={<ManageSubjects />} />

            <Route path="/test" element={<Test />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
