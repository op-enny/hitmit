"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { calculateValuation, PRICE_RATING_INFO } from "../valuation";
import type { ValuationBreakdown, PriceRating } from "../valuation";
import { calculateTireScore, TIRE_RATING_INFO } from "../tire-score";
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
  CAR_BRANDS_MODELS,
} from "../vehicles-data";
import type { Vehicle } from "../vehicles-data";
import { useSavedData } from "../use-saved-data";


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
                  {vehicle.accidentFree ? "Unfallfrei" : "Unfallwagen"}
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
                  {vehicle.companyName}
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
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors z-10"
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
  const [fuelFilter, setFuelFilter] = useState("Alle Kraftstoffe");
  const [priceFilter, setPriceFilter] = useState(0);
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

  // Read query params for filter pre-fill (from gespeichert page)
  useEffect(() => {
    const brand = searchParams.get("brand");
    const fuel = searchParams.get("fuel");
    const price = searchParams.get("price");
    if (brand && brandOptions.includes(brand)) setBrandFilter(brand);
    const mdl = searchParams.get("model");
    if (mdl) setModelFilter(mdl);
    if (fuel && fuelOptions.includes(fuel)) setFuelFilter(fuel);
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
    if (tr && transmissionOptions.includes(tr)) setTransmissionFilter(tr);
    if (dt && driveTypeOptions.includes(dt)) setDriveTypeFilter(dt);
    if (st && sellerTypeOptions.includes(st)) setSellerTypeFilter(st);
    if (af === "ja") setAccidentFreeFilter("Nur unfallfrei");
    if (ct) setCityFilter(ct);
    const co = searchParams.get("color");
    const cn = searchParams.get("condition");
    const dr = searchParams.get("doors");
    const se = searchParams.get("seats");
    if (co && colorOptions.includes(co)) setColorFilter(co);
    if (cn && conditionOptions.includes(cn)) setConditionFilter(cn);
    if (dr && doorOptions.includes(dr)) setDoorFilter(dr);
    if (se && seatOptions.includes(se)) setSeatFilter(se);
    // Auto-open advanced section if any advanced param is set
    if (yf || yt || ml || pw || tr || dt || st || af || ct || co || cn || dr || se) setShowAdvanced(true);
  }, [searchParams]);

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
    if (brandFilter !== "Alle Marken" && v.brand !== brandFilter) return false;
    if (modelFilter !== "" && !v.model.toLowerCase().includes(modelFilter.toLowerCase())) return false;
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
            <Link
              href="/gespeichert"
              className="text-sm font-medium text-gray-500 hover:text-[#f14011] transition-colors"
            >
              Gespeichert
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-[#f14011] transition-colors"
            >
              ← Zurück
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-gray-900 animate-fade-in-up">
          Aktuelle Inserate
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl text-lg animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          Entdecke ausgewählte Fahrzeuge von Privatverkäufern und Händlern — direkt und ohne Umwege.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-wrap gap-3 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          {/* Brand */}
          <div className="relative">
            <select
              value={brandFilter}
              onChange={(e) => { setBrandFilter(e.target.value); setModelFilter(""); }}
              className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
            >
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Model */}
          <div className="relative">
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">Alle Modelle</option>
              {brandFilter !== "Alle Marken" && CAR_BRANDS_MODELS[brandFilter] &&
                CAR_BRANDS_MODELS[brandFilter].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))
              }
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

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
          <div className="relative">
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="appearance-none bg-white dark:bg-[#141414] border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
            >
              {fuelOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

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

          {/* Save search button */}
          {mounted && (
            <button
              onClick={() => {
                const parts: string[] = [];
                if (brandFilter !== "Alle Marken") parts.push(brandFilter);
                if (modelFilter) parts.push(modelFilter);
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
                    modelFilter, variantFilter: "",
                    vehicleTypeFilter: "Alle", vehicleCategoryFilter: "Alle",
                    mwstFilter: "Alle", firstRegFrom: "", firstRegTo: "",
                    huFilter: "Alle", previousOwnersFilter: "Alle",
                    cylinderFilter: "Alle", displacementFilter: 0, tankVolumeFilter: 0,
                    manufacturerColorFilter: "", interiorColorFilter: "Alle Farben",
                    seatMaterialFilter: "Alle", climateZoneFilter: "Alle", rimSizeFilter: "Alle",
                    paintProtectionFilmFilter: "Alle", noRepaintFilter: "Alle",
                    serviceBookFilter: "Alle", manufacturerWarrantyFilter: "Alle",
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

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 p-5 bg-white dark:bg-[#141414] border border-gray-200 rounded-2xl animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Year From */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Baujahr von</label>
                <div className="relative">
                  <select
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Alle</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Year To */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Baujahr bis</label>
                <div className="relative">
                  <select
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Alle</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
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
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Getriebe</label>
                <div className="relative">
                  <select
                    value={transmissionFilter}
                    onChange={(e) => setTransmissionFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {transmissionOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Drive Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Antrieb</label>
                <div className="relative">
                  <select
                    value={driveTypeFilter}
                    onChange={(e) => setDriveTypeFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {driveTypeOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

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
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Farbe</label>
                <div className="relative">
                  <select
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {colorOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Zustand</label>
                <div className="relative">
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {conditionOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Doors */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Türen</label>
                <div className="relative">
                  <select
                    value={doorFilter}
                    onChange={(e) => setDoorFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {doorOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sitze</label>
                <div className="relative">
                  <select
                    value={seatFilter}
                    onChange={(e) => setSeatFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
                  >
                    {seatOptions.map((s) => (
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
            </div>

            {/* Reset advanced filters */}
            {advancedCount > 0 && (
              <button
                onClick={() => {
                  setYearFrom(""); setYearTo("");
                  setMileageFilter(0); setPowerFilter(0);
                  setTransmissionFilter("Alle"); setDriveTypeFilter("Alle");
                  setSellerTypeFilter("Alle"); setAccidentFreeFilter("Alle");
                  setCityFilter("");
                  setColorFilter("Alle Farben"); setConditionFilter("Alle");
                  setDoorFilter("Alle"); setSeatFilter("Alle");
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
                setFuelFilter("Alle Kraftstoffe");
                setPriceFilter(0);
                setYearFrom(""); setYearTo("");
                setMileageFilter(0); setPowerFilter(0);
                setTransmissionFilter("Alle"); setDriveTypeFilter("Alle");
                setSellerTypeFilter("Alle"); setAccidentFreeFilter("Alle");
                setCityFilter("");
                setColorFilter("Alle Farben"); setConditionFilter("Alle");
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
