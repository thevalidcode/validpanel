import "../styles/navbar.css";
import { useState, useRef, useEffect } from "react";
import { IoOpen } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoIosPricetags, IoLogoInstagram } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef();
  const containerRef = useRef();

  const toogleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toogleDropdownOpen = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const cancelOpen = () => {
    setIsOpen(false);
  };

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
    let handler = (e) => {
      if (
        !buttonRef.current?.contains(e.target) &&
        !containerRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
        setIsDropdownOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
    }

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className={scrolled ? "clnavbarcon-scroll" : "clnavbarcon"}>
      <div className="clnavbar">
        <div className="clnavbarlogo">
          <Link
            to="/"
            className=" text-decoration-none text-white"
            style={{ fontSize: "2rem" }}
          >
            Logo
          </Link>
        </div>
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
      {isOpen ? (
        <div className="clmbnavbar" ref={containerRef}>
          <div className="clmbnavbarhead">
            <h1>Logo</h1>
            <div ref={buttonRef}>
              <MdOutlineCancel
                className="clmbnavbarcancel"
                onClick={cancelOpen}
              />
            </div>
          </div>
          <div className="clmbnavbarsocials">
            <Link to="/#" className="navbarsocial">
              <FaSquareXTwitter className="clmbnavbarsocialIcon" /> X
            </Link>
            <Link to="/#" className="navbarsocial">
              <IoLogoInstagram className="clmbnavbarsocialIcon" />
              Instagram
            </Link>
            <Link to="/#" className="navbarsocial">
              <IoLogoWhatsapp className="clmbnavbarsocialIcon" />
              Whatsapp
            </Link>
          </div>
          <div className="claccdropdown">
            <span className="claccount" onClick={toogleDropdownOpen}>
              <VscAccount className="claccicon" />
              Account{" "}
              {isDropdownOpen ? (
                <FaCaretUp className="claccdownicon" />
              ) : (
                <FaCaretDown className="claccdownicon" />
              )}
            </span>
            {isDropdownOpen ? (
              <div className="cldropdownmenu">
                <Link to="/login" className="cldropdownlink">
                  <IoPerson className="cldropdowniconli" />
                  Login
                </Link>
                <Link to="/register" className="cldropdownlink">
                  <FaListUl className="cldropdowniconli" />
                  Register
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default NavBar;
