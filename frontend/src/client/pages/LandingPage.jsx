import React, { useContext, useEffect, useState } from "react";
import "../styles/landingpage.css";
import BG from "../../assets/images/dotted-black-background.jpg";
import PanelImage from "../../assets/images/panel-image.png";
import NavBar from "../components/NavBar";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSync, FaSyncAlt } from "react-icons/fa";
import ScrollAnimation from "react-animate-on-scroll";
import DarkThemeImg from "../../assets/images/Dark-Theme.png";
import LightThemeImg from "../../assets/images/Light-Theme.png"
import MbStyle from "../../assets/images/MB-Style.jpg";
import DeskDarkStyle from "../../assets/images/DeskDarkStyle.png";
import DeskLightStyle from "../../assets/images/DeskLightStyle.png";
import { FiSun } from "react-icons/fi";
import { MdDarkMode, MdOutlinePayment } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { IoBagHandle } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { RiUserLocationLine } from "react-icons/ri";
import Footer from "../components/Footer";
import AuthRedirect from "../utils/AuthRedirect";
import Loader from "../shared/Loader";
import { getData } from "../../utils/indexedDB";

function LandingPage() {
  const { loading, setLoading, siteTitle } = useContext(AppContext);
  const [lightThemeImage, setLightThemeImage] = useState(true);

  useEffect(() => {
    document.title = siteTitle;
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
      <>
        <AuthRedirect />
        <Loader />
      </>
    );
  }

  return (
    <div className="landingpage">
      <AuthRedirect />
      <img src={BG} alt="background" className="landingpagedots" />
      <NavBar />
      <div className="ldpagesquares">
        <div className="squares bigsq1"></div>
        <div className="squares bigsq2"></div>
        <div className="squares smallsq1"></div>
        <div className="squares smallsq2"></div>
        <div className="squares mediumsq1"></div>
        <div className="squares mediumsq2"></div>
        <div className="squares mediumsq3"></div>
      </div>
      <div className="clheadcenter">
        <h1>
          Your One-Stop Platform for Reselling{" "}
          <div className="success">
            <span>Success!</span>
            <span>Achievement!</span>
            <span>Growth!</span>
            <span>Triumph!</span>
            <span>Success!</span>
          </div>
        </h1>
      </div>
      <section className="container">
        <div className="lpsec1">
          <span className="lgsec1cttxt">Start Right Now</span>
          <ScrollAnimation
            animateIn="bounce"
            duration={0.2}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h1 className="lpsec1headtxt">
              CREATE YOUR OWN SMM-PANEL WITH US IN ONE CLICK
            </h1>
          </ScrollAnimation>
          <ScrollAnimation animateIn="fadeIn">
            <div className="lgsec1imgcon">
              <img src={PanelImage} alt="panel" className="lpsec1image" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animateIn="backInUp" duration={0.5}>
            <Link to="/register" className="lgsec1cta">
              GET STARTED <FaArrowRight className="lgsecctaicon" />
            </Link>
          </ScrollAnimation>
          <div className="lgsec1viewdemo">
            What's it gonna look like? ·{" "}
            <Link to="https://validplug.com.ng" target="blank">
              View demo
            </Link>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="lpsec2 mt-5">
          <span className="lgsec2cttxt">Amazing Themes</span>
          <ScrollAnimation
            animateIn="bounce"
            duration={0.4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h1 className="lpsec2headtxt">
              EMPOWER CLIENTS TO CHOOSE THEIR PREFERRED THEME EFFORTLESSLY
            </h1>
          </ScrollAnimation>
          <div className="lpsec2btnthemes">
            <button
              className="lpsec2thebtn"
              onClick={() => setLightThemeImage(!lightThemeImage)}
            >
              {lightThemeImage ? (
                <React.Fragment>
                  <FiSun className="lpssec2themeic" /> Light
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <MdDarkMode className="lpssec2themeic" /> Dark
                </React.Fragment>
              )}
            </button>
          </div>
          <div className="lpsec2imag">
            {lightThemeImage ? (
              <ScrollAnimation animateIn="fadeIn">
                <div className="lpsec2imgcon">
                  <img
                    src={LightThemeImg}
                    alt="light/theme"
                    className="lpsec2img"
                  />
                </div>
              </ScrollAnimation>
            ) : (
              <ScrollAnimation animateIn="fadeIn">
                <div className="lpsec2imgcon">
                  <img
                    src={DarkThemeImg}
                    alt="dark/theme"
                    className="lpsec2img"
                  />
                </div>
              </ScrollAnimation>
            )}
          </div>
        </div>
      </section>
      <section className="container">
        <div className="lpsec3">
          <span className="lpsec3cttxt">Customize Appearance</span>
          <ScrollAnimation
            animateIn="bounce"
            duration={0.4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h1 className="lpsec3headtxt">
              SHAPE APPEARANCE AND DESIGN FOR BOTH CLIENT AND ADMIN PORTALS
            </h1>
          </ScrollAnimation>
          <div className="lpsec3imgs">
            <ScrollAnimation animateIn="fadeInUp" className="lpsec3seecanim">
              <div className="firimg">
                <IoIosColorPalette className="imgicon" />
                <p>Choose any color of your choice for your panel</p>
                <img src={MbStyle} alt="mbt" className="lpsec3img" />
              </div>
            </ScrollAnimation>
            <ScrollAnimation
              animateIn="fadeIn"
              delay={1000}
              className="lpsec3seecanim2"
            >
              <div className="secimg">
                <IoBagHandle className="imgicon" />
                <p>
                  Design the landing page of your panel in any way you want it.
                </p>
                {lightThemeImage ? (
                  <img src={DeskLightStyle} alt="deskt" className="lpsec3img" />
                ) : (
                  <img src={DeskDarkStyle} alt="deskt" className="lpsec3img" />
                )}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      <section>
        <div className="lpsec4">
          <span className="lpsec4cttxt">Exiciting Features</span>
          <div className="lpsec4feats">
            <ScrollAnimation animateIn="fadeIn" duration={0.5}>
              <div className="feature1">
                <FaUsers className="lp4icon" />
                <h3 className="lp4headtxt">User Support</h3>
                <p className="lp4fettxt">
                  Give your clients support for anything they need help with in
                  your panel.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animateIn="fadeIn" duration={0.5} delay={500}>
              <div className="feature2">
                <FaSync className="lp4icon" />
                <h3 className="lp4headtxt">Sync Services</h3>
                <p className="lp4fettxt">
                  New provider services are automatically added to your panel,
                  saving you time and hassle.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animateIn="fadeIn" duration={0.5} delay={1000}>
              <div className="feature3">
                <FaSyncAlt className="lp4icon" />
                <h3 className="lp4headtxt">Sync Orders</h3>
                <p className="lp4fettxt">
                  Orders placed on your panel are forever synced with provider
                  data, eliminating your need to manage them manually.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animateIn="fadeIn" duration={0.5} delay={1500}>
              <div className="feature4">
                <RiUserLocationLine className="lp4icon" />
                <h3 className="lp4headtxt">User Status</h3>
                <p className="lp4fettxt">
                  Know when a user is online or offline instantly with our
                  system
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animateIn="fadeIn" duration={0.5} delay={2000}>
              <div className="feature5">
                <MdOutlinePayment className="lp4icon" />
                <h3 className="lp4headtxt">Payment Systems</h3>
                <p className="lp4fettxt">
                  Add any payment system of your choice in your panel
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
