import { Outlet } from "react-router-dom";
import Navbar from "../components/front/Navbar.jsx";
import Footer from "../components/front/Footer.jsx";
import "../styles/front.css";

function FrontLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default FrontLayout;
