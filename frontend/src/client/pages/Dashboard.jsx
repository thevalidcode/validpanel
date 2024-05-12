import NavBar from "../components/NavBar";
import CheckUser from "../utils/CheckUser";
import Footer from "../components/Footer";
import "../styles/dashboard.css";
import { Link, useParams } from "react-router-dom";
import smile from "../assets/images/smile.png";
import { useState, useEffect, useContext } from "react";
import { db } from "../../Firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import Loader from "../shared/Loader";

function Dashboard() {
  const { loading, setLoading, siteTitle } = useContext(AppContext);
  const { panelId } = useParams();
  const [domain, setDomain] = useState();

  useEffect(() => {
    const getDomain = async () => {
      const registeredPanelsQuery = query(
        collection(db, "registeredPanels"),
        where("panelId", "==", parseInt(panelId))
      );
      const registeredPanelsSnap = await getDocs(registeredPanelsQuery);
      if (!registeredPanelsSnap.empty) {
        setDomain(registeredPanelsSnap.docs[0].id);
      }
    };
    getDomain();
  }, [panelId]);

  useEffect(() => {
    document.title = `Dashboard | ${siteTitle}`;
  }, [siteTitle]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [setLoading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <CheckUser />
      <NavBar />
      <div className="cldashbd">
        <div className="cldashbdbody">
          <img src={smile} alt="" className="clntcdashbdiimg" />
          <h2>Nothing To See Here For Now.</h2>
          <Link to={`https://${domain}`} target="blank">
            View Panel
          </Link>
          <Link to={`https://${domain}/control-panel/login`} target="blank">
            View Admin
          </Link>
        </div>
      </div>
      <div className="clfooter">
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
