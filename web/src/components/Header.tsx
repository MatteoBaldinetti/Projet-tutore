import "../styles/Header.css";
import logo from "../assets/images/pret&go.png";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <div className="navbar bg-green-700 grid grid-cols-2 gap-4 p-4 text-white">
      <div className="Logo ml-10">
        <img src={logo} alt="Pret&Go Logo" className="h-8" />
      </div>
      <div className="nav-buttons flex gap-9 justify-end items-center pr-10">
        <Link to="/" className={location.pathname === "/" ? "underline" : ""}>
          Accueil
        </Link>
        <Link
          to="/reserver"
          className={location.pathname === "/reserver" ? "underline" : ""}
        >
          Réserver
        </Link>
        <Link
          to="/materiel"
          className={location.pathname === "/materiel" ? "underline" : ""}
        >
          Matériel
        </Link>
      </div>
    </div>
  );
}

export default Header;
