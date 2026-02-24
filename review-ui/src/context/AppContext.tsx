// AppContext.tsx
import { createContext, useContext, useState } from "react";

interface AppContextType {
  unreadGoogleReviews: number;
  setUnreadGoogleReviews: (count: number) => void;
  markGoogleReviewsAsRead: () => void;
  businessSlug: string | null;
  setBusinessSlug: (slug: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [unreadGoogleReviews, setUnreadGoogleReviews] = useState(0);

  const [businessSlug, setBusinessSlug] = useState<string | null>(null)

  const markGoogleReviewsAsRead = () => {
    setUnreadGoogleReviews(0);
  };

  return (
    <AppContext.Provider
      value={{
        unreadGoogleReviews,
        setUnreadGoogleReviews,
        markGoogleReviewsAsRead,
        setBusinessSlug,
        businessSlug
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside <AppProvider>");
  }
  return ctx;
}