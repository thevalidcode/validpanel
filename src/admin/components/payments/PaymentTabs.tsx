interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const TABS = [
  { id: "payments", label: "Payments" },
  { id: "transactions", label: "Transactions" },
  { id: "subscriptions", label: "Subscriptions" },
];

export default function PaymentTabs({ activeTab, onChange }: Props) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
