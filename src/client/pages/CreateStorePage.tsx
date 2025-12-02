import {
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from "react";
import { FaShoppingBag } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import TextInput from "../components/general/TextInput";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { RiPaypalFill } from "react-icons/ri";
import Button from "../components/general/Button";
import { FaStore } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import type { IconType } from "react-icons/lib";

interface BaseOption {
  selected: boolean;
  logo: string | IconType;
}

interface StoreType extends BaseOption {
  type: string;
  desc: string;
}

interface PaymentType extends BaseOption {
  name: string;
}

const storeType = [
  {
    type: "Shop",
    logo: FaShoppingBag,
    desc: "Traditional e-commerce store",
    selected: true,
  },
  {
    type: "Social Media Store",
    logo: FaShareAlt,
    desc: "Social commerce platform",
    selected: false,
  },
];

const brandColor = [
  { color: "#6A0DAD" },
  { color: "#7D1EFF" },
  { color: "#9333EA" },
  { color: "#A855F7" },
  { color: "#C084FC" },
  { color: "#DDD6FE" },
];

const paymentMethod = [
  { name: "Stripe", logo: FaCreditCard, selected: true },
  { name: "PayPal", logo: RiPaypalFill, selected: false },
  { name: "Flutterwave", logo: "", selected: false },
  { name: "Paystack", logo: "", selected: false },
];

const products = [
  { name: "Product1", price: "$29.8" },
  { name: "Product2", price: "$27.9" },
  // {name: 'Product3', price: '$87.9'},
];

const CreateStorePage = () => {
  const markSelected = (vals: (StoreType | PaymentType)[], idx: number) => {
    const clonedStore = vals.slice(0);
    const newArray = clonedStore.map((str, i) => {
      if (i === idx) {
        str.selected = true;
      } else {
        str.selected = false;
      }
      return str;
    });
    return newArray;
  };

  const [stores, setStores] = useState<StoreType[]>(storeType);
  const [payments, setPayments] = useState<PaymentType[]>(paymentMethod);

  const handleSelectStore = (idx: number) => {
    const newStores = markSelected(stores, idx);
    setStores(newStores as StoreType[]);
  };

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection from input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleColor = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handlePaymentSelection = (
    e: MouseEvent<HTMLButtonElement>,
    idx: number
  ) => {
    e.preventDefault();
    const newPayment = markSelected(paymentMethod, idx);
    setPayments(newPayment as PaymentType[]);
  };

  return (
    <div className="w-full flex flex-col gap-10 lg:flex-row justify-between px-5 border-t border-vgrey-border">
      <div className=" w-full sm:max-w-[672px] space-y-5 py-8 ">
        <div className="flex flex-col justify-between items-center gap-7">
          <h1 className="font-bold text-[32px] ">Create a New Store</h1>
          <p className="text-vgrey-text">
            Set up a new store by filling in the details below.
          </p>
          <div className="p-5 lg:p-8 w-full shadow-2xl rounded-2xl flex flex-col gap-5 border border-vgrey-border ">
            <h2 className="font-semibold text-sm">Store Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
              {stores.map((store, i) => (
                <button
                  key={store.type}
                  onClick={() => handleSelectStore(i)}
                  className={`rounded-xl text-sm lg:text-base outline-none font-semibold border h-[144px] flex flex-col items-center justify-center px-5 gap-5 ${
                    store.selected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-vgrey-border text-vgrey-text btn-custom"
                  }  `}
                >
                  <store.logo
                    className={
                      store.selected
                        ? "text-primary fill-primary"
                        : "text-shadow-vgrey-text fill-vgrey-text"
                    }
                  />
                  <span className={`inline-block`}> {store.type} </span>
                  <span className="inline-block text-vgrey-text">
                    {" "}
                    {store.desc}{" "}
                  </span>
                </button>
              ))}
            </div>
            <form className="grid grid-cols-1 gap-5">
              <div className="space-y-1 w-full">
                <label
                  htmlFor="storeName"
                  className="font-semibold text-sm block"
                >
                  Store Name
                </label>
                <TextInput placeholder="Enter your store name" />
              </div>
              <div className="space-y-1 w-full relative">
                <label htmlFor="domain" className="font-semibold text-sm block">
                  Custom Subdomain
                </label>
                <TextInput placeholder="mystore" />
                <span className="block absolute bottom-1.5 right-0.5 bg-vgrey-border p-4 ">
                  .validpanel.com
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm block lg:text-base">
                  Store Logo
                </p>
                {/* Dropzone */}
                <div
                  className={`w-full h-40 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label className="w-full h-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-36 object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 flex flex-col gap-1 items-center">
                        <FaCloudUploadAlt className="text-gray-500 text-4xl" />
                        <span className="block">
                          Click to upload or drag and drop
                        </span>
                        <span className="block">PNG, JPG up to 2MB</span>
                      </span>
                    )}
                  </label>
                </div>
              </div>
              <div className="min-h-21 w-full flex flex-col gap-2 justify-between ">
                <p className="font-semibold text-sm block lg:text-base">
                  Brand Color
                </p>
                <div className="flex flex-wrap gap-3">
                  {brandColor.map((col) => (
                    <button
                      onClick={(e) => handleColor(e)}
                      key={col.color}
                      style={{ backgroundColor: col.color }}
                      className={`w-12 h-12 rounded-xl`}
                    />
                  ))}
                </div>
              </div>
              <div className="min-h-21 w-full flex flex-col gap-2 justify-between ">
                <p className="font-semibold text-sm block lg:text-base">
                  Payment Method
                </p>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-3">
                  {payments.map((pay, i) => (
                    <button
                      onClick={(e) => handlePaymentSelection(e, i)}
                      key={pay.name}
                      className={`flex gap-2 justify-center py-3 px-4 rounded-xl border items-center ${
                        pay.selected
                          ? "border-primary bg-primary/5"
                          : "border-vgrey-border btn-custom"
                      }`}
                    >
                      {pay.logo ? (
                        <pay.logo className="text-vgrey-text block" />
                      ) : (
                        ""
                      )}
                      <span className="block"> {pay.name} </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Button>Cancel</Button>
                <Button styles="bg-primary text-white hover:bg-primary/90 active:bg-primary/90">
                  Create Store
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto max-w-[384px] space-y-5 bg-[#F9FAFB] px-6 py-8 ">
        <p className="font-semibold text-sm block lg:text-base">Live Preview</p>
        <div className="min-w-[319px] w-full space-y-4 rounded-3xl border-8 border-black p-8 ">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-lg bg-primary grid place-content-center">
              <FaStore className=" text-white" />
            </div>
            <div className="flex flex-col justify-between overflow-x-auto">
              <p className="font-semibold">My Store</p>
              <p className="text-vgrey-text text-sm">mystore.validpanel.com</p>
            </div>
            <FaShoppingCart className="text-vgrey-text block ml-auto text-lg " />
          </div>
          <hr className="border border-vgrey-border w-full" />
          <div className="flex w-full overflow-x-auto gap-3">
            {products.map((prod) => (
              <div key={prod.name} className="rounded-lg p-3 bg-[#F3F4F6]">
                <div className="w-[97px] h-20 rounded bg-[#E5E7EB] mb-2 " />
                <p className="text-xs font-medium"> {prod.name} </p>
                <p className="font-semibold text-xs text-primary">
                  {" "}
                  {prod.price}{" "}
                </p>
              </div>
            ))}
          </div>
          <Button styles="bg-primary w-full text-white">Shop Now</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateStorePage;
