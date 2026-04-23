import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../layouts/PageHeader";
import AddIncentiveForm from "./AddIncentiveForm";

export default function IncentiveManager() {
    const [loading, setLoading] = useState(true);
    const [incentive, setIncentive] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const { token, setApiOffline, setApiBackendError } = useAuth();

    const { businessName } = useApp();
    const navigate = useNavigate();

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
                    setIncentive(data);
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



    const DetailRow = ({ label, value }) => (
        <div className="flex items-center justify-between">
            <span className="text-[14px] text-gray-500">{label}</span>
            <span className="text-[15px] font-medium text-gray-900">{value}</span>
        </div>
    );

    return (
        <div className="w-full mb-10">

            {/* PAGE HEADER */}
            <PageHeader businessName={businessName} title="Rewards" />

            <div className="mt-4 px-4 sm:px-6 md:px-8 flex justify-center">
                <div className="w-full max-w-2xl">

                    <div
                        className="
                            w-full max-w-2xl mx-auto mt-8
                            px-6 sm:px-8
                            py-8 sm:py-10
                            rounded-[28px]
                            bg-white/70 backdrop-blur-2xl
                            border border-white/40
                            shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                            space-y-8
                            font-['SF Pro Text']
                        "
                    >

                        {loading && (
                            <div className="p-6 text-center text-gray-500">
                                Loading incentive…
                            </div>
                        )}

                        {/* ACTIVE INCENTIVE */}
                        <div className={!loading && incentive?.has_incentive ? "block" : "hidden"}>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[22px] font-['SF Pro Display'] font-semibold text-gray-900 tracking-tight">
                                    Active Incentive
                                </h3>

                                <span className="
                                    px-3 py-1.5 text-xs font-medium rounded-full
                                    bg-green-100 text-green-700
                                    shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                                ">
                                    Active
                                </span>
                            </div>

                            {/* Title + Subtitle */}
                            <div className="space-y-1 mb-6">
                                <h2 className="text-[28px] font-['SF Pro Display'] font-semibold text-gray-900 tracking-tight leading-tight">
                                    {incentive?.incentive?.reward_text}
                                </h2>
                                <p className="text-[15px] text-gray-500">
                                    Reward customers for scanning
                                </p>
                            </div>

                            {/* DETAILS CARD */}
                            <div
                                className="
                            rounded-[24px]
                            bg-white/80 backdrop-blur-xl
                            border border-white/50
                            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                            px-5 py-6
                            space-y-5
                        "
                            >
                                <DetailRow label="Reward Type" value={incentive?.incentive?.reward_type} />
                                <DetailRow label="Reward Value" value={incentive?.incentive?.reward_value} />
                                <DetailRow label="Reward Text" value={incentive?.incentive?.reward_text} />
                                <DetailRow label="Limit Per Day" value={incentive?.incentive?.limit_per_day} />
                                <DetailRow label="Starts" value={incentive?.incentive?.starts_at || "—"} />
                                <DetailRow label="Ends" value={incentive?.incentive?.ends_at || "—"} />
                            </div>

                            {/* BUTTON */}
                            <button
                                onClick={() => navigate(`/admin/reward/${businessName}`)}
                                className="
                            w-full h-12 mt-6
                            rounded-2xl
                            bg-gradient-to-br from-indigo-500 to-purple-500
                            text-white font-['SF Pro Display'] font-semibold
                            shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                            active:scale-[0.97] transition-all
                        "
                            >
                                Edit Incentive
                            </button>
                        </div>

                        {/* NO INCENTIVE */}
                        <div className={!loading && !incentive?.has_incentive && !showForm ? "flex flex-col items-center text-center py-12 px-6 space-y-5" : "hidden"}>

                            <div
                                className="
                                    w-16 h-16 rounded-3xl bg-white/70 backdrop-blur-xl
                                    border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                                    flex items-center justify-center
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-1.5-3-6-3-6 1.5 0 3 3 6 6 9 3-3 6-6 6-9 0-4.5-4.5-4.5-6-1.5z" />
                                </svg>
                            </div>

                            <h3 className="text-[22px] font-['SF Pro Display'] font-semibold text-gray-900">
                                No Active Reward
                            </h3>

                            <p className="text-[15px] text-gray-500 max-w-[260px] leading-relaxed">
                                You don’t have a reward set up yet. Create one to incentivize customers and boost engagement.
                            </p>

                            <button
                                onClick={() => setShowForm(true)}
                                className="
                                    mt-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500
                                    text-white font-['SF Pro Display'] font-semibold
                                    shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                                    active:scale-[0.97] transition-all
                                "
                            >
                                Create New Reward
                            </button>
                        </div>

                        {/* ADD INCENTIVE FORM */}
                        <div className={showForm ? "block mt-6" : "hidden mt-6"}>
                            <div className="animate-fadeIn">
                                <div className="p-6 space-y-6">

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="text-gray-400 hover:text-gray-600 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <AddIncentiveForm />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}