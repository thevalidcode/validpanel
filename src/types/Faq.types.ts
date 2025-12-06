export interface FaqCategoryProps {
  title: string;
  questions: FaqQuestionAnswerProps["question"][];
}

export interface FaqQuestionAnswerProps {
  isOpen: boolean;
  onClick: () => void;
  question: {
    q: string;
    a: string;
  };
}

export interface FaqData {
  faqs: FaqCategoryProps[];
}
