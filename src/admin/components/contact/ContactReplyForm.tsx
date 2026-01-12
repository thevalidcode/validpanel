import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface ContactReplyFormProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export default function ContactReplyForm({
  onSubmit,
  isLoading,
}: ContactReplyFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border-2 border-purple-200 p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="reply-message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Your Reply
          </label>
          <textarea
            id="reply-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response here..."
            rows={6}
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
            required
            maxLength={10000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length}/10000 characters
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Reply
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
