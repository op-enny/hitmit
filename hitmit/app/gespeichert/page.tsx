"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import {
  vehicles,
  brandOptions,
  fuelOptions,
  priceRanges,
  mileageOptions,
  powerOptions,
} from "../vehicles-data";
import type { Vehicle } from "../vehicles-data";
import { useSavedData } from "../use-saved-data";
import type { SavedSearch } from "../use-saved-data";

// ============================================================================
// HELPERS
// ============================================================================

function applyFilters(filters: SavedSearch["filters"]): Vehicle[] {
  return vehicles.filter((v) => {
    if (filters.brandFilter !== "Alle Marken" && v.brand !== filters.brandFilter) return false;
    if (filters.fuelFilter !== "Alle Kraftstoffe" && v.fuelType !== filters.fuelFilter) return false;
    const range = priceRanges[filters.priceFilter];
    if (range && (v.price < range.min || v.price >= range.max)) return false;
    // New filters (backwards-compatible: old saved searches won't have these fields)
    if (filters.yearFrom && v.year < Number(filters.yearFrom)) return false;
    if (filters.yearTo && v.year > Number(filters.yearTo)) return false;
    if (filters.mileageFilter && filters.mileageFilter !== 0) {
      const ml = mileageOptions[filters.mileageFilter];
      if (ml && v.mileage > ml.max) return false;
    }
    if (filters.powerFilter && filters.powerFilter !== 0) {
      const pw = powerOptions[filters.powerFilter];
      if (pw && v.powerPs < pw.min) return false;
    }
    if (filters.transmissionFilter && filters.transmissionFilter !== "Alle") {
      const t = v.transmission.toLowerCase();
      if (filters.transmissionFilter === "Automatik" && !t.includes("automatik") && !t.includes("dsg") && !t.includes("pdk") && !t.includes("tronic") && !t.includes("s tronic")) return false;
      if (filters.transmissionFilter === "Schaltung" && (t.includes("automatik") || t.includes("dsg") || t.includes("pdk") || t.includes("tronic") || t.includes("s tronic"))) return false;
    }
    if (filters.driveTypeFilter && filters.driveTypeFilter !== "Alle") {
      const d = v.driveType.toLowerCase();
      if (filters.driveTypeFilter === "Frontantrieb" && !d.includes("front")) return false;
      if (filters.driveTypeFilter === "Hinterradantrieb" && !d.includes("hinter")) return false;
      if (filters.driveTypeFilter === "Allrad" && !d.includes("allrad") && !d.includes("quattro") && !d.includes("awd") && !d.includes("4wd")) return false;
    }
    if (filters.sellerTypeFilter && filters.sellerTypeFilter !== "Alle") {
      if (filters.sellerTypeFilter === "Privat" && v.sellerType !== "private") return false;
      if (filters.sellerTypeFilter === "Händler" && v.sellerType !== "dealer") return false;
    }
    if (filters.accidentFreeFilter === "Nur unfallfrei" && !v.accidentFree) return false;
    if (filters.cityFilter && !v.city.toLowerCase().includes(filters.cityFilter.toLowerCase())) return false;
    if (filters.colorFilter && filters.colorFilter !== "Alle Farben" && !v.color.toLowerCase().includes(filters.colorFilter.toLowerCase())) return false;
    if (filters.conditionFilter && filters.conditionFilter !== "Alle" && v.condition !== filters.conditionFilter) return false;
    if (filters.doorFilter && filters.doorFilter !== "Alle") {
      if (filters.doorFilter === "2/3" && !["2", "3"].includes(v.doors)) return false;
      if (filters.doorFilter === "4/5" && !["4", "5"].includes(v.doors)) return false;
      if (filters.doorFilter === "6/7" && !["6", "7"].includes(v.doors)) return false;
    }
    if (filters.seatFilter && filters.seatFilter !== "Alle" && v.seats !== filters.seatFilter) return false;
    return true;
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildSearchUrl(filters: SavedSearch["filters"]): string {
  const params = new URLSearchParams();
  if (filters.brandFilter !== "Alle Marken") params.set("brand", filters.brandFilter);
  if (filters.fuelFilter !== "Alle Kraftstoffe") params.set("fuel", filters.fuelFilter);
  if (filters.priceFilter !== 0) params.set("price", String(filters.priceFilter));
  if (filters.yearFrom) params.set("yearFrom", filters.yearFrom);
  if (filters.yearTo) params.set("yearTo", filters.yearTo);
  if (filters.mileageFilter && filters.mileageFilter !== 0) params.set("mileage", String(filters.mileageFilter));
  if (filters.powerFilter && filters.powerFilter !== 0) params.set("power", String(filters.powerFilter));
  if (filters.transmissionFilter && filters.transmissionFilter !== "Alle") params.set("transmission", filters.transmissionFilter);
  if (filters.driveTypeFilter && filters.driveTypeFilter !== "Alle") params.set("driveType", filters.driveTypeFilter);
  if (filters.sellerTypeFilter && filters.sellerTypeFilter !== "Alle") params.set("sellerType", filters.sellerTypeFilter);
  if (filters.accidentFreeFilter === "Nur unfallfrei") params.set("accidentFree", "ja");
  if (filters.cityFilter) params.set("city", filters.cityFilter);
  if (filters.colorFilter && filters.colorFilter !== "Alle Farben") params.set("color", filters.colorFilter);
  if (filters.conditionFilter && filters.conditionFilter !== "Alle") params.set("condition", filters.conditionFilter);
  if (filters.doorFilter && filters.doorFilter !== "Alle") params.set("doors", filters.doorFilter);
  if (filters.seatFilter && filters.seatFilter !== "Alle") params.set("seats", filters.seatFilter);
  const qs = params.toString();
  return qs ? `/inserate?${qs}` : "/inserate";
}

// ============================================================================
// SEARCH CARD
// ============================================================================

function SearchCard({
  search,
  onRemove,
  onMarkSeen,
}: {
  search: SavedSearch;
  onRemove: () => void;
  onMarkSeen: (ids: number[]) => void;
}) {
  const currentMatches = applyFilters(search.filters);
  const currentIds = currentMatches.map((v) => v.id);
  const newIds = currentIds.filter((id) => !search.seenVehicleIds.includes(id));
  const newCount = newIds.length;

  const filterTags: string[] = [];
  const f = search.filters;
  if (f.brandFilter !== "Alle Marken") filterTags.push(f.brandFilter);
  if (f.fuelFilter !== "Alle Kraftstoffe") filterTags.push(f.fuelFilter);
  if (f.priceFilter !== 0) filterTags.push(priceRanges[f.priceFilter]?.label ?? "");
  if (f.yearFrom) filterTags.push(`ab ${f.yearFrom}`);
  if (f.yearTo) filterTags.push(`bis ${f.yearTo}`);
  if (f.mileageFilter && f.mileageFilter !== 0) filterTags.push(mileageOptions[f.mileageFilter]?.label ?? "");
  if (f.powerFilter && f.powerFilter !== 0) filterTags.push(powerOptions[f.powerFilter]?.label ?? "");
  if (f.transmissionFilter && f.transmissionFilter !== "Alle") filterTags.push(f.transmissionFilter);
  if (f.driveTypeFilter && f.driveTypeFilter !== "Alle") filterTags.push(f.driveTypeFilter);
  if (f.sellerTypeFilter && f.sellerTypeFilter !== "Alle") filterTags.push(f.sellerTypeFilter);
  if (f.accidentFreeFilter === "Nur unfallfrei") filterTags.push("Unfallfrei");
  if (f.cityFilter) filterTags.push(f.cityFilter);
  if (f.colorFilter && f.colorFilter !== "Alle Farben") filterTags.push(f.colorFilter);
  if (f.conditionFilter && f.conditionFilter !== "Alle") filterTags.push(f.conditionFilter);
  if (f.doorFilter && f.doorFilter !== "Alle") filterTags.push(`${f.doorFilter} Türen`);
  if (f.seatFilter && f.seatFilter !== "Alle") filterTags.push(`${f.seatFilter} Sitze`);

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{search.label}</h3>
            {newCount > 0 && (
              <span className="px-2 py-0.5 bg-[#f14011] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                {newCount} neu
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Gespeichert am {formatDate(search.createdAt)} &middot; {currentMatches.length} {currentMatches.length === 1 ? "Treffer" : "Treffer"}
          </p>
          {filterTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filterTags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
          aria-label="Suche löschen"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Link
          href={buildSearchUrl(search.filters)}
          onClick={() => onMarkSeen(currentIds)}
          className="px-4 py-2 bg-[#f14011] text-white text-sm font-semibold rounded-full hover:bg-[#d93a0e] transition-colors"
        >
          Anzeigen
        </Link>
        {newCount > 0 && (
          <button
            onClick={() => onMarkSeen(currentIds)}
            className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-500 rounded-full hover:border-gray-400 transition-colors"
          >
            Als gesehen markieren
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FAVORITE CARD
// ============================================================================

function FavoriteCard({
  vehicle,
  onRemove,
}: {
  vehicle: Vehicle;
  onRemove: () => void;
}) {
  return (
    <div className="card overflow-hidden group">
      <div className={`h-40 bg-gradient-to-br ${vehicle.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-white/15 text-5xl tracking-wider select-none">
            {vehicle.brand}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors z-10"
          aria-label="Favorit entfernen"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#f14011" stroke="#f14011" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              vehicle.sellerType === "dealer"
                ? "bg-[#f14011] text-white"
                : "bg-white/90 text-gray-800"
            }`}
          >
            {vehicle.sellerType === "dealer" ? "Händler" : "Privat"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-gray-900 tracking-wide">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">{vehicle.variant} &middot; {vehicle.year}</p>
        <p className="font-display text-xl text-[#f14011] mt-2">
          {vehicle.price.toLocaleString("de-DE")} &euro;
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-sm text-gray-500">
          <span>{vehicle.mileage.toLocaleString("de-DE")} km</span>
          <span>{vehicle.powerPs} PS</span>
          <span>{vehicle.fuelType}</span>
          <span>{vehicle.city}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link
            href="/inserate"
            className="text-sm text-[#f14011] font-semibold hover:underline"
          >
            In Inseraten ansehen &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function GespeichertPage() {
  const [activeTab, setActiveTab] = useState<"searches" | "favorites">("searches");
  const { mounted, savedSearches, favorites, removeSearch, markSearchSeen, toggleFavorite } = useSavedData();

  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-mesh">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/hitmit-logo.png" alt="HITMIT" width={40} height={40} className="rounded-lg" />
              <span className="font-display text-2xl tracking-wider text-gray-900">HITMIT</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9" />
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/hitmit-logo.png" alt="HITMIT" width={40} height={40} className="rounded-lg" />
            <span className="font-display text-2xl tracking-wider text-gray-900">HITMIT</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/inserate"
              className="text-sm font-medium text-gray-500 hover:text-[#f14011] transition-colors"
            >
              &larr; Inserate
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-gray-900 animate-fade-in-up">
          Gespeichert
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl text-lg animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          Deine gespeicherten Suchen und favorisierten Fahrzeuge auf einen Blick.
        </p>
      </section>

      {/* Tab Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex gap-2 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          <button
            onClick={() => setActiveTab("searches")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "searches"
                ? "bg-[#f14011] text-white"
                : "bg-white dark:bg-[#141414] border border-gray-200 text-gray-600 hover:border-[#f14011] hover:text-[#f14011]"
            }`}
          >
            Gespeicherte Suchen ({savedSearches.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "favorites"
                ? "bg-[#f14011] text-white"
                : "bg-white dark:bg-[#141414] border border-gray-200 text-gray-600 hover:border-[#f14011] hover:text-[#f14011]"
            }`}
          >
            Favoriten ({favoriteVehicles.length})
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {activeTab === "searches" ? (
          savedSearches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSearches.map((search, index) => (
                <div
                  key={search.id}
                  className="animate-fade-in-up"
                  style={{ opacity: 0, animationDelay: `${(index + 3) * 100}ms` }}
                >
                  <SearchCard
                    search={search}
                    onRemove={() => removeSearch(search.id)}
                    onMarkSeen={(ids) => markSearchSeen(search.id, ids)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-gray-400 text-lg">Noch keine Suchen gespeichert.</p>
              <Link
                href="/inserate"
                className="mt-4 inline-block text-[#f14011] font-semibold hover:underline"
              >
                Jetzt Inserate durchsuchen &rarr;
              </Link>
            </div>
          )
        ) : favoriteVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${(index + 3) * 100}ms` }}
              >
                <FavoriteCard
                  vehicle={vehicle}
                  onRemove={() => toggleFavorite(vehicle.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="text-gray-400 text-lg">Noch keine Favoriten gespeichert.</p>
            <Link
              href="/inserate"
              className="mt-4 inline-block text-[#f14011] font-semibold hover:underline"
            >
              Jetzt Inserate entdecken &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
