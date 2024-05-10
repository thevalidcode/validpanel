import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useContext, useEffect } from "react";
import { auth } from "../../Firebase-config";

function AuthRedirect() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const getPanelId = async () => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const response = await axios.post(`${backendUrl}/panel/getId`, {
              uid: user.uid,
            });
            const panelId = response.data.id;
            navigate(`/control-panel/${panelId}/dashboard`);
          } catch (error) {
            if (error.response.data.error === "Not Found") {
              await signOut(auth);
            }
          }
        };
        getPanelId();
      }
    });
  }, [navigate, backendUrl]);
  return null;
}

export default AuthRedirect;
