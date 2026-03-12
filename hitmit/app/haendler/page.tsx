"use client";

import Link from "next/link";
import { SubpageHeader } from "../subpage-header";
import { getDealers } from "../dealer-utils";
import { StarRating } from "../star-rating";
import { useSavedData } from "../use-saved-data";

export default function HaendlerPage() {
  const { mounted, dealerReviews, toggleSavedDealer, isSavedDealer } = useSavedData();
  const dealers = getDealers(dealerReviews);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-mesh">
        <SubpageHeader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-gray-900 animate-fade-in-up">
          Händler
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl text-lg animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          Entdecke verifizierte Händler auf HITMIT.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {dealers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer, index) => (
              <div
                key={dealer.companyName}
                className="animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="card p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/haendler/${encodeURIComponent(dealer.companyName)}`}
                        className="font-semibold text-gray-900 hover:text-[#f14011] transition-colors text-lg"
                      >
                        {dealer.companyName}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        {dealer.zip} {dealer.city}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSavedDealer(dealer.companyName)}
                      className="shrink-0 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                      aria-label={isSavedDealer(dealer.companyName) ? "Händler entfernen" : "Händler speichern"}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isSavedDealer(dealer.companyName) ? "#f14011" : "none"} stroke={isSavedDealer(dealer.companyName) ? "#f14011" : "currentColor"} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {dealer.averageRating > 0 ? (
                      <>
                        <StarRating rating={dealer.averageRating} size="sm" />
                        <span className="text-sm text-gray-500">
                          {dealer.averageRating.toFixed(1)} ({dealer.reviewCount})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">Noch keine Bewertungen</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-[#2a2a2a]">
                    <span className="text-sm text-gray-500">
                      {dealer.vehicleCount} {dealer.vehicleCount === 1 ? "Fahrzeug" : "Fahrzeuge"}
                    </span>
                    <Link
                      href={`/haendler/${encodeURIComponent(dealer.companyName)}`}
                      className="text-sm text-[#f14011] font-semibold hover:underline"
                    >
                      Zum Händler &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Keine Händler gefunden.</p>
          </div>
        )}
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
