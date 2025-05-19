import "../styles/navbar.css";
import React, { useState, useRef, useEffect } from "react";
import { IoOpen } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import { FaLightbulb, FaSquareXTwitter, FaUser } from "react-icons/fa6";
import { IoIosPricetags, IoLogoInstagram } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { MdDashboard, MdOutlineCancel } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Logo from "../../assets/images/ValidPanel.png";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { backendUrl, currentUser } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gottenPanelId, setGottenPanelId] = useState(0);
  const [mainPanelId, setMainPanelId] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const buttonRef = useRef();
  const containerRef = useRef();
  const navigate = useNavigate();

  const toogleOpen = () => {
    setIsOpen(!isOpen);
  };

  const cancelOpen = () => {
    setIsOpen(false);
  };

  const { panelId } = useParams();
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setIsLoggedIn(true);
    }
  }, [currentUser]);

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
        const gottenPanelId = response.data.id;
        setGottenPanelId(gottenPanelId);
      };
      getPanel();
    }
  }, [backendUrl, currentUser]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (panelId) {
      setMainPanelId(panelId);
    } else {
      setMainPanelId(gottenPanelId);
    }
  }, [panelId, gottenPanelId]);

  const goHome = () => {
    navigate(
      gottenPanelId !== 0 ? `/control-panel/${mainPanelId}/dashboard` : "/"
    );
  };

  return (
    <div className="clnavbarmain">
      {!isLoggedIn ? (
        // User Is Logged Out
        <React.Fragment>
          <div className={scrolled ? "clnavbarcon-scroll" : "clnavbarcon"}>
            <div className="clnavbar">
              <img
                src={Logo}
                alt="logo"
                className="clnavbarlogoimg"
                onClick={goHome}
              />
              <div className="clnavbarsocials">
                <Link to="https://x.com/validpanel" className="navbarsocial">
                  <FaSquareXTwitter className="clnavbarsocialIcon" />
                </Link>
                <Link
                  to="https://instagram.com/validpanel"
                  className="navbarsocial"
                >
                  <IoLogoInstagram className="clnavbarsocialIcon" />
                </Link>
                <Link to="#" className="navbarsocial">
                  <IoLogoWhatsapp className="clnavbarsocialIcon" />
                </Link>
              </div>
              <div className="clnavbarother">
                <Link to={"/"} className="navbarother">
                  <IoIosPricetags className="clnavbarsocialIcon" />
                  Pricing
                </Link>
              </div>
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
              <RiMenu2Line className="clnavbarhbmenu" onClick={toogleOpen} />
            </div>
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
                  <Link to="https://x.com/validpanel" className="navbarsocial">
                    <FaSquareXTwitter className="clmbnavbarsocialIcon" />
                  </Link>
                  <Link
                    to="https://instagram.com/validpanel"
                    className="navbarsocial"
                  >
                    <IoLogoInstagram className="clmbnavbarsocialIcon" />
                  </Link>
                  <Link to="#" className="navbarsocial">
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
            </div>
          ) : (
            ""
          )}
        </React.Fragment>
      ) : (
        // User Is Logged In
        <React.Fragment>
          <div
            className={
              scrolled && windowWidth <= 1320
                ? "clnavbarcon-scroll"
                : "clnavbarcon"
            }
          >
            <div className="clnavbar">
              <img
                src={Logo}
                alt="logo"
                className="clnavbarlogoimg"
                onClick={goHome}
              />
              <div className="clnavbarsocials">
                <Link to="https://x.com/validpanel" className="navbarsocial">
                  <FaSquareXTwitter className="clnavbarsocialIcon" />
                </Link>
                <Link
                  to="https://instagram.com/validpanel"
                  className="navbarsocial"
                >
                  <IoLogoInstagram className="clnavbarsocialIcon" />
                </Link>
                <Link to="#" className="navbarsocial">
                  <IoLogoWhatsapp className="clnavbarsocialIcon" />
                </Link>
              </div>
              <div className="clnavbarother">
                <Link
                  to={`/control-panel/${mainPanelId}/dashboard`}
                  className="navbarother"
                >
                  <IoIosPricetags className="clnavbarsocialIcon" />
                  Pricing
                </Link>
              </div>
              <Link
                to={`https://t.me/validpanel`}
                target="blank"
                className="clnavbarreq"
              >
                <FaLightbulb className="clnavbaricon" />
                Improve Valid Panel
              </Link>
              <RiMenu2Line className="clnavbarhbmenu" onClick={toogleOpen} />
            </div>
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
                  <Link to="https://x.com/validpanel" className="navbarsocial">
                    <FaSquareXTwitter className="clmbnavbarsocialIcon" />
                  </Link>
                  <Link
                    to="https://instagram.com/validpanel"
                    className="navbarsocial"
                  >
                    <IoLogoInstagram className="clmbnavbarsocialIcon" />
                  </Link>
                  <Link to="#" className="navbarsocial">
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
              <div className="clmbnbmenu">
                <Link
                  to={`/control-panel/${mainPanelId}/dashboard`}
                  className="clmbnavbarreq"
                >
                  <MdDashboard className="clmbnavbaricon" />
                  Dashboard
                </Link>
                <Link
                  to={`/control-panel/${mainPanelId}/account`}
                  className="clmbnavbarreq"
                >
                  <FaUser className="clmbnavbaricon" />
                  Account
                </Link>
                <Link
                  to={`https://t.me/validpanel`}
                  target="blank"
                  className="clmbnavbarreq"
                >
                  <FaLightbulb className="clmbnavbaricon" />
                  Improve Valid Panel
                </Link>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={scrolled ? "clusernav-scroll" : "clusernav"}>
            <div className="clusernavlinks">
              <Link
                to={`/control-panel/${mainPanelId}/dashboard`}
                className="clusernavlink"
              >
                <MdDashboard className="clusernavicon" />
                Dashboard
              </Link>
              <Link
                to={`/control-panel/${mainPanelId}/account`}
                className="clusernavlink"
              >
                <FaUser className="clusernavicon" />
                Account
              </Link>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default NavBar;
