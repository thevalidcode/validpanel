import type { FaqData } from "../../types/Faq.types";
import FaqCategory from "../components/faq/FaqCategory";
import FaqHero from "../components/faq/FaqHero";
import FaqSupport from "../components/faq/FaqSupport";
import faq from "../components/faq/faq.json";
import { motion } from "framer-motion";

const faqData: FaqData = faq;

export default function FAQPage() {
  return (
    <section className="container mx-auto px-5 py-20 faq">
      {/* Animated background blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 right-1/9 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-1/8 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
      />
      <FaqHero />
      {faqData.faqs.map((category, index) => (
        <FaqCategory
          key={index}
          title={category.title}
          questions={category.questions}
          index={index}
        />
      ))}
      <FaqSupport />
    </section>
  );
}
