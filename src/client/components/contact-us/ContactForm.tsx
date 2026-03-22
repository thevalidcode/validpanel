import { type FC, type FormEvent, useState } from "react";
import type { ContactFormProps } from "../../../types/ContactUs.types";
import { useSendContactMessage } from "@/hooks/use-contact";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

const ContactForm: FC<ContactFormProps> = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutateAsync: sendMessage, isPending } = useSendContactMessage();

  const submitMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return;
    }
    await sendMessage({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="bg-white py-20 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Send us a message
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-lg">
              We typically respond within 2-4 business hours. Please provide as
              much detail as possible so we can help you faster.
            </p>

            <div className="bg-gray-50 p-6 rounded-[4px] border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Office Hours</h4>
              <p className="text-sm text-gray-500 mb-4">
                Monday - Friday: 9AM - 10PM WAT
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">Direct Email</h4>
              <p className="text-sm text-gray-500">support@validpanel.com</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitMessage} className="bg-white rounded-[4px]">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  title="firstname"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-gray-200 p-3 rounded-[4px] outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  title="lastname"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-gray-200 p-3 rounded-[4px] outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                title="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 p-3 rounded-[4px] outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
              />
            </div>

            <div className="space-y-1 mb-6">
              <label className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                title="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-gray-200 p-3 rounded-[4px] outline-none focus:border-[var(--color-primary)] transition-colors text-sm min-h-[150px]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[var(--color-primary)] text-white p-4 rounded-[4px] font-bold text-sm tracking-wide hover:bg-[#5c0fb3] transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
