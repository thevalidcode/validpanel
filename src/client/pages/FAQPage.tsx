import type { FaqData } from "../../types/Faq.types";
import FaqCategory from "../components/faq/FaqCategory";
import FaqHero from "../components/faq/FaqHero";
import FaqSupport from "../components/faq/FaqSupport";
import faq from "../components/faq/faq.json";

const faqData: FaqData = faq;

export default function FAQPage() {
  return (
    <section className="container mx-auto p-5 faq">
      <FaqHero />
      <FaqCategory title="General Questions" questions={faqData.faqs} />
      <FaqSupport />
    </section>
  );
}