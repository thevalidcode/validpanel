import { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { deleteData, getData } from "../../utils/indexedDB";

function CheckUser() {
  const { backendUrl, currentUser } = useContext(AppContext);
  const { panelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPanel = async () => {
      if (currentUser) {
        try {
          const registeredPanelsDocs = await axios.post(
            `${backendUrl}/crud/get/docs`,
            {
              collection: "registeredPanels",
              key: currentUser.apiKey,
            }
          );
          const panelExist = registeredPanelsDocs.data.some(
            (panel) => panel.panelId === parseInt(panelId)
          );
          const response = await axios.post(`${backendUrl}/panel/checkuser`, {
            uid: currentUser.uid,
            panelId: panelId,
          });
          if (!response.data.success) {
            navigate("/");
            await deleteData("user_auth");
          }
          if (!panelExist) {
            navigate("/onboarding", {
              state: {
                id: panelId,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkPanel();
  }, [panelId, navigate, backendUrl, currentUser]);

  useEffect(() => {
    const onAuth = async () => {
      const currentUser = await getData("user_auth");
      if (!currentUser) {
        navigate("/");
      }
    };
    onAuth();
  }, [navigate]);

  return null;
}

export default CheckUser;
