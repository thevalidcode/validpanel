import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/account.css";
import TextInput from "../shared/TextInput";
import PasswordInput from "../shared/PasswordInput";
import { useContext, useEffect, useState } from "react";
import CheckUser from "../utils/CheckUser";
import bcrypt from "bcryptjs";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";
import Button from "../shared/Button";
import Select from "react-select";
import axios from "axios";
import { deleteData, getData } from "../../utils/indexedDB";
import AnchorLink from "../shared/AnchorLink";
import { AppContext } from "../../context/AppContext";

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const {
    setNotifyDuration,
    setNotifyType,
    backendUrl,
    setNotifyMessage,
    currentUser,
    siteTitle,
    setCurrentUser,
    setNotifyVisibility,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [panelOptions, setPanelOptions] = useState([]);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");
  const [btnSavingPassword, setBtnSavingPassword] = useState("Save Changes");
  const [btnSavingName, setBtnSavingName] = useState("Save Changes");
  const [selectedPanel, setSelectedPanel] = useState([]);
  const { panelId } = useParams();

  useEffect(() => {
    const onAuth = async () => {
      const currentUser = await getData("user_auth");
      if (!currentUser) {
        navigate("/");
      }
    };
    onAuth();
  }, [navigate]);

  useEffect(() => {
    document.title = `Account | ${siteTitle}`;
  }, [siteTitle]);

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

  const selectStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: "10px",
      borderColor: "var(--clhovercolor)",
    }),
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "var(--clhovercolor)" : "white",
        color: isFocused ? "white" : "black",
      };
    },
  };

  useEffect(() => {
    if (currentUser) {
      setAdminData(currentUser);
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    const hashPassword = async () => {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(newPassword, salt);
      setHashedPassword(hashed);
    };
    hashPassword();
  }, [newPassword]);

  useEffect(() => {
    const getPanelOptions = async () => {
      if (currentUser) {
        const response = await axios.post(`${backendUrl}/panel/get`, {
          uid: currentUser.uid,
        });
        const data = response.data;
        setPanelOptions(data);
        setSelectedPanel(
          data.find((option) => option.value === parseInt(panelId))
        );
      }
    };
    getPanelOptions();
  }, [currentUser, backendUrl, panelId]);

  if (!currentUser || adminData === null) {
    return <Loader />;
  }

  const handleSelectChange = (option) => {
    setSelectedPanel(option);
    const id = option.value;
    navigate(`/control-panel/${id}/dashboard`);
  };

  const handlePasswordChange = async () => {
    setBtnSavingPassword("Saving...");
    setSavingPassword(true);
    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmNewPassword.trim() === ""
    ) {
      Notify("error", "Please fill all fields");
      setBtnSavingPassword("Save Changes");
      setSavingPassword(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Notify("error", "New password and confirm new password doesn't match");
      setBtnSavingPassword("Save Changes");
      setSavingPassword(false);
      return;
    }
    try {
      await axios.post(`${backendUrl}/crud/update/doc`, {
        collection: "users",
        uid: currentUser.uid,
        data: { password: hashedPassword },
        key: currentUser.apiKey,
      });
      await axios.post(`${backendUrl}/crud/update/doc`, {
        collection: "admins",
        uid: currentUser.uid,
        panelId: panelId,
        data: { password: hashedPassword },
        key: currentUser.apiKey,
      });
      setBtnSavingPassword("Save Changes");
      setSavingPassword(false);
      Notify("success", "Changed Successfully");
    } catch (error) {
      setBtnSavingPassword("Save Changes");
      setSavingPassword(false);
      Notify("error", "Something went wrong");
    }
  };

  const handleNameChange = async () => {
    setBtnSavingName("Saving...");
    setSavingName(true);
    if (name === "") {
      Notify("error", "Kindly enter a name");
      setBtnSavingName("Save Changes");
      setSavingName(false);
      return;
    }
    try {
      await axios.post(`${backendUrl}/crud/update/doc`, {
        collection: "users",
        uid: currentUser.uid,
        data: { name: name },
        key: currentUser.apiKey,
      });
      await axios.post(`${backendUrl}/crud/update/doc`, {
        collection: "admins",
        uid: currentUser.uid,
        panelId: panelId,
        data: { name: name },
        key: currentUser.apiKey,
      });
      setBtnSavingName("Save Changes");
      setSavingName(false);
      Notify("success", "Changed Successfully");
    } catch (error) {
      setBtnSavingName("Save Changes");
      setSavingName(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    await deleteData("user_auth");
    navigate("/");
  };

  return (
    <>
      <CheckUser />
      <NavBar />
      <div className="claccount">
        <div className="clwelcometxt">
          <div className="container">
            <span>Hello, {name}👋🏽</span>
          </div>
        </div>
        <div className="claccountbd">
          <div className="container">
            <div className="p-3 m-auto claccheadtxt">
              <h1>Account</h1>
            </div>
            <div className="claccnaembd">
              <div className="claccnaem">
                <div className="claccname">
                  <label htmlFor="name" className="clacclabel">
                    Name
                  </label>
                  <TextInput
                    value={name}
                    setState={setName}
                    placeholder="Name"
                    onChange={handleTextChange}
                  />
                </div>
                <div className="claccemail">
                  <label className="clacclabel" htmlFor="email">
                    Email
                  </label>
                  <TextInput
                    value={email}
                    disabled={true}
                    setState={setEmail}
                    placeholder="Email"
                    onChange={handleTextChange}
                  />
                </div>
              </div>
              <Button
                name={btnSavingName}
                loading={savingName}
                onClick={handleNameChange}
              />
            </div>
            <div className="claccpass">
              <div className="flex-center">
                <h1>Password</h1>
              </div>
              <div className="claccpassword">
                <div className="claccexistpass">
                  <label className="clacclabel" htmlFor="oldpassword">
                    Existing Password
                  </label>
                  <PasswordInput
                    value={oldPassword}
                    setState={setOldPassword}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="claccnewpass">
                  <label className="clacclabel" htmlFor="newpassword">
                    New Password
                  </label>
                  <PasswordInput
                    value={newPassword}
                    setState={setNewPassword}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="claccconfirmpass">
                  <label className="clacclabel" htmlFor="confirmnewpassword">
                    Confirm New Password
                  </label>
                  <PasswordInput
                    value={confirmNewPassword}
                    setState={setConfirmNewPassword}
                    onChange={handleTextChange}
                  />
                </div>
                <Button
                  name={btnSavingPassword}
                  loading={savingPassword}
                  onClick={handlePasswordChange}
                />
              </div>
            </div>
            <div className="claccpanel">
              <div className="flex-center">
                <h1>Panel</h1>
              </div>
              <div className="claccpanels">
                <div className="claccexistpanel">
                  <Select
                    value={selectedPanel}
                    onChange={handleSelectChange}
                    options={panelOptions}
                    styles={selectStyles}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        primary: "var(--clbuttoncolor)",
                      },
                    })}
                  />
                </div>
                <div className="clacccreatepanel">
                  <AnchorLink to="/onboarding" name="Create Panel" />
                </div>
              </div>
            </div>
            <div className="clacclogout">
              <Button name="Logout" onClick={logout} />
            </div>
          </div>
        </div>
      </div>
      <div className="clfooter">
        <Footer />
      </div>
    </>
  );
}

export default Account;
