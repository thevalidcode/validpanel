import { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../utils/indexedDB";

function CheckAdmin() {
  const { backendUrl, currentAdmin, setCurrentAdmin } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPanel = async () => {
      if (currentAdmin) {
        try {
          const adminsDocs = await axios.post(`${backendUrl}/crud/get/docs`, {
            collection: "admins",
            key: currentAdmin.api_key,
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

  useEffect(() => {
    const onAuth = async () => {
      const currentAdmin = await getData("admin_auth");
      if (!currentAdmin) {
        setCurrentAdmin(null);
        navigate("/admin/login");
      }
    };
    onAuth();
  }, [navigate, setCurrentAdmin]);

  return null;
}

export default CheckAdmin;
