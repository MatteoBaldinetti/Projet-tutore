import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ManageStudents from "./pages/admin/ManageStudents.tsx";
import ManageProfessors from "./pages/admin/ManageProfessors.tsx";
import Test from "./pages/Test.tsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/confirm-reset-password"
              element={<ConfirmResetPassword />}
            />
            <Route path="/test" element={<Test />} />

            <Route path="/admin/manage-students" element={<ManageStudents />} />
            <Route
              path="/admin/manage-professors"
              element={<ManageProfessors />}
            />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
