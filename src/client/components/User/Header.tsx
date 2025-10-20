import { type FC } from "react";

const Header: FC = () => {
  return (
    <header className="bg-white border-b border-gray-300 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">My Stores</h2>
        <p className="text-gray-500 text-sm">
          View and manage all your created shops and social media stores.
        </p>
      </div>

      {/* Profile section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src="Sarah.png"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="font-medium text-gray-800">Sarah Johnson</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
