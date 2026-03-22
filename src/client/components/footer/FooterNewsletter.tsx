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
      <h4 className="text-gray-900 font-bold mb-4">
        Stay Updated
      </h4>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        Get the latest updates, tips, and exclusive offers delivered to your inbox.
      </p>
      <form className="flex gap-2" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-[4px] border border-gray-200 text-gray-700 bg-white text-sm placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all duration-200"
        />
        <button
          title="Subscribe to newsletter"
          type="submit"
          disabled={isSubmitting}
          className="h-[46px] w-[46px] rounded-[4px] bg-[var(--color-primary)] hover:bg-[#5c0fb3] text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <FaPaperPlane className="text-sm" />
        </button>
      </form>
    </div>
  );
};

export default FooterNewsletter;
