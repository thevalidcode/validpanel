import { type FC, type FormEvent } from "react";
import type { ContactFormProps } from "../../../types/ContactUs.types";

const ContactForm: FC<ContactFormProps> = () => {
  const submitMessage = async (e: FormEvent) => {
    e.preventDefault();
    try {
    } catch (error) {}
  };
  return (
    <div className="container mx-auto mt-16 mb-32 px-4 grid md:grid-cols-2 gap-8 items-top">
      <div>
        <h2 className="text-2xl md:text-4xl mb-4  font-extrabold poppins">
          Have a question, or just want to say Hello
        </h2>
        <p className="text-gray-600">
          We have answers. Whether you need technical support or want to know
          more about feature management.
        </p>
      </div>
      <form
        onSubmit={submitMessage}
        className="bg-white shadow-2xl p-6 border-2 border-purple-800 rounded-lg shadow-[#8000ff40]"
      >
        <h3 className="text-xl font-semibold mb-1">Fill the form below</h3>
        <p className="text-gray-600 mb-4">We will respond within 24 hrs</p>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            required
            placeholder="First Name*"
            className="w-1/2 border-0 bg-gray-50 p-2 rounded outline-primary"
          />
          <input
            type="text"
            required
            placeholder="Last Name*"
            className="w-1/2 border-0 bg-gray-50 p-2 rounded outline-primary"
          />
        </div>
        <input
          type="email"
          required
          placeholder="Enter your e-mail*"
          className="w-full border-0 bg-gray-50 p-2 rounded mb-2 outline-primary"
        />
        <textarea
          placeholder="Type your message*"
          required
          className="w-full border-0 bg-gray-50 p-2 rounded mb-4 outline-primary"
          rows={10}
        ></textarea>
        <button
          type="submit"
          className="merriweather w-full bg-purple-900 text-white p-2 rounded-full font-semibold hover:bg-purple-700"
        >
          SEND MESSAGE NOW
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
