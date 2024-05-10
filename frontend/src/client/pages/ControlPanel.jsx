import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CheckUser from "../utils/CheckUser";

function ControlPanel() {
  return (
    <div>
      <CheckUser />
      <NavBar />
      <Footer />
    </div>
  );
}

export default ControlPanel;
