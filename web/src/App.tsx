import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/confirm-reset-password" element={<ConfirmResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
