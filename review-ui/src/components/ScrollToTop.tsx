import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Pass 1 — immediately on route change
        window.scrollTo(0, 0);

        // Pass 2 — after paint (fixes React Router timing)
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        });

        // Pass 3 — after async content loads (fixes iOS Safari)
        const timeout = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
            });
        }, 120); // 100–150ms is the sweet spot for iOS + async pages

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}