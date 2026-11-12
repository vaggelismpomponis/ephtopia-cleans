"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ephtopia-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ephtopia-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("ephtopia-cookie-consent", "dismissed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Ειδοποίηση cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-3xl mx-auto bg-navy text-white border border-navy-medium rounded-xl shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie
          className="w-5 h-5 text-teal shrink-0 mt-0.5 sm:mt-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p className="text-sm text-slate-300 flex-1 leading-relaxed min-w-0">
          Χρησιμοποιούμε cookies για τη βελτίωση της εμπειρίας σας. Συνεχίζοντας,
          αποδέχεστε τη{" "}
          <a
            href="#contact"
            className="text-teal-light hover:text-white underline transition-colors"
          >
            Πολιτική Απορρήτου
          </a>
          .
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-initial min-h-10 px-4 py-2 rounded-lg bg-teal-dark hover:bg-teal text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Αποδοχή
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg border border-navy-medium text-slate-300 hover:text-white hover:bg-navy-light transition-colors cursor-pointer"
            aria-label="Κλείσιμο ειδοποίησης cookies"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
