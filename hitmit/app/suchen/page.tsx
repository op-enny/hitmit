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
  yearOptions,
  mileageOptions,
  powerOptions,
  transmissionOptions,
  driveTypeOptions,
  sellerTypeOptions,
  colorOptions,
  conditionOptions,
  doorOptions,
  seatOptions,
} from "../vehicles-data";
import type { Vehicle } from "../vehicles-data";
import { useSavedData } from "../use-saved-data";
import { calculateValuation, PRICE_RATING_INFO } from "../valuation";

// ============================================================================
// STATIC OPTIONS
// ============================================================================

const vehicleCategoryOptions = ["Alle", "Limousine", "Kombi", "Schrägheck", "SUV", "Geländewagen", "Sportwagen", "Coupé", "Cabrio", "Van / Minibus", "Pick-up"];

// ============================================================================
// ICONS
// ============================================================================

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);

// ============================================================================
// FILTER SELECT COMPONENT
// ============================================================================

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 dark:text-gray-300 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
        >
          {options.map((o) => (
            <option key={String(o.value)} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

// ============================================================================
// PRICE RATING BADGE
// ============================================================================

function PriceRatingBadge({ vehicle }: { vehicle: Vehicle }) {
  const v = calculateValuation({
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    accidentFree: vehicle.accidentFree,
    askingPrice: vehicle.price,
  });
  const info = PRICE_RATING_INFO[v.preisRating];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${info.bgColor} ${info.color}`}>
      {info.label}
    </span>
  );
}

// ============================================================================
// RESULT CARD
// ============================================================================

function ResultCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/inserate`} className="block">
      <div className="card cursor-pointer overflow-hidden group">
        <div className={`h-40 bg-gradient-to-br ${vehicle.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-white/15 text-5xl tracking-wider select-none group-hover:scale-110 transition-transform duration-500">
              {vehicle.brand}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vehicle.sellerType === "dealer" ? "bg-[#f14011] text-white" : "bg-white/90 text-gray-800"}`}>
              {vehicle.sellerType === "dealer" ? "Händler" : "Privat"}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg text-gray-900 dark:text-gray-100 tracking-wide">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">{vehicle.variant} · {vehicle.year}</p>
            </div>
            <PriceRatingBadge vehicle={vehicle} />
          </div>
          <p className="font-display text-xl text-[#f14011] mt-2">
            {vehicle.price.toLocaleString("de-DE")} €
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{vehicle.mileage.toLocaleString("de-DE")} km</span>
            <span>{vehicle.powerPs} PS</span>
            <span>{vehicle.fuelType}</span>
            <span>{vehicle.transmission}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
            <span className="text-gray-400">{vehicle.city}</span>
            <span className="text-[#f14011] font-semibold group-hover:translate-x-0.5 transition-transform">Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// MAIN SEARCH PAGE
// ============================================================================

export default function SuchenPage() {
  // Basic filters
  const [brandFilter, setBrandFilter] = useState("Alle Marken");
  const [fuelFilter, setFuelFilter] = useState("Alle Kraftstoffe");
  const [priceFilter, setPriceFilter] = useState(0);

  // Extended filters
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [mileageFilter, setMileageFilter] = useState(0);
  const [powerFilter, setPowerFilter] = useState(0);
  const [transmissionFilter, setTransmissionFilter] = useState("Alle");
  const [driveTypeFilter, setDriveTypeFilter] = useState("Alle");
  const [sellerTypeFilter, setSellerTypeFilter] = useState("Alle");
  const [accidentFreeFilter, setAccidentFreeFilter] = useState("Alle");
  const [cityFilter, setCityFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("Alle Farben");
  const [conditionFilter, setConditionFilter] = useState("Alle");
  const [doorFilter, setDoorFilter] = useState("Alle");
  const [seatFilter, setSeatFilter] = useState("Alle");

  // Search saved state
  const [searchSaved, setSearchSaved] = useState(false);
  const { mounted, saveSearch } = useSavedData();

  // Filter logic
  const filtered = vehicles.filter((v) => {
    if (brandFilter !== "Alle Marken" && v.brand !== brandFilter) return false;
    if (fuelFilter !== "Alle Kraftstoffe" && v.fuelType !== fuelFilter) return false;
    const range = priceRanges[priceFilter];
    if (v.price < range.min || v.price >= range.max) return false;
    if (yearFrom !== "" && v.year < Number(yearFrom)) return false;
    if (yearTo !== "" && v.year > Number(yearTo)) return false;
    if (mileageFilter !== 0 && v.mileage > mileageOptions[mileageFilter].max) return false;
    if (powerFilter !== 0 && v.powerPs < powerOptions[powerFilter].min) return false;
    if (transmissionFilter !== "Alle") {
      const t = v.transmission.toLowerCase();
      if (transmissionFilter === "Automatik" && !t.includes("automatik") && !t.includes("dsg") && !t.includes("pdk") && !t.includes("tronic") && !t.includes("s tronic")) return false;
      if (transmissionFilter === "Schaltung" && (t.includes("automatik") || t.includes("dsg") || t.includes("pdk") || t.includes("tronic") || t.includes("s tronic"))) return false;
    }
    if (driveTypeFilter !== "Alle") {
      const d = v.driveType.toLowerCase();
      if (driveTypeFilter === "Frontantrieb" && !d.includes("front")) return false;
      if (driveTypeFilter === "Hinterradantrieb" && !d.includes("hinter")) return false;
      if (driveTypeFilter === "Allrad" && !d.includes("allrad") && !d.includes("quattro") && !d.includes("awd") && !d.includes("4wd")) return false;
    }
    if (sellerTypeFilter !== "Alle") {
      if (sellerTypeFilter === "Privat" && v.sellerType !== "private") return false;
      if (sellerTypeFilter === "Händler" && v.sellerType !== "dealer") return false;
    }
    if (accidentFreeFilter === "Nur unfallfrei" && !v.accidentFree) return false;
    if (cityFilter !== "" && !v.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (colorFilter !== "Alle Farben" && !v.color.toLowerCase().includes(colorFilter.toLowerCase())) return false;
    if (conditionFilter !== "Alle" && v.condition !== conditionFilter) return false;
    if (doorFilter !== "Alle") {
      if (doorFilter === "2/3" && !["2", "3"].includes(v.doors)) return false;
      if (doorFilter === "4/5" && !["4", "5"].includes(v.doors)) return false;
      if (doorFilter === "6/7" && !["6", "7"].includes(v.doors)) return false;
    }
    if (seatFilter !== "Alle" && v.seats !== seatFilter) return false;
    return true;
  });

  const activeFilterCount = [
    brandFilter !== "Alle Marken",
    fuelFilter !== "Alle Kraftstoffe",
    priceFilter !== 0,
    yearFrom !== "",
    yearTo !== "",
    mileageFilter !== 0,
    powerFilter !== 0,
    transmissionFilter !== "Alle",
    driveTypeFilter !== "Alle",
    sellerTypeFilter !== "Alle",
    accidentFreeFilter !== "Alle",
    cityFilter !== "",
    colorFilter !== "Alle Farben",
    conditionFilter !== "Alle",
    doorFilter !== "Alle",
    seatFilter !== "Alle",
  ].filter(Boolean).length;

  const resetAll = () => {
    setBrandFilter("Alle Marken");
    setFuelFilter("Alle Kraftstoffe");
    setPriceFilter(0);
    setYearFrom(""); setYearTo("");
    setMileageFilter(0); setPowerFilter(0);
    setTransmissionFilter("Alle"); setDriveTypeFilter("Alle");
    setSellerTypeFilter("Alle"); setAccidentFreeFilter("Alle");
    setCityFilter("");
    setColorFilter("Alle Farben"); setConditionFilter("Alle");
    setDoorFilter("Alle"); setSeatFilter("Alle");
  };

  const handleSaveSearch = () => {
    const parts: string[] = [];
    if (brandFilter !== "Alle Marken") parts.push(brandFilter);
    if (fuelFilter !== "Alle Kraftstoffe") parts.push(fuelFilter);
    if (priceFilter !== 0) parts.push(priceRanges[priceFilter].label);
    if (yearFrom) parts.push(`ab ${yearFrom}`);
    if (yearTo) parts.push(`bis ${yearTo}`);
    if (mileageFilter !== 0) parts.push(mileageOptions[mileageFilter].label);
    if (powerFilter !== 0) parts.push(powerOptions[powerFilter].label);
    if (transmissionFilter !== "Alle") parts.push(transmissionFilter);
    if (driveTypeFilter !== "Alle") parts.push(driveTypeFilter);
    if (sellerTypeFilter !== "Alle") parts.push(sellerTypeFilter);
    if (accidentFreeFilter !== "Alle") parts.push("Unfallfrei");
    if (cityFilter) parts.push(cityFilter);
    if (colorFilter !== "Alle Farben") parts.push(colorFilter);
    if (conditionFilter !== "Alle") parts.push(conditionFilter);
    if (doorFilter !== "Alle") parts.push(`${doorFilter} Türen`);
    if (seatFilter !== "Alle") parts.push(`${seatFilter} Sitze`);
    const label = parts.length > 0 ? parts.join(", ") : "Alle Fahrzeuge";
    saveSearch(
      label,
      {
        brandFilter, fuelFilter, priceFilter,
        yearFrom, yearTo,
        mileageFilter, powerFilter,
        transmissionFilter, driveTypeFilter,
        sellerTypeFilter, accidentFreeFilter,
        cityFilter,
        colorFilter, conditionFilter,
        doorFilter, seatFilter,
      },
      filtered.map((v) => v.id),
    );
    setSearchSaved(true);
    setTimeout(() => setSearchSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/hitmit-logo.png" alt="HITMIT" width={40} height={40} className="rounded-lg" />
            <span className="font-display text-2xl tracking-wider text-gray-900 dark:text-gray-100">HITMIT</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/inserate" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#f14011] transition-colors">
              Inserate
            </Link>
            <Link href="/gespeichert" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#f14011] transition-colors">
              Gespeichert
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#f14011] transition-colors">
              Startseite
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
          <SearchIcon className="w-8 h-8 text-[#f14011]" />
          <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-gray-900 dark:text-gray-100">
            Fahrzeugsuche
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl text-lg animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          Finde dein Traumauto — filtere nach allen Kriterien und entdecke passende Angebote.
        </p>
      </section>

      {/* Filter Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-6 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          {/* Section: Fahrzeug */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Fahrzeug</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label="Marke"
              value={brandFilter}
              onChange={setBrandFilter}
              options={brandOptions.map((b) => ({ value: b, label: b }))}
            />
            <FilterSelect
              label="Kraftstoff"
              value={fuelFilter}
              onChange={setFuelFilter}
              options={fuelOptions.map((f) => ({ value: f, label: f }))}
            />
            <FilterSelect
              label="Zustand"
              value={conditionFilter}
              onChange={setConditionFilter}
              options={conditionOptions.map((c) => ({ value: c, label: c }))}
            />
            <FilterSelect
              label="Farbe"
              value={colorFilter}
              onChange={setColorFilter}
              options={colorOptions.map((c) => ({ value: c, label: c }))}
            />
          </div>

          {/* Section: Preis & Leistung */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Preis & Leistung</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label="Preis"
              value={priceFilter}
              onChange={(v) => setPriceFilter(Number(v))}
              options={priceRanges.map((r, i) => ({ value: i, label: r.label }))}
            />
            <FilterSelect
              label="Leistung"
              value={powerFilter}
              onChange={(v) => setPowerFilter(Number(v))}
              options={powerOptions.map((p, i) => ({ value: i, label: p.label }))}
            />
            <FilterSelect
              label="Kilometerstand"
              value={mileageFilter}
              onChange={(v) => setMileageFilter(Number(v))}
              options={mileageOptions.map((m, i) => ({ value: i, label: m.label }))}
            />
            <FilterSelect
              label="Getriebe"
              value={transmissionFilter}
              onChange={setTransmissionFilter}
              options={transmissionOptions.map((t) => ({ value: t, label: t }))}
            />
          </div>

          {/* Section: Details */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label="Baujahr von"
              value={yearFrom}
              onChange={setYearFrom}
              options={[{ value: "", label: "Alle" }, ...yearOptions.map((y) => ({ value: String(y), label: String(y) }))]}
            />
            <FilterSelect
              label="Baujahr bis"
              value={yearTo}
              onChange={setYearTo}
              options={[{ value: "", label: "Alle" }, ...yearOptions.map((y) => ({ value: String(y), label: String(y) }))]}
            />
            <FilterSelect
              label="Antrieb"
              value={driveTypeFilter}
              onChange={setDriveTypeFilter}
              options={driveTypeOptions.map((d) => ({ value: d, label: d }))}
            />
            <FilterSelect
              label="Türen"
              value={doorFilter}
              onChange={setDoorFilter}
              options={doorOptions.map((d) => ({ value: d, label: d }))}
            />
            <FilterSelect
              label="Sitze"
              value={seatFilter}
              onChange={setSeatFilter}
              options={seatOptions.map((s) => ({ value: s, label: s }))}
            />
            <FilterSelect
              label="Verkäufertyp"
              value={sellerTypeFilter}
              onChange={setSellerTypeFilter}
              options={sellerTypeOptions.map((s) => ({ value: s, label: s }))}
            />
            <FilterSelect
              label="Unfallfrei"
              value={accidentFreeFilter}
              onChange={setAccidentFreeFilter}
              options={[{ value: "Alle", label: "Alle" }, { value: "Nur unfallfrei", label: "Nur unfallfrei" }]}
            />
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Standort (Stadt)</label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="z.B. München"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-display text-2xl text-[#f14011]">{filtered.length}</span>
              <span>{filtered.length === 1 ? "Fahrzeug" : "Fahrzeuge"} gefunden</span>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={resetAll} className="text-sm text-[#f14011] font-semibold hover:underline">
                Alle Filter zurücksetzen
              </button>
            )}

            <div className="ml-auto">
              {mounted && (
                <button
                  onClick={handleSaveSearch}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                    searchSaved
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                      : "bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-[#f14011] hover:text-[#f14011]"
                  }`}
                >
                  {searchSaved ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Gespeichert!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      Suche speichern
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${(index + 4) * 100}ms` }}
              >
                <ResultCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg">Keine Fahrzeuge gefunden.</p>
            <button onClick={resetAll} className="mt-4 text-[#f14011] font-semibold hover:underline">
              Filter zurücksetzen
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#2a2a2a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
