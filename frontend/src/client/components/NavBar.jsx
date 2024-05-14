import "../styles/navbar.css";
import { useState, useRef, useEffect } from "react";
import { IoOpen } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import { FaLightbulb, FaSquareXTwitter } from "react-icons/fa6";
import { IoIosPricetags, IoLogoInstagram } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase-config";
import Logo from "../assets/images/ValidPanel.png";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [panelId, setPanelId] = useState(0);
  const buttonRef = useRef();
  const containerRef = useRef();
  const navigate = useNavigate();

  const toogleOpen = () => {
    setIsOpen(!isOpen);
  };

  const cancelOpen = () => {
    setIsOpen(false);
  };

  const { currentUser } = auth;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setIsLoggedIn(true);
      }
    });
    return () => {
      unsuscribe();
    };
  }, []);

  useEffect(() => {
    let handler = (e) => {
      if (
        !buttonRef.current?.contains(e.target) &&
        !containerRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
    }

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const getPanel = async () => {
        const response = await axios.post(`${backendUrl}/panel/getId`, {
          uid: currentUser.uid,
        });
        const panelId = response.data.id;
        setPanelId(panelId);
      };
      getPanel();
    }
  }, [backendUrl, currentUser]);

  const goHome = () => {
    navigate(panelId !== 0 ? `/control-panel/${panelId}/dashboard` : "/");
  };

  return (
    <div className="clnavbarmain">
      <div className={scrolled ? "clnavbarcon-scroll" : "clnavbarcon"}>
        <div className="clnavbar">
          <img
            src={Logo}
            alt="logo"
            className="clnavbarlogoimg"
            onClick={goHome}
          />
          <div className="clnavbarsocials">
            <Link to="/#" className="navbarsocial">
              <FaSquareXTwitter className="clnavbarsocialIcon" />
            </Link>
            <Link to="/#" className="navbarsocial">
              <IoLogoInstagram className="clnavbarsocialIcon" />
            </Link>
            <Link to="/#" className="navbarsocial">
              <IoLogoWhatsapp className="clnavbarsocialIcon" />
            </Link>
          </div>
          <div className="clnavbarother">
            <Link to="/#" className="navbarother">
              <IoIosPricetags className="clnavbarsocialIcon" />
              Pricing
            </Link>
          </div>
          {!isLoggedIn ? (
            <div className="clnavbarlinks">
              <Link to="/register" className="clnavbarregis">
                <IoOpen className="clnavbaricon" />
                Register
              </Link>
              <Link to="/login" className="clnavbarlogin">
                <IoLogIn className="clnavbaricon" />
                Login
              </Link>
            </div>
          ) : (
            <Link to="/request-feature" className="clnavbarreq">
              <FaLightbulb className="clnavbaricon" />
              Improve Valid Panel
            </Link>
          )}
          <RiMenu2Line className="clnavbarhbmenu" onClick={toogleOpen} />
        </div>
        {isOpen ? (
          <div className="clmbnavbar" ref={containerRef}>
            <div className="clmbnavbarhead">
              <img
                src={Logo}
                alt="logo"
                className="clnavbarlogoimg"
                onClick={goHome}
              />
              <div className="clmbnavbarsocials">
                <Link to="/#" className="navbarsocial">
                  <FaSquareXTwitter className="clmbnavbarsocialIcon" />
                </Link>
                <Link to="/#" className="navbarsocial">
                  <IoLogoInstagram className="clmbnavbarsocialIcon" />
                </Link>
                <Link to="/#" className="navbarsocial">
                  <IoLogoWhatsapp className="clmbnavbarsocialIcon" />
                </Link>
              </div>
              <div ref={buttonRef}>
                <MdOutlineCancel
                  className="clmbnavbarcancel"
                  onClick={cancelOpen}
                />
              </div>
            </div>
            {isLoggedIn ? (
              <Link to="/request-feature" className="clmbnavbarreq">
                <FaLightbulb className="clmbnavbaricon" />
                Improve Valid Panel
              </Link>
            ) : (
              <div className="clmbnbmenu">
                <Link to="/login" className="clmbnblink">
                  <IoPerson className="clmbnbiconli" />
                  Login
                </Link>
                <Link to="/register" className="clmbnblink">
                  <FaListUl className="clmbnbiconli" />
                  Register
                </Link>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default NavBar;
