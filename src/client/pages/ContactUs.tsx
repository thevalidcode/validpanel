import ContactForm from "../components/contact-us/ContactForm";
import ContactMiniHolder from "../components/contact-us/ContactMiniHolder";


export default function ContactUs() {
  return (
    <div className="bg-white py-20">
      <ContactMiniHolder />
      <ContactForm />
    </div>
  );
}