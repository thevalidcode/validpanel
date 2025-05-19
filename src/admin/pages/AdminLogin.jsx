import React, { useContext, useEffect, useState } from "react";
import "../styles/adminlogin.css";
import axios from "axios";
import { addData, getData } from "../../utils/indexedDB";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

function AdminLogin() {
  const {
    setNotifyType,
    setNotifyMessage,
    setNotifyVisibility,
    siteTitle,
    setNotifyDuration,
    backendUrl,
    setCurrentAdmin,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    const onAuth = async () => {
      const currentAdmin = await getData("admin_auth");
      if (currentAdmin) {
        navigate("/admin/panels");
      }
    };
    onAuth();
  }, [navigate]);

  useEffect(() => {
    document.title = `Admin Login | ${siteTitle}`;
  }, [siteTitle]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await axios.post(`${backendUrl}/admin/login`, data);
      const adminData = response.data.adminData;
      setCurrentAdmin(adminData);
      await addData({
        id: "admin_auth",
        email: email,
        created_at: adminData.timestamp,
        uid: adminData.uid,
      });
      navigate("/admin/panels");
      Notify("success", "Logged In Successfully");
    } catch (error) {
      Notify("error", error.response.data.error);
    }
  };

  const Notify = (type, message, duration) => {
    setNotifyType(type);
    setNotifyMessage(message);
    setNotifyVisibility(true);
    if (duration >= 0) setNotifyDuration(duration);
  };

  return (
    <div className="adalogin-container">
      <div className="adalogin-box">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="adainput-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="adainput-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="adalogin-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
