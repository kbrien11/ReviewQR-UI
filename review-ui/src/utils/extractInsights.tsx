// src/utils/extractInsights.js

export function extractInsights(rawText) {
    if (!rawText) return null;
  
    // Remove ```json and ``` fences
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse AI insights JSON:", err);
      return null;
    }
  }