export default function ReviewsTabs({ active, onChange }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "google", label: "Google" },
    { id: "internal", label: "Internal" },
  ];

  return (
    <div className="flex gap-6 border-b mb-6">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`
            pb-3 text-sm font-medium transition
            ${active === t.id
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}