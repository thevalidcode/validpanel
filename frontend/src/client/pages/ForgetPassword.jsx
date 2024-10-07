import "../styles/forgetpassword.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BG from "../../assets/images/dotted-black-background.jpg";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthRedirect from "../utils/AuthRedirect";
import { getData } from "../../utils/indexedDB";
import Loader from "../shared/Loader";
import TextInput from "../shared/TextInput";

function ForgetPassword() {
  const {
    setNotifyDuration,
    loading,
    setLoading,
    setNotifyType,
    setNotifyMessage,
    siteTitle,
    backendUrl,
    setNotifyVisibility,
  } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    document.title = `Forget Password | ${siteTitle}`;
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

  const handleTextChange = (e, setChange) => {
    const value = e.target.value;
    setChange(value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/user/forget-password`, {
        email: email,
      });
      Notify("success", "Email sent successfully");
      setEmail("");
      setEmailSent(true);
    } catch (error) {
      setEmail("");
      Notify("error", error.response.data.error || "Error sending email.");
    }
  };

  return (
    <div className="clforgetpassword">
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
      <div className="clfpassform">
        {!emailSent ? (
          <form onSubmit={handleEmailSubmit}>
            <h2>Reset Your Password</h2>
            <TextInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleTextChange}
              setState={setEmail}
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <React.Fragment>
            <div className="message">
              Thanks for submitting your email. A password has been sent to the
              email entered. Use it to login to your account. Check your spam
              folder if you don see it in your inbox!
            </div>
            <Link to="/login" className="clfpasswloginbtn">
              Login
            </Link>
          </React.Fragment>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ForgetPassword;
