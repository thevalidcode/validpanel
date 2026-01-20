import { type FC } from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import type { TestimonialItem } from "../../../types/Home.types";
import { FaStar } from "react-icons/fa";

const Testimonials: FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      name: "Daniel U.",
      quote:
        "Valid Panel made it super easy to start selling social media streaming services online. I had my store up in 20 seconds!",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
    },
    {
      name: "Blessing A.",
      quote:
        "No coding needed, no stress. Just pick a store, select your plan, and start earning!",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 4,
    },
    {
      name: "Tolu K.",
      quote:
        "I now run my e-commerce store fully on Valid Panel — looks professional and payments are instant!",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-50 px-[16px] md:px-[150px] pb-40 max-md:pb-20 inter  pt-10">
      <h2 className="text-2xl md:text-[40.21px] merriweather font-bold text-center mb-5">
        What Our Users Are Saying
      </h2>
      <h5 className="text-sm md:text-[19.3px] font-[400] text-center mb-12 max-w-[630.5px] mx-auto">
        From first-time sellers to growing entrepreneurs, here’s what they love
        about ValidPanel
      </h5>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] shadow-md rounded-xl p-6 py-15 flex flex-col items-center text-center relative"
          >
            {/* Quote Icon */}
            <div className="absolute left-[42.5%] w-[59px] h-[59px] bg-[#1A1A1A] top-[-20px] rounded-full flex justify-center items-center">
              <BiSolidQuoteAltLeft className="text-[white] text-[37px]" />
            </div>
            <div className="flex items-center w-full gap-2">
              {/* Avatar */}
              <img
                src={t.image}
                alt={t.name}
                className="w-[49.66px] h-[49.66px] rounded-full object-cover mb-4 mt-2"
              />
              <div className="flex flex-col gap-1">
                {/* Name */}
                <h4 className="font-[400] text-[19.1px] text-[white]">
                  {t.name}
                </h4>
                {/* Rating */}
                <div className="flex text-[var(--primary)] mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < t.rating ? "text-[var(--primary)]" : "text-gray-700"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[#FFFFFF] mb-3 mt-2 text-[12.76px]">
              "{t.quote}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
