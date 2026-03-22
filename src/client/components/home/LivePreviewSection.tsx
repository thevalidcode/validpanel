import { motion } from "framer-motion";
import { type FC, useState } from "react";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { FaExternalLinkAlt, FaInstagram, FaGlobe } from "react-icons/fa";

const LivePreviewSection: FC = () => {
  const [confirmOpen, setConfirmOpen] = useState<{ open: boolean; url: string; title: string } | null>(null);

  const previews = [
    {
      title: "ValidShop",
      desc: "Full E-Commerce Experience",
      sub: "Best for Physical Goods Brands",
      url: "https://validshop.validpanel.com",
      icon: <FaGlobe />,
      // Using platform-consistent colors or neutral backgrounds with primary accents
      color: "bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)]", 
      border: "border-gray-200"
    },
    {
      title: "Valid Plug",
      desc: "Social Media Store",
      sub: "Best for Service Providers",
      url: "https://validplug.com.ng",
      icon: <FaInstagram />,
      color: "bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)]",
      border: "border-gray-200"
    },
  ];

  return (
    <section className="py-32 bg-white border-t border-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Experience the Platform Live</h2>
          <p className="text-gray-500">Don't just take our word for it. Interact with real live instances.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {previews.map((preview) => (
            <motion.div
              key={preview.title}
              whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
              onClick={() => setConfirmOpen({ open: true, url: preview.url, title: preview.title })}
              className={`bg-white p-8 rounded-[4px] border border-gray-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 group flex items-start gap-6 relative overflow-hidden`}
            >
              <div className={`w-14 h-14 rounded-[4px] flex items-center justify-center text-2xl ${preview.color} group-hover:scale-110 transition-transform`}>
                {preview.icon}
              </div>

              <div>
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 block">{preview.sub}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    {preview.title}
                    <FaExternalLinkAlt className="text-xs text-gray-300 group-hover:text-[var(--color-primary)]" />
                </h3>
                <p className="text-gray-500">{preview.desc}</p>
              </div>

              {/* Subtle patterned background */}
              <div className="absolute right-0 bottom-0 opacity-[0.03] text-9xl pointer-events-none transform translate-x-10 translate-y-10">
                {preview.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmOpen}
        title={`Visit ${confirmOpen?.title}?`}
        description={`This will open the ${confirmOpen?.title} demo in a new tab. This is a live production instance.`}
        onConfirm={() => {
          if (confirmOpen?.url) window.open(confirmOpen.url, "_blank");
          setConfirmOpen(null);
        }}
        onCancel={() => setConfirmOpen(null)}
      />
    </section>
  );
};

export default LivePreviewSection;
