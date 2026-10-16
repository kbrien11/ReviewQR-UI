
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import PageHeader from "../../layouts/PageHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useBusinessPlan } from "../Dashboard/useBusinessPlan";
import { useAuth } from "../../context/AuthContext";

export default function PlanAndBilling() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<any>(null);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    const { updatePlan } = useBusinessPlan();
    const { business } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const plans = [
        {
            id: "starter",
            name: "starter",
            price: "$29/mo",
            cost: 29,
            features: [
                "Basic analytics",
                "Up to 100 reviews",
                "Email support",
            ],
        },
        {
            id: "pro",
            name: "pro",
            price: "$79/mo",
            cost: 79,
            features: [
                "Advanced analytics",
                "Unlimited reviews",
                "Priority support",
            ],
            highlight: true,
        },
        {
            id: "premium",
            name: "premium",
            price: "Custom",
            cost: null,
            features: [
                "Multi-location",
                "Dedicated manager",
                "Custom integrations",
            ],
        },
    ];

    /**
     * Create an Adyen session for the selected plan.
     *
     * IMPORTANT:
     * The backend should use the plan/cost information to create
     * the Adyen session. Do not rely on the amount sent by the
     * browser for the final payment amount in production.
     */
    async function createAdyenSession() {
        if (!pendingPlan) {
            return;
        }

        // Premium doesn't have a fixed price.
        if (!pendingPlan.cost) {
            console.log("Premium requires a custom quote.");
            return;
        }

        try {
            setLoadingCheckout(true);

            const res = await fetch(
                "http://127.0.0.1:8000/api/adyen/create-session/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        plan: pendingPlan.id,
                        amount: pendingPlan.cost,
                        business: business,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error(
                    `Failed to create Adyen session: ${res.status}`
                );
            }

            const session = await res.json();

            console.log("ADYEN SESSION:", session);
            console.log("SELECTED PLAN:", pendingPlan);
            console.log("PLAN AMOUNT:", pendingPlan.cost);

            // Close the modal before navigating.
            setConfirmOpen(false);

            /**
             * Pass both the Adyen session and plan information
             * to the checkout page.
             */
            navigate("/checkout", {
                state: {
                    session,
                    plan: pendingPlan,
                },
            });
        } catch (err) {
            console.error("Failed to create Adyen session:", err);
        } finally {
            setLoadingCheckout(false);
        }
    }

    /**
     * User clicks a plan.
     */
    function handleChoosePlan(plan: any) {
        setPendingPlan(plan);
        setConfirmOpen(true);
    }

    return (
        <div className="min-h-screen bg-gray-50 font-[Inter]">
            <PageHeader
                businessName={business}
                title="Plan and Billing"
            />

            <div className="px-4 md:px-0 mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => handleChoosePlan(plan)}
                            className={`
                                relative cursor-pointer rounded-3xl p-6 border
                                backdrop-blur-2xl bg-white/60
                                shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                                transition-all duration-300
                                hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                                active:scale-[0.98]
                                flex flex-col
                                md:h-[480px] lg:h-[520px]

                                ${
                                    plan.highlight
                                        ? "border-purple-500/40"
                                        : "border-white/40"
                                }

                                ${
                                    isSelected
                                        ? "scale-[1.03] shadow-[0_12px_40px_rgba(106,13,173,0.25)] border-purple-600/60"
                                        : ""
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                    Current Plan
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-slate-900">
                                {plan.name}
                            </h2>

                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {plan.price}
                            </p>

                            <ul className="mt-4 space-y-2">
                                {plan.features.map((feature: string, index: number) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-slate-700"
                                    >
                                        <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleChoosePlan(plan);
                                }}
                                className={`
                                    mt-auto w-full py-2 rounded-xl
                                    font-semibold transition

                                    ${
                                        isSelected
                                            ? "bg-purple-600 text-white"
                                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                    }
                                `}
                            >
                                {isSelected ? "Selected" : "Choose Plan"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ========================= */}
            {/* CONFIRMATION / CHECKOUT MODAL */}
            {/* ========================= */}

            {confirmOpen && pendingPlan && (
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/40 backdrop-blur-sm
                        animate-fadeIn
                    "
                    onClick={() => {
                        if (!loadingCheckout) {
                            setConfirmOpen(false);
                        }
                    }}
                >
                    <div
                        className="
                            w-[90%] max-w-md
                            bg-white rounded-3xl
                            p-6 pb-8
                            shadow-[0_8px_40px_rgba(0,0,0,0.18)]
                            animate-slideUp
                        "
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold text-gray-900 text-center">
                            Confirm Your Plan
                        </h2>

                        <p className="text-gray-600 text-center mt-2">
                            You're selecting the{" "}
                            <span className="font-semibold text-indigo-600">
                                {pendingPlan.name}
                            </span>{" "}
                            plan.
                        </p>

                        <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-center">
                            <p className="text-sm text-gray-500">
                                Monthly subscription
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {pendingPlan.price}
                            </p>

                            {pendingPlan.cost && (
                                <p className="text-sm text-gray-500 mt-1">
                                    ${pendingPlan.cost}.00 per month
                                </p>
                            )}
                        </div>

                        {/* Plan features */}
                        <div className="mt-5">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                What's included:
                            </p>

                            <ul className="space-y-2">
                                {pendingPlan.features.map(
                                    (feature: string, index: number) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-gray-600"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                                            {feature}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="mt-7 flex flex-col gap-3">
                            {/* Checkout button */}
                            {pendingPlan.cost ? (
                                <button
                                    disabled={loadingCheckout}
                                    onClick={createAdyenSession}
                                    className="
                                        w-full py-3 rounded-xl
                                        bg-indigo-600 text-white
                                        font-semibold
                                        shadow-sm
                                        hover:bg-indigo-700
                                        active:scale-[0.98]
                                        transition-all
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {loadingCheckout
                                        ? "Preparing Checkout..."
                                        : `Continue to Checkout — ${pendingPlan.price}`}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setConfirmOpen(false);
                                        console.log(
                                            "Premium plan selected - contact sales"
                                        );
                                    }}
                                    className="
                                        w-full py-3 rounded-xl
                                        bg-indigo-600 text-white
                                        font-semibold
                                        shadow-sm
                                        hover:bg-indigo-700
                                        transition-all
                                    "
                                >
                                    Contact Sales
                                </button>
                            )}

                            <button
                                disabled={loadingCheckout}
                                onClick={() => setConfirmOpen(false)}
                                className="
                                    w-full py-3 rounded-xl
                                    bg-gray-100 text-gray-700
                                    font-medium
                                    hover:bg-gray-200
                                    active:scale-[0.98]
                                    transition-all
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }

                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes slideUp {
                        from {
                            transform: translateY(40px);
                            opacity: 0;
                        }

                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }

                    .animate-fadeIn {
                        animation: fadeIn 0.25s ease-out;
                    }

                    .animate-slideUp {
                        animation: slideUp 0.28s ease-out;
                    }
                `}
            </style>
        </div>
    );
}

