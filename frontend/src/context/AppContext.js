import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getData } from "../utils/indexedDB";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const clientStyles = useMemo(
    () => ({
      "--sitecolor": "#a200ff",
      "--cltextcolor": "#d084fc",
      "--clbgcolor": "#1f0f2e",
      "--clactivecolor": "#750ecf",
      "--clhovercolor": "#510097",
      "--clbuttoncolor": "#7209ce",
      "--clbasebgcolor": "#2e0b50",
    }),
    []
  );
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyVisibility, setNotifyVisibility] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifyType, setNotifyType] = useState("");
  const [notifyDuration, setNotifyDuration] = useState(4000);

  useEffect(() => {
    const bodyStyle = document.querySelector("body").style;
    bodyStyle.setProperty("--sitecolor", clientStyles["--sitecolor"]);
    bodyStyle.setProperty("--cltextcolor", clientStyles["--cltextcolor"]);
    bodyStyle.setProperty("--clbgcolor", clientStyles["--clbgcolor"]);
    bodyStyle.setProperty("--clactivecolor", clientStyles["--clactivecolor"]);
    bodyStyle.setProperty("--clhovercolor", clientStyles["--clhovercolor"]);
    bodyStyle.setProperty("--clbuttoncolor", clientStyles["--clbuttoncolor"]);
    bodyStyle.setProperty("--clbasebgcolor", clientStyles["--clbasebgcolor"]);
    bodyStyle.backgroundColor = "var(--clbgcolor)";
  }, [clientStyles]);

  const env = process.env.NODE_ENV;

  const backendUrl =
    env === "production"
      ? "https://validpanel.com:3002"
      : "http://localhost:3002";

  const siteTitle = "Valid Panel";

  useEffect(() => {
    const getUserAuth = async () => {
      const inUserDt = await getData("user_auth");
      if (inUserDt) {
        const response = await axios.post(`${backendUrl}/user/data`, {
          uid: inUserDt.uid,
        });
        setCurrentUser(response.data);
      } else {
        setCurrentUser(null);
      }
    };
    getUserAuth();
  }, [backendUrl, checkAuth]);

  return (
    <AppContext.Provider
      value={{
        clientStyles,
        loading,
        checkAuth,
        setCheckAuth,
        setLoading,
        siteTitle,
        backendUrl,
        notifyType,
        setNotifyType,
        setNotifyMessage,
        currentUser,
        setCurrentUser,
        notifyVisibility,
        setNotifyVisibility,
        notifyMessage,
        setNotifyDuration,
        notifyDuration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
