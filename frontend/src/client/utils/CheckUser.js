import { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { auth, db } from "../../Firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

function CheckUser() {
  const { backendUrl } = useContext(AppContext);
  const { panelId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const checkPanel = async () => {
          const registeredPanelsQuery = query(
            collection(db, "registeredPanels"),
            where("panelId", "==", parseInt(panelId))
          );
          const registeredPanelsSnap = await getDocs(registeredPanelsQuery);
          const response = await axios.post(`${backendUrl}/panel/checkuser`, {
            uid: user.uid,
          });
          if (!response.data.success) {
            navigate("/");
            await signOut(auth)
          }
          if (registeredPanelsSnap.empty) {
            navigate("/onboarding", {
              state: {
                id: panelId,
              },
            });
          }
        };
        checkPanel();
      } else {
        navigate("/");
      }
    });
  }, [panelId, navigate, backendUrl]);
  return null;
}

export default CheckUser;
