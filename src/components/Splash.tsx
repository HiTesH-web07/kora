"use client";
import { useEffect, useState } from "react";

/**
 * Logo screen shown while the page loads. It is in the first HTML the browser gets, so it
 * appears immediately; it fades once everything has loaded (never sooner than 0.7s, so it
 * doesn't flash). The CSS animation is a safety net that removes it even if scripts fail.
 */
export function Splash() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const started = Date.now();
    const hide = () => setTimeout(() => setGone(true), Math.max(0, 700 - (Date.now() - started)));
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
    return () => window.removeEventListener("load", hide);
  }, []);

  return (
    <div className={`kora-splash ${gone ? "kora-splash-out" : ""}`} aria-hidden="true">
      <img src="/logo.png" alt="" width={148} height={148} className="kora-splash-logo" />
      <p className="hand mt-5 text-2xl text-burgundy">baking something sweet...</p>
      <style>{`
        .kora-splash{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#FBF3EA;transition:opacity .5s ease,visibility .5s;animation:kora-splash-safety .5s ease 6s forwards}
        .kora-splash-out{opacity:0;visibility:hidden;pointer-events:none}
        .kora-splash-logo{border-radius:9999px;box-shadow:0 18px 40px -18px rgba(118,46,66,.5);animation:kora-splash-breathe 1.6s ease-in-out infinite}
        @keyframes kora-splash-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes kora-splash-safety{to{opacity:0;visibility:hidden;pointer-events:none}}
      `}</style>
    </div>
  );
}
