import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BG from "../assets/images/dotted-black-background.jpg";
import "../styles/login.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { auth } from "../../Firebase-config";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { AppContext } from "../../context/AppContext";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Button from "../shared/Button";
import AuthRedirect from "../utils/AuthRedirect";
import TextInput from "../shared/TextInput";
import PasswordInput from "../shared/PasswordInput";

function Register() {
  const [password, setPassword] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [btnName, setBtnName] = useState("Register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const {
    setNotifyDuration,
    setNotifyType,
    backendUrl,
    setNotifyMessage,
    siteTitle,
    setNotifyVisibility,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const handleTextChange = (e, setChange) => {
    const value = e.target.value;
    setChange(value);
  };

  const Notify = (type, message, duration) => {
    setNotifyType(type);
    setNotifyMessage(message);
    setNotifyVisibility(true);
    if (duration > 0) setNotifyDuration(duration);
  };

  useEffect(() => {
    const hashPassword = async () => {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(password, salt);
      setHashedPassword(hashed);
    };
    hashPassword();
  }, [password]);
  useEffect(() => {
    document.title = `Register | ${siteTitle}`;
  }, [siteTitle]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
      Notify("error", "Please fill all the fields");
      return;
    }
    setLoadingBtn(true);
    setBtnName("Registering...");
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = newUser.user;
      const userUid = user.uid;
      const data = {
        uid: userUid,
        email: email,
        name: name,
        password: hashedPassword,
      };
      const response = await axios.post(`${backendUrl}/user/create`, data);
      const panelId = response.data.id;
      Notify("success", "Registered Successfully");
      setEmail("");
      setName("");
      setPassword("");
      setBtnName("Register");
      setLoadingBtn(false);
      navigate(`/control-panel/${panelId}/dashboard`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Notify(
          "error",
          "Email is already in use. Please use a different email."
        );
      } else if (error.code === "auth/weak-password") {
        Notify("error", "Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        Notify("error", "Invalid email");
      }
      if (error.code === "auth/network-request-failed") {
        Notify("error", "Please check your device's network connection");
      }
      setLoadingBtn(false);
      setBtnName("Register");
    }
  };
  return (
    <div className="cllogin">
      <AuthRedirect />
      <img src={BG} alt="background" className="loginpagedots" />
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
            <h1>Register</h1>
          </div>
          <div className="cllogform">
            <div className="cllogemaildiv">
              <div className="cllogicondiv">
                <FaRegUser className="cllogicon" />
              </div>
              <TextInput
                value={name}
                onChange={handleTextChange}
                setState={setName}
                name="name"
                placeholder="Full Name"
              />
            </div>
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
            Already have an account? <Link to="/login">Login Now!</Link>
          </span>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
