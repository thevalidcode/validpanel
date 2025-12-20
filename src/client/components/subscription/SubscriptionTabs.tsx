interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "plans", label: "Plans & Pricing" },
  { id: "billing", label: "Billing History" },
];

export default function SubscriptionTabs({ activeTab, onChange }: Props) {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inter py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
