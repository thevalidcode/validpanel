import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BG from "../assets/images/dotted-black-background.jpg";
import "../styles/login.css";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { AppContext } from "../../context/AppContext";
import { auth } from "../../Firebase-config";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import AuthRedirect from "../utils/AuthRedirect";
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setTimeout(() => {
          setLoading(false);
        }, 20000);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setLoading]);

  if (loading) {
    return (
      <>
        <AuthRedirect />
        <Loader />
      </>
    );
  }
  const Notify = (type, message, duration) => {
    setNotifyType(type);
    setNotifyMessage(message);
    setNotifyVisibility(true);
    if (duration > 0) setNotifyDuration(duration);
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const response = await axios.post(`${backendUrl}/panel/getId`, {
        uid: userCredential.user.uid,
      });
      const panelId = response.data.id;
      setEmail("");
      setPassword("");
      setBtnName("Login");
      setLoadingBtn(false);
      Notify("success", "Logged in successfully");
      navigate(`/control-panel/${panelId}/dashboard`);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Notify("error", "Invalid email or password");
      }
      if (error.code === "auth/network-request-failed") {
        Notify("error", "Please check your device's network connection");
      }
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
