import { type FC } from "react";
import type { FeatureCardProps } from "../../../types/Home.types";

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, desc, classes }) => (
  <div className={`bg-white rounded-xl group shadow-sm p-6 flex flex-col btn-custom justify-center ${classes ?? ""}`}>
    <div className="text-white text-[24px] group-hover:animate-bounce mb-4 rounded-full w-[56px] h-[56px] flex items-center justify-center bg-[var(--primary)]">{icon}</div>
    <h4 className="font-semibold text-lg mb-1">{title}</h4>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default FeatureCard;