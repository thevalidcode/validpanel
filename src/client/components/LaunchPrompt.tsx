import { GoArrowUpRight } from "react-icons/go";

export default function LaunchPrompt() {
  return (
    <div className="flex md:px-[150px] pb-10 md:pb-20">
      <div className="bg-black text-white text-center py-12 w-full md:rounded-[16px] poppins min-h-[424px] flex flex-col gap-5 justify-center items-center">
        <h2 className="text-2xl md:text-[43.21px] font-extrabold md:max-w-[800px]">
          Ready to launch your online business?
        </h2>
        <p className="md:text-[20px]">
          Create your shop or social store in minutes. No technical skills
          needed.
        </p>
        <button className="bg-[var(--primary)] px-8 py-3 rounded-full btn-custom cursor-pointer inline-flex items-center gap-2">
          Get Started <GoArrowUpRight />{" "}
        </button>
      </div>
    </div>
  );
}
