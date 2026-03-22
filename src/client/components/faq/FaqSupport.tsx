import { type FC } from "react";
import { motion } from "framer-motion";
import "./FaqSupportStyle.css";
import { useNavigate } from "react-router-dom";

const FaqSupport: FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12 bg-white rounded-[4px] border-2 border-gray-200 p-8 text-center shadow-lg"
    >
      <h3 className="text-xl font-bold mb-3 text-gray-800">
        Still have question ?
      </h3>
      <p className="text-gray-600 text-sm mb-6">
        Our support team is ready to help you with any other questions you might
        have.
      </p>
      <motion.button
        onClick={() => navigate("/contact-us")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
      >
        Contact Support
      </motion.button>
    </motion.div>
  );
};

export default FaqSupport;
