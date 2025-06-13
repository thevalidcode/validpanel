import { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { deleteData, getData } from "../../utils/indexedDB";

function CheckUser() {
  const { backendUrl, currentUser } = useContext(AppContext);
  const { panel_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPanel = async () => {
      if (currentUser) {
        try {
          const registeredPanelsDocs = await axios.post(
            `${backendUrl}/crud/get/docs`,
            {
              collection: "registeredPanels",
              key: currentUser.api_key,
            }
          );
          const panelExist = registeredPanelsDocs.data.some(
            (panel) => panel.panel_id === parseInt(panel_id)
          );
          const response = await axios.post(`${backendUrl}/panel/checkuser`, {
            uid: currentUser.uid,
            panel_id: panel_id,
          });
          if (!response.data.success) {
            navigate("/");
            await deleteData("user_auth");
          }
          if (!panelExist) {
            navigate("/onboarding", {
              state: {
                id: panel_id,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkPanel();
  }, [panel_id, navigate, backendUrl, currentUser]);

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
