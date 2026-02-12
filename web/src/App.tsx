import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ManageStudents from "./pages/admin/ManageStudents.tsx";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/confirm-reset-password" element={<ConfirmResetPassword />} />
            <Route path="/test" element={<ManageStudents />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
