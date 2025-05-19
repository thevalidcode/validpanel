import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useContext, useEffect } from "react";
import { getData, deleteData } from "../../utils/indexedDB";

function AuthRedirect() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const onAuth = async () => {
      const currentUser = await getData("user_auth");
      if (currentUser) {
        const getPanelId = async () => {
          try {
            const response = await axios.post(`${backendUrl}/panel/getId`, {
              uid: currentUser.uid,
            });
            const panelId = response.data.id;
            navigate(`/control-panel/${panelId}/dashboard`);
          } catch (error) {
            if (error.response.data.error === "Not Found") {
              await deleteData("user_auth");
            }
          }
        };
        getPanelId();
      }
    };
    onAuth();
  }, [navigate, backendUrl]);
  return null;
}

export default AuthRedirect;
