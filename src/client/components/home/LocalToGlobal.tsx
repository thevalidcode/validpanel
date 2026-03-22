import { motion, useScroll, useTransform } from "framer-motion";
import { type FC, useRef } from "react";
import { FaGlobeAmericas, FaPlane, FaCreditCard, FaUserFriends, FaBox } from "react-icons/fa";

const LocalToGlobal: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-24">
           <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">From Local Passion to <br /><span className="text-[var(--color-primary)]">Global Empire</span></h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             ValidPanel removes the borders from your business. We handle the complexity of international logistics and payments invisibly.
           </p>
        </div>

        <div className="relative">
             {/* Central Line */}
             <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 rounded-full" />
             <motion.div 
                className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-[var(--color-primary)] -translate-x-1/2 rounded-full origin-top" 
                style={{ scaleY: pathLength }}
             />

             {/* Steps */}
             {[
                 { title: "Local Store", desc: "You start selling to your local community.", icon: <FaUserFriends /> },
                 { title: "National Logistics", desc: "We automatically route orders through nationwide partners.", icon: <FaBox /> },
                 { title: "Global Payments", desc: "Accept USD, GBP, and EUR instantly.", icon: <FaCreditCard /> },
                 { title: "International Shipping", desc: "Cross-border delivery handling enabled.", icon: <FaPlane /> }
             ].map((step, i) => (
                 <div key={i} className={`flex flex-col md:flex-row items-center mb-24 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-16 md:text-right">
                          {i % 2 === 0 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                <p className="text-gray-500">{step.desc}</p>
                            </motion.div>
                          )}
                          {i % 2 !== 0 && <div className="hidden md:block" />}
                      </div>

                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-14 h-14 bg-white border-4 border-[var(--color-primary)] rounded-full z-10 flex items-center justify-center text-[var(--color-primary)] shadow-lg"
                      >
                          <div className="text-xl">{step.icon}</div>
                      </motion.div>

                      <div className="w-full md:w-1/2 pl-20 md:pl-16 text-left">
                          {i % 2 !== 0 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                <p className="text-gray-500">{step.desc}</p>
                            </motion.div>
                          )}
                           {i % 2 === 0 && <div className="hidden md:block" />}
                      </div>
                 </div>
             ))}

             {/* Final Globe */}
             <motion.div 
                className="relative z-10 flex justify-center pt-8"
                style={{ opacity }}
             >
                 <div className="w-24 h-24 bg-[var(--color-primary)] rounded-full text-white flex items-center justify-center text-4xl shadow-xl shadow-purple-500/40 animate-bounce">
                     <FaGlobeAmericas />
                 </div>
             </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocalToGlobal;
