import type { FaqData } from "../../types/Faq.types";
import FaqCategory from "../components/faq/FaqCategory";
import FaqHero from "../components/faq/FaqHero";
import FaqSupport from "../components/faq/FaqSupport";
import faq from "../components/faq/faq.json";

const faqData: FaqData = faq;

export default function FAQPage() {
  return (
    <section className="container mx-auto px-5 py-20 faq">
      {/* Animated background blobs */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
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
