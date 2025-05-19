import CheckAdmin from "../utils/CheckAdmin";
import "../styles/orders.css";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { formatDate } from "../../utils/FormatDate";
import NavBar from "../components/NavBar";

function Orders() {
  const { currentAdmin, backendUrl, siteTitle } = useContext(AppContext);
  const [orderDocs, setOrderDocs] = useState([]);

  useEffect(() => {
    document.title = `Orders | ${siteTitle}`;
  }, [siteTitle]);

  useEffect(() => {
    const getOrdersDocs = async () => {
      if (currentAdmin) {
        try {
          const response = await axios.post(`${backendUrl}/panel/get/orders`, {
            key: currentAdmin.apiKey,
          });
          const orderDocs = response.data;
          setOrderDocs(orderDocs);
        } catch (error) {}
      }
    };
    getOrdersDocs();
  }, [backendUrl, currentAdmin]);
  return (
    <div className="adhorders">
      <CheckAdmin />
      <NavBar />
      <div className="adhorderstb">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service ID</th>
              <th>Price</th>
              <th>Url</th>
              <th>Status</th>
              <th>User</th>
              <th>Panel ID</th>
              <th>Synced</th>
              <th className="advpminwidth190">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orderDocs.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.serviceID}</td>
                <td>${order.price}</td>
                <td>{order.url}</td>
                <td>{order.status}</td>
                <td>{order.username}</td>
                <td>{order.panelId}</td>
                <td>{order.synced ? "Synced" : "Not Synced"}</td>
                <td>{formatDate(order.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
