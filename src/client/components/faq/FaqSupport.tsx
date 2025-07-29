import { type FC } from "react";

import "./FaqSupportStyle.css";

const FaqSupport: FC = () => (
  <div className="border mx-4 md:mx-auto max-w-4xl my-10 p-6 rounded-lg text-center">
    <h3 className="text-xl font-semibold mb-2">Still have question?</h3>
    <p className="italic text-gray-600 mb-4">
      Our support team is ready to help you with any other questions you might have.
    </p>
    <button
      className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
      type="button"
    >
      Contact Support
    </button>
  </div>
);

export default FaqSupport;