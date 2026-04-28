import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LeaveReviewPage() {
  const { slug } = useParams();

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [businessId, setBusinessId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGooleReviewUrl] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [reward, setReward] = useState(null);
  const [eligible, setEligible] = useState(null); // true, false, or null

  const { token, setApiOffline, setApiBackendError } = useAuth();


  useEffect(() => {
    fetch(`https://reviewqrapi.onrender.com/api/business/${slug}/`)
      .then(res => res.json())
      .then(data => {
        setBusinessId(data.id);
        setBusinessName(data.name);
      });
  }, [slug]);

  useEffect(() => {
    // 1. Load or create device_id
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("device_id", id);
    }
    setDeviceId(id);

    // 2. First call: does the business have an active incentive?
    fetch(`https://reviewqrapi.onrender.com/api/getIncentive/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.has_incentive) {
          setReward(null);
          setEligible(null);
          return;
        }

        // Business DOES have an incentive
        setReward(data.incentive);

        // 3. Second call: check if THIS device already used it today
        fetch(`https://reviewqrapi.onrender.com/api/checkUserIncentive/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: id,
            business_slug: slug,
          }),
        })
          .then(res => res.json())
          .then(check => {
            setEligible(check.eligible); // true or false
          });
      });
  }, [slug]);

  const submitReview = async () => {
    if (!rating) return;

    setLoading(true);

    const response = await fetch("https://reviewqrapi.onrender.com/api/reviews/submit/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business: businessId,        // UUID from your business fetch
        // from useParams()
        rating,
        comment,
        is_public: rating >= 4,      // your funnel logic
        device_type: /mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
        user_agent: navigator.userAgent,
        // fetched from an IP API
      }),
    });

    const json = await response.json();
    setLoading(false);
    setGooleReviewUrl(json.google_review_url)

    if (!response.ok) {
      alert("Something went wrong submitting your review.");
      return;
    }

    // Close the feedback modal if it was open
    setShowFeedbackModal(false);

    // Always show success modal after a successful submission
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10">

      {/* Reward Card */}
      {reward && (
        <div className="w-full max-w-sm mt-6">
          <div className="
      bg-white/80 backdrop-blur-xl
      border border-white/50
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      rounded-3xl p-6 space-y-4
      text-center
    ">
            <h2 className="text-[26px] font-semibold text-gray-900 tracking-tight">
              {reward.reward_text}
            </h2>

            <p className="text-gray-500 text-[15px]">
              Special reward from {businessName}
            </p>

            {/* Eligible → Show Claim Button */}
            {eligible === true && (
              <button
                onClick={() => alert("Reward claimed! (hook up backend)")}
                className="
            w-full py-3 rounded-2xl
            bg-gradient-to-br from-indigo-500 to-purple-500
            text-white font-semibold
            shadow-[0_4px_14px_rgba(0,0,0,0.15)]
            active:scale-[0.97] transition-all
          "
              >
                Claim Reward
              </button>
            )}

            {/* Not Eligible → Show Badge */}
            {eligible === false && (
              <div className="
          inline-block px-4 py-2 rounded-full
          bg-gray-100 text-gray-600
          text-sm font-medium
          shadow-inner
        ">
                Already claimed today
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fadeIn">

            {/* Stars */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl transition ${rating && rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment — only show for 1–4 stars */}
            {rating && rating < 5 && (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback here..."
                className="w-full p-4 rounded-xl border border-gray-200 shadow-sm mb-4"
              />
            )}

            {/* Submit */}
            <button
              onClick={() => {
                if (!rating) return;

                setShowRatingModal(false);

                if (rating === 5) {
                  // ⭐ 5 stars → submit immediately → success modal
                  submitReview();
                } else {
                  // ⭐ 1–4 stars → open feedback modal
                  setShowFeedbackModal(true);
                }
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fadeIn text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              Thank you!
            </h2>
            <p className="text-gray-600 mb-6">
              Your review helps this business grow.
            </p>

            {/* ⭐ Only show Google button for 5-star ratings */}
            {rating === 5 && (
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Leave a Google Review
              </a>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal — ⭐ 1–4 stars */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fadeIn">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Help us improve {businessName}
            </h2>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what happened..."
              className="w-full border rounded-lg p-3 h-28 text-gray-700"
            />

            <button
              onClick={submitReview}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}