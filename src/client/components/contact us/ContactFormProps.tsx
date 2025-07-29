import { type FC } from "react";
import type { ContactFormProps } from "../../../types/ContactUs.types";


const ContactForm: FC<ContactFormProps> = () => (
   <div className="max-w-6xl mx-auto mt-16 mb-32 px-4 grid md:grid-cols-2 gap-8 items-top">
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Have a question, or just want to say Hello
      </h2>
      <p className="text-gray-600">
        We have answers. Whether you need technical support or want to know more
        about feature management.
      </p>
    </div>
    <form className="bg-white shadow-lg p-6 border-2 border-purple-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-1">Fill the form below</h3>
      <p className="text-gray-600 mb-4">We will respond within 24 hrs</p>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="First Name*"
          className="w-1/2 border-0 bg-gray-200 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name*"
          className="w-1/2 border-0 bg-gray-200 p-2 rounded"
        />
      </div>
      <input
        type="email"
        placeholder="Enter your e-mail*"
        className="w-full border-0 bg-gray-200 p-2 rounded mb-2"
      />
      <textarea
        placeholder="Type your message*"
        className="w-full border-0 bg-gray-200 p-2 rounded mb-4"
        rows={10}
      ></textarea>
      <button
        type="submit"
        className="w-full bg-purple-900 text-white p-2 rounded-full font-semibold hover:bg-purple-700"
      >
        SEND MESSAGE NOW
      </button>
    </form>
  </div>
);

export default ContactForm;