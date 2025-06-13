import CheckAdmin from "../utils/CheckAdmin";
import "../styles/panels.css";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { formatDate } from "../../utils/FormatDate";
import NavBar from "../components/NavBar";

function Panels() {
  const [registeredPanelsDocs, setRegisteredPanelsDocs] = useState([]);
  const { currentAdmin, backendUrl, siteTitle } = useContext(AppContext);

  useEffect(() => {
    document.title = `Panels | ${siteTitle}`;
  }, [siteTitle]);

  useEffect(() => {
    const getRpDocs = async () => {
      if (currentAdmin) {
        try {
          const response = await axios.post(`${backendUrl}/crud/get/docs`, {
            collection: "registeredPanels",
            key: currentAdmin.api_key,
          });
          setRegisteredPanelsDocs(response.data);
        } catch (error) {}
      }
    };
    getRpDocs();
  }, [currentAdmin, backendUrl]);

  return (
    <div className="adfpanels">
      <CheckAdmin />
      <NavBar />
      <div className="adfpanelstb">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Domain</th>
              <th className="advpminwidth190">Created At</th>
              <th>SSL</th>
            </tr>
          </thead>
          <tbody>
            {registeredPanelsDocs.map((panel, index) => (
              <tr key={index}>
                <td>{panel.panel_id}</td>
                <td>{panel.uid}</td>
                <td className="advpminwidth190">
                  {formatDate(panel.timestamp)}
                </td>
                <td className="advpminwidth190">
                  {panel.ssl ? "Secured" : "Not Secured"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Panels;
