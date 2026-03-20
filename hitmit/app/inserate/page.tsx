"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { calculateValuation, PRICE_RATING_INFO } from "../valuation";
import type { ValuationBreakdown, PriceRating } from "../valuation";
import { calculateTireScore, TIRE_RATING_INFO } from "../tire-score";
import { SubpageHeader } from "../subpage-header";
import { getCoordsByCity } from "../geocoding";

const LocationMap = dynamic(() => import("../location-map"), { ssr: false });
import {
  vehicles,
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
  vehicleTypeOptions,
  vehicleCategoryOptions,
  cylinderOptions,
  interiorColorOptions,
  seatMaterialOptions,
  emissionClassOptions,
  environmentalBadgeOptions,
  particleFilterOptions,
  MERCEDES_MOTORIZATIONS,
  getBrandOptionsForType,
  getModelsForBrand,
  getCategoriesForType,
  getDriveTypeOptionsForType,
  getCylinderOptionsForType,
  getDoorOptionsForType,
  getSeatOptionsForType,
  isFieldVisibleForType,
} from "../vehicles-data";
import type { Vehicle } from "../vehicles-data";
import { useSavedData } from "../use-saved-data";


// ============================================================================
// DAMAGE MAP (read-only)
// ============================================================================

const DAMAGE_ZONES = [
  { id: "frontLeft", label: "Vorne links", x: 62, y: 18 },
  { id: "frontCenter", label: "Vorne Mitte", x: 50, y: 10 },
  { id: "frontRight", label: "Vorne rechts", x: 38, y: 18 },
  { id: "leftFront", label: "Seite links vorne", x: 72, y: 38 },
  { id: "leftRear", label: "Seite links hinten", x: 72, y: 62 },
  { id: "rightFront", label: "Seite rechts vorne", x: 28, y: 38 },
  { id: "rightRear", label: "Seite rechts hinten", x: 28, y: 62 },
  { id: "roof", label: "Dach", x: 50, y: 50 },
  { id: "rearLeft", label: "Hinten links", x: 62, y: 82 },
  { id: "rearCenter", label: "Hinten Mitte", x: 50, y: 90 },
  { id: "rearRight", label: "Hinten rechts", x: 38, y: 82 },
];

