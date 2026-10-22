
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift,
  Sparkles,
  Plus,
  Pencil,
  CalendarDays,
  Clock,
  Hash,
  Tag,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  ArrowRight,
  X,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../layouts/PageHeader";
import AddIncentiveForm from "./AddIncentiveForm";

const API_URL = "https://reviewqrapi.onrender.com/api/getIncentive/";

function formatRewardType(type) {
  const labels = {
    percent_discount: "Percentage discount",
    free_item: "Free item",
    points: "Loyalty points",
    custom_text: "Custom reward",
  };

  return labels[type] || type || "Not specified";
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value === null || value === undefined || value === ""
            ? "Not set"
            : String(value)}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <LoaderCircle
        size={28}
        className="mx-auto animate-spin text-indigo-600"
      />
      <p className="mt-4 text-sm font-semibold text-gray-800">
        Loading your reward
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Fetching your current incentive details...
      </p>
    </div>
  );
}

export default function IncentiveManager() {
  const { token, setApiOffline, setApiBackendError } = useAuth();
  const { businessName } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [incentive, setIncentive] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadIncentive = useCallback(
    async (signal) => {
      if (!token) {
        setLoading(false);
        setError("Please sign in to view your rewards.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        const responseText = await res.text();
        let data = {};

        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {
          data = {};
        }

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("Your session may have expired. Please sign in again.");
          } else {
            setError(
              data.detail ||
                data.error ||
                "We couldn't load your reward. Please try again."
            );
          }

          if (!signal.aborted) {
            setIncentive(null);
            setApiBackendError?.(
              [500, 502, 503, 504].includes(res.status)
            );
            setApiOffline?.(false);
          }

          return;
        }

        if (!signal.aborted) {
          setIncentive(data);
          setApiBackendError?.(false);
          setApiOffline?.(false);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        setIncentive(null);
        setError(
          "Unable to connect to the server. Check your connection and try again."
        );
        setApiOffline?.(true);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [token, setApiOffline, setApiBackendError]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadIncentive(controller.signal);

    return () => controller.abort();
  }, [loadIncentive, refreshKey]);

  const reward = incentive?.incentive;
  const hasActiveIncentive = Boolean(
    incentive?.has_incentive && reward
  );

  const handleFormCreated = () => {
    setShowForm(false);
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50/60 pb-12">
      <PageHeader businessName={businessName} title="Rewards" />

      <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Page intro */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Gift size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Rewards & incentives
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Manage the incentives you offer to customers and encourage
                repeat engagement.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={loading}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 sm:self-center"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Fetch error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />
              <p className="text-sm leading-6 text-red-800">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Try again
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Active reward */}
            {hasActiveIncentive && !showForm && (
              <div className="space-y-6">
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 p-5 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <CheckCircle2 size={20} />
                        </div>

                        <div>
                          <h2 className="text-base font-bold text-gray-900">
                            Your current incentive
                          </h2>
                          <p className="mt-0.5 text-sm text-gray-500">
                            Review your configured reward details.
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Reward preview */}
                  <div className="p-5 sm:p-7">
                    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 sm:p-7">
                      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-indigo-100/50 blur-2xl" />

                      <div className="relative flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                          <Gift size={24} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                            Customer reward
                          </p>

                          <h3 className="mt-2 break-words text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                            {reward.reward_text || reward.name || "Your reward"}
                          </h3>

                          {reward.description && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                              {reward.description}
                            </p>
                          )}

                          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700">
                            <Sparkles
                              size={15}
                              className="shrink-0 text-indigo-600"
                            />
                            <span className="break-words">
                              {formatRewardType(reward.reward_type)}
                              {reward.reward_value !== null &&
                              reward.reward_value !== undefined &&
                              reward.reward_value !== ""
                                ? ` · ${reward.reward_value}${
                                    reward.reward_type === "percent_discount"
                                      ? "%"
                                      : reward.reward_type === "points"
                                      ? " points"
                                      : ""
                                  }`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6">
                      <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        Incentive settings
                      </h3>

                      <div className="grid gap-x-8 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0">
                        <div className="divide-y divide-gray-100">
                          <DetailItem
                            icon={Tag}
                            label="Reward type"
                            value={formatRewardType(reward.reward_type)}
                          />
                          <DetailItem
                            icon={Hash}
                            label="Reward value"
                            value={
                              reward.reward_value === null ||
                              reward.reward_value === undefined ||
                              reward.reward_value === ""
                                ? "Not set"
                                : reward.reward_type === "percent_discount"
                                ? `${reward.reward_value}%`
                                : reward.reward_type === "points"
                                ? `${reward.reward_value} points`
                                : reward.reward_value
                            }
                          />
                          <DetailItem
                            icon={Gift}
                            label="Daily limit"
                            value={reward.limit_per_day ?? "Not set"}
                          />
                        </div>

                        <div className="divide-y divide-gray-100">
                          <DetailItem
                            icon={CalendarDays}
                            label="Start date"
                            value={formatDate(reward.starts_at)}
                          />
                          <DetailItem
                            icon={CalendarDays}
                            label="End date"
                            value={formatDate(reward.ends_at)}
                          />
                          <DetailItem
                            icon={Clock}
                            label="Schedule"
                            value={
                              reward.starts_at || reward.ends_at
                                ? "Scheduled dates configured"
                                : "No dates configured"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-5 text-gray-500">
                        Changes to this incentive depend on your reward
                        settings and backend rules.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/reward/${encodeURIComponent(
                              businessName || ""
                            )}`
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                      >
                        <Pencil size={16} />
                        Edit incentive
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* No active incentive */}
            {!hasActiveIncentive && !showForm && (
              <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <Gift size={29} strokeWidth={1.6} />
                </div>

                <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-950">
                  No active reward yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Create an incentive for your customers. Set the reward,
                  choose how it appears, and review it before saving.
                </p>

                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                >
                  <Plus size={18} />
                  Create an incentive
                </button>
              </section>
            )}

            {/* Create form */}
            {showForm && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-7">
                  <div>
                    <div className="flex items-center gap-2">
                      <Gift size={19} className="text-indigo-600" />
                      <h2 className="text-lg font-bold text-gray-950">
                        Create an incentive
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure the reward you want to offer customers.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    aria-label="Close create incentive form"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="p-5 sm:p-7">
                  <AddIncentiveForm />
                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    After saving, refresh this page to view the latest
                    incentive details.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
