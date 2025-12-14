import { type FC } from "react";
import StoreCard from "./StoreCard";
import { useGetUserStores } from "@/hooks/use-store";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "lucide-react";

const MyStores: FC = () => {
  const { data: stores, isLoading } = useGetUserStores();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (!stores) {
    return (
      <NotFound
        title="No Stores Found"
        description="You haven't added any stores yet."
        actionLabel="Add Store"
        icon={<ShoppingBagIcon className="w-10 h-10 mx-auto text-gray-400" />}
        onActionClick={() => navigate("/stores/create")}
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {stores.map((store) => (
          <StoreCard key={store.name} store={store} />
        ))}
      </div>
    </div>
  );
};

export default MyStores;
