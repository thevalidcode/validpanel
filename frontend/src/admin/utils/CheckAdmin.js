import { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../utils/indexedDB";

function CheckAdmin() {
  const { backendUrl, currentAdmin } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPanel = async () => {
      if (currentAdmin) {
        try {
          const adminsDocs = await axios.post(`${backendUrl}/crud/get/docs`, {
            collection: "admins",
            key: currentAdmin.apiKey,
          });
          const adminAuthDoc = await getData("admin_auth");
          if (!adminAuthDoc) {
            navigate("/");
          }
          const adminExist = adminsDocs.data.some(
            (admin) => admin.email === adminAuthDoc.email
          );
          if (!adminExist) {
            await deleteData("admin_auth");
            navigate("/admin/login");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkPanel();
  }, [navigate, backendUrl, currentAdmin]);

  return null;
}

export default CheckAdmin;
