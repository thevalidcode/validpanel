import { createContext, useEffect, useMemo, useState } from "react";
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
  const backendUrl = "https://validpanel.com:3002";
  const siteTitle = "Valid Panel";
  return (
    <AppContext.Provider
      value={{
        clientStyles,
        loading,
        setLoading,
        notifyMessage,
        siteTitle,
        notifyType,
        setNotifyType,
        setNotifyMessage,
        backendUrl,
        notifyVisibility,
        setNotifyVisibility,
        setNotifyDuration,
        notifyDuration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
