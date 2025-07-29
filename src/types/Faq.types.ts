export interface FaqCategoryProps {
  title: string;
  questions: FaqQuestionAnswerProps["question"][];
}

export interface FaqQuestionAnswerProps {
  question: {
    q: string;
    a: string;
  };
}

export interface FaqData {
  faqs: FaqQuestionAnswerProps["question"][];
}