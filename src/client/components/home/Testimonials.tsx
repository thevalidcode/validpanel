import { motion } from "framer-motion";
import type { FC } from "react";
import type { TestimonialItem } from "../../../types/Home.types";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials: FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      name: "Daniel U.",
      quote:
        "ValidPanel made it super easy to start selling social media streaming services online. I had my store up in 20 seconds!",
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
        "I now run my e-commerce store fully on ValidPanel — looks professional and payments are instant!",
      image: "https://i.pravatar.cc/150?img=9",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Trusted by Entrepreneurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From first-time sellers to growing brands, see why they choose ValidPanel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 p-8 rounded-[4px] relative group hover:bg-white hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-purple-100"
            >
              <FaQuoteLeft className="text-4xl text-purple-200 mb-6 group-hover:text-[var(--color-primary)] transition-colors" />
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.quote}"</p>
              
              <div className="flex items-center gap-4">
                <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < t.rating ? "" : "text-gray-300"} />
                        ))}
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
