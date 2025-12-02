import { Bell } from "lucide-react";
import React, { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const CreateStoreForm: React.FC = () => {
  const [storeType, setStoreType] = useState<"shop" | "social">("shop");
  const [brandColor, setBrandColor] = useState<string>("#6D28D9");
  const [payment, setPayment] = useState<
    "stripe" | "paypal" | "flutterwave" | "paystack"
  >("stripe");
  const [storeName, setStoreName] = useState<string>("");
  const [subdomain, setSubdomain] = useState<string>("");

  const brandColors: string[] = [
    "#4C1D95",
    "#5B21B6",
    "#6D28D9",
    "#7C3AED",
    "#8B5CF6",
    "#A78BFA",
    "#C4B5FD",
    "#EDE9FE",
    "#f97316",
  ];

  const navigate = useNavigate();
  const handleNext = (): void => {
    navigate("/dashboard");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
  };

  const handleSubdomainChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubdomain(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 px-4 py-3 border-b border-gray-300 shadow-sm bg-white sticky top-0 z-10">
        <div>
          <img src="./Valid2.svg" alt="logo" className="w-28 sm:w-36" />
        </div>
        <div className="flex gap-3 items-center">
          <Bell className="w-5 h-5 text-gray-600" />
          <img
            src="./Valid2.svg"
            alt="profile"
            className="w-7 h-7 rounded-full border"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          {/* Left Form */}
          <div className="bg-white p-6 sm:p-8 flex-1 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Create a New Store
            </h2>
            <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">
              Set up a new store by filling in the details below.
            </p>

            <div className="mb-6  rounded-lg p-4 sm:p-6">
              {/* Store Type */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {(["shop", "social"] as const).map((type) => (
                  <button
                    key={type}
                    className={`flex-1 border rounded-lg py-6 sm:py-8 text-center transition-all duration-200 ${
                      storeType === type
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-700 hover:border-purple-200"
                    }`}
                    onClick={() => setStoreType(type)}
                  >
                    <img
                      src={type === "shop" ? "Shop2.svg" : "Link.svg"}
                      alt={type}
                      className="mx-auto w-5 mb-2"
                    />
                    <span className="font-medium capitalize">{type}</span>
                    <p className="text-xs text-gray-400">
                      {type === "shop"
                        ? "Traditional e-commerce store"
                        : "Social commerce platform"}
                    </p>
                  </button>
                ))}
              </div>

              {/* Store Name */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                placeholder="Enter your store name"
                value={storeName}
                onChange={handleNameChange}
                className="w-full border  border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Custom Subdomain */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Subdomain
              </label>
              <div className="flex flex-col sm:flex-row mb-4">
                <input
                  type="text"
                  placeholder="mystore"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="flex-1 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="border border-gray-300 sm:rounded-r-md sm:rounded-l-none bg-gray-100 px-3 py-2 flex items-center justify-center text-gray-500 text-sm mt-2 sm:mt-0">
                  .validpanel.com
                </span>
              </div>

              {/* Brand Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {brandColors.map((color) => (
                    <button
                      title="color"
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-150 ${
                        brandColor === color
                          ? "border-gray-600 scale-105"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBrandColor(color)}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    ["stripe", "paypal", "flutterwave", "paystack"] as const
                  ).map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`border rounded-md py-2 capitalize transition ${
                        payment === method
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-600 hover:border-purple-200"
                      }`}
                      onClick={() => setPayment(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                <button
                  type="button"
                  className="border border-purple-500 text-purple-500 rounded-md px-4 py-2 hover:bg-purple-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700 w-full sm:w-auto"
                >
                  Create Store
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white shadow rounded-lg p-6 h-fit w-full lg:w-1/3">
            <h3 className="font-semibold mb-3 text-center sm:text-left">
              Live Preview
            </h3>
            <div className="border-2 border-black flex flex-col p-4 rounded-lg">
              <div className="flex items-center mb-4 justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <div
                    className="w-6 h-6 rounded-md mr-2 flex items-center justify-center"
                    style={{ backgroundColor: brandColor }}
                  >
                    <img src="Prev_shop.svg" alt="icon" className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-[150px]">
                      {storeName || "My Store"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {subdomain || "mystore"}.validpanel.com
                    </p>
                  </div>
                </div>
                <img src="Cart.svg" alt="cart" className="w-5 h-5" />
              </div>

              <div className="flex flex-wrap gap-3 justify-center mb-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="border p-3 rounded-lg bg-[#F3F4F6] w-[48%] sm:w-[45%] text-center"
                  >
                    <img src="Preview.svg" alt="product" className="mx-auto" />
                    <p className="text-xs text-black mt-1">Product {i}</p>
                    <p className="text-xs text-purple-500 font-bold">$29.99</p>
                  </div>
                ))}
              </div>

              <button
                className="w-full text-white py-2 rounded-md text-sm sm:text-base transition"
                style={{ backgroundColor: brandColor }}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoreForm;
