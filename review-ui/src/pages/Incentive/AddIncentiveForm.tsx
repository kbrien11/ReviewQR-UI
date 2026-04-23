import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AddIncentiveForm() {
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rewardType, setRewardType] = useState("percent_discount");
    const [rewardValue, setRewardValue] = useState("");
    const [rewardText, setRewardText] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("https://reviewqrapi.onrender.com/api/createIncentive/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                    reward_type: rewardType,
                    reward_value: rewardValue,
                    reward_text: rewardText,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create incentive");
                setLoading(false);
                return;
            }

            setLoading(false);
        } catch (err) {
            setError("Network error");
            setLoading(false);
        }
    };



    return (
        <form onSubmit={submit} className="space-y-10 font-['SF Pro Text']">

            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-[22px] font-['SF Pro Display'] font-semibold text-gray-900">
                    Create Incentive
                </h2>
                <p className="text-[15px] text-gray-500">
                    Define the reward customers will receive after scanning.
                </p>
            </div>

            {/* CARD WRAPPER — Apple/Vercel style */}
            <div className="
                bg-white/70 backdrop-blur-2xl
                border border-white/40
                rounded-[28px]
                shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                px-5 py-6 space-y-6
                sm:px-6
            ">

                {/* Name */}
                <div className="
                    bg-white/90
                    border border-gray-200
                    rounded-2xl px-4 py-3
                    shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                    focus-within:border-gray-400
                    transition-all
                ">
                    <input
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Reward Name"
                        className="w-full bg-transparent outline-none text-[16px] text-gray-900 placeholder-gray-400"
                    />
                </div>

                {/* Description */}
                <div className="
                    bg-white/90
                    border border-gray-200
                    rounded-2xl px-4 py-3
                    shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                    focus-within:border-gray-400
                    transition-all
                ">
                    <textarea
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description"
                        rows={3}
                        className="w-full bg-transparent outline-none text-[16px] text-gray-900 placeholder-gray-400 resize-none"
                    />
                </div>

                {/* Reward Type */}
                <div className="
                    bg-white/90
                    border border-gray-200
                    rounded-2xl px-4 py-3
                    shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                    focus-within:border-gray-400
                    transition-all
                ">
                    <select
                        value={rewardType}
                        onChange={(e) => setRewardType(e.target.value)}
                        className="w-full bg-transparent outline-none text-[16px] text-gray-900 pr-6"
                    >
                        <option value="percent_discount">Percent Discount</option>
                        <option value="free_item">Free Item</option>
                        <option value="points">Points</option>
                        <option value="custom_text">Custom Text</option>
                    </select>
                </div>

                {/* Reward Value */}
                <div className="
                    bg-white/90
                    border border-gray-200
                    rounded-2xl px-4 py-3
                    shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                    focus-within:border-gray-400
                    transition-all
                ">
                    <input
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        type="number"
                        value={rewardValue}
                        onChange={(e) => setRewardValue(e.target.value)}
                        placeholder="Reward Value"
                        className="w-full bg-transparent outline-none text-[16px] text-gray-900 placeholder-gray-400"
                    />
                </div>

                {/* Reward Text */}
                <div className="
                    bg-white/90
                    border border-gray-200
                    rounded-2xl px-4 py-3
                    shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                    focus-within:border-gray-400
                    transition-all
                ">
                    <input
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        type="text"
                        value={rewardText}
                        onChange={(e) => setRewardText(e.target.value)}
                        placeholder="Display Text (e.g. 10% Off)"
                        className="w-full bg-transparent outline-none text-[16px] text-gray-900 placeholder-gray-400"
                    />
                </div>

            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="
                    w-full h-12 rounded-2xl
                    bg-gradient-to-br from-indigo-500 to-purple-500
                    text-white font-['SF Pro Display'] font-semibold
                    shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                    active:scale-[0.97] transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                {loading ? "Saving…" : "Save Reward"}
            </button>
        </form>
    );
}