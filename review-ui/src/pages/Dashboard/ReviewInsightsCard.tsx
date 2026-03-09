import { useState } from "react";
import { motion } from "framer-motion";

export default function ReviewInsightsCard({ insights }) {
    // -----------------------------
    // 1. Bulletproof Normalizer
    // -----------------------------
    const normalizeTopics = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value.map((item) =>
                typeof item === "string"
                    ? { topic: item, sentiment: "neutral" }
                    : {
                        topic: item.topic || item.text || "",
                        sentiment: item.sentiment || "neutral",
                    }
            );
        }
        if (typeof value === "string") {
            return [{ topic: value, sentiment: "neutral" }];
        }
        return [];
    };

    const normalizeTrends = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value.map((item) =>
                typeof item === "string"
                    ? { text: item }
                    : { text: item.text || item.topic || "" }
            );
        }
        if (typeof value === "string") {
            return [{ text: value }];
        }
        return [];
    };
    const safeInsights = {
        ...insights,
        key_topics: normalizeTopics(insights?.key_topics),
        trends: normalizeTrends(insights?.trends),
    };

    const keyTopics = normalizeTopics(safeInsights.key_topics);

    const [expanded, setExpanded] = useState(false);

    // -----------------------------
    // 2. Color Map for Topics
    // -----------------------------
    const colorMap = {
        positive:
            "from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300",
        negative:
            "from-rose-100 to-rose-200 text-rose-800 border-rose-300",
        neutral:
            "from-slate-100 to-slate-200 text-slate-700 border-slate-300",
    };

    const getTopicEmoji = (topic) => {
        const t = topic.toLowerCase();

        if (t.includes("service")) return "🤝";
        if (t.includes("food")) return "🍽️";
        if (t.includes("drink")) return "🥤";
        if (t.includes("haircut")) return "💇‍♂️";
        if (t.includes("ambiance") || t.includes("clean")) return "✨";
        if (t.includes("experience") || t.includes("place")) return "📍";

        return "🔹"; // default iOS dot
    };

    const shortenTopic = (topic) => {
        if (!topic) return "";

        let cleaned = topic
            .replace(/.*?/g, "")      // remove parentheses
            .replace(/[\/\-]/g, " ")      // replace slashes/dashes
            .replace(/\s+/g, " ")         // collapse spaces
            .trim();

        const words = cleaned.split(" ");

        // If it's something like "Food Quality Speed Accuracy" → "Food Quality"
        if (words.length >= 2) return `${words[0]} ${words[1]}`;

        return words[0];
    };

    const topicColor = (topic) => {
        const t = topic.toLowerCase();

        if (t.includes("service")) return "from-indigo-50 to-indigo-100 border-indigo-200";
        if (t.includes("food")) return "from-amber-50 to-amber-100 border-amber-200";
        if (t.includes("drink")) return "from-sky-50 to-sky-100 border-sky-200";
        if (t.includes("haircut")) return "from-pink-50 to-pink-100 border-pink-200";
        if (t.includes("ambiance") || t.includes("clean")) return "from-emerald-50 to-emerald-100 border-emerald-200";
        if (t.includes("experience") || t.includes("place")) return "from-purple-50 to-purple-100 border-purple-200";

        return "from-gray-50 to-gray-100 border-gray-200";
    };;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="
        rounded-3xl 
        bg-white/60 
        backdrop-blur-2xl 
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        border border-white/40
        p-6
        space-y-8
      "
        >
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <div className="
          w-10 h-10 rounded-2xl 
          bg-gradient-to-br from-indigo-500 to-indigo-600
          flex items-center justify-center text-white text-lg
          shadow-[0_4px_12px_rgba(99,102,241,0.35)]
        ">
                    ✨
                </div>

                <div>
                    <h2 className="
            text-xl font-semibold tracking-tight
            bg-gradient-to-r from-slate-900 to-slate-700 
            bg-clip-text text-transparent
          ">
                        AI Review Insights
                    </h2>
                    <p className="text-xs text-gray-500">Powered by AI</p>
                </div>
            </div>

            <div className="border-t border-gray-200/60 pt-4" />

            {/* KEY TOPICS */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Key Topics
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {keyTopics.map((item, i) => {
                        const short = shortenTopic(item.topic);

                        return (
                            <div
                                key={i}
                                className={`
                                    flex items-center
                                    px-3 py-3
                                    rounded-2xl
                                    bg-gradient-to-br ${topicColor(item.topic)}
                                    border
                                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_3px_rgba(0,0,0,0.05)]
                                    hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.08)]
                                    active:scale-[0.97]
                                    transition-all duration-200

                                    w-full
                                    min-h-[46px]
                                    whitespace-normal
                                    break-words
                                `}
                            >
                                {/* Icon */}
                                <div className="text-base sm:text-lg opacity-80 shrink-0">
                                    {getTopicEmoji(item.topic)}
                                </div>

                                {/* Text */}
                                <span className="
                                    text-[13px] sm:text-[14px]
                                    font-medium text-gray-800
                                    leading-tight
                                    ml-2
                                    break-words
                                    whitespace-normal
                                ">
                                    {short}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <>


                {/* SENTIMENT BREAKDOWN */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Sentiment Breakdown
                    </h3>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">

                        {/* Positive */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="
                                flex flex-col items-center justify-center
                                p-3 rounded-2xl
                                bg-gradient-to-br from-emerald-50 to-emerald-100
                                border border-emerald-200
                                shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_3px_rgba(0,0,0,0.05)]
                            "
                        >
                            <span className="text-xl font-semibold text-emerald-700">
                                {safeInsights.sentiment_breakdown?.positive}
                            </span>
                            <span className="text-xs text-emerald-700 opacity-80 mt-1">
                                Positive
                            </span>
                        </motion.div>

                        {/* Neutral */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="
                                    flex flex-col items-center justify-center
                                    p-3 rounded-2xl
                                    bg-gradient-to-br from-slate-50 to-slate-100
                                    border border-slate-200
                                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_3px_rgba(0,0,0,0.05)]
                                "
                        >
                            <span className="text-xl font-semibold text-slate-700">
                                {safeInsights.sentiment_breakdown?.neutral}
                            </span>
                            <span className="text-xs text-slate-700 opacity-80 mt-1">
                                Neutral
                            </span>
                        </motion.div>

                        {/* Negative */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="
                            flex flex-col items-center justify-center
                            p-3 rounded-2xl
                            bg-gradient-to-br from-rose-50 to-rose-100
                            border border-rose-200
                            shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_3px_rgba(0,0,0,0.05)]
                        "
                        >
                            <span className="text-xl font-semibold text-rose-700">
                                {safeInsights.sentiment_breakdown?.negative}
                            </span>
                            <span className="text-xs text-rose-700 opacity-80 mt-1">
                                Negative
                            </span>
                        </motion.div>

                    </div>
                </div>
            </>

            {/* TRENDS */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Trends
                </h3>

                <ul className="space-y-3">
                    {normalizeTrends(safeInsights.trends).map((trend, i) => {
                        const [open, setOpen] = useState(false);

                        return (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.05 }}
                                onClick={() => setOpen(!open)}
                                onMouseEnter={() => setOpen(true)}
                                onMouseLeave={() => setOpen(false)}
                                className="
                                    relative cursor-pointer
                                    bg-white
                                    rounded-2xl p-4 pl-12
                                    border border-gray-200
                                    shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                                    transition-all duration-300
          "
                            >
                                {/* Accent bar (iOS subtle version) */}
                                <div className="
                                    absolute left-0 top-0 bottom-0 w-1
                                    bg-gray-200
                                    rounded-l-2xl
                                " />

                                {/* Icon (iOS emoji style) */}
                                <div className="
                                absolute left-4 top-4
                                text-xl
                            ">
                                    📈
                                </div>

                                {/* Text */}
                                <motion.div
                                    animate={{ height: open ? "auto" : "40px" }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-[15px] text-gray-800 leading-snug">
                                        {typeof trend === "string" ? trend : trend.text}
                                    </p>
                                </motion.div>

                                {/* Fade mask when collapsed */}
                                {!open && (
                                    <div className="
                                absolute bottom-0 left-0 right-0 h-6
                                bg-gradient-to-t from-white to-transparent
                                pointer-events-none
                                " />
                                )}
                            </motion.li>
                        );
                    })}
                </ul>
            </motion.div>

            {/* SUMMARY */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Summary
                </h3>

                <div className="relative">
                    <p
                        className={`
              text-sm text-gray-700 leading-relaxed
              transition-all duration-300
              ${expanded ? "" : "line-clamp-4"}
            `}
                    >
                        {safeInsights.summary}
                    </p>

                    {!expanded && (
                        <div className="
              absolute bottom-0 left-0 right-0 h-10
              bg-gradient-to-t from-white/90 to-transparent
            " />
                    )}
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="
            text-xs font-medium text-indigo-600 mt-2
            hover:underline
          "
                >
                    {expanded ? "Show Less" : "Show More"}
                </button>
            </div>
        </motion.div>
    );
}