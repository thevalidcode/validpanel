import { type FC } from "react";

const FaqHero: FC = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-bold">
      Frequently Asked <span className="text-purple-600">Question</span>
    </h1>
    <p className="text-gray-600 mt-2">
      Find answers to the most common questions about our platform.
    </p>
  </div>
);

export default FaqHero;