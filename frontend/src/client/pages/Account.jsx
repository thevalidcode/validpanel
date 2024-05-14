import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/account.css";
import TextInput from "../shared/TextInput";
import PasswordInput from "../shared/PasswordInput";
import { useContext, useEffect, useState } from "react";
import CheckUser from "../utils/CheckUser";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../Firebase-config";
import Loader from "../shared/Loader";
import Button from "../shared/Button";
import Select from "react-select";
import axios from "axios";
import AnchorLink from "../shared/AnchorLink";
import { AppContext } from "../../context/AppContext";

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [panelOptions, setPanelOptions] = useState([]);
  const [savingPassword, setSavingPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState([]);

  const { panelId } = useParams();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleTextChange = (e, setChange) => {
    const value = e.target.value;
    setChange(value);
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
    const getAdminData = async () => {
      if (currentUser) {
        try {
          const adminCol = collection(db, `panels/${panelId}/admins`);
          const adminSnap = await getDocs(
            query(adminCol, where("uid", "==", currentUser.uid))
          );
          if (!adminSnap.empty) {
            const data = adminSnap.docs[0].data();
            setAdminData(data);
            setName(data.name);
            setEmail(data.email);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getAdminData();
  }, [panelId, currentUser]);

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
  }, [currentUser, backendUrl]);

  if (!currentUser || adminData === null) {
    return <Loader />;
  }

  const handleSelectChange = (option) => {
    setSelectedPanel(option);
    const id = option.value;
    navigate(`/control-panel/${id}/dashboard`);
  };

  return (
    <>
      <CheckUser />
      <NavBar />
      <div className="claccount">
        <div className="clwelcometxt">
          <div className="container">
            <span>Hello, {adminData.name}👋🏽</span>
          </div>
        </div>
        <div className="claccountbd">
          <div className="container">
            <div className="p-3 m-auto claccheadtxt">
              <h1>Account</h1>
            </div>
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
                <Button name="Save Changes" loading={savingPassword} />
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
