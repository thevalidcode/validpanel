import { type FC } from "react";
import MockUpPhone from "../../../assets/images/mockup-phones.svg";

const Hero: FC= () => (
  <section className="bg-white px-[16px] md:px-[150px] py-20 md:py-5 sm:block md:flex md:items-center">
    <div className="flex-[1] flex flex-col gap-6">
      <h1 className="text-[36px] md:text-[48px] font-bold leading-tight">
        Start Selling
        {" "}
        <br className="block md:hidden" />
        <span className="text-[var(--primary)]">Anything</span>
        {" "}
        in
        <br className="block" />
        Minutes
      </h1>
      <p className="text-gray-600 max-w-2xl text-[16px] md:text-[24px] mx-auto">
        Create your own store for airtime, data, eBooks or social media services — no tech skills needed.
      </p>
      <button
        className="bg-[var(--primary)] btn-custom text-white font-[500] w-[228px] h-[49px] md:w-[283px] md:h-[61px] cursor-pointer rounded-full text-[15px] md:text-[20.82px] flex items-center justify-center gap-2"
        type="button"
      >
        Get Started Free
      </button>
    </div>
    {/* Image mockup below */}
    <div className="mt-10 flex justify-center flex-[1] md:h-[665px]">
      <img
        src={MockUpPhone}
        alt="Phone App Mockup"
        className="w-[361px] md:w-[669px] h-auto"
      />
    </div>
  </section>
);

export default Hero;