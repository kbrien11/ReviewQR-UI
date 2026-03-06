import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // First attempt (React render)
        window.scrollTo(0, 0);

        // Second attempt (after Safari restores scroll)
        const timeout = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });
        }, 50); // 50–80ms is the sweet spot for iOS

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}