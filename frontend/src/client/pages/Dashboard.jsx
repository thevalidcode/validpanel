import NavBar from "../components/NavBar";
import CheckUser from "../utils/CheckUser";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <div>
      <CheckUser />
      <NavBar />
      <Footer />
    </div>
  );
}

export default Dashboard;
