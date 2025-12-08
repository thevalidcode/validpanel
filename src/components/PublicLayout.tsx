import Navbar from "../client/components/NavBar";
import Footer from "../client/components/footer/Footer";
import { Outlet } from "react-router-dom";

const DashLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default DashLayout;
