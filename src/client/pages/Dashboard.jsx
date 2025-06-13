import NavBar from "../components/NavBar";
import CheckUser from "../utils/CheckUser";
import Footer from "../components/Footer";
import "../styles/dashboard.css";
import { useParams } from "react-router-dom";
import smile from "../../assets/images/smile.png";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loader from "../shared/Loader";
import AnchorLink from "../shared/AnchorLink";

function Dashboard() {
  const { loading, setLoading, siteTitle, backendUrl, currentUser } =
    useContext(AppContext);
  const { panel_id } = useParams();
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const getDomain = async () => {
      if (currentUser) {
        const response = await axios.post(`${backendUrl}/crud/get/docs`, {
          collection: "registeredPanels",
          key: currentUser.api_key,
        });
        const foundDomain = response.data.find(
          (panel) => panel.panel_id === parseInt(panel_id)
        );
        if (foundDomain) {
          setDomain(foundDomain.uid);
        }
      }
    };
    getDomain();
  }, [backendUrl, panel_id, currentUser]);

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
    <React.Fragment>
      <CheckUser />
      <NavBar />
      <div className="cldashbd">
        <div className="cldashbdbody">
          <img src={smile} alt="" className="clntcdashbdiimg" />
          <h2>Nothing To See Here For Now.</h2>
          <AnchorLink
            to={`https://${domain}`}
            target="blank"
            name="View Panel"
          />
          <AnchorLink
            to={`https://${domain}/control-panel/login`}
            target="blank"
            name="View Admin"
          />
        </div>
      </div>
      <div className="clfooter">
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
