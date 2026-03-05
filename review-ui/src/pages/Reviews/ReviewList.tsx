import ReviewCard from "./ReviewCard";

export default function ReviewsList({ reviews, onSelect }) {
  if (reviews.length === 0) {
    return (
      <div
        className="
          bg-white/80 backdrop-blur-xl
          border border-gray-200 shadow-sm
          rounded-2xl px-5 py-6 text-center
          text-gray-600 text-[15px] font-medium
        "
      >
        No reviews found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-[1px]">
      {reviews.map((review, i) => (
        <ReviewCard
          key={review.id}
          review={review}
          onClick={() => onSelect(review)}
          delay={i * 70}
        />
      ))}
    </div>
  );
}