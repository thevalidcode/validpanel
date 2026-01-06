import { type FC } from "react";
import { FaPaperPlane } from "react-icons/fa";
import FooterSocial from "./FooterSocial";
import { toast } from "sonner";

const FooterNewsletter: FC = () => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here

    toast.success("Subscribed successfully!");
  };
  return (
    <div>
      <div>
        <h5 className="font-semibold mb-4 uppercase">
          Subscribe to our Newsletter
        </h5>
        <p className="text-sm">Only valuable resource no bullshit</p>
        <form className="flex gap-4 items-end" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Enter your e-mail"
            required
            className="mt-2 px-4 py-3 rounded-full text-black w-full bg-white outline-0"
          />
          <button
            title="subscribe"
            type="submit"
            className="h-[50px] px-4 rounded-full bg-black flex items-center py-3"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
      <FooterSocial />
    </div>
  );
};
export default FooterNewsletter;
