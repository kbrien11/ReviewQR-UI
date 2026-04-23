import { useState } from "react";

export default function AddIncentiveForm({ token, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    reward_type: "percent_discount",
    reward_value: "",
    reward_text: "",
    limit_per_day: 1,
    starts_at: "",
    ends_at: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://reviewqrapi.onrender.com/api/createIncentive/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create incentive");
        setLoading(false);
        return;
      }

      setLoading(false);
      onSuccess?.(data);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Create Incentive
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Name */}
      <label className="block mb-2 font-medium text-gray-700">Name</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="10% Off Next Visit"
      />

      {/* Description */}
      <label className="block mb-2 font-medium text-gray-700">Description</label>
      <textarea
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Reward customers for scanning your QR code"
      />

      {/* Reward Type */}
      <label className="block mb-2 font-medium text-gray-700">Reward Type</label>
      <select
        value={form.reward_type}
        onChange={(e) => update("reward_type", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      >
        <option value="percent_discount">Percent Discount</option>
        <option value="free_item">Free Item</option>
        <option value="points">Points</option>
        <option value="custom_text">Custom Text</option>
      </select>

      {/* Reward Value */}
      {(form.reward_type === "percent_discount" ||
        form.reward_type === "points") && (
        <>
          <label className="block mb-2 font-medium text-gray-700">
            Reward Value
          </label>
          <input
            type="number"
            value={form.reward_value}
            onChange={(e) => update("reward_value", e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder={
              form.reward_type === "percent_discount"
                ? "10 for 10% off"
                : "50 for 50 points"
            }
          />
        </>
      )}

      {/* Reward Text */}
      <label className="block mb-2 font-medium text-gray-700">Reward Text</label>
      <input
        type="text"
        value={form.reward_text}
        onChange={(e) => update("reward_text", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="10% Off • Free Drink • Surprise Reward"
      />

      {/* Limit Per Day */}
      <label className="block mb-2 font-medium text-gray-700">
        Limit Per Day
      </label>
      <input
        type="number"
        value={form.limit_per_day}
        onChange={(e) => update("limit_per_day", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      {/* Start Date */}
      <label className="block mb-2 font-medium text-gray-700">Starts At</label>
      <input
        type="datetime-local"
        value={form.starts_at}
        onChange={(e) => update("starts_at", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      {/* End Date */}
      <label className="block mb-2 font-medium text-gray-700">Ends At</label>
      <input
        type="datetime-local"
        value={form.ends_at}
        onChange={(e) => update("ends_at", e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      {/* Active Toggle */}
      <label className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => update("is_active", e.target.checked)}
        />
        <span className="text-gray-700 font-medium">Active</span>
      </label>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Create Incentive"}
      </button>
    </div>
  );
}