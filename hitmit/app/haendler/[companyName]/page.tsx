"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SubpageHeader } from "../../subpage-header";
import { getDealerByName, getDealerVehicles } from "../../dealer-utils";
import { StarRating } from "../../star-rating";
import { useSavedData } from "../../use-saved-data";
import { getCoordsByCity } from "../../geocoding";

const LocationMap = dynamic(() => import("../../location-map"), { ssr: false });

export default function DealerDetailPage() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);

  const {
    mounted,
    dealerReviews,
    toggleSavedDealer,
    isSavedDealer,
    addDealerReview,
    getDealerReviewsForDealer,
  } = useSavedData();

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const dealer = getDealerByName(companyName, dealerReviews);
  const vehicles = getDealerVehicles(companyName);
  const reviews = getDealerReviewsForDealer(companyName);
  const coords = dealer ? getCoordsByCity(dealer.city) : null;

  const handleSubmitReview = () => {
    if (!reviewName.trim() || reviewRating === 0 || !reviewText.trim()) return;
    addDealerReview({
      dealerCompanyName: companyName,
      authorName: reviewName.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
    });
    setReviewName("");
    setReviewRating(0);
    setReviewText("");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-mesh">
        <SubpageHeader />
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen bg-mesh">
        <SubpageHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 text-center">
          <p className="text-gray-400 text-lg">Händler nicht gefunden.</p>
          <Link href="/haendler" className="mt-4 inline-block text-[#f14011] font-semibold hover:underline">
            Zurück zur Übersicht &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

      {/* Profile Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-wider text-gray-900 animate-fade-in-up">
              {dealer.companyName}
            </h1>
            <p className="text-gray-500 mt-2 text-lg">{dealer.zip} {dealer.city}</p>
            <div className="flex items-center gap-2 mt-2">
              {dealer.averageRating > 0 ? (
                <>
                  <StarRating rating={dealer.averageRating} />
                  <span className="text-sm text-gray-500">
                    {dealer.averageRating.toFixed(1)} ({dealer.reviewCount} {dealer.reviewCount === 1 ? "Bewertung" : "Bewertungen"})
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Noch keine Bewertungen</span>
              )}
            </div>
          </div>
          <button
            onClick={() => toggleSavedDealer(companyName)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              isSavedDealer(companyName)
                ? "bg-[#f14011] text-white"
                : "bg-white dark:bg-[#141414] border border-gray-200 text-gray-600 hover:border-[#f14011] hover:text-[#f14011]"
            }`}
          >
            {isSavedDealer(companyName) ? "Gespeichert" : "Händler speichern"}
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 card p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Kontakt</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
            <div>
              <span className="text-gray-400">Ansprechpartner:</span>{" "}
              {dealer.contactName}
            </div>
            <div>
              <span className="text-gray-400">Telefon:</span>{" "}
              <a href={`tel:${dealer.contactPhone}`} className="text-[#f14011] hover:underline">
                {dealer.contactPhone}
              </a>
            </div>
            <div>
              <span className="text-gray-400">E-Mail:</span>{" "}
              <a href={`mailto:${dealer.contactEmail}`} className="text-[#f14011] hover:underline">
                {dealer.contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <h2 className="font-display text-2xl tracking-wider text-gray-900 mb-4">
          Fahrzeuge ({vehicles.length})
        </h2>
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="card overflow-hidden group">
                <div className={`h-40 bg-gradient-to-br ${v.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-white/15 text-5xl tracking-wider select-none">
                      {v.brand}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-gray-900 tracking-wide">
                    {v.brand} {v.model}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">{v.variant} &middot; {v.year}</p>
                  <p className="font-display text-xl text-[#f14011] mt-2">
                    {v.price.toLocaleString("de-DE")} &euro;
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-sm text-gray-500">
                    <span>{v.mileage.toLocaleString("de-DE")} km</span>
                    <span>{v.powerPs} PS</span>
                    <span>{v.fuelType}</span>
                    <span>{v.city}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Link href="/inserate" className="text-sm text-[#f14011] font-semibold hover:underline">
                      In Inseraten ansehen &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Keine Fahrzeuge vorhanden.</p>
        )}
      </section>

      {/* Map */}
      {coords && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="font-display text-2xl tracking-wider text-gray-900 mb-4">Standort</h2>
          <LocationMap lat={coords.lat} lng={coords.lng} label={`${dealer.companyName} – ${dealer.city}`} />
        </section>
      )}

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="font-display text-2xl tracking-wider text-gray-900 mb-4">
          Bewertungen ({reviews.length})
        </h2>

        {/* Review Form */}
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Bewertung abgeben</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Dein Name"
              className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Bewertung:</span>
              <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Deine Erfahrung mit diesem Händler..."
              rows={3}
              className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors resize-none"
            />
            <button
              onClick={handleSubmitReview}
              disabled={!reviewName.trim() || reviewRating === 0 || !reviewText.trim()}
              className="px-5 py-2.5 bg-[#f14011] text-white text-sm font-semibold rounded-full hover:bg-[#d93a0e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Bewertung absenden
            </button>
          </div>
        </div>

        {/* Review List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{review.authorName}</span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{review.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Noch keine Bewertungen vorhanden. Sei der Erste!</p>
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
