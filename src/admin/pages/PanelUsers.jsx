import CheckAdmin from "../utils/CheckAdmin";
import "../styles/panelusers.css";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { formatDate } from "../../utils/FormatDate";
import NavBar from "../components/NavBar";

function PanelUsers() {
  const { currentAdmin, backendUrl, siteTitle } = useContext(AppContext);
  const [userDocs, setUserDocs] = useState([]);

  useEffect(() => {
    document.title = `Panel Users | ${siteTitle}`;
  }, [siteTitle]);

  useEffect(() => {
    const getUsersDocs = async () => {
      if (currentAdmin) {
        try {
          const response = await axios.post(`${backendUrl}/panel/get/users`, {
            key: currentAdmin.api_key,
          });
          const userDocs = response.data;
          setUserDocs(userDocs);
        } catch (error) {}
      }
    };
    getUsersDocs();
  }, [backendUrl, currentAdmin]);

  return (
    <div className="adhusers">
      <CheckAdmin />
      <NavBar />
      <div className="adhuserstb">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Status</th>
              <th>Balance</th>
              <th>Spent</th>
              <th>Panel ID</th>
              <th>Last Seen</th>
              <th className="advpminwidth190">Created At</th>
            </tr>
          </thead>
          <tbody>
            {userDocs.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.email}</td>
                <td>{order.username}</td>
                <td>{order.status}</td>
                <td>{order.balance}</td>
                <td>{order.spent}</td>
                <td>{order.panel_id}</td>
                <td>{formatDate(order.lastSeen)}</td>
                <td>{formatDate(order.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PanelUsers;
