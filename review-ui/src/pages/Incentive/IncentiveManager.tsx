import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddIncentiveForm from "./AddIncentiveForm";

export default function IncentiveManager() {
    const [loading, setLoading] = useState(true);
    const [incentive, setIncentive] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { token, setApiOffline, setApiBackendError } = useAuth();

    console.log(token)
    // Load incentive on mount
    useEffect(() => {
        // ⛔ Don't run the request until the token actually exists
        if (!token) return;

        async function loadIncentive() {
            try {
                const res = await fetch("https://reviewqrapi.onrender.com/api/getIncentive/", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    setIncentive(data.incentive);
                } else {
                    setIncentive(null);
                }
            } catch (err) {
                setIncentive(null);
            } finally {
                setLoading(false);
            }
        }

        loadIncentive();
    }, [token]);

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading incentive…
            </div>
        );
    }

    const DetailRow = ({ label, value }) => (
        <div className="flex items-center justify-between">
            <span className="text-[14px] text-gray-500">{label}</span>
            <span className="text-[15px] font-medium text-gray-900">{value}</span>
        </div>
    );

    return (
        <div className="
  w-full
  rounded-[28px]
  p-7
  bg-white/60
  backdrop-blur-2xl
  border border-white/50
  shadow-[0_8px_30px_rgba(0,0,0,0.06)]
  space-y-6
  font-['SF Pro Text']
">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[21px] font-['SF Pro Display'] font-semibold text-gray-900 tracking-tight">
                    Active Incentive
                </h3>

                <span className="
                    px-3 py-1.5
                    text-xs font-medium
                    rounded-full
                    bg-green-100 text-green-700
                    shadow-sm
                    ">
                    Active
                </span>
            </div>

            {/* Title */}
            <div>
                <h2 className="text-[26px] font-['SF Pro Display'] font-semibold text-gray-900 tracking-tight">
                    {incentive.reward_text}
                </h2>
                <p className="text-[15px] text-gray-500 mt-1">
                    Reward customers for scanning
                </p>
            </div>

            {/* Details */}
            <div className="
                    rounded-2xl
                    bg-white/70
                    backdrop-blur-xl
                    border border-white/40
                    shadow-inner
                    p-5
                    space-y-4
                ">
                <DetailRow label="Reward Type" value={incentive.reward_type} />
                <DetailRow label="Reward Value" value={incentive.reward_value} />
                <DetailRow label="Reward Text" value={incentive.reward_text} />
                <DetailRow label="Limit Per Day" value={incentive.limit_per_day} />
                <DetailRow label="Starts" value={incentive.starts} />
                <DetailRow label="Ends" value={incentive.ends || '—'} />
            </div>

            {/* Button */}
            <button
                onClick={() => navigate(`/admin/reward/${businessSlug}`)}
                className="
                        w-full
                        h-12
                        rounded-2xl
                        bg-gradient-to-br from-indigo-500 to-purple-500
                        text-white font-['SF Pro Display'] font-semibold
                        shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                        active:scale-[0.97]
                        transition-all
                        "
            >
                Edit Incentive
            </button>
        </div>
    );
}