import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircleIcon,
  GiftIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "https://reviewqrapi.onrender.com/api";

function getDeviceId() {
  try {
    const existingId = localStorage.getItem("device_id");
    if (existingId) return existingId;

    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem("device_id", newId);
    return newId;
  } catch {
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function getDeviceType() {
  return /mobile|android|iphone|ipad|ipod/i.test(
    navigator.userAgent || ""
  )
    ? "mobile"
    : "desktop";
}

function StarSelector({ rating, onChange, disabled }) {
  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="radiogroup"
      aria-label="Choose your rating"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const selected = rating >= star;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            disabled={disabled}
            onClick={() => onChange(star)}
            className="group rounded-xl p-1 transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <StarIcon
              className={`h-9 w-9 transition-colors sm:h-11 sm:w-11 ${
                selected
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 group-hover:text-amber-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ModalShell({ children, onClose, labelledBy }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] border border-white/70 bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-[2rem] sm:p-8"
      >
        {children}
      </section>
    </div>
  );
}

export default function LeaveReviewPage() {
  const { slug } = useParams();
  const { setApiOffline, setApiBackendError } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [showRatingModal, setShowRatingModal] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [rewardLoading, setRewardLoading] = useState(false);

  const [businessId, setBusinessId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const [reward, setReward] = useState(null);
  const [eligible, setEligible] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [businessError, setBusinessError] = useState("");
  const [rewardMessage, setRewardMessage] = useState("");

  // Load or create the customer's anonymous device identifier.
  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  // Fetch the business details for this QR code.
  useEffect(() => {
    if (!slug) {
      setBusinessError("This review link is missing its business identifier.");
      setBusinessLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadBusiness() {
      setBusinessLoading(true);
      setBusinessError("");

      try {
        const response = await fetch(
          `${API_BASE}/business/${encodeURIComponent(slug)}/`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          if ([500, 502, 503, 504].includes(response.status)) {
            setApiBackendError?.(true);
          }
          throw new Error(
            response.status === 404
              ? "We couldn't find this business. Please check your QR code."
              : "Unable to load this business right now."
          );
        }

        const data = await response.json();

        if (!data?.id || !data?.name) {
          throw new Error("The business information is incomplete.");
        }

        setBusinessId(data.id);
        setBusinessName(data.name);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Business loading error:", error);
        setBusinessError(
          error instanceof TypeError
            ? "Unable to connect. Please check your internet connection."
            : error.message || "Unable to load this business."
        );

        if (error instanceof TypeError) {
          setApiOffline?.(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setBusinessLoading(false);
        }
      }
    }

    loadBusiness();

    return () => controller.abort();
  }, [slug, setApiOffline, setApiBackendError]);

  // Check reward eligibility once both the QR slug and device ID are ready.
  useEffect(() => {
    if (!slug || !deviceId) return;

    const controller = new AbortController();

    async function checkReward() {
      setRewardLoading(true);
      setRewardMessage("");

      try {
        const response = await fetch(
          `${API_BASE}/checkUserIncentive/${encodeURIComponent(slug)}/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id: deviceId }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if ([500, 502, 503, 504].includes(response.status)) {
            setApiBackendError?.(true);
          }
          throw new Error("Reward eligibility is temporarily unavailable.");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          if (!data?.has_incentive) {
            setReward(null);
            setEligible(null);
          } else {
            setReward(data.incentive || null);
            setEligible(data.eligible === true);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Reward eligibility error:", error);

        if (error instanceof TypeError) {
          setApiOffline?.(true);
        }

        if (!controller.signal.aborted) {
          setRewardMessage("Reward availability couldn't be checked right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setRewardLoading(false);
        }
      }
    }

    checkReward();

    return () => controller.abort();
  }, [slug, deviceId, setApiOffline, setApiBackendError]);

  const submitReview = useCallback(async () => {
    if (!rating || !businessId || loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/reviews/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: businessId,
          rating,
          comment: comment.trim(),
          device_id: deviceId,
          device_type: getDeviceType(),
          user_agent: navigator.userAgent,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        // Handle a non-JSON error response below.
      }

      if (!response.ok) {
        if ([500, 502, 503, 504].includes(response.status)) {
          setApiBackendError?.(true);
        }

        throw new Error(
          data?.detail ||
            data?.error ||
            "We couldn't submit your feedback. Please try again."
        );
      }

      setGoogleReviewUrl(data.google_review_url || "");
      setShowFeedbackModal(false);
      setShowRatingModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Review submission error:", error);

      if (
        error instanceof TypeError ||
        /network|failed to fetch/i.test(error?.message || "")
      ) {
        setApiOffline?.(true);
      }

      setErrorMessage(
        error instanceof TypeError
          ? "Connection failed. Please check your internet and try again."
          : error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [
    rating,
    businessId,
    loading,
    comment,
    deviceId,
    setApiOffline,
    setApiBackendError,
  ]);

  const closeRatingModal = useCallback(() => {
    if (loading) return;
    setShowRatingModal(false);
  }, [loading]);

  const closeFeedbackModal = useCallback(() => {
    if (loading) return;
    setShowFeedbackModal(false);
    setShowRatingModal(true);
  }, [loading]);

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  const handleRatingContinue = () => {
    if (!rating || loading || !businessId) return;

    setErrorMessage("");

    if (rating < 5) {
      setShowRatingModal(false);
      setShowFeedbackModal(true);
    } else {
      submitReview();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#f7f8fc] px-4 py-8 sm:justify-center sm:px-6 sm:py-12">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative z-10 my-auto w-full max-w-md">
        {/* Brand / business identity */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <ChatBubbleLeftRightIcon className="h-7 w-7" />
          </div>

          {businessLoading ? (
            <div className="mx-auto h-7 w-48 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {businessName || "Share your experience"}
            </h1>
          )}

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your feedback helps us understand what we're doing well and where
            we can improve.
          </p>
        </div>

        {/* Business error */}
        {businessError && (
          <div
            role="alert"
            className="mb-5 flex gap-3 rounded-2xl border border-red-200 bg-white p-4 shadow-sm"
          >
            <ExclamationCircleIcon className="h-6 w-6 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to open this review
              </p>
              <p className="mt-1 text-sm text-red-700">{businessError}</p>
            </div>
          </div>
        )}

        {/* Main review card */}
        <section className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className="h-5 w-5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>

          <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-gray-900">
            How was your experience?
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-gray-500">
            Select a rating to share your honest feedback.
          </p>

          <button
            type="button"
            disabled={businessLoading || Boolean(businessError)}
            onClick={() => {
              setErrorMessage("");
              setShowSuccessModal(false);
              setShowFeedbackModal(false);
              setShowRatingModal(true);
            }}
            className="mt-6 w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {businessLoading ? "Loading business..." : "Leave feedback"}
          </button>

          {/* Reward information */}
          {(reward || rewardLoading || rewardMessage) && (
            <div className="mt-5 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <GiftIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    A little something for you
                  </h3>

                  {rewardLoading ? (
                    <p className="mt-1 text-sm text-gray-500">
                      Checking reward availability...
                    </p>
                  ) : reward ? (
                    <>
                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {reward.reward_text ||
                          "A special reward is available from this business."}
                      </p>

                      {eligible === true && (
                        <p className="mt-2 text-xs font-medium text-amber-800">
                          You're eligible for this reward.
                        </p>
                      )}

                      {eligible === false && (
                        <p className="mt-2 text-xs font-medium text-gray-500">
                          This reward has already been claimed or isn't
                          currently available to you.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      {rewardMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="mt-5 text-center text-xs leading-5 text-gray-400">
            Your feedback is valuable. Please share your honest experience.
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-gray-400">
          Powered by ReviewQR
        </p>
      </main>

      {/* Rating modal */}
      {showRatingModal && !businessError && (
        <ModalShell
          onClose={closeRatingModal}
          labelledBy="rating-modal-title"
        >
          <div className="mb-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
              <StarIcon className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <h2
            id="rating-modal-title"
            className="text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            Rate your experience
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-gray-500">
            How would you rate your experience with {businessName || "us"}?
          </p>

          <div className="my-7">
            <StarSelector
              rating={rating}
              onChange={(nextRating) => {
                setRating(nextRating);
                setErrorMessage("");
              }}
              disabled={loading}
            />

            <p className="mt-3 h-5 text-center text-sm font-medium text-amber-700">
              {rating
                ? [
                    "",
                    "Poor",
                    "Fair",
                    "Good",
                    "Very good",
                    "Excellent",
                  ][rating]
                : "Tap a star to select your rating"}
            </p>
          </div>

          {rating > 0 && (
            <div className="mb-5">
              <label
                htmlFor="rating-comment"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Add a comment{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>

              <textarea
                id="rating-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Tell us about your experience..."
                className="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {comment.length}/2000
              </p>
            </div>
          )}

          {errorMessage && (
            <p role="alert" className="mb-4 text-sm leading-5 text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handleRatingContinue}
            disabled={!rating || loading || businessLoading || !businessId}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting feedback...
              </>
            ) : rating < 5 && rating > 0 ? (
              "Continue"
            ) : (
              "Submit feedback"
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={closeRatingModal}
            className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
        </ModalShell>
      )}

      {/* Follow-up feedback for lower ratings */}
      {showFeedbackModal && (
        <ModalShell
          onClose={closeFeedbackModal}
          labelledBy="feedback-modal-title"
        >
          <div className="mb-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>

          <h2
            id="feedback-modal-title"
            className="text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            Help us improve
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-gray-500">
            Thanks for sharing your rating. What could we have done better?
          </p>

          <div className="my-5 flex justify-center">
            <StarSelector
              rating={rating}
              onChange={setRating}
              disabled={loading}
            />
          </div>

          <label
            htmlFor="feedback-comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Your feedback{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>

          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Tell us what happened and how we can improve..."
            className="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {comment.length}/2000
          </p>

          {errorMessage && (
            <p role="alert" className="mt-3 text-sm leading-5 text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={submitReview}
            disabled={loading || !rating || !businessId}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending feedback...
              </>
            ) : (
              "Submit feedback"
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={closeFeedbackModal}
            className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50"
          >
            Back
          </button>
        </ModalShell>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <ModalShell
          onClose={closeSuccessModal}
          labelledBy="success-modal-title"
        >
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
              <CheckCircleIcon className="h-9 w-9 text-emerald-600" />
            </div>
          </div>

          <h2
            id="success-modal-title"
            className="text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            Thank you!
          </h2>

          <p className="mt-3 text-center text-sm leading-6 text-gray-500">
            Your feedback has been submitted to{" "}
            <span className="font-semibold text-gray-800">
              {businessName || "this business"}
            </span>
            . We appreciate you taking the time to share your experience.
          </p>

          {googleReviewUrl && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Want to share your experience publicly, too?
              </p>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                You can optionally leave an honest review on Google.
              </p>

              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
              >
                Leave a Google Review
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={closeSuccessModal}
            className="mt-5 w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
          >
            Done
          </button>
        </ModalShell>
      )}
    </div>
  );
}