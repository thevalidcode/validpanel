import { type FC } from "react";
import StoreCard from "./StoreCard";

// Define the shape of a store object
interface Store {
  name: string;
  type: string;
  date: string;
  status: string;
  logo?: string; // optional because not all stores have a logo
}

// Sample data
const stores: Store[] = [
  {
    name: "Clark’s Skincare",
    type: "Shop",
    date: "April 25, 2025",
    status: "Active",
  },
  {
    name: "Fashion Hub",
    type: "Social Media Store",
    date: "March 15, 2025",
    status: "Inactive",
    logo: "Rectangle 67.png",
  },
  {
    name: "Organic Wellness",
    type: "Shop",
    date: "April 8, 2025",
    status: "Active",
  },
  {
    name: "Tech Gadgets Pro",
    type: "Social Media Store",
    date: "January 20, 2025",
    status: "Active",
  },
];

const MyStores: FC = () => {
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
