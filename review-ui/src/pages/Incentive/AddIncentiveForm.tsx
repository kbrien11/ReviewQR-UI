
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Gift,
  Tag,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Percent,
  Coins,
  Package,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

const API_URL = "https://reviewqrapi.onrender.com/api/createIncentive/";

const REWARD_TYPES = [
  {
    value: "percent_discount",
    label: "Percentage discount",
    description: "Give customers a percentage off",
    icon: Percent,
  },
  {
    value: "free_item",
    label: "Free item",
    description: "Offer a complimentary product",
    icon: Package,
  },
  {
    value: "points",
    label: "Loyalty points",
    description: "Reward customers with points",
    icon: Coins,
  },
  {
    value: "custom_text",
    label: "Custom reward",
    description: "Create your own reward",
    icon: Tag,
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-gray-800";

export default function AddIncentiveForm() {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rewardType, setRewardType] = useState("percent_discount");
  const [rewardValue, setRewardValue] = useState("");
  const [rewardText, setRewardText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedReward = REWARD_TYPES.find(
    (reward) => reward.value === rewardType
  );

  const isNumericReward = ["percent_discount", "points"].includes(
    rewardType
  );

  const resetForm = () => {
    setName("");
    setDescription("");
    setRewardType("percent_discount");
    setRewardValue("");
    setRewardText("");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!token) {
      setError("Your session may have expired. Please sign in again.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a name for this reward.");
      return;
    }

    if (!rewardText.trim()) {
      setError("Please enter the text customers will see.");
      return;
    }

    if (isNumericReward) {
      const value = Number(rewardValue);

      if (rewardValue.trim() === "" || !Number.isFinite(value) || value <= 0) {
        setError("Enter a reward value greater than zero.");
        return;
      }

      if (rewardType === "percent_discount" && value > 100) {
        setError("A percentage discount cannot exceed 100%.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          reward_type: rewardType,
          reward_value: rewardValue === "" ? null : rewardValue,
          reward_text: rewardText.trim(),
        }),
      });

      const responseText = await res.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        const detail =
          data.error ||
          data.detail ||
          (typeof data === "string" ? data : null) ||
          "Unable to create this reward. Please try again.";

        throw new Error(detail);
      }

      setSuccess("Your reward has been created successfully.");
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "A network error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
          <Gift size={23} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
              Create an incentive
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Rewards
            </span>
          </div>

          <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
            Create a reward to encourage customer participation and bring
            people back to your business.
          </p>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
        >
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Reward details */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-7">
            <h3 className="text-base font-semibold text-gray-900">
              Reward details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Give your incentive a clear name and description.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            <div>
              <label htmlFor="incentive-name" className={labelClass}>
                Reward name <span className="text-red-500">*</span>
              </label>
              <input
                id="incentive-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Customer Appreciation Reward"
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="incentive-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="incentive-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this reward offers and any important details..."
                rows={3}
                maxLength={500}
                className={`${inputClass} resize-y`}
              />
              <p className="mt-1.5 text-right text-xs text-gray-400">
                {description.length}/500
              </p>
            </div>
          </div>
        </section>

        {/* Reward type */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-7">
            <h3 className="text-base font-semibold text-gray-900">
              Reward type
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose the kind of incentive you want to offer.
            </p>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
            {REWARD_TYPES.map((reward) => {
              const Icon = reward.icon;
              const active = rewardType === reward.value;

              return (
                <button
                  key={reward.value}
                  type="button"
                  onClick={() => {
                    setRewardType(reward.value);
                    setError("");
                  }}
                  aria-pressed={active}
                  className={`flex min-w-0 items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15 ${
                    active
                      ? "border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon size={19} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-gray-900">
                      {reward.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">
                      {reward.description}
                    </span>
                  </span>

                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      active
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-gray-300 bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Value and customer-facing text */}
          <div className="space-y-5 border-t border-gray-100 bg-gray-50/60 p-5 sm:p-7">
            {isNumericReward && (
              <div>
                <label htmlFor="incentive-value" className={labelClass}>
                  {rewardType === "percent_discount"
                    ? "Discount percentage"
                    : "Number of points"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    id="incentive-value"
                    type="number"
                    min="0.01"
                    max={rewardType === "percent_discount" ? 100 : undefined}
                    step={rewardType === "percent_discount" ? "0.01" : "1"}
                    value={rewardValue}
                    onChange={(e) => setRewardValue(e.target.value)}
                    placeholder={
                      rewardType === "percent_discount" ? "10" : "100"
                    }
                    required
                    className={`${inputClass} pr-16`}
                  />

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-gray-400">
                    {rewardType === "percent_discount" ? "%" : "pts"}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="incentive-reward-text" className={labelClass}>
                Customer-facing reward text{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                id="incentive-reward-text"
                type="text"
                value={rewardText}
                onChange={(e) => setRewardText(e.target.value)}
                placeholder={
                  rewardType === "percent_discount"
                    ? "e.g. Enjoy 10% off your next visit"
                    : rewardType === "free_item"
                    ? "e.g. Enjoy a free coffee"
                    : rewardType === "points"
                    ? "e.g. Earn 100 bonus points"
                    : "e.g. Enjoy a special thank-you reward"
                }
                maxLength={160}
                required
                className={inputClass}
              />

              <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-gray-500">
                <Sparkles
                  size={15}
                  className="mt-0.5 shrink-0 text-indigo-500"
                />
                This is the message customers will see when the reward is
                displayed.
              </p>
            </div>
          </div>
        </section>

        {/* Live preview */}
        <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={17} className="text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Reward preview
            </h3>
            <span className="ml-auto text-xs text-gray-400">Preview only</span>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {selectedReward && <selectedReward.icon size={23} />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold text-gray-900">
                {name.trim() || "Your reward name"}
              </p>

              <p className="mt-1 break-words text-sm leading-5 text-gray-500">
                {description.trim() || "Your reward description will appear here."}
              </p>

              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                <Gift size={15} className="shrink-0" />
                <span className="break-words">
                  {rewardText.trim() || "Your customer-facing reward"}
                </span>
              </div>

              {isNumericReward && rewardValue && Number(rewardValue) > 0 && (
                <p className="mt-2 text-xs font-medium text-gray-500">
                  {rewardType === "percent_discount"
                    ? `${rewardValue}% discount`
                    : `${rewardValue} points`}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Form actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-500">
            Fields marked <span className="text-red-500">*</span> are required.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Creating reward...
              </>
            ) : (
              <>
                <Gift size={18} />
                Create reward
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
