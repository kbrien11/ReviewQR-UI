import ReviewCard from "./ReviewCard";

export default function ReviewsList({ reviews, onSelect }) {
  if (reviews.length === 0) {
    return (
      <div className="p-5 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl text-center">
        No reviews found.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review, i) => (
        <ReviewCard
          key={review.id}
          review={review}
          onClick={() => onSelect(review)}
          delay={i * 80}
        />
      ))}
    </div>
  );
}