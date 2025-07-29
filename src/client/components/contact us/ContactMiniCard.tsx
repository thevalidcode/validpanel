import { type FC } from "react";
import type { ContactMiniCardProps } from "../../../types/ContactUs.types";


// import "./ContactMiniCard.css";

const ContactMiniCard: FC<ContactMiniCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center bg-white p-6 rounded-lg text-center shadow-xl shadow-[#8000ff40] border border-purple-100">
    <div className="text-purple-600 mb-3 mt-8">{icon}</div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    <hr
      className="h-px bg-gray-200 border-0"
      style={{ width: "88%", marginBottom: "3rem", marginTop: "1rem" }}
    />
  </div>
);

export default ContactMiniCard;