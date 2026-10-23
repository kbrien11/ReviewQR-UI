
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Sparkles,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import { useBusinessPlan } from "../Dashboard/useBusinessPlan";

interface Plan {
  id: "starter" | "pro" | "premium";
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export default function PlanAndBilling() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updatePlan } = useBusinessPlan();
  const { business } = useParams();

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: "$29",
      description: "Everything you need to get started.",
      features: [
        "Essential review analytics",
        "Up to 100 reviews",
        "Custom QR codes",
        "Email support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$79",
      description: "More insights. More growth.",
      features: [
        "Advanced analytics and insights",
        "Unlimited reviews",
        "AI-powered review summaries",
        "Custom QR code styling",
        "Priority support",
      ],
      highlight: true,
      badge: "MOST POPULAR",
    },
    {
      id: "premium",
      name: "Premium",
      price: "Custom",
      description: "Powerful tools for growing teams.",
      features: [
        "Multi-location management",
        "Consolidated location analytics",
        "Dedicated account manager",
        "Custom integrations",
        "Tailored support",
      ],
    },
  ];

  const openConfirmation = (plan: Plan) => {
    setPendingPlan(plan);
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingPlan || saving) return;

    setSaving(true);
    setError(null);

    try {
      await updatePlan(pendingPlan.id);
      setSelectedPlan(pendingPlan.id);
      setConfirmOpen(false);
      setPendingPlan(null);
    } catch (err) {
      console.error("Failed to update plan:", err);
      setError("We couldn't update your plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900">
      <PageHeader
        businessName={business}
        title="Plan and Billing"
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        {/* Page introduction */}
        <section className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm">
            <Sparkles size={14} />
            SIMPLE, TRANSPARENT PRICING
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            The right plan for
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text pb-1 text-transparent">
              your next stage of growth.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
            Get the insights and tools you need to turn customer feedback
            into lasting growth. Choose the plan that works for your business.
          </p>
        </section>

        {/* Pricing cards */}
        <section
          aria-label="Available plans"
          className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-6"
        >
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <article
                key={plan.id}
                className={`relative flex min-w-0 flex-col rounded-3xl border bg-white p-6 transition-all duration-300 sm:p-7 ${
                  plan.highlight
                    ? "border-indigo-500 shadow-[0_16px_50px_rgba(79,70,229,0.12)] md:-translate-y-2"
                    : "border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.035)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-[10px] font-bold tracking-[0.14em] text-white shadow-md shadow-indigo-500/20">
                    {plan.badge}
                  </div>
                )}

                {/* Plan heading */}
                <div className="mb-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    {plan.id === "starter" && <CreditCard size={21} />}
                    {plan.id === "pro" && (
                      <Sparkles className="text-indigo-600" size={21} />
                    )}
                    {plan.id === "premium" && <Crown size={21} />}
                  </div>

                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-7 border-b border-slate-100 pb-7">
                  {plan.price === "Custom" ? (
                    <div className="text-4xl font-bold tracking-tight text-slate-950">
                      Custom
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-slate-950">
                        {plan.price}
                      </span>
                      <span className="text-sm font-medium text-slate-400">
                        / month
                      </span>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    {plan.price === "Custom"
                      ? "Tailored to your business"
                      : "Simple monthly pricing"}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    What's included
                  </p>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-5 text-slate-600"
                      >
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                            plan.highlight
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          <Check size={12} strokeWidth={2.8} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => openConfirmation(plan)}
                  className={`mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98] ${
                    plan.highlight
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {isSelected ? "Current selection" : plan.price === "Custom" ? "Explore Premium" : "Choose plan"}
                  {!isSelected && <ArrowRight size={16} />}
                </button>
              </article>
            );
          })}
        </section>

        {/* Reassurance footer */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-600" />
            Straightforward pricing
          </p>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-600" />
            Built for growing businesses
          </p>
        </div>
      </main>

      {/* Confirmation modal */}
      {confirmOpen && pendingPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setConfirmOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-plan-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
              aria-label="Close dialog"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <CreditCard size={23} />
            </div>

            <h2
              id="confirm-plan-title"
              className="text-2xl font-bold tracking-tight text-slate-950"
            >
              Confirm your plan
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You're choosing the{" "}
              <span className="font-semibold text-slate-900">
                {pendingPlan.name}
              </span>{" "}
              plan for your business.
            </p>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {pendingPlan.name} plan
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {pendingPlan.price === "Custom"
                    ? "Custom pricing"
                    : "Billed monthly"}
                </p>
              </div>

              <p className="text-xl font-bold tracking-tight text-slate-950">
                {pendingPlan.price}
                {pendingPlan.price !== "Custom" && (
                  <span className="text-xs font-medium text-slate-400">
                    /mo
                  </span>
                )}
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={saving}
                className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={saving}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    Confirm plan
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
