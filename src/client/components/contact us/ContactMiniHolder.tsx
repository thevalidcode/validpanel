import { type FC } from "react";
import { FaBug, FaInfoCircle, FaCommentDots } from "react-icons/fa";
import ContactMiniCard from "./ContactMiniCard";

const ContactMiniHolder: FC = () => (
  <section className="container my-5">
    <div className="text-center py-12">
      <h2 className="text-4xl font-bold">
        We're here <span className="text-purple-600">to help</span>.
      </h2>
      <p className="text-muted">
        Have a question? We have answers. Whether you need technical
      </p>
      <p className="text-muted">support, want to learn more about us</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
      <ContactMiniCard
        icon={<FaBug size={40} />}
        title="Technical Support"
        description="Found a persistent bug or need help setting a team member up?"
      />
      <ContactMiniCard
        icon={<FaInfoCircle size={40} />}
        title="Product Information"
        description="Want to suggest a feature or get a walkthrough?"
      />
      <ContactMiniCard
        icon={<FaCommentDots size={40} />}
        title="Miscellaneous"
        description="Billing issues, plan changes, and more go here."
      />
    </div>
  </section>
);

export default ContactMiniHolder;