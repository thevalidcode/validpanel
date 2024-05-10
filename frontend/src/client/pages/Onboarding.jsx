import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/onboarding.css";
import React, { useContext, useEffect, useState } from "react";
import Panel from "../assets/images/select-panel.png";
import Shop from "../assets/images/select-shop.png";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import Domain from "../assets/images/domain.png";
import dns from "../assets/images/dns.png";
import success from "../assets/images/success.png";
import selectDomain from "../assets/images/selectDomain.png";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { IoCopy } from "react-icons/io5";
import axios from "axios";

function Onboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setNotifyDuration,
    setNotifyType,
    setNotifyMessage,
    backendUrl,
    setNotifyVisibility,
  } = useContext(AppContext);
  const [panelId, setPanelId] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [stage, setStage] = useState("start");
  const [domain, setDomain] = useState("");
  const [btnName, setBtnName] = useState("Create");
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (location.state === null) {
      navigate("/register");
    } else {
      setPanelId(location.state.id);
    }
  }, [location.state, navigate]);

  const goToSelectDomainStage = () => {
    if (!selectedOption) {
      Notify("error", "Kindly choose one");
      return;
    }
    if (selectedOption === "shop") {
      Notify("warn", "Coming soon...");
      return;
    }
    setStage("selectDomainType");
  };

  const goToDomainStage = () => {
    setStage("domain");
  };

  const goToSubDomainStage = () => {
    setStage("subDomain");
  };

  const goBackToSelectDomainStage = () => {
    setStage("selectDomainType");
  };

  const goBackToStartStage = () => {
    setStage("start");
  };

  const domainRegex = /\./;
  const isDomain = domainRegex.test(domain);

  const goToNameServersStage = () => {
    if (!isDomain && stage === "domain") {
      Notify("error", "Invalid domain");
      return;
    }
    if (isDomain && stage === "subDomain") {
      Notify("error", "Invalid domain");
      return;
    }
    if (stage === "subDomain") {
      CreatePanel();
      setStage("success");
    } else {
      setStage("nameservers");
    }
  };

  const handleTextChange = (e, setChange) => {
    const value = e.target.value;
    setChange(value.trim());
  };

  const Notify = (type, message, duration) => {
    setNotifyType(type);
    setNotifyMessage(message);
    setNotifyVisibility(true);
    if (duration > 0) setNotifyDuration(duration);
  };

  const copyServer = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Notify("success", "Copied Successfully");
    } catch (error) {
      Notify("error", "Error copying nameserver");
    }
  };

  const CreatePanel = async () => {
    setBtnLoading(true);
    setBtnName("Creating...");
    try {
      const data = {
        domain: isDomain ? `${domain}` : `${domain}.validpanel.com`,
        panelId: panelId,
      };
      await axios.post(`${backendUrl}/panel/create`, data);
      setBtnLoading(false);
      setBtnName("Create");
      setStage("success");
    } catch (error) {
      setBtnLoading(false);
      setBtnName("Create");
    }
  };
  return (
    <div className="clonboarding">
      <NavBar />
      <div className="clonbselect">
        {stage === "start" ? (
          <React.Fragment>
            <h3 className="clonbheadtxt">Choose One</h3>
            <div className="clselectvalid">
              <div
                className={
                  selectedOption === "shop" ? "clselectedshop" : "clselectshop"
                }
                onClick={() => handleSelectOption("shop")}
              >
                <img src={Shop} alt="" />
                <h4>Shop</h4>
              </div>
              <div
                className={
                  selectedOption === "panel"
                    ? "clselectedpanel"
                    : "clselectpanel"
                }
                onClick={() => handleSelectOption("panel")}
              >
                <img src={Panel} alt="" />
                <h4>Panel</h4>
              </div>
            </div>
            <Button name="Next" onClick={goToSelectDomainStage} width="100%" />
          </React.Fragment>
        ) : stage === "selectDomainType" ? (
          <React.Fragment>
            <h3 className="clonbheadtxt">Select Domain Type</h3>
            <div className="cldomainimg">
              <img src={selectDomain} alt="" />
            </div>
            <div className="clselectdomanlis">
              <ul>
                <li onClick={goToDomainStage}>
                  I want to use my domain
                  <FaAngleRight className="clselecdomrigicon" />
                </li>
                <li onClick={goToSubDomainStage}>
                  Use Valid Panel free subdomain .validpanel.com
                  <FaAngleRight className="clselecdomrigicon" />
                </li>
                <li>
                  <Link to="https://validwebhost.com" target="blank">
                    Get a custom domain
                    <FaAngleRight className="clselecdomrigicon" />
                  </Link>
                </li>
              </ul>
              <Button
                name="Go Back"
                onClick={goBackToStartStage}
                width="100%"
              />
            </div>
          </React.Fragment>
        ) : stage === "domain" || stage === "subDomain" ? (
          <React.Fragment>
            <h3 className="clonbheadtxt">Domain</h3>
            <div className="cldomainimg">
              <img src={Domain} alt="" />
            </div>
            <div
              className={
                stage === "subDomain" ? "clsubDomaininput" : "cldomaininput"
              }
            >
              <TextInput
                name="domain"
                value={domain}
                placeholder="validplug.com.ng"
                setState={setDomain}
                onChange={handleTextChange}
              />
              {stage === "subDomain" ? (
                <div className="clsubdomainname">.validpanel.com</div>
              ) : (
                ""
              )}
            </div>
            <div className="cldomainbtns">
              <Button
                name="Go Back"
                onClick={goBackToSelectDomainStage}
                width="100%"
              />
              <Button
                name={stage === "subDomain" ? btnName : "Next"}
                loading={btnLoading}
                onClick={goToNameServersStage}
                width="100%"
              />
            </div>
          </React.Fragment>
        ) : stage === "nameservers" ? (
          <React.Fragment>
            <h3 className="clonbheadtxt">NameServers</h3>
            <div className="cldomainimg">
              <img src={dns} alt="" />
            </div>
            <div className="flex-center my-3">
              <strong className="clnameservhedtxt">
                For the domain to work properly you need to add Valid Panel DNS
                servers.
              </strong>
            </div>
            <div className="clnameserversinst">
              <ol>
                <li>Log in to your domain registrar account.</li>
                <li>Find your domain in the management panel.</li>
                <li>Access DNS or Nameserver settings.</li>
                <li>Replace the existing nameservers with ours below.</li>
                <li>Save changes.</li>
                <li>Wait for propagation (can take up to 10 - 48 hours).</li>
              </ol>
              <div className="clnameservers">
                <ul>
                  <li onClick={() => copyServer("ns1.validpanel.com")}>
                    ns1.validpanel.com <IoCopy className="icon" />
                  </li>
                  <li onClick={() => copyServer("ns2.validpanel.com")}>
                    ns2.validpanel.com <IoCopy className="icon" />
                  </li>
                </ul>
              </div>
            </div>
            <div className="cldomainbtns">
              <Button
                name="Go Back"
                onClick={goBackToSelectDomainStage}
                width="100%"
              />
              <Button
                name={btnName}
                loading={btnLoading}
                onClick={selectedOption === "shop" ? CreatePanel : CreatePanel}
                width="100%"
              />
            </div>
          </React.Fragment>
        ) : stage === "success" ? (
          <React.Fragment>
            <div className="cldomainimg mb-3">
              <img src={success} alt="" />
            </div>
            <div className="clpanelsucctext">
              <span>Your panel has been created successfully</span>
              <Link
                to={
                  isDomain
                    ? `https://${domain}`
                    : `https://${domain}.validpanel.com`
                }
              >
                View Panel
              </Link>
              <Link
                to={
                  isDomain
                    ? `https://${domain}/control-panel/login`
                    : `https://${domain}.validpanel.com/control-panel/login`
                }
              >
                View Admin
              </Link>
            </div>
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
      <div className="clonboardfooter">
        <Footer />
      </div>
    </div>
  );
}

export default Onboarding;
