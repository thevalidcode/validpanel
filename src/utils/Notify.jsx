import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

let Notify;

function NotifyProvider() {
  const {
    setNotifyDuration,
    setNotifyType,
    setNotifyMessage,
    setNotifyVisibility,
  } = useContext(AppContext);

  Notify = (type, message, duration) => {
    setNotifyType(type);
    setNotifyMessage(message);
    setNotifyVisibility(true);
    if (duration >= 0) setNotifyDuration(duration);
  };

  return null;
}

export { Notify };
export default NotifyProvider;
