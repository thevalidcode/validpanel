import { type FC } from "react";
import { FaArrowRight } from "react-icons/fa";
import MockUpPhone from "../../../assets/images/mockup-phones.webp";

const Hero: FC= () => (
  <section className="bg-white px-6 md:px-10 py-16 sm:block md:flex justify-center mx-auto">
    <div>
      <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
        Start Selling
        {" "}
        <br className="block md:hidden" />
        <span className="text-purple-600">Anything</span>
        {" "}
        in
        <br className="block" />
        Minutes
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Create your own store for airtime, data, eBooks or social media services — no tech skills needed.
      </p>
      <button
        className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2"
        type="button"
      >
        Get Started Free <FaArrowRight />
      </button>
    </div>
    {/* Image mockup below */}
    <div className="mt-10 flex justify-center">
      <img
        src={MockUpPhone}
        alt="Phone App Mockup"
        className="w-[300px] md:w-[400px]"
      />
    </div>
  </section>
);

export default Hero;