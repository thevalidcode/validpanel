import { GoArrowUpRight } from "react-icons/go";

export default function LaunchPrompt() {
  return (
    <div className="bg-black text-white text-center py-12 md:w-90%">
      <h2 className="text-2xl font-semibold mb-2">
        Ready to launch your online business?
      </h2>
      <p className="mb-4">
        Create your shop or social store in minutes. No technical skills needed.
      </p>
      <button className="bg-purple-600 px-8 py-3 rounded-full hover:bg-purple-700 inline-flex items-center gap-2">
        Get Started <GoArrowUpRight />{" "}
      </button>
    </div>
  );
}