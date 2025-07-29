import { type FC } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import type { TestimonialItem } from "../../../types/Home.types";

const Testimonials: FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      name: "Daniel U.",
      quote: "ValidPanel made it super easy to start selling data online. I had my store up in 10 minutes!",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
    },
    {
      name: "Blessing A.",
      quote: "No coding needed, no stress. Just pick a product, set your price, and start earning!",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 4,
    },
    {
      name: "Tolu K.",
      quote: "I now run my ebook store fully on ValidPanel — looks professional and payments are instant!",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-50 px-6 md:px-10 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        Loved by <span className="text-purple-600">Thousands of Creators</span> & Entrepreneurs
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center relative"
          >
            {/* Quote Icon */}
            <FaQuoteLeft className="text-purple-600 text-2xl absolute top-4 left-4" />
            {/* Avatar */}
            <img
              src={t.image}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover mb-4 mt-2"
            />
            <p className="text-gray-700 italic mb-3 mt-2">"{t.quote}"</p>
            {/* Rating */}
            <div className="flex text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < t.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            {/* Name */}
            <h4 className="font-semibold text-purple-700">{t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;