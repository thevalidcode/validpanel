import { type FC, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";

const FooterNewsletter: FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Handle form submission logic here
    // Simulate API call
    setTimeout(() => {
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4 text-white">
        Stay Updated
      </h4>
      <p className="text-purple-100 text-sm mb-4">
        Get the latest updates, tips, and exclusive offers delivered to your inbox.
      </p>
      <form className="flex gap-2" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-full text-gray-700 bg-white outline-none focus:ring-2 focus:ring-white text-sm placeholder:text-gray-400"
        />
        <button
          title="Subscribe to newsletter"
          type="submit"
          disabled={isSubmitting}
          className="h-[48px] w-[48px] rounded-full bg-white hover:bg-purple-50 flex items-center justify-center transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane className="text-[var(--primary)] text-sm" />
        </button>
      </form>
    </div>
  );
};

export default FooterNewsletter;
