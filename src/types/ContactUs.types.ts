import type { ReactNode } from "react";

export interface ContactFormProps {
 onSubmit?: (formData: FormData) => void;
}

export interface ContactMiniCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}