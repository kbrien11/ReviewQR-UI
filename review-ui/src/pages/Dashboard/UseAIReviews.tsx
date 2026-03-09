import { useEffect, useState } from "react";
import { extractInsights } from "../../utils/extractInsights";
import {useApp} from '../../context/AppContext'

export function UseAIReviews() {
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoading] = useState(true);

  const {businessSlug} = useApp();
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`https://reviewqrapi.onrender.com/api/analyzeReviews/${businessSlug}`);
        const data = await res.json();

        const rawText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;

        const parsed = extractInsights(rawText);
        setInsights(parsed);
      } catch (err) {
        console.error("Error loading AI insights:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { insights, loadingInsights };
}