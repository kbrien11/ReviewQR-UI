export default function HalfCircleGauge({ positive, privateFeedback }) {
    const radius = 80;
    const circumference = Math.PI * radius;
  
    const positiveLength = (positive / 100) * circumference;
    const privateLength = (privateFeedback / 100) * circumference;
  
    return (
      <svg
        className="w-full h-auto"
        viewBox="0 0 200 110"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="14"
          strokeLinecap="round"
        />
  
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#6366F1"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${positiveLength} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
  
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#EA580C"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${privateLength} ${circumference}`}
          strokeDashoffset={-positiveLength}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
    );
  }