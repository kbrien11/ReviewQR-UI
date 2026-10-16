import { motion, useReducedMotion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import ReviewCard from "./ReviewCard";

export default function ReviewsList({ reviews = [], onSelect }) {
  const prefersReducedMotion = useReducedMotion();
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (safeReviews.length === 0) {
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-gray-200/80 bg-white px-6 py-12 text-center shadow-sm"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
          <ChatBubbleLeftRightIcon
            className="h-7 w-7 text-indigo-600"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">
          No reviews found
        </h3>

        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
          There are no reviews matching your current filters. Try selecting a
          different filter or check back when new reviews arrive.
        </p>
      </motion.div>
    );
  }

  return (
    <section className="min-h-[1px] space-y-4" aria-label="Customer reviews">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Customer reviews
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Select a review to see its details
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold tabular-nums text-gray-600 shadow-sm">
          {safeReviews.length}{" "}
          {safeReviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="flex min-h-[1px] flex-col gap-3 sm:gap-4">
        {safeReviews.map((review, index) => (
          <motion.div
            key={review.id ?? `${review.created_at ?? "review"}-${index}`}
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.25,
              delay: prefersReducedMotion
                ? 0
                : Math.min(index * 0.045, 0.25),
              ease: "easeOut",
            }}
          >
            <ReviewCard
              review={review}
              onClick={onSelect ? () => onSelect(review) : undefined}
              delay={0}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}