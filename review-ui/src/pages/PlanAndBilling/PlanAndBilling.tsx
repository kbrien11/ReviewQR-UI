import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import PageHeader from "../../layouts/PageHeader";
import { useParams } from "react-router-dom";

export default function PlanAndBilling() {
    const [selectedPlan, setSelectedPlan] = useState("Pro"); // Example current plan

    const { business } = useParams();


    const plans = [
        {
            id: "Starter",
            name: "Starter",
            price: "$29/mo",
            features: ["Basic analytics", "Up to 100 reviews", "Email support"],
        },
        {
            id: "Pro",
            name: "Pro",
            price: "$79/mo",
            features: ["Advanced analytics", "Unlimited reviews", "Priority support"],
            highlight: true,
        },
        {
            id: "Enterprise",
            name: "Enterprise",
            price: "Custom",
            features: ["Multi-location", "Dedicated manager", "Custom integrations"],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-[Inter]">
            <PageHeader businessName={business} title="Plan and Billing" />

            {/* Better spacing + mobile padding */}
            <div className="px-4 md:px-0 mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`
                            relative cursor-pointer rounded-3xl p-6 border
                            backdrop-blur-2xl bg-white/60
                            shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                            transition-all duration-300
                            hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                            active:scale-[0.98]

                            flex flex-col   /* <-- NEW */

                            md:h-[480px] lg:h-[520px]

                            ${plan.highlight ? "border-purple-500/40" : "border-white/40"}
                            ${isSelected ? "scale-[1.03] shadow-[0_12px_40px_rgba(106,13,173,0.25)] border-purple-600/60" : ""}
                        `}

                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                    Current Plan
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>

                            <p className="text-3xl font-bold text-slate-900 mt-2">{plan.price}</p>

                            <ul className="mt-4 space-y-2">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-700">
                                        <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`
                                        mt-auto w-full py-2 rounded-xl font-semibold transition
                                        ${isSelected
                                        ? "bg-purple-600 text-white"
                                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"}
  `}
                            >
                                {isSelected ? "Selected" : "Choose Plan"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}