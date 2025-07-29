import type { ReactNode } from "react";

// Props for the FeatureCard component
export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  classes?: string;
}

// Type for the features array items
export interface FeatureItem {
  title: string;
  desc: string;
  icon: ReactNode;
}

// Props for the StepCard component
export interface StepCardProps {
  step: {
    title: string;
    desc: ReactNode;
  };
  cont?: string;
  numb?: string;
  index: number;
}

// Type for the steps array items (aligned with StepCardProps)
export interface StepItem {
  title: string;
  desc: string; // Matches StepCardProps, but can be empty
}

// Type for the testimonials array items
export interface TestimonialItem {
  name: string;
  quote: string;
  image: string;
  rating: number;
}