function ReadOnlyDamageMap({
  damageMap,
  paintThickness,
}: {
  damageMap?: Record<string, string>;
  paintThickness?: Record<string, string>;
}) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const hasDamages = damageMap && Object.keys(damageMap).length > 0;

  // Map paintThickness keys to zone IDs for overlay
  const PAINT_ZONE_MAP: Record<string, string> = {
    "Motorhaube": "frontCenter",
    "Kotflügel vorne links": "leftFront",
    "Kotflügel vorne rechts": "rightFront",
    "Fahrertür": "leftRear",
    "Beifahrertür": "rightFront",
    "Kotflügel hinten links": "leftRear",
    "Kotflügel hinten rechts": "rearRight",
    "Heckklappe": "rearCenter",
    "Dach": "roof",
  };

  function getPaintColor(value: string): string {
    const num = parseInt(value);
    if (num < 80) return "#9ca3af";
    if (num <= 130) return "#22c55e";
    if (num <= 250) return "#eab308";
    if (num <= 400) return "#f97316";
    return "#ef4444";
  }

  // Build paint thickness by zone ID
  const paintByZone: Record<string, { label: string; value: string }> = {};
  if (paintThickness) {
    for (const [label, value] of Object.entries(paintThickness)) {
      const zoneId = PAINT_ZONE_MAP[label];
      if (zoneId) {
        paintByZone[zoneId] = { label, value };
      }
    }
  }

  const selectedInfo = selectedZone ? DAMAGE_ZONES.find((z) => z.id === selectedZone) : null;
  const selectedDamage = selectedZone && damageMap ? damageMap[selectedZone] : null;
  const selectedPaint = selectedZone ? paintByZone[selectedZone] : null;

  return (
    <div>
      <div className="relative bg-gray-50 dark:bg-[#1f1f1f] rounded-2xl p-4" style={{ minHeight: 320 }}>
        <svg viewBox="0 0 100 100" className="w-full max-w-[320px] mx-auto" style={{ height: 280 }}>
          <defs>
            <linearGradient id="carBodyRO" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="100%" stopColor="#d4d4d4" />
            </linearGradient>
            <linearGradient id="glassRO" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>

          {/* Car body */}
          <path
            d="M 35 8 Q 35 5 38 5 L 62 5 Q 65 5 65 8
               L 67 20 Q 68 22 70 23 L 72 24 Q 74 25 74 28
               L 74 72 Q 74 75 72 76 L 70 77 Q 68 78 67 80
               L 65 92 Q 65 95 62 95 L 38 95 Q 35 95 35 92
               L 33 80 Q 32 78 30 77 L 28 76 Q 26 75 26 72
               L 26 28 Q 26 25 28 24 L 30 23 Q 32 22 33 20 Z"
            fill="url(#carBodyRO)" stroke="#a3a3a3" strokeWidth="0.8"
          />
          {/* Hood */}
          <path d="M 37 8 Q 37 6 39 6 L 61 6 Q 63 6 63 8 L 64 18 Q 64 19 63 19 L 37 19 Q 36 19 36 18 Z" fill="#d4d4d4" stroke="#b0b0b0" strokeWidth="0.4" />
          {/* Windshield */}
          <path d="M 36 20 L 64 20 Q 65 20 65 21 L 66 29 Q 66 30 65 30 L 35 30 Q 34 30 34 29 L 35 21 Q 35 20 36 20 Z" fill="url(#glassRO)" stroke="#7daadb" strokeWidth="0.5" opacity="0.85" />
          {/* Roof */}
          <path d="M 35 31 L 65 31 Q 66 31 66 32 L 66 68 Q 66 69 65 69 L 35 69 Q 34 69 34 68 L 34 32 Q 34 31 35 31 Z" fill="#d9d9d9" stroke="#b0b0b0" strokeWidth="0.4" />
          {/* Rear window */}
          <path d="M 35 70 L 65 70 Q 66 70 66 71 L 65 79 Q 65 80 64 80 L 36 80 Q 35 80 34 79 L 34 71 Q 34 70 35 70 Z" fill="url(#glassRO)" stroke="#7daadb" strokeWidth="0.5" opacity="0.85" />
          {/* Trunk */}
          <path d="M 36 81 L 64 81 Q 64 81 64 82 L 63 92 Q 63 93 62 93 L 38 93 Q 37 93 37 92 L 36 82 Q 36 81 36 81 Z" fill="#d4d4d4" stroke="#b0b0b0" strokeWidth="0.4" />
          {/* Mirrors */}
          <ellipse cx="74" cy="26" rx="3" ry="2" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="0.4" />
          <ellipse cx="26" cy="26" rx="3" ry="2" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="0.4" />
          {/* Wheels */}
          <rect x="70" y="14" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          <rect x="70" y="72" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          <rect x="23" y="14" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          <rect x="23" y="72" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          {/* Rims */}
          <rect x="71.5" y="18" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          <rect x="71.5" y="76" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          <rect x="24.5" y="18" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          <rect x="24.5" y="76" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          {/* Headlights */}
          <ellipse cx="40" cy="7" rx="3" ry="1.2" fill="#fef08a" stroke="#eab308" strokeWidth="0.3" opacity="0.7" />
          <ellipse cx="60" cy="7" rx="3" ry="1.2" fill="#fef08a" stroke="#eab308" strokeWidth="0.3" opacity="0.7" />
          {/* Taillights */}
          <ellipse cx="40" cy="93" rx="3" ry="1.2" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.3" opacity="0.7" />
          <ellipse cx="60" cy="93" rx="3" ry="1.2" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.3" opacity="0.7" />
          {/* Pillar lines */}
          <line x1="36" y1="20" x2="34" y2="31" stroke="#b0b0b0" strokeWidth="0.3" />
          <line x1="64" y1="20" x2="66" y2="31" stroke="#b0b0b0" strokeWidth="0.3" />
          <line x1="36" y1="80" x2="34" y2="69" stroke="#b0b0b0" strokeWidth="0.3" />
          <line x1="64" y1="80" x2="66" y2="69" stroke="#b0b0b0" strokeWidth="0.3" />

          {/* Zone markers */}
          {DAMAGE_ZONES.map((zone) => {
            const isDamaged = damageMap?.[zone.id];
            const hasPaint = paintByZone[zone.id];
            const isSelected = selectedZone === zone.id;
            let fill = "rgba(120,120,120,0.35)";
            if (isDamaged) fill = "#f14011";
            else if (hasPaint) fill = getPaintColor(hasPaint.value);
            return (
              <g key={zone.id}>
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isDamaged || isSelected ? 4.5 : 3}
                  fill={fill}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedZone(isSelected ? null : zone.id)}
                />
                {isDamaged && (
                  <text x={zone.x} y={zone.y - 6} textAnchor="middle" fontSize="3.5" fill="#f14011" fontWeight="bold">!</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
        {hasDamages && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#f14011] inline-block" /> Schaden
          </span>
        )}
        {paintThickness && (
          <>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Lack OK</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Nachlackierung</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Spachtel</span>
          </>
        )}
      </div>

      {/* Selected zone detail */}
      {selectedInfo && (selectedDamage || selectedPaint) && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a]">
          <p className="text-sm font-semibold text-gray-900">{selectedInfo.label}</p>
          {selectedDamage && (
            <p className="text-sm text-red-600 mt-1">{selectedDamage}</p>
          )}
          {selectedPaint && (
            <p className="text-sm text-gray-600 mt-1">
              Lackdicke: <span className="font-mono font-semibold">{selectedPaint.value} µm</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PAINT THICKNESS INFO BUTTON
// ============================================================================

function PaintThicknessInfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#f14011] transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
        </svg>
        Was bedeuten die Werte?
      </button>
      {isOpen && (
        <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Referenztabelle Lackdickenmessung</h4>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold text-gray-500">Wert (µm)</th>
                <th className="text-left py-2 font-semibold text-gray-500">Bedeutung</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-mono font-semibold text-green-600">80 – 130</td>
                <td className="py-2">Werkslackierung (Originallack)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-mono font-semibold text-yellow-600">130 – 250</td>
                <td className="py-2">Nachlackiert (einfache Schicht)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-mono font-semibold text-orange-600">250 – 400</td>
                <td className="py-2">Mehrfach nachlackiert oder gespachtelt</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-mono font-semibold text-red-600">über 400</td>
                <td className="py-2">Starke Spachtelarbeiten / Unfallschaden</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono font-semibold text-gray-500">unter 80</td>
                <td className="py-2">Möglicher Schliff oder Polierung</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-3">Hinweis: Werte können je nach Hersteller und Fahrzeugtyp leicht variieren.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ICONS
// ============================================================================

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// ============================================================================
// MULTI-SELECT FILTER (checkboxes inside dropdown)
// ============================================================================

function MultiFilterSelect({
  label,
  selected,
  onChange,
  options,
}: {
  label: string;
  selected: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const display = selected.length === 0
    ? options[0]
    : selected.join(", ");

  const selectableOptions = options.slice(1);

  const dropdownContent = (
    <>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
        >
          Auswahl zurücksetzen
        </button>
      )}
      {selectableOptions.map((o) => (
        <label
          key={o}
          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-[#222] transition-colors cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(o)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, o]);
              } else {
                onChange(selected.filter((s) => s !== o));
              }
            }}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
          />
          <span className={selected.includes(o) ? "text-[#f14011] font-medium" : "text-gray-700 dark:text-gray-300"}>{o}</span>
        </label>
      ))}
    </>
  );

  return (
    <div ref={ref}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer text-left"
        >
          <span className="break-words whitespace-normal">{display}</span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {/* Desktop dropdown */}
        {open && (
          <div className="hidden sm:block absolute z-50 top-full mt-1 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
            {dropdownContent}
          </div>
        )}
      </div>
      {/* Mobile bottom sheet */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-[#1a1a1a] rounded-t-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#2a2a2a]">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{label}</span>
              <button type="button" onClick={() => setOpen(false)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto py-1">
              {dropdownContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PRICE RATING BADGE (public — for all users)
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
  const minPrice = Math.round(v.marktwert * 0.82);
  const maxPrice = Math.round(v.marktwert * 1.18);
  const range = maxPrice - minPrice;
  // Clamp marker position between 2% and 98%
  const markerPct = Math.max(2, Math.min(98, ((vehicle.price - minPrice) / range) * 100));

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${info.bgColor} ${info.color}`}>
          {info.label}
        </span>
        <span className="text-sm text-gray-500">
          Marktwert ca. {v.marktwert.toLocaleString("de-DE")} €
        </span>
      </div>
      {/* Price bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-300 to-red-400">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#141414] border-2 border-gray-800 rounded-full shadow-md -ml-2"
          style={{ left: `${markerPct}%` }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-1.5 text-xs text-gray-400">
        <span>{minPrice.toLocaleString("de-DE")} €</span>
        <span className="font-medium text-gray-500">{v.marktwert.toLocaleString("de-DE")} €</span>
        <span>{maxPrice.toLocaleString("de-DE")} €</span>
      </div>
    </div>
  );
}

function TireScoreBadge({ vehicle }: { vehicle: Vehicle }) {
  const frontRating = calculateTireScore(
    vehicle.tireDepthFront ?? "",
    vehicle.tireAgeFront ?? "",
    vehicle.tireDamageFront ?? null,
  );
  const rearRating = calculateTireScore(
    vehicle.tireDepthRear ?? "",
    vehicle.tireAgeRear ?? "",
    vehicle.tireDamageRear ?? null,
  );

  if (!frontRating && !rearRating) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Reifenzustand</h4>
      <div className="flex flex-wrap gap-3">
        {frontRating && (() => {
          const info = TIRE_RATING_INFO[frontRating];
          return (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Vorne:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${info.bgColor} ${info.color}`}>
                {info.label}
              </span>
            </div>
          );
        })()}
        {rearRating && (() => {
          const info = TIRE_RATING_INFO[rearRating];
          return (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Hinten:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${info.bgColor} ${info.color}`}>
                {info.label}
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ============================================================================
// DEALER PURCHASE PANEL (only for logged-in dealers)
// ============================================================================

function DealerPurchasePanel({ vehicle }: { vehicle: Vehicle }) {
  const [showDetails, setShowDetails] = useState(false);

  const v = calculateValuation({
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    accidentFree: vehicle.accidentFree,
    askingPrice: vehicle.price,
  });

  const fuelLabel =
    vehicle.fuelType.toLowerCase() === "elektro"
      ? "Elektro"
      : vehicle.fuelType.toLowerCase() === "diesel"
      ? "Diesel"
      : vehicle.fuelType.toLowerCase().includes("hybrid")
      ? "Plug-in-Hybrid"
      : "Benzin";

  return (
    <div className="border border-blue-200 bg-blue-50/60 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
          Händler
        </span>
        <span className="text-sm font-medium text-blue-900">Geschätzter Einkaufspreis</span>
      </div>

      <p className="text-3xl font-bold text-blue-900">
        {v.einkaufspreis.toLocaleString("de-DE")} €
      </p>
      <p className="text-sm text-blue-700 mt-1">
        Spanne: {v.einkaufMin.toLocaleString("de-DE")} € – {v.einkaufMax.toLocaleString("de-DE")} €
      </p>

      <button
        onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
        className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1"
      >
        {showDetails ? "Details ausblenden" : "Details anzeigen"}
        <svg
          className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDetails && (
        <div className="mt-3 bg-white dark:bg-[#141414] rounded-lg border border-blue-100 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-blue-50">
                <td className="px-3 py-2 text-gray-600">Neupreis (ca.)</td>
                <td className="px-3 py-2 text-right font-mono text-gray-800">
                  {v.neupreis.toLocaleString("de-DE")} €
                </td>
              </tr>
              <tr className="border-b border-blue-50">
                <td className="px-3 py-2 text-gray-600">
                  Alter ({v.alter} {v.alter === 1 ? "Jahr" : "Jahre"}, -{Math.round((1 - v.altersFaktor) * 100)}%)
                </td>
                <td className="px-3 py-2 text-right font-mono text-red-600">
                  -{v.abschreibungBetrag.toLocaleString("de-DE")} €
                </td>
              </tr>
              <tr className="border-b border-blue-50">
                <td className="px-3 py-2 text-gray-600">
                  km-Korrektur ({v.kmDifferenz >= 0 ? "+" : ""}{v.kmDifferenz.toLocaleString("de-DE")} km)
                </td>
                <td className={`px-3 py-2 text-right font-mono ${v.kmKorrekturBetrag >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {v.kmKorrekturBetrag >= 0 ? "+" : ""}{v.kmKorrekturBetrag.toLocaleString("de-DE")} €
                </td>
              </tr>
              <tr className="border-b border-blue-50">
                <td className="px-3 py-2 text-gray-600">Kraftstoff ({fuelLabel})</td>
                <td className={`px-3 py-2 text-right font-mono ${v.kraftstoffBetrag >= 0 ? "text-green-600" : v.kraftstoffBetrag < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {v.kraftstoffBetrag === 0 ? "±0" : (v.kraftstoffBetrag > 0 ? "+" : "") + v.kraftstoffBetrag.toLocaleString("de-DE")} €
                </td>
              </tr>
              <tr className="border-b border-blue-50">
                <td className="px-3 py-2 text-gray-600">
                  {vehicle.accidentFree ? "Unfallfrei" : "Nicht fahrtüchtig"}
                </td>
                <td className={`px-3 py-2 text-right font-mono ${v.unfallBetrag >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {v.unfallBetrag >= 0 ? "+" : ""}{v.unfallBetrag.toLocaleString("de-DE")} €
                </td>
              </tr>
              <tr className="border-b border-blue-100 bg-gray-50">
                <td className="px-3 py-2 font-semibold text-gray-900">Geschätzter Marktwert</td>
                <td className="px-3 py-2 text-right font-mono font-semibold text-gray-900">
                  {v.marktwert.toLocaleString("de-DE")} €
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-3 py-2 font-semibold text-blue-900">Händler-Einkaufspreis (~78%)</td>
                <td className="px-3 py-2 text-right font-mono font-bold text-blue-900">
                  {v.einkaufspreis.toLocaleString("de-DE")} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DETAIL MODAL
// ============================================================================

function DetailModal({ vehicle, onClose, isDealer }: { vehicle: Vehicle; onClose: () => void; isDealer: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#141414] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Placeholder */}
        <div className={`h-56 bg-gradient-to-br ${vehicle.gradient} rounded-t-2xl relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-white/20 text-7xl tracking-wider select-none">
              {vehicle.brand}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                vehicle.sellerType === "dealer"
                  ? "bg-[#f14011] text-white"
                  : "bg-white/90 text-gray-800"
              }`}
            >
              {vehicle.sellerType === "dealer" ? "Händler" : "Privat"}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title & Price */}
          <div>
            <h2 className="font-display text-3xl text-gray-900 tracking-wide">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-gray-500 mt-1">{vehicle.variant} · {vehicle.year} · {vehicle.firstRegistration}</p>
            <p className="font-display text-4xl text-[#f14011] mt-2">
              {vehicle.price.toLocaleString("de-DE")} €
            </p>
          </div>

          {/* Price Rating (public) */}
          <PriceRatingBadge vehicle={vehicle} />

          {/* Key specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Modell", value: vehicle.model },
              { label: "Variante", value: vehicle.variant },
              { label: "Kilometer", value: `${vehicle.mileage.toLocaleString("de-DE")} km` },
              { label: "Leistung", value: `${vehicle.powerPs} PS` },
              { label: "Kraftstoff", value: vehicle.fuelType },
              { label: "Getriebe", value: vehicle.transmission },
              { label: "Antrieb", value: vehicle.driveType },
              { label: "Farbe", value: vehicle.color },
              { label: "Türen", value: vehicle.doors },
              { label: "Sitze", value: vehicle.seats },
              ...(vehicle.vehicleType ? [{ label: "Fahrzeugtyp", value: vehicle.vehicleType }] : []),
              ...(vehicle.vehicleCategory ? [{ label: "Karosserie", value: vehicle.vehicleCategory }] : []),
              ...(vehicle.cylinders ? [{ label: "Zylinder", value: String(vehicle.cylinders) }] : []),
              ...(vehicle.engineDisplacement ? [{ label: "Hubraum", value: `${vehicle.engineDisplacement.toLocaleString("de-DE")} ccm` }] : []),
              ...(vehicle.tankVolume ? [{ label: "Tankvolumen", value: `${vehicle.tankVolume} l` }] : []),
              ...(vehicle.interiorColor ? [{ label: "Innenfarbe", value: vehicle.interiorColor }] : []),
              ...(vehicle.seatMaterial ? [{ label: "Sitzmaterial", value: vehicle.seatMaterial }] : []),
              ...(vehicle.climateZones ? [{ label: "Klimazonen", value: String(vehicle.climateZones) }] : []),
              ...(vehicle.rimSize ? [{ label: "Felgengröße", value: `${vehicle.rimSize} Zoll` }] : []),
              { label: "Erstzulassung", value: vehicle.firstRegistration },
              ...(vehicle.hu ? [{ label: "HU", value: vehicle.hu }] : []),
              ...(vehicle.previousOwners !== undefined ? [{ label: "Vorbesitzer", value: String(vehicle.previousOwners) }] : []),
              ...(vehicle.emissionClass ? [{ label: "Schadstoffklasse", value: vehicle.emissionClass }] : []),
              ...(vehicle.environmentalBadge ? [{ label: "Umweltplakette", value: vehicle.environmentalBadge }] : []),
            ].map((spec) => (
              <div key={spec.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{spec.label}</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Condition */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              {vehicle.condition}
            </span>
            {vehicle.accidentFree && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Unfallfrei
              </span>
            )}
            {vehicle.noRepaint && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Nachlackierungsfrei
              </span>
            )}
            {vehicle.serviceBookMaintained && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Scheckheftgepflegt
              </span>
            )}
            {vehicle.paintProtectionFilm && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Steinschlagschutzfolie
              </span>
            )}
            {vehicle.manufacturerWarranty && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Herstellergarantie
              </span>
            )}
            {vehicle.nonSmokerVehicle && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Nichtraucherfahrzeug
              </span>
            )}
            {vehicle.petFreeVehicle && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Tierfreies Fahrzeug
              </span>
            )}
            {vehicle.particleFilter && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Rußpartikelfilter
              </span>
            )}
            {vehicle.mwstAusweisbar && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                MwSt. ausweisbar
              </span>
            )}
          </div>

          {/* Tire Score */}
          <TireScoreBadge vehicle={vehicle} />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Beschreibung</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{vehicle.description}</p>
          </div>

          {/* Features */}
          {[
            { title: "Komfort", items: vehicle.comfortFeatures },
            { title: "Sicherheit", items: vehicle.safetyFeatures },
            { title: "Exterieur", items: vehicle.exteriorFeatures },
            { title: "Multimedia", items: vehicle.multimediaFeatures },
          ].map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.title}>
                  <h3 className="font-semibold text-gray-900 mb-2">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}

          {/* Paint Thickness */}
          {vehicle.paintThickness && Object.keys(vehicle.paintThickness).length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Lackdickenmessung</h3>
              <div className="space-y-1.5">
                {Object.entries(vehicle.paintThickness).map(([zone, value]) => {
                  const num = parseInt(value);
                  let color = "text-gray-600";
                  if (num < 80) color = "text-gray-500";
                  else if (num <= 130) color = "text-green-600";
                  else if (num <= 250) color = "text-yellow-600";
                  else if (num <= 400) color = "text-orange-600";
                  else color = "text-red-600";
                  return (
                    <div key={zone} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-700">{zone}</span>
                      <span className={`font-mono font-semibold ${color}`}>{value} µm</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2">
                <PaintThicknessInfoButton />
              </div>
            </div>
          )}

          {/* Schadenskarte */}
          {(vehicle.damageMap && Object.keys(vehicle.damageMap).length > 0 || vehicle.paintThickness && Object.keys(vehicle.paintThickness).length > 0) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Schadenskarte</h3>
              <p className="text-sm text-gray-400 mb-3">Klicke auf eine Zone für Details</p>
              <ReadOnlyDamageMap damageMap={vehicle.damageMap} paintThickness={vehicle.paintThickness} />
            </div>
          )}

          {/* Location & Contact */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Standort & Kontakt</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="text-gray-400">Standort:</span>{" "}
                {vehicle.zip} {vehicle.city}
              </p>
              {vehicle.sellerType === "dealer" && vehicle.companyName && (
                <p>
                  <span className="text-gray-400">Händler:</span>{" "}
                  <Link href={`/haendler/${encodeURIComponent(vehicle.companyName)}`} className="text-[#f14011] hover:underline font-medium">
                    {vehicle.companyName}
                  </Link>
                </p>
              )}
              {vehicle.showContactName && (
                <p>
                  <span className="text-gray-400">Ansprechpartner:</span>{" "}
                  {vehicle.contactName}
                </p>
              )}
              {vehicle.showContactPhone && (
                <p>
                  <span className="text-gray-400">Telefon:</span>{" "}
                  <a href={`tel:${vehicle.contactPhone}`} className="text-[#f14011] hover:underline">
                    {vehicle.contactPhone}
                  </a>
                </p>
              )}
              <p>
                <span className="text-gray-400">E-Mail:</span>{" "}
                <a href={`mailto:${vehicle.contactEmail}`} className="text-[#f14011] hover:underline">
                  {vehicle.contactEmail}
                </a>
              </p>
            </div>
            {(() => {
              const coords = getCoordsByCity(vehicle.city);
              return coords ? (
                <div className="mt-4">
                  <LocationMap lat={coords.lat} lng={coords.lng} label={`${vehicle.zip} ${vehicle.city}`} />
                </div>
              ) : null;
            })()}
          </div>

          {/* Dealer Purchase Panel (only for logged-in dealers) */}
          {isDealer && <DealerPurchasePanel vehicle={vehicle} />}

          {/* CTA */}
          <button
            onClick={() => (window.location.href = `mailto:${vehicle.contactEmail}?subject=Anfrage: ${vehicle.brand} ${vehicle.model}`)}
            className="btn btn-primary btn-lg w-full"
          >
            Verkäufer kontaktieren
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VEHICLE CARD
// ============================================================================

function VehicleCard({
  vehicle,
  onClick,
  isFavorited,
  onToggleFavorite,
}: {
  vehicle: Vehicle;
  onClick: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="card cursor-pointer overflow-hidden group" onClick={onClick}>
      {/* Image Placeholder */}
      <div className={`h-48 bg-gradient-to-br ${vehicle.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-white/15 text-6xl tracking-wider select-none group-hover:scale-110 transition-transform duration-500">
            {vehicle.brand}
          </span>
        </div>
        {/* Favorite heart */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-2 left-2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors z-10"
          aria-label={isFavorited ? "Favorit entfernen" : "Als Favorit speichern"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorited ? "#f14011" : "none"} stroke={isFavorited ? "#f14011" : "white"} strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* Seller badge */}
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

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl text-gray-900 tracking-wide">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">{vehicle.variant} · {vehicle.year}</p>

        <p className="font-display text-2xl text-[#f14011] mt-3">
          {vehicle.price.toLocaleString("de-DE")} €
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 text-sm text-gray-500">
          <span>{vehicle.mileage.toLocaleString("de-DE")} km</span>
          <span>{vehicle.powerPs} PS</span>
          <span>{vehicle.fuelType}</span>
          <span>{vehicle.transmission}</span>
        </div>

        {/* Location */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-400">{vehicle.city}</span>
          <span className="text-[#f14011] font-semibold group-hover:translate-x-0.5 transition-transform">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function InseratePageInner() {
  const searchParams = useSearchParams();
  const [brandFilter, setBrandFilter] = useState("Alle Marken");
  const [modelFilter, setModelFilter] = useState("");
  const [motorizationFilter, setMotorizationFilter] = useState<string[]>([]);
  const [showMotorizationDropdown, setShowMotorizationDropdown] = useState(false);
  const motorizationRef = useRef<HTMLDivElement>(null);
  const [fuelFilter, setFuelFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState(0);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [mileageFilter, setMileageFilter] = useState(0);
  const [powerFilter, setPowerFilter] = useState(0);
  const [transmissionFilter, setTransmissionFilter] = useState<string[]>([]);
  const [driveTypeFilter, setDriveTypeFilter] = useState<string[]>([]);
  const [sellerTypeFilter, setSellerTypeFilter] = useState("Alle");
  const [accidentFreeFilter, setAccidentFreeFilter] = useState("Alle");
  const [cityFilter, setCityFilter] = useState("");
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [conditionFilter, setConditionFilter] = useState<string[]>([]);
  const [doorFilter, setDoorFilter] = useState("Alle");
  const [seatFilter, setSeatFilter] = useState("Alle");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("Alle");
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState<string[]>([]);
  const [mwstFilter, setMwstFilter] = useState("Alle");
  const [cylinderFilter, setCylinderFilter] = useState<string[]>([]);
  const [displacementMin, setDisplacementMin] = useState("");
  const [displacementMax, setDisplacementMax] = useState("");
  const [tankVolumeMin, setTankVolumeMin] = useState("");
  const [interiorColorFilter, setInteriorColorFilter] = useState<string[]>([]);
  const [seatMaterialFilter, setSeatMaterialFilter] = useState<string[]>([]);
  const [climateZoneFilter, setClimateZoneFilter] = useState("");
  const [rimSizeFilter, setRimSizeFilter] = useState("");
  const [paintProtectionFilmFilter, setPaintProtectionFilmFilter] = useState("Alle");
  const [noRepaintFilter, setNoRepaintFilter] = useState("Alle");
  const [serviceBookFilter, setServiceBookFilter] = useState("Alle");
  const [manufacturerWarrantyFilter, setManufacturerWarrantyFilter] = useState("Alle");
  const [nonSmokerFilter, setNonSmokerFilter] = useState("Alle");
  const [petFreeFilter, setPetFreeFilter] = useState("Alle");
  const [emissionClassFilter, setEmissionClassFilter] = useState<string[]>([]);
  const [environmentalBadgeFilter, setEnvironmentalBadgeFilter] = useState<string[]>([]);
  const [particleFilterFilter, setParticleFilterFilter] = useState("Alle");
  const [manufacturerColorFilter, setManufacturerColorFilter] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [brandFilter2, setBrandFilter2] = useState("Alle Marken");
  const [modelFilter2, setModelFilter2] = useState("");
  const [variantFilter2, setVariantFilter2] = useState("");
  const [brandFilter3, setBrandFilter3] = useState("Alle Marken");
  const [modelFilter3, setModelFilter3] = useState("");
  const [variantFilter3, setVariantFilter3] = useState("");
  const [customBrandText, setCustomBrandText] = useState("");
  const [customBrandText2, setCustomBrandText2] = useState("");
  const [customBrandText3, setCustomBrandText3] = useState("");
  const [showBrandRow2, setShowBrandRow2] = useState(false);
  const [showBrandRow3, setShowBrandRow3] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDealer, setIsDealer] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);

  const { mounted, saveSearch, toggleFavorite, isFavorite } = useSavedData();

  // Count active advanced filters
  const advancedCount = [
    yearFrom !== "",
    yearTo !== "",
    mileageFilter !== 0,
    powerFilter !== 0,
    transmissionFilter.length > 0,
    driveTypeFilter.length > 0,
    sellerTypeFilter !== "Alle",
    accidentFreeFilter !== "Alle",
    cityFilter !== "",
    colorFilter.length > 0,
    conditionFilter.length > 0,
    doorFilter !== "Alle",
    seatFilter !== "Alle",
    vehicleTypeFilter !== "Alle",
    vehicleCategoryFilter.length > 0,
    mwstFilter !== "Alle",
    cylinderFilter.length > 0,
    displacementMin !== "",
    displacementMax !== "",
    tankVolumeMin !== "",
    interiorColorFilter.length > 0,
    seatMaterialFilter.length > 0,
    climateZoneFilter !== "",
    rimSizeFilter !== "",
    paintProtectionFilmFilter !== "Alle",
    noRepaintFilter !== "Alle",
    serviceBookFilter !== "Alle",
    manufacturerWarrantyFilter !== "Alle",
    nonSmokerFilter !== "Alle",
    petFreeFilter !== "Alle",
    emissionClassFilter.length > 0,
    environmentalBadgeFilter.length > 0,
    particleFilterFilter !== "Alle",
    manufacturerColorFilter !== "",
  ].filter(Boolean).length;

  // Read query params for filter pre-fill (from gespeichert page)
  useEffect(() => {
    const brand = searchParams.get("brand");
    const fuel = searchParams.get("fuel");
    const price = searchParams.get("price");
    if (brand && getBrandOptionsForType("Alle").includes(brand)) setBrandFilter(brand);
    const mdl = searchParams.get("model");
    if (mdl) setModelFilter(mdl);
    const mot = searchParams.get("motorization");
    if (mot) setMotorizationFilter(mot.split(","));
    if (fuel) setFuelFilter(fuel.split(",").filter(Boolean));
    if (price !== null) {
      const idx = Number(price);
      if (idx >= 0 && idx < priceRanges.length) setPriceFilter(idx);
    }
    const yf = searchParams.get("yearFrom");
    const yt = searchParams.get("yearTo");
    const ml = searchParams.get("mileage");
    const pw = searchParams.get("power");
    const tr = searchParams.get("transmission");
    const dt = searchParams.get("driveType");
    const st = searchParams.get("sellerType");
    const af = searchParams.get("accidentFree");
    const ct = searchParams.get("city");
    if (yf) setYearFrom(yf);
    if (yt) setYearTo(yt);
    if (ml !== null) { const i = Number(ml); if (i >= 0 && i < mileageOptions.length) setMileageFilter(i); }
    if (pw !== null) { const i = Number(pw); if (i >= 0 && i < powerOptions.length) setPowerFilter(i); }
    if (tr) setTransmissionFilter(tr.split(",").filter(Boolean));
    if (dt) setDriveTypeFilter(dt.split(",").filter(Boolean));
    if (st && sellerTypeOptions.includes(st)) setSellerTypeFilter(st);
    if (af === "ja") setAccidentFreeFilter("Nur unfallfrei");
    if (ct) setCityFilter(ct);
    const co = searchParams.get("color");
    const cn = searchParams.get("condition");
    const dr = searchParams.get("doors");
    const se = searchParams.get("seats");
    if (co) setColorFilter(co.split(",").filter(Boolean));
    if (cn) setConditionFilter(cn.split(",").filter(Boolean));
    if (dr && doorOptions.includes(dr)) setDoorFilter(dr);
    if (se && seatOptions.includes(se)) setSeatFilter(se);
    const vt = searchParams.get("vehicleType");
    const vc = searchParams.get("vehicleCategory");
    const mw = searchParams.get("mwst");
    const cy = searchParams.get("cylinders");
    const dmi = searchParams.get("displacementMin");
    const dma = searchParams.get("displacementMax");
    const tv = searchParams.get("tankVolumeMin");
    const ic = searchParams.get("interiorColor");
    const sm = searchParams.get("seatMaterial");
    const cz = searchParams.get("climateZone");
    const rs = searchParams.get("rimSize");
    const ppf = searchParams.get("paintProtectionFilm");
    const nr = searchParams.get("noRepaint");
    const sb = searchParams.get("serviceBook");
    const mwf = searchParams.get("manufacturerWarranty");
    const ns = searchParams.get("nonSmoker");
    const pf = searchParams.get("petFree");
    const ec = searchParams.get("emissionClass");
    const eb = searchParams.get("environmentalBadge");
    const pff = searchParams.get("particleFilter");
    const mc = searchParams.get("manufacturerColor");
    const va = searchParams.get("variant");
    const b2 = searchParams.get("brand2");
    const m2 = searchParams.get("model2");
    const v2 = searchParams.get("variant2");
    const b3 = searchParams.get("brand3");
    const m3 = searchParams.get("model3");
    const v3 = searchParams.get("variant3");
    if (vt && vehicleTypeOptions.includes(vt)) setVehicleTypeFilter(vt);
    if (vc) setVehicleCategoryFilter(vc.split(",").filter(Boolean));
    if (mw && ["Alle", "Ja", "Nein"].includes(mw)) setMwstFilter(mw);
    if (cy) setCylinderFilter(cy.split(",").filter(Boolean));
    if (dmi) setDisplacementMin(dmi);
    if (dma) setDisplacementMax(dma);
    if (tv) setTankVolumeMin(tv);
    if (ic) setInteriorColorFilter(ic.split(",").filter(Boolean));
    if (sm) setSeatMaterialFilter(sm.split(",").filter(Boolean));
    if (cz) setClimateZoneFilter(cz);
    if (rs) setRimSizeFilter(rs);
    if (ppf && ["Alle", "Ja", "Nein"].includes(ppf)) setPaintProtectionFilmFilter(ppf);
    if (nr && ["Alle", "Ja", "Nein"].includes(nr)) setNoRepaintFilter(nr);
    if (sb && ["Alle", "Ja", "Nein"].includes(sb)) setServiceBookFilter(sb);
    if (mwf && ["Alle", "Vorhanden", "Nicht vorhanden"].includes(mwf)) setManufacturerWarrantyFilter(mwf);
    if (ns && ["Alle", "Ja", "Nein"].includes(ns)) setNonSmokerFilter(ns);
    if (pf && ["Alle", "Ja", "Nein"].includes(pf)) setPetFreeFilter(pf);
    if (ec) setEmissionClassFilter(ec.split(",").filter(Boolean));
    if (eb) setEnvironmentalBadgeFilter(eb.split(",").filter(Boolean));
    if (pff && particleFilterOptions.includes(pff)) setParticleFilterFilter(pff);
    if (mc) setManufacturerColorFilter(mc);
    if (va) setVariantFilter(va);
    if (b2 && getBrandOptionsForType("Alle").includes(b2)) { setBrandFilter2(b2); setShowBrandRow2(true); }
    if (m2) setModelFilter2(m2);
    if (v2) setVariantFilter2(v2);
    if (b3 && getBrandOptionsForType("Alle").includes(b3)) { setBrandFilter3(b3); setShowBrandRow2(true); setShowBrandRow3(true); }
    if (m3) setModelFilter3(m3);
    if (v3) setVariantFilter3(v3);
    // Auto-open advanced section if any advanced param is set
    if (yf || yt || ml || pw || tr || dt || st || af || ct || co || cn || dr || se || vt || vc || mw || cy || dmi || dma || tv || ic || sm || cz || rs || ppf || nr || sb || mwf || ns || pf || ec || eb || pff || mc) setShowAdvanced(true);
  }, [searchParams]);

  // Close motorization dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (motorizationRef.current && !motorizationRef.current.contains(e.target as Node)) {
        setShowMotorizationDropdown(false);
      }
    }
    if (showMotorizationDropdown) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showMotorizationDropdown]);

  // Persist dealer login state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("hitmit_dealer");
    if (stored === "true") setIsDealer(true);
  }, []);

  const toggleDealer = () => {
    const next = !isDealer;
    setIsDealer(next);
    localStorage.setItem("hitmit_dealer", String(next));
  };

  const filtered = vehicles.filter((v) => {
    // Brand+Model+Variant: ODER-Logik über bis zu 3 Paare
    const brandModelPairs: { brand: string; model: string; variant: string; customText?: string }[] = [];
    if (brandFilter !== "Alle Marken") brandModelPairs.push({ brand: brandFilter, model: modelFilter, variant: variantFilter, customText: brandFilter === "Andere" ? customBrandText : undefined });
    if (brandFilter2 !== "Alle Marken") brandModelPairs.push({ brand: brandFilter2, model: modelFilter2, variant: variantFilter2, customText: brandFilter2 === "Andere" ? customBrandText2 : undefined });
    if (brandFilter3 !== "Alle Marken") brandModelPairs.push({ brand: brandFilter3, model: modelFilter3, variant: variantFilter3, customText: brandFilter3 === "Andere" ? customBrandText3 : undefined });

    if (brandModelPairs.length > 0) {
      const matchesAny = brandModelPairs.some((pair) => {
        if (pair.brand === "Andere" && pair.customText) {
          const search = pair.customText.toLowerCase();
          const matchesBrandOrModel = v.brand.toLowerCase().includes(search) || v.model.toLowerCase().includes(search);
          if (!matchesBrandOrModel) return false;
          if (pair.variant !== "" && !v.variant.toLowerCase().includes(pair.variant.toLowerCase())) return false;
          return true;
        }
        if (v.brand !== pair.brand) return false;
        if (pair.model !== "") {
          if (pair.brand === "Mercedes-Benz" && MERCEDES_MOTORIZATIONS[pair.model]) {
            if (!MERCEDES_MOTORIZATIONS[pair.model].some((m) => v.model.toLowerCase().includes(m.toLowerCase()))) return false;
          } else {
            if (!v.model.toLowerCase().includes(pair.model.toLowerCase())) return false;
          }
        }
        if (pair.variant !== "" && !v.variant.toLowerCase().includes(pair.variant.toLowerCase())) return false;
        return true;
      });
      if (!matchesAny) return false;
    } else {
      // No brand selected — still check variant from row 1 if set
      if (variantFilter !== "" && !v.variant.toLowerCase().includes(variantFilter.toLowerCase())) return false;
    }

    if (motorizationFilter.length > 0 && !motorizationFilter.some((m) => v.model.toLowerCase().includes(m.toLowerCase()))) return false;
    if (fuelFilter.length > 0) {
      const matchesFuel = fuelFilter.some((ff) => {
        if (ff.startsWith("Plug-in-Hybrid")) return v.fuelType.startsWith("Plug-in-Hybrid");
        return v.fuelType === ff;
      });
      if (!matchesFuel) return false;
    }
    const range = priceRanges[priceFilter];
    if (v.price < range.min || v.price >= range.max) return false;
    if (yearFrom !== "" && v.year < Number(yearFrom)) return false;
    if (yearTo !== "" && v.year > Number(yearTo)) return false;
    if (mileageFilter !== 0 && v.mileage > mileageOptions[mileageFilter].max) return false;
    if (powerFilter !== 0 && v.powerPs < powerOptions[powerFilter].min) return false;
    if (transmissionFilter.length > 0) {
      const t = v.transmission.toLowerCase();
      const matchesTrans = transmissionFilter.some((tf) => {
        if (tf === "Automatik") return t.includes("automatik") || t.includes("dsg") || t.includes("pdk") || t.includes("tronic") || t.includes("s tronic");
        if (tf === "Halbautomatik") return t.includes("halbautomatik");
        if (tf === "Schaltung") return !t.includes("automatik") && !t.includes("dsg") && !t.includes("pdk") && !t.includes("tronic") && !t.includes("s tronic") && !t.includes("halbautomatik");
        return false;
      });
      if (!matchesTrans) return false;
    }
    if (driveTypeFilter.length > 0) {
      const d = v.driveType.toLowerCase();
      const matchesDrive = driveTypeFilter.some((df) => {
        if (df === "Frontantrieb") return d.includes("front");
        if (df === "Hinterradantrieb") return d.includes("hinter");
        if (df === "Allrad") return d.includes("allrad") || d.includes("quattro") || d.includes("awd") || d.includes("4wd");
        return false;
      });
      if (!matchesDrive) return false;
    }
    if (sellerTypeFilter !== "Alle") {
      if (sellerTypeFilter === "Privat" && v.sellerType !== "private") return false;
      if (sellerTypeFilter === "Händler" && v.sellerType !== "dealer") return false;
    }
    if (accidentFreeFilter === "Nur unfallfrei" && !v.accidentFree) return false;
    if (cityFilter !== "" && !v.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (colorFilter.length > 0 && !colorFilter.some((cf) => v.color.toLowerCase().includes(cf.toLowerCase()))) return false;
    if (conditionFilter.length > 0 && !conditionFilter.includes(v.condition)) return false;
    if (doorFilter !== "Alle") {
      if (doorFilter === "2/3" && !["2", "3"].includes(v.doors)) return false;
      if (doorFilter === "4/5" && !["4", "5"].includes(v.doors)) return false;
      if (doorFilter === "6/7" && !["6", "7"].includes(v.doors)) return false;
    }
    if (seatFilter !== "Alle" && v.seats !== seatFilter) return false;
    if (vehicleTypeFilter !== "Alle" && v.vehicleType !== vehicleTypeFilter) return false;
    if (vehicleCategoryFilter.length > 0 && (!v.vehicleCategory || !vehicleCategoryFilter.includes(v.vehicleCategory))) return false;
    if (mwstFilter !== "Alle") {
      if (mwstFilter === "Ja" && !v.mwstAusweisbar) return false;
      if (mwstFilter === "Nein" && v.mwstAusweisbar) return false;
    }
    if (cylinderFilter.length > 0 && !cylinderFilter.includes(String(v.cylinders))) return false;
    if (displacementMin !== "" && (!v.engineDisplacement || v.engineDisplacement < Number(displacementMin))) return false;
    if (displacementMax !== "" && (!v.engineDisplacement || v.engineDisplacement > Number(displacementMax))) return false;
    if (tankVolumeMin !== "" && (!v.tankVolume || v.tankVolume < Number(tankVolumeMin))) return false;
    if (interiorColorFilter.length > 0 && (!v.interiorColor || !interiorColorFilter.some((ic) => v.interiorColor!.toLowerCase().includes(ic.toLowerCase())))) return false;
    if (seatMaterialFilter.length > 0 && (!v.seatMaterial || !seatMaterialFilter.includes(v.seatMaterial))) return false;
    if (climateZoneFilter !== "" && v.climateZones !== Number(climateZoneFilter)) return false;
    if (rimSizeFilter !== "" && v.rimSize !== Number(rimSizeFilter)) return false;
    if (paintProtectionFilmFilter !== "Alle") {
      if (paintProtectionFilmFilter === "Ja" && !v.paintProtectionFilm) return false;
      if (paintProtectionFilmFilter === "Nein" && v.paintProtectionFilm) return false;
    }
    if (noRepaintFilter !== "Alle") {
      if (noRepaintFilter === "Ja" && !v.noRepaint) return false;
      if (noRepaintFilter === "Nein" && v.noRepaint) return false;
    }
    if (serviceBookFilter !== "Alle") {
      if (serviceBookFilter === "Ja" && !v.serviceBookMaintained) return false;
      if (serviceBookFilter === "Nein" && v.serviceBookMaintained) return false;
    }
    if (manufacturerWarrantyFilter !== "Alle") {
      if (manufacturerWarrantyFilter === "Vorhanden" && !v.manufacturerWarranty) return false;
      if (manufacturerWarrantyFilter === "Nicht vorhanden" && v.manufacturerWarranty) return false;
    }
    if (nonSmokerFilter === "Ja" && !v.nonSmokerVehicle) return false;
    if (nonSmokerFilter === "Nein" && v.nonSmokerVehicle) return false;
    if (petFreeFilter === "Ja" && !v.petFreeVehicle) return false;
    if (petFreeFilter === "Nein" && v.petFreeVehicle) return false;
    if (emissionClassFilter.length > 0 && (!v.emissionClass || !emissionClassFilter.includes(v.emissionClass))) return false;
    if (environmentalBadgeFilter.length > 0 && (!v.environmentalBadge || !environmentalBadgeFilter.includes(v.environmentalBadge))) return false;
    if (particleFilterFilter !== "Alle") {
      if (particleFilterFilter === "Ja" && !v.particleFilter) return false;
      if (particleFilterFilter === "Nein" && v.particleFilter) return false;
    }
    if (manufacturerColorFilter !== "" && !v.color.toLowerCase().includes(manufacturerColorFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider text-gray-900 animate-fade-in-up">
          Aktuelle Inserate
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl text-lg animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          Entdecke ausgewählte Fahrzeuge von Privatverkäufern und Händlern — direkt und ohne Umwege.
        </p>
      </section>

      {/* Filters */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col gap-3 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          {/* Row 1: Brand + Model + Motorisierung + Variante */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <select
                value={brandFilter}
                onChange={(e) => { setBrandFilter(e.target.value); setModelFilter(""); setMotorizationFilter([]); setVariantFilter(""); setCustomBrandText(""); }}
                className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
              >
                {getBrandOptionsForType(vehicleTypeFilter).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {brandFilter === "Andere" ? (
              <input
                type="text"
                value={customBrandText}
                onChange={(e) => setCustomBrandText(e.target.value)}
                placeholder="Marke / Modell eingeben"
                className="bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors w-56"
              />
            ) : (
              <div className="relative">
                <select
                  value={modelFilter}
                  onChange={(e) => { setModelFilter(e.target.value); setMotorizationFilter([]); }}
                  className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Alle Modelle</option>
                  {brandFilter !== "Alle Marken" &&
                    getModelsForBrand(vehicleTypeFilter, brandFilter).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))
                  }
                </select>
                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* Motorisierung (Mercedes only) */}
            {(vehicleTypeFilter === "Alle" || vehicleTypeFilter === "PKW") && brandFilter === "Mercedes-Benz" && modelFilter !== "" && MERCEDES_MOTORIZATIONS[modelFilter] && (
              <div className="relative" ref={motorizationRef}>
                <button
                  type="button"
                  onClick={() => setShowMotorizationDropdown(!showMotorizationDropdown)}
                  className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer flex items-center gap-1"
                >
                  {motorizationFilter.length === 0
                    ? "Alle Motorisierungen"
                    : `${motorizationFilter.length} Motorisierung${motorizationFilter.length > 1 ? "en" : ""}`}
                </button>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${showMotorizationDropdown ? "rotate-180" : ""}`} />
                {showMotorizationDropdown && (
                  <div className="absolute z-50 mt-1 min-w-[200px] bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
                    {MERCEDES_MOTORIZATIONS[modelFilter].map((m) => (
                      <label key={m} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222]">
                        <input
                          type="checkbox"
                          checked={motorizationFilter.includes(m)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMotorizationFilter([...motorizationFilter, m]);
                            } else {
                              setMotorizationFilter(motorizationFilter.filter((x) => x !== m));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{m}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Variante (Row 1) */}
            <input
              type="text"
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
              placeholder="Variante (z.B. Clubsport)"
              className="bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors w-48"
            />
          </div>

          {/* "Weitere Marke" Button — own line below row 1 */}
          {brandFilter !== "Alle Marken" && !showBrandRow2 && (
            <button
              type="button"
              onClick={() => setShowBrandRow2(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#f14011] border border-dashed border-[#f14011]/40 rounded-full hover:bg-[#f14011]/5 transition-colors self-start"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
              Weitere Marke hinzufügen
            </button>
          )}

          {/* Row 2: Brand2 + Model2 + Variante2 */}
          {showBrandRow2 && (
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <select
                  value={brandFilter2}
                  onChange={(e) => { setBrandFilter2(e.target.value); setModelFilter2(""); setVariantFilter2(""); setCustomBrandText2(""); }}
                  className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                >
                  {getBrandOptionsForType(vehicleTypeFilter).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {brandFilter2 === "Andere" ? (
                <input
                  type="text"
                  value={customBrandText2}
                  onChange={(e) => setCustomBrandText2(e.target.value)}
                  placeholder="Marke / Modell eingeben"
                  className="bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors w-56"
                />
              ) : (
                <div className="relative">
                  <select
                    value={modelFilter2}
                    onChange={(e) => setModelFilter2(e.target.value)}
                    className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Alle Modelle</option>
                    {brandFilter2 !== "Alle Marken" &&
                      getModelsForBrand(vehicleTypeFilter, brandFilter2).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))
                    }
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              <input
                type="text"
                value={variantFilter2}
                onChange={(e) => setVariantFilter2(e.target.value)}
                placeholder="Variante"
                className="bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors w-48"
              />
              <button
                type="button"
                onClick={() => {
                  if (showBrandRow3) {
                    // Zeile 3 hochrutschen nach Zeile 2
                    setBrandFilter2(brandFilter3); setModelFilter2(modelFilter3); setVariantFilter2(variantFilter3); setCustomBrandText2(customBrandText3);
                    setBrandFilter3("Alle Marken"); setModelFilter3(""); setVariantFilter3(""); setCustomBrandText3("");
                    setShowBrandRow3(false);
                  } else {
                    setBrandFilter2("Alle Marken"); setModelFilter2(""); setVariantFilter2(""); setCustomBrandText2("");
                    setShowBrandRow2(false);
                  }
                }}
                className="flex items-center justify-center w-10 h-10 text-gray-400 border border-gray-200 rounded-full hover:text-red-500 hover:border-red-300 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* "+" for Row 3 — own line below row 2 */}
          {showBrandRow2 && brandFilter2 !== "Alle Marken" && !showBrandRow3 && (
            <button
              type="button"
              onClick={() => setShowBrandRow3(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#f14011] border border-dashed border-[#f14011]/40 rounded-full hover:bg-[#f14011]/5 transition-colors self-start"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
              Weitere Marke hinzufügen
            </button>
          )}

          {/* Row 3: Brand3 + Model3 + Variante3 */}
          {showBrandRow3 && (
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <select
                  value={brandFilter3}
                  onChange={(e) => { setBrandFilter3(e.target.value); setModelFilter3(""); setVariantFilter3(""); setCustomBrandText3(""); }}
                  className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                >
                  {getBrandOptionsForType(vehicleTypeFilter).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {brandFilter3 === "Andere" ? (
                <input
                  type="text"
                  value={customBrandText3}
                  onChange={(e) => setCustomBrandText3(e.target.value)}
                  placeholder="Marke / Modell eingeben"
                  className="bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors w-56"
                />
              ) : (
                <div className="relative">
                  <select
                    value={modelFilter3}
                    onChange={(e) => setModelFilter3(e.target.value)}
                    className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Alle Modelle</option>
                    {brandFilter3 !== "Alle Marken" &&
                      getModelsForBrand(vehicleTypeFilter, brandFilter3).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))
                    }
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              <input
                type="text"
                value={variantFilter3}
                onChange={(e) => setVariantFilter3(e.target.value)}
                placeholder="Variante"
                className="bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors w-48"
              />
              <button
                type="button"
                onClick={() => { setBrandFilter3("Alle Marken"); setModelFilter3(""); setVariantFilter3(""); setShowBrandRow3(false); }}
                className="flex items-center justify-center w-10 h-10 text-gray-400 border border-gray-200 rounded-full hover:text-red-500 hover:border-red-300 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Price, Fuel, More filters etc. */}
          <div className="flex flex-wrap gap-3 items-center">
          {/* Price */}
          <div className="relative">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
            >
              {priceRanges.map((r, i) => (
                <option key={r.label} value={i}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Fuel */}
          <MultiFilterSelect label="Kraftstoff" selected={fuelFilter} onChange={setFuelFilter} options={fuelOptions} />

          {/* More filters toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              showAdvanced || advancedCount > 0
                ? "bg-[#f14011]/10 border-[#f14011] text-[#f14011]"
                : "bg-white dark:bg-[#141414] border-gray-200 text-gray-600 hover:border-[#f14011] hover:text-[#f14011]"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Mehr Filter
            {advancedCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#f14011] text-white text-xs font-bold rounded-full">
                {advancedCount}
              </span>
            )}
            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {/* Result count */}
          <div className="flex items-center px-4 text-sm text-gray-400">
            {filtered.length} {filtered.length === 1 ? "Fahrzeug" : "Fahrzeuge"}
          </div>

          {/* Dealer login */}
          <button
            onClick={toggleDealer}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              isDealer
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-[#141414] text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {isDealer ? "Händler ✓" : "Händler-Login"}
          </button>

          {/* Save search button */}
          {mounted && (
            <button
              onClick={() => {
                const parts: string[] = [];
                if (brandFilter !== "Alle Marken") parts.push(brandFilter);
                if (modelFilter) parts.push(modelFilter);
                if (variantFilter) parts.push(variantFilter);
                if (brandFilter2 !== "Alle Marken") parts.push(modelFilter2 ? `${brandFilter2} ${modelFilter2}` : brandFilter2);
                if (variantFilter2) parts.push(variantFilter2);
                if (brandFilter3 !== "Alle Marken") parts.push(modelFilter3 ? `${brandFilter3} ${modelFilter3}` : brandFilter3);
                if (variantFilter3) parts.push(variantFilter3);
                if (motorizationFilter.length > 0) parts.push(motorizationFilter.join(", "));
                if (fuelFilter.length > 0) parts.push(fuelFilter.join(", "));
                // Convert old number-based filters to new string format
                const pRange = priceRanges[priceFilter];
                const pMin = pRange && pRange.min > 0 ? String(pRange.min) : "";
                const pMax = pRange && pRange.max < Infinity ? String(pRange.max) : "";
                const mlMax = mileageFilter !== 0 ? (mileageOptions[mileageFilter].max < Infinity ? String(mileageOptions[mileageFilter].max) : "") : "";
                const pwMin = powerFilter !== 0 ? (powerOptions[powerFilter].min > 0 ? String(powerOptions[powerFilter].min) : "") : "";
                if (pMin || pMax) {
                  if (pMin) parts.push(`ab ${Number(pMin).toLocaleString("de-DE")} €`);
                  if (pMax) parts.push(`bis ${Number(pMax).toLocaleString("de-DE")} €`);
                }
                if (yearFrom) parts.push(`ab ${yearFrom}`);
                if (yearTo) parts.push(`bis ${yearTo}`);
                if (mlMax) parts.push(`bis ${Number(mlMax).toLocaleString("de-DE")} km`);
                if (pwMin) parts.push(`ab ${pwMin} PS`);
                if (transmissionFilter.length > 0) parts.push(transmissionFilter.join(", "));
                if (driveTypeFilter.length > 0) parts.push(driveTypeFilter.join(", "));
                if (sellerTypeFilter !== "Alle") parts.push(sellerTypeFilter);
                if (accidentFreeFilter !== "Alle") parts.push("Unfallfrei");
                if (cityFilter) parts.push(cityFilter);
                if (colorFilter.length > 0) parts.push(colorFilter.join(", "));
                if (conditionFilter.length > 0) parts.push(conditionFilter.join(", "));
                if (doorFilter !== "Alle") parts.push(`${doorFilter} Türen`);
                if (seatFilter !== "Alle") parts.push(`${seatFilter} Sitze`);
                if (vehicleTypeFilter !== "Alle") parts.push(vehicleTypeFilter);
                if (vehicleCategoryFilter.length > 0) parts.push(vehicleCategoryFilter.join(", "));
                if (mwstFilter !== "Alle") parts.push(`MwSt. ${mwstFilter}`);
                if (cylinderFilter.length > 0) parts.push(`${cylinderFilter.join("/")} Zyl.`);
                if (displacementMin) parts.push(`ab ${displacementMin} ccm`);
                if (displacementMax) parts.push(`bis ${displacementMax} ccm`);
                if (tankVolumeMin) parts.push(`ab ${tankVolumeMin} L Tank`);
                if (interiorColorFilter.length > 0) parts.push(`Innen: ${interiorColorFilter.join(", ")}`);
                if (seatMaterialFilter.length > 0) parts.push(seatMaterialFilter.join(", "));
                if (climateZoneFilter) parts.push(`${climateZoneFilter} Klimazonen`);
                if (rimSizeFilter) parts.push(`${rimSizeFilter}" Felgen`);
                if (manufacturerColorFilter) parts.push(manufacturerColorFilter);
                if (paintProtectionFilmFilter !== "Alle") parts.push("Steinschlagfolie");
                if (noRepaintFilter !== "Alle") parts.push("Nachlackierungsfrei");
                if (serviceBookFilter !== "Alle") parts.push("Scheckheft");
                if (manufacturerWarrantyFilter !== "Alle") parts.push("Garantie");
                if (nonSmokerFilter !== "Alle") parts.push("Nichtraucher");
                if (petFreeFilter !== "Alle") parts.push("Tierfrei");
                if (emissionClassFilter.length > 0) parts.push(emissionClassFilter.join(", "));
                if (environmentalBadgeFilter.length > 0) parts.push(environmentalBadgeFilter.join(", "));
                if (particleFilterFilter !== "Alle") parts.push("Partikelfilter");
                const label = parts.length > 0 ? parts.join(", ") : "Alle Fahrzeuge";
                saveSearch(
                  label,
                  {
                    brandFilter, fuelFilter,
                    priceMin: pMin, priceMax: pMax,
                    yearFrom, yearTo,
                    mileageMin: "", mileageMax: mlMax, powerMin: pwMin, powerMax: "",
                    transmissionFilter, driveTypeFilter,
                    sellerTypeFilter, accidentFreeFilter,
                    cityFilter, cityRadius: "",
                    colorFilter, conditionFilter,
                    doorFilter, seatFilter: seatFilter === "Alle" ? "" : seatFilter,
                    modelFilter,
                    brandFilter2, modelFilter2,
                    brandFilter3, modelFilter3,
                    motorizationFilter, variantFilter, descriptionSearch: "",
                    vehicleTypeFilter, vehicleCategoryFilter,
                    mwstFilter, firstRegFrom: "", firstRegTo: "",
                    huFilter: "Alle", previousOwnersFilter: [],
                    cylinderFilter, displacementMin, displacementMax, tankVolumeMin,
                    ausstattungSearch: "",
                    manufacturerColorFilter, interiorColorFilter,
                    seatMaterialFilter, climateZoneFilter, rimSizeFilter,
                    paintProtectionFilmFilter, noRepaintFilter,
                    serviceBookFilter, manufacturerWarrantyFilter,
                    nonSmokerFilter, petFreeFilter, tradeInFilter: false,
                    emissionClassFilter, environmentalBadgeFilter, particleFilterFilter,
                    safetyFeaturesFilter: [], equipmentFeaturesFilter: [],
                  },
                  filtered.map((v) => v.id),
                );
                setSearchSaved(true);
                setTimeout(() => setSearchSaved(false), 2000);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                searchSaved
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-white dark:bg-[#141414] border-gray-200 text-gray-600 hover:border-[#f14011] hover:text-[#f14011]"
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

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 p-5 bg-white dark:bg-[#141414] border border-gray-200 rounded-2xl animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Year From */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Erstzulassung von</label>
                <input
                  type="text"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  placeholder="z.B. 2018"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Year To */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Erstzulassung bis</label>
                <input
                  type="text"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  placeholder="z.B. 2024"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Kilometerstand</label>
                <div className="relative">
                  <select
                    value={mileageFilter}
                    onChange={(e) => setMileageFilter(Number(e.target.value))}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {mileageOptions.map((m, i) => (
                      <option key={m.label} value={i}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Power */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Leistung</label>
                <div className="relative">
                  <select
                    value={powerFilter}
                    onChange={(e) => setPowerFilter(Number(e.target.value))}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {powerOptions.map((p, i) => (
                      <option key={p.label} value={i}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Transmission */}
              <MultiFilterSelect label="Getriebe" selected={transmissionFilter} onChange={setTransmissionFilter} options={transmissionOptions} />

              {/* Drive Type */}
              <MultiFilterSelect label="Antrieb" selected={driveTypeFilter} onChange={setDriveTypeFilter} options={getDriveTypeOptionsForType(vehicleTypeFilter)} />

              {/* Seller Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Verkäufertyp</label>
                <div className="relative">
                  <select
                    value={sellerTypeFilter}
                    onChange={(e) => setSellerTypeFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {sellerTypeOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Accident Free */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Unfallfrei</label>
                <div className="relative">
                  <select
                    value={accidentFreeFilter}
                    onChange={(e) => setAccidentFreeFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Alle">Alle</option>
                    <option value="Nur unfallfrei">Nur unfallfrei</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Color */}
              <MultiFilterSelect label="Farbe" selected={colorFilter} onChange={setColorFilter} options={colorOptions} />

              {/* Condition */}
              <MultiFilterSelect label="Zustand" selected={conditionFilter} onChange={setConditionFilter} options={conditionOptions} />

              {/* Doors */}
              {isFieldVisibleForType("doors", vehicleTypeFilter) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Türen</label>
                  <div className="relative">
                    <select
                      value={doorFilter}
                      onChange={(e) => setDoorFilter(e.target.value)}
                      className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                    >
                      {getDoorOptionsForType(vehicleTypeFilter).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Seats */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sitze</label>
                <div className="relative">
                  <select
                    value={seatFilter}
                    onChange={(e) => setSeatFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {getSeatOptionsForType(vehicleTypeFilter).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Standort (Stadt)</label>
                <input
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="z.B. München"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Fahrzeugtyp</label>
                <div className="relative">
                  <select
                    value={vehicleTypeFilter}
                    onChange={(e) => {
                      setVehicleTypeFilter(e.target.value);
                      setBrandFilter("Alle Marken"); setModelFilter(""); setMotorizationFilter([]);
                      setBrandFilter2("Alle Marken"); setModelFilter2(""); setVariantFilter2("");
                      setBrandFilter3("Alle Marken"); setModelFilter3(""); setVariantFilter3("");
                      setShowBrandRow2(false); setShowBrandRow3(false);
                      setCustomBrandText(""); setCustomBrandText2(""); setCustomBrandText3("");
                      setVehicleCategoryFilter([]);
                      // Reset type-specific filters
                      setDriveTypeFilter([]);
                      setCylinderFilter([]);
                      setDoorFilter("Alle");
                      setSeatFilter("Alle");
                      setInteriorColorFilter([]);
                      setSeatMaterialFilter([]);
                      setClimateZoneFilter("");
                      setPaintProtectionFilmFilter("Alle");
                      setNoRepaintFilter("Alle");
                    }}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {vehicleTypeOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Vehicle Category */}
              <MultiFilterSelect label="Karosserieform" selected={vehicleCategoryFilter} onChange={setVehicleCategoryFilter} options={getCategoriesForType(vehicleTypeFilter)} />

              {/* MwSt */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">MwSt. ausweisbar</label>
                <div className="relative">
                  <select
                    value={mwstFilter}
                    onChange={(e) => setMwstFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Alle">Alle</option>
                    <option value="Ja">Ja</option>
                    <option value="Nein">Nein</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Cylinders */}
              <MultiFilterSelect label="Zylinder" selected={cylinderFilter} onChange={setCylinderFilter} options={getCylinderOptionsForType(vehicleTypeFilter)} />

              {/* Displacement From */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Hubraum von (ccm)</label>
                <input
                  type="text"
                  value={displacementMin}
                  onChange={(e) => setDisplacementMin(e.target.value)}
                  placeholder="z.B. 1500"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Displacement To */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Hubraum bis (ccm)</label>
                <input
                  type="text"
                  value={displacementMax}
                  onChange={(e) => setDisplacementMax(e.target.value)}
                  placeholder="z.B. 3000"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Tank Volume */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Tankvolumen ab (L)</label>
                <input
                  type="text"
                  value={tankVolumeMin}
                  onChange={(e) => setTankVolumeMin(e.target.value)}
                  placeholder="z.B. 50"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Interior Color */}
              {isFieldVisibleForType("interiorColor", vehicleTypeFilter) && (
                <MultiFilterSelect label="Innenfarbe" selected={interiorColorFilter} onChange={setInteriorColorFilter} options={interiorColorOptions} />
              )}

              {/* Seat Material */}
              {isFieldVisibleForType("seatMaterial", vehicleTypeFilter) && (
                <MultiFilterSelect label="Sitzmaterial" selected={seatMaterialFilter} onChange={setSeatMaterialFilter} options={seatMaterialOptions} />
              )}

              {/* Climate Zones */}
              {isFieldVisibleForType("climateZones", vehicleTypeFilter) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Klimazonen</label>
                  <input
                    type="text"
                    value={climateZoneFilter}
                    onChange={(e) => setClimateZoneFilter(e.target.value)}
                    placeholder="z.B. 2"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* Rim Size */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Felgengröße (Zoll)</label>
                <input
                  type="text"
                  value={rimSizeFilter}
                  onChange={(e) => setRimSizeFilter(e.target.value)}
                  placeholder="z.B. 19"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Manufacturer Color */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Herstellerfarbe</label>
                <input
                  type="text"
                  value={manufacturerColorFilter}
                  onChange={(e) => setManufacturerColorFilter(e.target.value)}
                  placeholder="z.B. Nardograu"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>

              {/* Paint Protection Film */}
              {isFieldVisibleForType("paintProtectionFilm", vehicleTypeFilter) && (
                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paintProtectionFilmFilter === "Ja"}
                      onChange={(e) => setPaintProtectionFilmFilter(e.target.checked ? "Ja" : "Alle")}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Steinschlagschutzfolie</span>
                  </label>
                </div>
              )}

              {/* No Repaint */}
              {isFieldVisibleForType("noRepaint", vehicleTypeFilter) && (
                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noRepaintFilter === "Ja"}
                      onChange={(e) => setNoRepaintFilter(e.target.checked ? "Ja" : "Alle")}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Nachlackierungsfrei</span>
                  </label>
                </div>
              )}

              {/* Service Book */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceBookFilter === "Ja"}
                    onChange={(e) => setServiceBookFilter(e.target.checked ? "Ja" : "Alle")}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Scheckheftgepflegt</span>
                </label>
              </div>

              {/* Manufacturer Warranty */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manufacturerWarrantyFilter === "Vorhanden"}
                    onChange={(e) => setManufacturerWarrantyFilter(e.target.checked ? "Vorhanden" : "Alle")}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Herstellergarantie</span>
                </label>
              </div>

              {/* Non-Smoker */}
              {isFieldVisibleForType("nonSmokerVehicle", vehicleTypeFilter) && (
                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nonSmokerFilter === "Ja"}
                      onChange={(e) => setNonSmokerFilter(e.target.checked ? "Ja" : "Alle")}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Nichtraucherfahrzeug</span>
                  </label>
                </div>
              )}

              {/* Pet Free */}
              {isFieldVisibleForType("petFreeVehicle", vehicleTypeFilter) && (
                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={petFreeFilter === "Ja"}
                      onChange={(e) => setPetFreeFilter(e.target.checked ? "Ja" : "Alle")}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Tierfreies Fahrzeug</span>
                  </label>
                </div>
              )}

              {/* Emission Class */}
              <MultiFilterSelect label="Schadstoffklasse" selected={emissionClassFilter} onChange={setEmissionClassFilter} options={emissionClassOptions} />

              {/* Environmental Badge */}
              <MultiFilterSelect label="Umweltplakette" selected={environmentalBadgeFilter} onChange={setEnvironmentalBadgeFilter} options={environmentalBadgeOptions} />

              {/* Particle Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Rußpartikelfilter</label>
                <div className="relative">
                  <select
                    value={particleFilterFilter}
                    onChange={(e) => setParticleFilterFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {particleFilterOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Reset advanced filters */}
            {advancedCount > 0 && (
              <button
                onClick={() => {
                  setYearFrom(""); setYearTo("");
                  setMileageFilter(0); setPowerFilter(0);
                  setTransmissionFilter([]); setDriveTypeFilter([]);
                  setSellerTypeFilter("Alle"); setAccidentFreeFilter("Alle");
                  setCityFilter("");
                  setColorFilter([]); setConditionFilter([]);
                  setDoorFilter("Alle"); setSeatFilter("Alle");
                  setVehicleTypeFilter("Alle"); setVehicleCategoryFilter([]);
                  setMwstFilter("Alle"); setCylinderFilter([]);
                  setDisplacementMin(""); setDisplacementMax(""); setTankVolumeMin("");
                  setInteriorColorFilter([]); setSeatMaterialFilter([]);
                  setClimateZoneFilter(""); setRimSizeFilter("");
                  setPaintProtectionFilmFilter("Alle"); setNoRepaintFilter("Alle");
                  setServiceBookFilter("Alle"); setManufacturerWarrantyFilter("Alle");
                  setNonSmokerFilter("Alle"); setPetFreeFilter("Alle");
                  setEmissionClassFilter([]); setEnvironmentalBadgeFilter([]);
                  setParticleFilterFilter("Alle");
                  setManufacturerColorFilter(""); setVariantFilter("");
                  setBrandFilter2("Alle Marken"); setModelFilter2(""); setVariantFilter2(""); setCustomBrandText2("");
                  setBrandFilter3("Alle Marken"); setModelFilter3(""); setVariantFilter3(""); setCustomBrandText3("");
                  setCustomBrandText("");
                  setShowBrandRow2(false); setShowBrandRow3(false);
                }}
                className="mt-4 text-sm text-[#f14011] font-semibold hover:underline"
              >
                Erweiterte Filter zurücksetzen
              </button>
            )}
          </div>
        )}
      </section>

      {/* Vehicle Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${(index + 3) * 100}ms` }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  onClick={() => setSelectedVehicle(vehicle)}
                  isFavorited={mounted ? isFavorite(vehicle.id) : false}
                  onToggleFavorite={() => toggleFavorite(vehicle.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Keine Fahrzeuge gefunden.</p>
            <button
              onClick={() => {
                setBrandFilter("Alle Marken");
                setModelFilter("");
                setFuelFilter([]);
                setPriceFilter(0);
                setYearFrom(""); setYearTo("");
                setMileageFilter(0); setPowerFilter(0);
                setTransmissionFilter([]); setDriveTypeFilter([]);
                setSellerTypeFilter("Alle"); setAccidentFreeFilter("Alle");
                setCityFilter("");
                setColorFilter([]); setConditionFilter([]);
                setDoorFilter("Alle"); setSeatFilter("Alle");
              }}
              className="mt-4 text-[#f14011] font-semibold hover:underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedVehicle && (
        <DetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} isDealer={isDealer} />
      )}
    </div>
  );
}

export default function InseratePage() {
  return (
    <Suspense>
      <InseratePageInner />
    </Suspense>
  );
}
