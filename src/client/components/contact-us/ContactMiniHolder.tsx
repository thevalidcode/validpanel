import { type FC } from "react";
import { FaBug, FaInfoCircle, FaCommentDots } from "react-icons/fa";
import { motion } from "framer-motion";

const ContactCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[4px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all text-center group"
  >
    <div className="w-14 h-14 mx-auto bg-[var(--color-primary)]/5 rounded-full flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-3 text-lg">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const ContactMiniHolder: FC = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="container mx-auto text-center py-12">
        <h2 className="text-4xl md:text-6xl font-extrabold poppins">
          We're here <span className="text-purple-600">to help</span>.
        </h2>
        <p className="text-muted">
          Have a question? We have answers. Whether you need technical
        </p>
        <p className="text-muted">support, want to learn more about us</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <ContactCard
          icon={<FaBug size={24} />}
          title="Technical Support"
          description="Encountering an issue with your store? Let our engineering team troubleshoot and fix it for you."
        />
        <ContactCard
          icon={<FaInfoCircle size={24} />}
          title="Product Information"
          description="Curious about specific features like SMM integration or payment gateways? Get detailed answers."
        />
        <ContactCard
          icon={<FaCommentDots size={24} />}
          title="General Inquiries"
          description="Questions about billing, enterprise plans, or partnership opportunities? Reach out anytime."
        />
      </div>
    </div>
  </section>
);

export default ContactMiniHolder;
