import { type FC } from "react";
import MyStores from "../components/stores/MyStores";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const StoreLayout: FC = () => {
  const navigate = useNavigate();
  const handleCreateStore = (): void => {
    navigate("/create-store");
  };

  return (
    <Layout
      title="My Stores"
      description="View and manage all your created shops and social media stores."
    >
      <main className="p-4 sm:p-6 flex-1">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleCreateStore}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2 text-sm sm:text-base"
          >
            + Create New Store
          </button>
        </div>

        <MyStores />
      </main>
    </Layout>
  );
};

export default StoreLayout;
