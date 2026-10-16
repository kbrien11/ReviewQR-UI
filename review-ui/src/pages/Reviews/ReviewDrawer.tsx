import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StarRating({ rating }) {
  const value = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));

  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            star <= value ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.8l2.5 5.1 5.6.8-4.05 3.95.96 5.58L10 14.6l-5.01 2.63.96-5.58L1.9 7.7l5.6-.8L10 1.8z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.42 13.92a6 6 0 0 1 0-3.84v-2.6H3.07a10 10 0 0 0 0 9.04l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.93 5.48l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z"
      />
    </svg>
  );
}

export default function ReviewDrawer({ review, onClose, onSubmitReply }) {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const closeButtonRef = useRef(null);
  const textareaRef = useRef(null);
  const previousFocusRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const isGoogleReview =
    String(review?.source || "").toLowerCase() === "google";

  const author =
    typeof review?.author === "string" && review.author.trim()
      ? review.author.trim()
      : "Customer";

  const comment =
    typeof review?.comment === "string" && review.comment.trim()
      ? review.comment.trim()
      : "No written comment was provided.";

  const rating = Math.min(5, Math.max(0, Math.round(Number(review?.rating) || 0)));

  useEffect(() => {
    if (!review) return;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }

      if (event.key !== "Tab") return;

      const drawer = document.getElementById("review-drawer");
      if (!drawer) return;

      const focusable = drawer.querySelectorAll(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [review, onClose, submitting]);

  useEffect(() => {
    setReply("");
    setError("");
    setSuccess(false);
    setSubmitting(false);
  }, [review?.id]);

  if (!review) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!trimmedReply) {
      setError("Please write a reply before submitting.");
      textareaRef.current?.focus();
      return;
    }

    if (typeof onSubmitReply !== "function") {
      setError(
        "Reply submission isn't connected yet. Connect your reply API to enable posting."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmitReply(review, trimmedReply);
      setSuccess(true);
      setReply("");
    } catch (err) {
      setError(
        err?.message || "We couldn't submit your reply. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close review details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        onClick={() => !submitting && onClose?.()}
        disabled={submitting}
        className="absolute inset-0 cursor-default bg-gray-950/40 backdrop-blur-[3px]"
      />

      {/* Drawer */}
      <motion.section
        id="review-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-drawer-title"
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, x: 30, y: 0 }
        }
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={
          prefersReducedMotion
            ? undefined
            : { opacity: 0, x: 30 }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
        className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-gray-200 bg-white shadow-2xl sm:h-full sm:max-h-none sm:w-[460px] sm:rounded-none sm:border-y-0 sm:border-r-0"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path
                  d="M7 3.75h7l4 4V20a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 6 20V5a1.25 1.25 0 0 1 1-1.25Z"
                  strokeLinejoin="round"
                />
                <path d="M14 4v4h4M9 12h6M9 16h6" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h2
                id="review-drawer-title"
                className="text-base font-bold tracking-tight text-gray-900"
              >
                Review details
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Customer feedback and response
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => onClose?.()}
            disabled={submitting}
            aria-label="Close drawer"
            className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
          {/* Reviewer profile */}
          <section>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Reviewer
            </p>

            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-lg font-bold text-indigo-700 ring-1 ring-indigo-100">
                {author.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-words text-sm font-bold text-gray-900">
                    {author}
                  </p>

                  {review.is_local_guide && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <span aria-hidden="true">★</span>
                      Local Guide
                    </span>
                  )}
                </div>

                {review.is_local_guide && (
                  <p className="mt-1 text-xs text-gray-500">
                    {Number(review.total_reviews) || 0} reviews
                    {" · "}
                    {Number(review.total_photos) || 0} photos
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StarRating rating={rating} />
                  <span className="text-xs font-semibold text-gray-700">
                    {rating}.0
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <time
                    dateTime={review.created_at || undefined}
                    className="text-xs text-gray-500"
                  >
                    {formatDate(review.created_at)}
                  </time>
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex items-center gap-3">
                {isGoogleReview ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-white">
                    <GoogleIcon />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 10h10M7 14h6m-6 6h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    {isGoogleReview ? "Google review" : "Internal feedback"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {isGoogleReview
                      ? "Public customer review"
                      : "Private customer feedback"}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  isGoogleReview
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-200/70 text-gray-600"
                }`}
              >
                {isGoogleReview ? "Published" : "Private"}
              </span>
            </div>
          </section>

          {/* Review text */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Customer comment
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-3 h-0.5 w-10 rounded-full bg-indigo-500" />
              <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-700">
                {comment}
              </p>
            </div>
          </section>

          {/* Reply guidance for Google reviews */}
          {isGoogleReview && (
            <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H5l-2 1v-9.5A8.5 8.5 0 0 1 11.5 3H12a9 9 0 0 1 9 8.5Z"
                      strokeLinejoin="round"
                    />
                    <path d="M8 10h8M8 13.5h5" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Make every response count
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    Thank the customer, acknowledge their experience, and keep
                    your reply personal and professional.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Reply composer */}
        {isGoogleReview && (
          <footer className="shrink-0 border-t border-gray-100 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="review-public-reply"
                  className="text-sm font-bold text-gray-900"
                >
                  Your public reply
                </label>

                <span className="text-[11px] text-gray-400">
                  {reply.length}/4000
                </span>
              </div>

              <textarea
                ref={textareaRef}
                id="review-public-reply"
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setError("");
                  setSuccess(false);
                }}
                placeholder="Thank the customer and write your reply..."
                rows={4}
                maxLength={4000}
                disabled={submitting || success}
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {error && (
                <p role="alert" className="text-xs leading-5 text-rose-600">
                  {error}
                </p>
              )}

              {success && (
                <p
                  role="status"
                  className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
                >
                  Your reply was submitted successfully.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || success}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : success ? (
                  "Reply submitted"
                ) : (
                  <>
                    Post reply
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 10h14m-6-6 6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] leading-4 text-gray-400">
                Replies are public. Review your message before submitting.
              </p>
            </form>
          </footer>
        )}
      </motion.section>
    </div>
  );
}