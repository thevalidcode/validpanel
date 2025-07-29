import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import Steps from "../components/home/Steps";
import Testimonials from "../components/home/Testimonials";
import LaunchPrompt from "../components/LaunchPrompt";


export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Steps />
      <Testimonials />
      <LaunchPrompt />
    </>
  );
}