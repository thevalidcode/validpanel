import { useEffect, useState, useContext } from "react";
import "../styles/notification.css";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AppContext } from "../../context/AppContext";
import { GiCancel } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";

const Notify = () => {
  const {
    notifyMessage,
    notifyVisibility,
    notifyType,
    notifyDuration,
    setNotifyVisibility,
  } = useContext(AppContext);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (notifyVisibility) {
      const timerId = setTimeout(() => {
        setNotifyVisibility(false);
      }, notifyDuration);

      setTimer(timerId);

      return () => clearTimeout(timerId);
    }
  }, [notifyDuration, setNotifyVisibility, notifyVisibility]);

  const handleMouseEnter = () => {
    if (timer) {
      clearTimeout(timer);
    }
    document.querySelector(".notifyCon").classList.add("paused");
  };

  const handleMouseLeave = () => {
    if (notifyVisibility) {
      const newTimer = setTimeout(() => {
        setNotifyVisibility(false);
      }, notifyDuration);
      setTimer(newTimer);
    }
    document.querySelector(".notifyCon").classList.remove("paused");
  };

  return notifyVisibility ? (
    <div
      className="notifyCon"
      style={{ animationDuration: `${notifyDuration / 1000}s` }}
    >
      {notifyType === "success" ? (
        <div
          className="notifyText"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <IoCheckmarkCircle
            className="icon"
            style={{
              color: "rgb(2, 153, 2)",
            }}
          />
          {notifyMessage}
        </div>
      ) : notifyType === "error" ? (
        <div
          className="notifyText"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <GiCancel
            className="icon"
            style={{
              color: "rgb(247, 26, 26)",
            }}
          />
          {notifyMessage}
        </div>
      ) : notifyType === "warn" ? (
        <div
          className="notifyText"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <IoIosWarning
            className="icon"
            style={{
              color: "rgb(255, 204, 0)",
            }}
          />
          {notifyMessage}
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    ""
  );
};

export { Notify };
