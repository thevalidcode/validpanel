import CheckAdmin from "../utils/CheckAdmin";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { formatDate } from "../../utils/FormatDate";
import "../styles/users.css";
import NavBar from "../components/NavBar";

function Users() {
  const { currentAdmin, backendUrl, siteTitle } = useContext(AppContext);
  const [userDocs, setUserDocs] = useState([]);

  useEffect(() => {
    document.title = `Users | ${siteTitle}`;
  }, [siteTitle]);

  useEffect(() => {
    const getUsersDocs = async () => {
      if (currentAdmin) {
        try {
          const response = await axios.post(`${backendUrl}/crud/get/docs`, {
            collection: "users",
            key: currentAdmin.apiKey,
          });
          const userDocs = response.data.sort((a, b) => b.id - a.id);
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
              <th>Name</th>
              <th>Email</th>
              <th className="advpminwidth190">Created At</th>
              <th>Panel IDs</th>
            </tr>
          </thead>
          <tbody>
            {userDocs.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.timestamp)}</td>
                <td>{user.panelIds.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
