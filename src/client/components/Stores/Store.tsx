import { FaRegEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoIosPause } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const Store = () => {
  return (
    <div
      className={`w-full max-w-[554px] mx-auto h-[163px] md:h-[234px] rounded-[8.4px] border-l-4 border-l-primary border-[1.4px] border-vgrey-border px-3 xl:px-[23px] py-6 md:py-[35px] `}
    >
      <div className="space-y-[11px] md:space-y-4 ">
        <div className="w-full h-[70px] md:h-[100px] flex flex-col justify-between ">
          <div className="w-full flex justify-between">
            <div className="flex gap-2 md:gap-[18px] ">
              <div className="w-11 md:w-[63px] md:h-[66px] h-11.5 bg-primary rounded-[6px] " />
              <div className="flex flex-col justify-between items-start">
                <p className="text-sm font-bold md:text-xl ">
                  Clark’s Skincare
                </p>
                <button className="bg-primary text-white text-[10px] md:text-sm btn-custom rounded-[22px] md:rounded-[32px] p-[3.5px] md:p-[5px] w-[57px] md:w-21 grid place-content-center ">
                  Shop
                </button>
              </div>
            </div>
            <button className="flex gap-1 items-center w-[55px] md:w-[79px] bg-vgreen-light h-[18px] md:h-[26px] rounded-full justify-center">
              <span className="inline-block w-1 h-1 md:h-[6px] md:w-[6px] rounded-full bg-vgreen-lemon " />
              <span className="inline-block text-vgreen-dark text-[8px] md:text-sm ">
                {" "}
                Active{" "}
              </span>
            </button>
          </div>
          <p className="text-vgrey-text font-semibold text-xs md:text-base">
            Created on April 25, 2025
          </p>
        </div>
        <hr className="border-vgrey-border" />
        <div className="flex items-center gap-[5.5px] justify-between ">
          <button className="text-[10px] btn-custom lg:text-sm items-center font-medium w-[92px] md:w-[133px] md:h-[41px] h-[28px] rounded-[6px] md:rounded-[8px] flex gap-[10px] bg-vgrey-border justify-center ">
            <FaRegEye />
            <span>View</span>
          </button>
          <button className="text-[10px] md:w-[133px] md:h-[41px] btn-custom lg:text-sm items-center font-medium w-[92px] h-[28px] rounded-[6px] md:rounded-[8px] flex gap-[10px] bg-vgrey-border justify-center ">
            <FaRegEye />
            <span>Admin View</span>
          </button>
          <button className="text-[10px] md:w-[133px] md:h-[41px] btn-custom lg:text-sm items-center font-medium w-[92px] h-[28px] rounded-[6px] md:rounded-[8px] flex gap-[10px] bg-[#EFF6FF] justify-center ">
            <FaEdit className="fill-[#2563EB] " />
            <span>Edit</span>
          </button>
          <button
            type="button"
            title="pause"
            className="text-[10px] btn-custom md:text-sm items-center font-medium w-[27px] md:w-[40px] md:h-[41px] h-[28px] rounded-[6px] md:rounded-[8px] flex gap-[10px] bg-[#FEFCE8] justify-center "
          >
            <IoIosPause className="fill-[#CA8A04] " />
          </button>
          <button
            type="button"
            title="delete"
            className="text-[10px] btn-custom md:text-sm items-center font-medium w-[27px] md:w-[40px] md:h-[41px] h-[28px] rounded-[6px] md:rounded-[8px] flex gap-[10px] bg-[#FEF2F2] justify-center "
          >
            <MdDelete className="fill-[#DC2626] " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;
