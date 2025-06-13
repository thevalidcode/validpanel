import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BG from "../../assets/images/dotted-black-background.jpg";
import "../styles/login.css";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import axios from "axios";
import AuthRedirect from "../utils/AuthRedirect";
import { addData, getData } from "../../utils/indexedDB";
import TextInput from "../shared/TextInput";
import PasswordInput from "../shared/PasswordInput";
import Loader from "../shared/Loader";

function Login() {
  const [password, setPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [btnName, setBtnName] = useState("Login");
  const {
    setNotifyDuration,
    loading,
    setLoading,
    setNotifyType,
    setNotifyMessage,
    siteTitle,
    backendUrl,
    setCurrentUser,
    setNotifyVisibility,
  } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleTextChange = (e, setChange) => {
    const value = e.target.value;
    setChange(value);
  };
  useEffect(() => {
    document.title = `Login | ${siteTitle}`;
  }, [siteTitle]);

  useEffect(() => {
    const onAuth = async () => {
      const currentUser = await getData("user_auth");
      if (currentUser) {
        setTimeout(() => {
          setLoading(false);
        }, 20000);
      } else {
        setLoading(false);
      }
    };
    onAuth();
  }, [setLoading]);

  if (loading) {
    return (
      <React.Fragment>
        <AuthRedirect />
        <Loader />
      </React.Fragment>
    );
  }
  const Notify = (type, message, duration) => {
    setNotifyType(type);
    setNotifyMessage(message);
    setNotifyVisibility(true);
    if (duration >= 0) setNotifyDuration(duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      Notify("error", "Please fill all the fields");
      return;
    }
    setLoadingBtn(true);
    setBtnName("Logging in...");
    try {
      const userResponse = await axios.post(`${backendUrl}/user/auth`, {
        email: email,
        password: password,
      });
      const userData = userResponse.data;
      const response = await axios.post(`${backendUrl}/panel/getId`, {
        uid: userData.uid,
        key: userData.api_key,
      });
      const panel_id = response.data.id;
      setEmail("");
      setPassword("");
      await addData({
        email: email,
        uid: userData.uid,
        created_at: userData.timestamp,
        id: "user_auth",
      });
      setBtnName("Login");
      setLoadingBtn(false);
      setCurrentUser(userData);
      Notify("success", "Logged in successfully");
      navigate(`/control-panel/${panel_id}/dashboard`);
    } catch (error) {
      Notify("error", error.response.data.error);
      setLoadingBtn(false);
      setBtnName("Login");
    }
  };

  return (
    <div className="cllogin">
      <img src={BG} alt="background" className="loginpagedots" />
      <AuthRedirect />
      <NavBar />
      <div className="logpagesquares">
        <div className="squares bigsq1"></div>
        <div className="squares bigsq2"></div>
        <div className="squares smallsq1"></div>
        <div className="squares smallsq2"></div>
        <div className="squares smallsq3"></div>
        <div className="squares mediumsq1"></div>
        <div className="squares mediumsq2"></div>
        <div className="squares mediumsq3"></div>
      </div>
      <div className="clloginform">
        <form onSubmit={handleSubmit}>
          <div className="cllogheadtext">
            <h1>Login</h1>
          </div>
          <div className="cllogform">
            <div className="cllogemaildiv">
              <div className="cllogicondiv">
                <IoMail className="cllogicon" />
              </div>
              <TextInput
                value={email}
                onChange={handleTextChange}
                setState={setEmail}
                autoComplete="off"
                name="email"
                placeholder="Email"
              />
            </div>
            <div className="cllogpasswdiv">
              <div className="cllogicondiv">
                <IoIosLock className="cllogicon" />
              </div>
              <PasswordInput
                onChange={handleTextChange}
                setState={setPassword}
                value={password}
              />
            </div>
            <Button
              type="submit"
              name={btnName}
              loading={loadingBtn}
              width="90%"
            />
          </div>
          <Link to="/forget-password" className="cllogfpass">
            Forget Password?
          </Link>
          <span className="cllognot">
            Don't have an account? <Link to="/register">Create One Now!</Link>
          </span>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
