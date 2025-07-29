import { type FC } from "react";
import type { FeatureCardProps } from "../../../types/Home.types";

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, desc, classes }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${classes ?? ""}`}>
    <div className="text-purple-700 text-2xl mb-4 rounded-full">{icon}</div>
    <h4 className="font-semibold text-lg mb-1">{title}</h4>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default FeatureCard;