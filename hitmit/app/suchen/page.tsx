"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SubpageHeader } from "../subpage-header";
import {
  vehicles,
  brandOptions,
  fuelOptions,
  yearOptions,
  transmissionOptions,
  driveTypeOptions,
  sellerTypeOptions,
  colorOptions,
  conditionOptions,
  doorOptions,
  vehicleTypeOptions,
  vehicleCategoryOptions,
  cylinderOptions,
  previousOwnerOptions,
  huOptions,
  interiorColorOptions,
  seatMaterialOptions,
  SAFETY_FEATURE_LIST,
  EQUIPMENT_FEATURE_LIST,
  CAR_BRANDS_MODELS,
  MERCEDES_MOTORIZATIONS,
  emissionClassOptions,
  environmentalBadgeOptions,
  particleFilterOptions,
} from "../vehicles-data";
import type { Vehicle } from "../vehicles-data";
import { useSavedData } from "../use-saved-data";
import { calculateValuation, PRICE_RATING_INFO } from "../valuation";
import { getCoordsByCity, distanceKm } from "../geocoding";

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

const BookmarkIcon = ({ filled = false, className = "w-5 h-5" }: { filled?: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
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

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={ref}>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer text-left"
        >
          <span className="truncate">{selected?.label ?? ""}</span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
            {options.map((o) => (
              <button
                key={String(o.value)}
                type="button"
                onClick={() => { onChange(String(o.value)); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#222] transition-colors ${
                  String(o.value) === String(value)
                    ? "text-[#f14011] font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
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

function ResultCard({
  vehicle,
  currentSearchId,
  isVehicleSaved,
  onToggleSave,
  isFavorited,
  onToggleFavorite,
}: {
  vehicle: Vehicle;
  currentSearchId: string | null;
  isVehicleSaved: boolean;
  onToggleSave: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="card cursor-pointer overflow-hidden group relative">
      <Link href={`/inserate`} className="block">
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
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(); }}
        className={`absolute top-3 left-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors z-10 ${
          isFavorited
            ? "bg-[#f14011]/90 text-white hover:bg-[#f14011]"
            : "bg-white/20 text-white hover:bg-white/40"
        }`}
        aria-label={isFavorited ? "Favorit entfernen" : "Als Favorit speichern"}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorited ? "#fff" : "none"} stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      {currentSearchId && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(); }}
          className={`absolute top-3 left-12 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors z-10 ${
            isVehicleSaved
              ? "bg-[#f14011]/90 text-white hover:bg-[#f14011]"
              : "bg-white/20 text-white hover:bg-white/40"
          }`}
          aria-label={isVehicleSaved ? "Aus Suche entfernen" : "In Suche speichern"}
        >
          <BookmarkIcon filled={isVehicleSaved} className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// NUMERIC INPUT HELPER
// ============================================================================

function NumericInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
      />
    </div>
  );
}

// ============================================================================
// MAIN SEARCH PAGE
// ============================================================================

export default function SuchenPage() {
  // Basic filters
  const [brandFilter, setBrandFilter] = useState("Alle Marken");
  const [fuelFilter, setFuelFilter] = useState("Alle Kraftstoffe");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Extended filters
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [mileageMin, setMileageMin] = useState("");
  const [mileageMax, setMileageMax] = useState("");
  const [powerMin, setPowerMin] = useState("");
  const [powerMax, setPowerMax] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("Alle");
  const [driveTypeFilter, setDriveTypeFilter] = useState("Alle");
  const [sellerTypeFilter, setSellerTypeFilter] = useState("Alle");
  const [accidentFreeFilter, setAccidentFreeFilter] = useState("Alle");
  const [cityFilter, setCityFilter] = useState("");
  const [cityRadius, setCityRadius] = useState("");
  const [colorFilter, setColorFilter] = useState("Alle Farben");
  const [conditionFilter, setConditionFilter] = useState("Alle");
  const [doorFilter, setDoorFilter] = useState("Alle");
  const [seatFilter, setSeatFilter] = useState("");

  // New filters
  const [modelFilter, setModelFilter] = useState("");
  const [brandFilter2, setBrandFilter2] = useState("Alle Marken");
  const [modelFilter2, setModelFilter2] = useState("");
  const [brandFilter3, setBrandFilter3] = useState("Alle Marken");
  const [modelFilter3, setModelFilter3] = useState("");
  const [variantFilter2, setVariantFilter2] = useState("");
  const [variantFilter3, setVariantFilter3] = useState("");
  const [customBrandText, setCustomBrandText] = useState("");
  const [customBrandText2, setCustomBrandText2] = useState("");
  const [customBrandText3, setCustomBrandText3] = useState("");
  const [showBrandRow2, setShowBrandRow2] = useState(false);
  const [showBrandRow3, setShowBrandRow3] = useState(false);
  const [motorizationFilter, setMotorizationFilter] = useState<string[]>([]);
  const [showMotorizationDropdown, setShowMotorizationDropdown] = useState(false);
  const motorizationRef = useRef<HTMLDivElement>(null);
  const [variantFilter, setVariantFilter] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("Alle");
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState("Alle");
  const [mwstFilter, setMwstFilter] = useState("Alle");
  const [firstRegFrom, setFirstRegFrom] = useState("");
  const [firstRegTo, setFirstRegTo] = useState("");
  const [huFilter, setHuFilter] = useState("Alle");
  const [previousOwnersFilter, setPreviousOwnersFilter] = useState("Alle");
  const [cylinderFilter, setCylinderFilter] = useState("Alle");
  const [displacementMin, setDisplacementMin] = useState("");
  const [displacementMax, setDisplacementMax] = useState("");
  const [tankVolumeMin, setTankVolumeMin] = useState("");

  // Additional filters
  const [manufacturerColorFilter, setManufacturerColorFilter] = useState("");
  const [interiorColorFilter, setInteriorColorFilter] = useState("Alle Farben");
  const [seatMaterialFilter, setSeatMaterialFilter] = useState("Alle");
  const [climateZoneFilter, setClimateZoneFilter] = useState("");
  const [rimSizeFilter, setRimSizeFilter] = useState("");
  const [paintProtectionFilmFilter, setPaintProtectionFilmFilter] = useState("Alle");
  const [noRepaintFilter, setNoRepaintFilter] = useState("Alle");
  const [serviceBookFilter, setServiceBookFilter] = useState("Alle");
  const [manufacturerWarrantyFilter, setManufacturerWarrantyFilter] = useState("Alle");
  const [ausstattungSearch, setAusstattungSearch] = useState("");
  const [nonSmokerFilter, setNonSmokerFilter] = useState("Alle");
  const [petFreeFilter, setPetFreeFilter] = useState("Alle");
  const [emissionClassFilter, setEmissionClassFilter] = useState("Alle");
  const [environmentalBadgeFilter, setEnvironmentalBadgeFilter] = useState("Alle");
  const [particleFilterFilter, setParticleFilterFilter] = useState("Alle");
  const [safetyFeaturesFilter, setSafetyFeaturesFilter] = useState<string[]>([]);
  const [equipmentFeaturesFilter, setEquipmentFeaturesFilter] = useState<string[]>([]);
  const [showSafetyFeatures, setShowSafetyFeatures] = useState(false);
  const [showEquipmentFeatures, setShowEquipmentFeatures] = useState(false);

  // Search state
  const [hasSearched, setHasSearched] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const { mounted, saveSearch, toggleVehicleInSearch, isVehicleSavedInSearch, toggleFavorite, isFavorite } = useSavedData();

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

  // Filter logic
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
      if (variantFilter !== "" && !v.variant.toLowerCase().includes(variantFilter.toLowerCase())) return false;
    }

    if (fuelFilter !== "Alle Kraftstoffe") {
      if (fuelFilter.startsWith("Plug-in-Hybrid")) {
        if (!v.fuelType.startsWith("Plug-in-Hybrid")) return false;
      } else {
        if (v.fuelType !== fuelFilter) return false;
      }
    }
    if (priceMin !== "" && v.price < Number(priceMin)) return false;
    if (priceMax !== "" && v.price > Number(priceMax)) return false;
    if (yearFrom !== "" && v.year < Number(yearFrom)) return false;
    if (yearTo !== "" && v.year > Number(yearTo)) return false;
    if (mileageMin !== "" && v.mileage < Number(mileageMin)) return false;
    if (mileageMax !== "" && v.mileage > Number(mileageMax)) return false;
    if (powerMin !== "" && v.powerPs < Number(powerMin)) return false;
    if (powerMax !== "" && v.powerPs > Number(powerMax)) return false;
    if (transmissionFilter !== "Alle") {
      const t = v.transmission.toLowerCase();
      if (transmissionFilter === "Automatik" && !t.includes("automatik") && !t.includes("dsg") && !t.includes("pdk") && !t.includes("tronic") && !t.includes("s tronic")) return false;
      if (transmissionFilter === "Halbautomatik" && !t.includes("halbautomatik")) return false;
      if (transmissionFilter === "Schaltung" && (t.includes("automatik") || t.includes("dsg") || t.includes("pdk") || t.includes("tronic") || t.includes("s tronic") || t.includes("halbautomatik"))) return false;
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
    if (cityFilter !== "") {
      if (cityRadius !== "" && Number(cityRadius) > 0) {
        const from = getCoordsByCity(cityFilter);
        const to = getCoordsByCity(v.city);
        if (from && to) {
          if (distanceKm(from, to) > Number(cityRadius)) return false;
        } else {
          if (!v.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
        }
      } else {
        if (!v.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      }
    }
    if (colorFilter !== "Alle Farben" && !v.color.toLowerCase().includes(colorFilter.toLowerCase())) return false;
    if (conditionFilter !== "Alle" && v.condition !== conditionFilter) return false;
    if (doorFilter !== "Alle") {
      if (doorFilter === "2/3" && !["2", "3"].includes(v.doors)) return false;
      if (doorFilter === "4/5" && !["4", "5"].includes(v.doors)) return false;
      if (doorFilter === "6/7" && !["6", "7"].includes(v.doors)) return false;
    }
    if (seatFilter !== "" && v.seats !== seatFilter) return false;
    if (motorizationFilter.length > 0 && !motorizationFilter.some((m) => v.model.toLowerCase().includes(m.toLowerCase()))) return false;
    if (vehicleTypeFilter !== "Alle" && v.vehicleType !== vehicleTypeFilter) return false;
    if (vehicleCategoryFilter !== "Alle" && v.vehicleCategory !== vehicleCategoryFilter) return false;
    if (mwstFilter !== "Alle") {
      if (mwstFilter === "Ja" && !v.mwstAusweisbar) return false;
      if (mwstFilter === "Nein" && v.mwstAusweisbar) return false;
    }
    if (firstRegFrom !== "" || firstRegTo !== "") {
      const [mStr, yStr] = v.firstRegistration.split("/");
      const regDate = Number(yStr) * 100 + Number(mStr);
      if (firstRegFrom !== "") {
        const [fm, fy] = firstRegFrom.split("/");
        if (regDate < Number(fy) * 100 + Number(fm)) return false;
      }
      if (firstRegTo !== "") {
        const [tm, ty] = firstRegTo.split("/");
        if (regDate > Number(ty) * 100 + Number(tm)) return false;
      }
    }
    if (huFilter !== "Alle") {
      if (!v.hu) return false;
      const [hm, hy] = v.hu.split("/");
      const huDate = new Date(Number(hy), Number(hm) - 1);
      const now = new Date();
      const in12 = new Date();
      in12.setMonth(in12.getMonth() + 12);
      if (huFilter === "Neu (mind. 12 Monate)" && huDate < in12) return false;
      if (huFilter === "Abgelaufen" && huDate >= now) return false;
    }
    if (previousOwnersFilter !== "Alle") {
      if (v.previousOwners === undefined) return false;
      if (previousOwnersFilter === "4+") {
        if (v.previousOwners < 4) return false;
      } else {
        if (v.previousOwners !== Number(previousOwnersFilter)) return false;
      }
    }
    if (cylinderFilter !== "Alle" && v.cylinders !== Number(cylinderFilter)) return false;
    if (displacementMin !== "" && (!v.engineDisplacement || v.engineDisplacement < Number(displacementMin))) return false;
    if (displacementMax !== "" && (!v.engineDisplacement || v.engineDisplacement > Number(displacementMax))) return false;
    if (tankVolumeMin !== "" && (!v.tankVolume || v.tankVolume < Number(tankVolumeMin))) return false;
    if (manufacturerColorFilter !== "" && !v.color.toLowerCase().includes(manufacturerColorFilter.toLowerCase())) return false;
    if (interiorColorFilter !== "Alle Farben" && (!v.interiorColor || !v.interiorColor.toLowerCase().includes(interiorColorFilter.toLowerCase()))) return false;
    if (seatMaterialFilter !== "Alle" && v.seatMaterial !== seatMaterialFilter) return false;
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
    if (emissionClassFilter !== "Alle" && v.emissionClass !== emissionClassFilter) return false;
    if (environmentalBadgeFilter !== "Alle" && v.environmentalBadge !== environmentalBadgeFilter) return false;
    if (particleFilterFilter !== "Alle") {
      if (particleFilterFilter === "Ja" && !v.particleFilter) return false;
      if (particleFilterFilter === "Nein" && v.particleFilter) return false;
    }
    if (ausstattungSearch.trim() !== "") {
      const allFeatures = [...v.comfortFeatures, ...v.safetyFeatures, ...v.exteriorFeatures, ...v.multimediaFeatures];
      const terms = ausstattungSearch.toLowerCase().split(",").map((t) => t.trim()).filter(Boolean);
      if (!terms.every((term) => allFeatures.some((f) => f.toLowerCase().includes(term)))) return false;
    }
    if (safetyFeaturesFilter.length > 0) {
      const allFeatures = [...v.safetyFeatures];
      if (!safetyFeaturesFilter.every((f) => allFeatures.some((vf) => vf.toLowerCase().includes(f.toLowerCase())))) return false;
    }
    if (equipmentFeaturesFilter.length > 0) {
      const allFeatures = [...v.comfortFeatures, ...v.exteriorFeatures, ...v.multimediaFeatures];
      if (!equipmentFeaturesFilter.every((f) => allFeatures.some((vf) => vf.toLowerCase().includes(f.toLowerCase())))) return false;
    }
    return true;
  });

  const activeFilterCount = [
    brandFilter !== "Alle Marken" || brandFilter2 !== "Alle Marken" || brandFilter3 !== "Alle Marken",
    fuelFilter !== "Alle Kraftstoffe",
    priceMin !== "",
    priceMax !== "",
    yearFrom !== "",
    yearTo !== "",
    mileageMin !== "",
    mileageMax !== "",
    powerMin !== "",
    powerMax !== "",
    transmissionFilter !== "Alle",
    driveTypeFilter !== "Alle",
    sellerTypeFilter !== "Alle",
    accidentFreeFilter !== "Alle",
    cityFilter !== "",
    cityRadius !== "",
    colorFilter !== "Alle Farben",
    conditionFilter !== "Alle",
    doorFilter !== "Alle",
    seatFilter !== "",
    motorizationFilter.length > 0,
    vehicleTypeFilter !== "Alle",
    vehicleCategoryFilter !== "Alle",
    mwstFilter !== "Alle",
    firstRegFrom !== "",
    firstRegTo !== "",
    huFilter !== "Alle",
    previousOwnersFilter !== "Alle",
    cylinderFilter !== "Alle",
    displacementMin !== "",
    displacementMax !== "",
    tankVolumeMin !== "",
    manufacturerColorFilter !== "",
    interiorColorFilter !== "Alle Farben",
    seatMaterialFilter !== "Alle",
    climateZoneFilter !== "",
    rimSizeFilter !== "",
    paintProtectionFilmFilter !== "Alle",
    noRepaintFilter !== "Alle",
    serviceBookFilter !== "Alle",
    manufacturerWarrantyFilter !== "Alle",
    nonSmokerFilter !== "Alle",
    petFreeFilter !== "Alle",
    emissionClassFilter !== "Alle",
    environmentalBadgeFilter !== "Alle",
    particleFilterFilter !== "Alle",
    ausstattungSearch.trim() !== "",
    safetyFeaturesFilter.length > 0,
    equipmentFeaturesFilter.length > 0,
  ].filter(Boolean).length;

  const resetAll = () => {
    setBrandFilter("Alle Marken");
    setFuelFilter("Alle Kraftstoffe");
    setPriceMin(""); setPriceMax("");
    setYearFrom(""); setYearTo("");
    setMileageMin(""); setMileageMax(""); setPowerMin(""); setPowerMax("");
    setTransmissionFilter("Alle"); setDriveTypeFilter("Alle");
    setSellerTypeFilter("Alle"); setAccidentFreeFilter("Alle");
    setCityFilter(""); setCityRadius("");
    setColorFilter("Alle Farben"); setConditionFilter("Alle");
    setDoorFilter("Alle"); setSeatFilter("");
    setModelFilter("");
    setBrandFilter2("Alle Marken"); setModelFilter2(""); setVariantFilter2(""); setCustomBrandText2("");
    setBrandFilter3("Alle Marken"); setModelFilter3(""); setVariantFilter3(""); setCustomBrandText3("");
    setCustomBrandText("");
    setShowBrandRow2(false); setShowBrandRow3(false);
    setVariantFilter("");
    setVehicleTypeFilter("Alle"); setVehicleCategoryFilter("Alle");
    setMwstFilter("Alle"); setFirstRegFrom(""); setFirstRegTo("");
    setHuFilter("Alle"); setPreviousOwnersFilter("Alle");
    setCylinderFilter("Alle"); setDisplacementMin(""); setDisplacementMax(""); setTankVolumeMin("");
    setManufacturerColorFilter(""); setInteriorColorFilter("Alle Farben");
    setSeatMaterialFilter("Alle"); setClimateZoneFilter(""); setRimSizeFilter("");
    setPaintProtectionFilmFilter("Alle"); setNoRepaintFilter("Alle");
    setServiceBookFilter("Alle"); setManufacturerWarrantyFilter("Alle");
    setNonSmokerFilter("Alle"); setPetFreeFilter("Alle");
    setEmissionClassFilter("Alle"); setEnvironmentalBadgeFilter("Alle"); setParticleFilterFilter("Alle");
    setAusstattungSearch("");
    setSafetyFeaturesFilter([]); setEquipmentFeaturesFilter([]);
  };

  const handleSaveSearch = () => {
    const parts: string[] = [];
    if (brandFilter !== "Alle Marken") parts.push(modelFilter ? `${brandFilter} ${modelFilter}` : brandFilter);
    if (variantFilter) parts.push(variantFilter);
    if (brandFilter2 !== "Alle Marken") parts.push(modelFilter2 ? `${brandFilter2} ${modelFilter2}` : brandFilter2);
    if (variantFilter2) parts.push(variantFilter2);
    if (brandFilter3 !== "Alle Marken") parts.push(modelFilter3 ? `${brandFilter3} ${modelFilter3}` : brandFilter3);
    if (variantFilter3) parts.push(variantFilter3);
    if (fuelFilter !== "Alle Kraftstoffe") parts.push(fuelFilter);
    if (priceMin !== "") parts.push(`ab ${Number(priceMin).toLocaleString("de-DE")} €`);
    if (priceMax !== "") parts.push(`bis ${Number(priceMax).toLocaleString("de-DE")} €`);
    if (yearFrom) parts.push(`ab ${yearFrom}`);
    if (yearTo) parts.push(`bis ${yearTo}`);
    if (mileageMin !== "") parts.push(`ab ${Number(mileageMin).toLocaleString("de-DE")} km`);
    if (mileageMax !== "") parts.push(`bis ${Number(mileageMax).toLocaleString("de-DE")} km`);
    if (powerMin !== "") parts.push(`ab ${powerMin} PS`);
    if (powerMax !== "") parts.push(`bis ${powerMax} PS`);
    if (transmissionFilter !== "Alle") parts.push(transmissionFilter);
    if (driveTypeFilter !== "Alle") parts.push(driveTypeFilter);
    if (sellerTypeFilter !== "Alle") parts.push(sellerTypeFilter);
    if (accidentFreeFilter !== "Alle") parts.push("Unfallfrei");
    if (cityFilter) parts.push(cityRadius ? `${cityFilter} +${cityRadius} km` : cityFilter);
    if (colorFilter !== "Alle Farben") parts.push(colorFilter);
    if (conditionFilter !== "Alle") parts.push(conditionFilter);
    if (doorFilter !== "Alle") parts.push(`${doorFilter} Türen`);
    if (seatFilter !== "") parts.push(`${seatFilter} Sitze`);
    if (motorizationFilter.length > 0) parts.push(motorizationFilter.join(", "));
    if (vehicleTypeFilter !== "Alle") parts.push(vehicleTypeFilter);
    if (vehicleCategoryFilter !== "Alle") parts.push(vehicleCategoryFilter);
    if (mwstFilter !== "Alle") parts.push(`MwSt: ${mwstFilter}`);
    if (firstRegFrom) parts.push(`EZ ab ${firstRegFrom}`);
    if (firstRegTo) parts.push(`EZ bis ${firstRegTo}`);
    if (huFilter !== "Alle") parts.push(`HU: ${huFilter}`);
    if (previousOwnersFilter !== "Alle") parts.push(`${previousOwnersFilter} Vorbesitzer`);
    if (cylinderFilter !== "Alle") parts.push(`${cylinderFilter} Zylinder`);
    if (displacementMin !== "") parts.push(`ab ${Number(displacementMin).toLocaleString("de-DE")} ccm`);
    if (displacementMax !== "") parts.push(`bis ${Number(displacementMax).toLocaleString("de-DE")} ccm`);
    if (tankVolumeMin !== "") parts.push(`ab ${tankVolumeMin} L`);
    if (manufacturerColorFilter) parts.push(`Farbe: ${manufacturerColorFilter}`);
    if (interiorColorFilter !== "Alle Farben") parts.push(`Innen: ${interiorColorFilter}`);
    if (seatMaterialFilter !== "Alle") parts.push(seatMaterialFilter);
    if (climateZoneFilter !== "") parts.push(`${climateZoneFilter}-Zonen Klima`);
    if (rimSizeFilter !== "") parts.push(`${rimSizeFilter} Zoll`);
    if (paintProtectionFilmFilter !== "Alle") parts.push(`Steinschlagfolie: ${paintProtectionFilmFilter}`);
    if (noRepaintFilter !== "Alle") parts.push(`Nachlackierungsfrei: ${noRepaintFilter}`);
    if (serviceBookFilter !== "Alle") parts.push(`Scheckheft: ${serviceBookFilter}`);
    if (manufacturerWarrantyFilter !== "Alle") parts.push(`Garantie: ${manufacturerWarrantyFilter}`);
    if (nonSmokerFilter !== "Alle") parts.push(`Nichtraucher: ${nonSmokerFilter}`);
    if (petFreeFilter !== "Alle") parts.push(`Tierfrei: ${petFreeFilter}`);
    if (emissionClassFilter !== "Alle") parts.push(emissionClassFilter);
    if (environmentalBadgeFilter !== "Alle") parts.push(`Plakette: ${environmentalBadgeFilter}`);
    if (particleFilterFilter !== "Alle") parts.push(`Partikelfilter: ${particleFilterFilter}`);
    if (ausstattungSearch.trim()) parts.push(`"${ausstattungSearch.trim()}"`);
    if (safetyFeaturesFilter.length > 0) parts.push(`${safetyFeaturesFilter.length}x Sicherheit`);
    if (equipmentFeaturesFilter.length > 0) parts.push(`${equipmentFeaturesFilter.length}x Ausstattung`);
    const label = parts.length > 0 ? parts.join(", ") : "Alle Fahrzeuge";
    const newId = saveSearch(
      label,
      {
        brandFilter, fuelFilter, priceMin, priceMax,
        yearFrom, yearTo,
        mileageMin, mileageMax, powerMin, powerMax,
        transmissionFilter, driveTypeFilter,
        sellerTypeFilter, accidentFreeFilter,
        cityFilter, cityRadius,
        colorFilter, conditionFilter,
        doorFilter, seatFilter,
        modelFilter, brandFilter2, modelFilter2, brandFilter3, modelFilter3,
        motorizationFilter, variantFilter,
        vehicleTypeFilter, vehicleCategoryFilter,
        mwstFilter, firstRegFrom, firstRegTo,
        huFilter, previousOwnersFilter,
        cylinderFilter, displacementMin, displacementMax, tankVolumeMin,
        manufacturerColorFilter, interiorColorFilter,
        seatMaterialFilter, climateZoneFilter, rimSizeFilter,
        paintProtectionFilmFilter, noRepaintFilter,
        serviceBookFilter, manufacturerWarrantyFilter,
        nonSmokerFilter, petFreeFilter,
        emissionClassFilter, environmentalBadgeFilter, particleFilterFilter,
        ausstattungSearch, safetyFeaturesFilter, equipmentFeaturesFilter,
      },
      filtered.map((v) => v.id),
    );
    setCurrentSearchId(newId);
    setSearchSaved(true);
    setTimeout(() => setSearchSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

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
            {/* Row 1: Marke + Modell (always visible) */}
            <FilterSelect
              label="Marke"
              value={brandFilter}
              onChange={(v) => { setBrandFilter(v); setModelFilter(""); setMotorizationFilter([]); setCustomBrandText(""); }}
              options={brandOptions.map((b) => ({ value: b, label: b }))}
            />
            {brandFilter === "Andere" ? (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Freitext-Suche</label>
                <input
                  type="text"
                  value={customBrandText}
                  onChange={(e) => setCustomBrandText(e.target.value)}
                  placeholder="Marke / Modell eingeben"
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                />
              </div>
            ) : (
              <FilterSelect
                label="Modell"
                value={modelFilter}
                onChange={(v) => { setModelFilter(v); setMotorizationFilter([]); }}
                options={[
                  { value: "", label: "Alle Modelle" },
                  ...(brandFilter !== "Alle Marken" && CAR_BRANDS_MODELS[brandFilter]
                    ? CAR_BRANDS_MODELS[brandFilter].map((m) => ({ value: m, label: m }))
                    : []),
                ]}
              />
            )}
            {brandFilter === "Mercedes-Benz" && modelFilter !== "" && MERCEDES_MOTORIZATIONS[modelFilter] && (
              <div className="relative" ref={motorizationRef}>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Motorisierung</label>
                <button
                  type="button"
                  onClick={() => setShowMotorizationDropdown(!showMotorizationDropdown)}
                  className="w-full flex items-center justify-between bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                >
                  <span className="truncate">
                    {motorizationFilter.length === 0
                      ? "Alle Motorisierungen"
                      : `${motorizationFilter.length} gewählt`}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 ml-2 shrink-0 transition-transform ${showMotorizationDropdown ? "rotate-180" : ""}`} />
                </button>
                {showMotorizationDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
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
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Variante</label>
              <input
                type="text"
                value={variantFilter}
                onChange={(e) => setVariantFilter(e.target.value)}
                placeholder="z.B. Clubsport, AMG"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
            {/* "+" Button to add Row 2 */}
            {brandFilter !== "Alle Marken" && !showBrandRow2 && (
              <div className="col-span-full">
                <button
                  type="button"
                  onClick={() => setShowBrandRow2(true)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#f14011] border border-dashed border-[#f14011]/40 rounded-xl hover:bg-[#f14011]/5 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                  Weitere Marke hinzufügen
                </button>
              </div>
            )}

            {/* Row 2: Marke + Modell + Variante (conditional) — full-width sub-row */}
            {showBrandRow2 && (
              <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <FilterSelect
                  label="Marke 2"
                  value={brandFilter2}
                  onChange={(v) => { setBrandFilter2(v); setModelFilter2(""); setVariantFilter2(""); setCustomBrandText2(""); }}
                  options={brandOptions.map((b) => ({ value: b, label: b }))}
                />
                {brandFilter2 === "Andere" ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Freitext-Suche 2</label>
                    <input
                      type="text"
                      value={customBrandText2}
                      onChange={(e) => setCustomBrandText2(e.target.value)}
                      placeholder="Marke / Modell eingeben"
                      className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                    />
                  </div>
                ) : (
                  <FilterSelect
                    label="Modell 2"
                    value={modelFilter2}
                    onChange={setModelFilter2}
                    options={[
                      { value: "", label: "Alle Modelle" },
                      ...(brandFilter2 !== "Alle Marken" && CAR_BRANDS_MODELS[brandFilter2]
                        ? CAR_BRANDS_MODELS[brandFilter2].map((m) => ({ value: m, label: m }))
                        : []),
                    ]}
                  />
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Variante 2</label>
                  <input
                    type="text"
                    value={variantFilter2}
                    onChange={(e) => setVariantFilter2(e.target.value)}
                    placeholder="z.B. Clubsport, AMG"
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-end">
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
                    className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-gray-400 border border-gray-200 dark:border-[#2a2a2a] rounded-xl hover:text-red-500 hover:border-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* "+" Button to add Row 3 — own line below row 2 */}
            {showBrandRow2 && brandFilter2 !== "Alle Marken" && !showBrandRow3 && (
              <div className="col-span-full">
                <button
                  type="button"
                  onClick={() => setShowBrandRow3(true)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#f14011] border border-dashed border-[#f14011]/40 rounded-xl hover:bg-[#f14011]/5 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                  Weitere Marke hinzufügen
                </button>
              </div>
            )}

            {/* Row 3: Marke + Modell + Variante (conditional) — full-width sub-row */}
            {showBrandRow3 && (
              <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <FilterSelect
                  label="Marke 3"
                  value={brandFilter3}
                  onChange={(v) => { setBrandFilter3(v); setModelFilter3(""); setVariantFilter3(""); setCustomBrandText3(""); }}
                  options={brandOptions.map((b) => ({ value: b, label: b }))}
                />
                {brandFilter3 === "Andere" ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Freitext-Suche 3</label>
                    <input
                      type="text"
                      value={customBrandText3}
                      onChange={(e) => setCustomBrandText3(e.target.value)}
                      placeholder="Marke / Modell eingeben"
                      className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                    />
                  </div>
                ) : (
                  <FilterSelect
                    label="Modell 3"
                    value={modelFilter3}
                    onChange={setModelFilter3}
                    options={[
                      { value: "", label: "Alle Modelle" },
                      ...(brandFilter3 !== "Alle Marken" && CAR_BRANDS_MODELS[brandFilter3]
                        ? CAR_BRANDS_MODELS[brandFilter3].map((m) => ({ value: m, label: m }))
                        : []),
                    ]}
                  />
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Variante 3</label>
                  <input
                    type="text"
                    value={variantFilter3}
                    onChange={(e) => setVariantFilter3(e.target.value)}
                    placeholder="z.B. Clubsport, AMG"
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => { setBrandFilter3("Alle Marken"); setModelFilter3(""); setVariantFilter3(""); setCustomBrandText3(""); setShowBrandRow3(false); }}
                    className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-gray-400 border border-gray-200 dark:border-[#2a2a2a] rounded-xl hover:text-red-500 hover:border-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            )}
            <FilterSelect
              label="Fahrzeugtyp"
              value={vehicleTypeFilter}
              onChange={setVehicleTypeFilter}
              options={vehicleTypeOptions.map((v) => ({ value: v, label: v }))}
            />
            <FilterSelect
              label="Karosserieform"
              value={vehicleCategoryFilter}
              onChange={setVehicleCategoryFilter}
              options={vehicleCategoryOptions.map((c) => ({ value: c, label: c }))}
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
              label="Außenfarbe"
              value={colorFilter}
              onChange={setColorFilter}
              options={colorOptions.map((c) => ({ value: c, label: c }))}
            />
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Herstellerfarbe</label>
              <input
                type="text"
                value={manufacturerColorFilter}
                onChange={(e) => setManufacturerColorFilter(e.target.value)}
                placeholder="z.B. Nardograu"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Section: Preis & Leistung */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Preis & Leistung</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <NumericInput label="Preis von (€)" value={priceMin} onChange={setPriceMin} placeholder="z.B. 10000" />
            <NumericInput label="Preis bis (€)" value={priceMax} onChange={setPriceMax} placeholder="z.B. 50000" />
            <NumericInput label="Leistung ab (PS)" value={powerMin} onChange={setPowerMin} placeholder="z.B. 200" />
            <NumericInput label="Leistung bis (PS)" value={powerMax} onChange={setPowerMax} placeholder="z.B. 500" />
            <NumericInput label="Kilometerstand ab" value={mileageMin} onChange={setMileageMin} placeholder="z.B. 10000" />
            <NumericInput label="Kilometerstand bis" value={mileageMax} onChange={setMileageMax} placeholder="z.B. 50000" />
            <FilterSelect
              label="Getriebe"
              value={transmissionFilter}
              onChange={setTransmissionFilter}
              options={transmissionOptions.map((t) => ({ value: t, label: t }))}
            />
            <FilterSelect
              label="Zylinder"
              value={cylinderFilter}
              onChange={setCylinderFilter}
              options={cylinderOptions.map((c) => ({ value: c, label: c }))}
            />
            <NumericInput label="Hubraum von (ccm)" value={displacementMin} onChange={setDisplacementMin} placeholder="z.B. 1500" />
            <NumericInput label="Hubraum bis (ccm)" value={displacementMax} onChange={setDisplacementMax} placeholder="z.B. 3000" />
            <NumericInput label="Tankvolumen ab (L)" value={tankVolumeMin} onChange={setTankVolumeMin} placeholder="z.B. 50" />
          </div>

          {/* Section: Details */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Erstzulassung von</label>
              <input
                type="text"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="z.B. 2018"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Erstzulassung bis</label>
              <input
                type="text"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="z.B. 2024"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
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
            <NumericInput label="Sitze" value={seatFilter} onChange={setSeatFilter} placeholder="z.B. 5" />
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
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Umkreis {cityRadius ? `${cityRadius} km` : "(beliebig)"}
              </label>
              {(() => {
                const radiusSteps = [0, 50, 100, 250, 500, 1000];
                const idx = radiusSteps.indexOf(Number(cityRadius) || 0);
                const sliderIdx = idx >= 0 ? idx : 0;
                return (
                  <>
                    <input
                      type="range"
                      min="0"
                      max={radiusSteps.length - 1}
                      step="1"
                      value={sliderIdx}
                      onChange={(e) => {
                        const v = radiusSteps[Number(e.target.value)];
                        setCityRadius(v === 0 ? "" : String(v));
                      }}
                      className="w-full h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#f14011]"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>Alle</span>
                      <span>50</span>
                      <span>100</span>
                      <span>250</span>
                      <span>500</span>
                      <span>1000 km</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Erstzulassung von</label>
              <input
                type="text"
                value={firstRegFrom}
                onChange={(e) => setFirstRegFrom(e.target.value)}
                placeholder="MM/JJJJ"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Erstzulassung bis</label>
              <input
                type="text"
                value={firstRegTo}
                onChange={(e) => setFirstRegTo(e.target.value)}
                placeholder="MM/JJJJ"
                className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={huFilter === "Neu (mind. 12 Monate)"}
                  onChange={(e) => setHuFilter(e.target.checked ? "Neu (mind. 12 Monate)" : "Alle")}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">HU neu</span>
              </label>
            </div>
            <FilterSelect
              label="Vorbesitzer"
              value={previousOwnersFilter}
              onChange={setPreviousOwnersFilter}
              options={previousOwnerOptions.map((p) => ({ value: p, label: p }))}
            />
            <FilterSelect
              label="MwSt. ausweisbar"
              value={mwstFilter}
              onChange={setMwstFilter}
              options={[{ value: "Alle", label: "Alle" }, { value: "Ja", label: "Ja" }, { value: "Nein", label: "Nein" }]}
            />
          </div>

          {/* Section: Interieur */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Interieur</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label="Innenfarbe"
              value={interiorColorFilter}
              onChange={setInteriorColorFilter}
              options={interiorColorOptions.map((c) => ({ value: c, label: c }))}
            />
            <FilterSelect
              label="Sitzmaterial"
              value={seatMaterialFilter}
              onChange={setSeatMaterialFilter}
              options={seatMaterialOptions.map((s) => ({ value: s, label: s }))}
            />
            <NumericInput label="Klimazonen" value={climateZoneFilter} onChange={setClimateZoneFilter} placeholder="z.B. 2" />
            <NumericInput label="Felgengröße (Zoll)" value={rimSizeFilter} onChange={setRimSizeFilter} placeholder="z.B. 19" />
          </div>

          {/* Section: Zustand & Garantie */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Zustand & Garantie</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
          </div>

          {/* Section: Umwelt & Emissionen */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Umwelt & Emissionen</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label="Schadstoffklasse"
              value={emissionClassFilter}
              onChange={setEmissionClassFilter}
              options={emissionClassOptions.map((o) => ({ value: o, label: o }))}
            />
            <FilterSelect
              label="Umweltplakette"
              value={environmentalBadgeFilter}
              onChange={setEnvironmentalBadgeFilter}
              options={environmentalBadgeOptions.map((o) => ({ value: o, label: o }))}
            />
            <FilterSelect
              label="Rußpartikelfilter"
              value={particleFilterFilter}
              onChange={setParticleFilterFilter}
              options={particleFilterOptions.map((o) => ({ value: o, label: o }))}
            />
          </div>

          {/* Section: Freie Ausstattungssuche */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Ausstattungssuche</h3>
          <div className="mb-6">
            <input
              type="text"
              value={ausstattungSearch}
              onChange={(e) => setAusstattungSearch(e.target.value)}
              placeholder="z.B. Panoramadach, Sitzheizung, Apple CarPlay"
              className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1.5">Mehrere Begriffe mit Komma trennen – durchsucht alle Ausstattungskategorien</p>
          </div>

          {/* Section: Sicherheit */}
          <div className="mb-6">
            <button
              onClick={() => setShowSafetyFeatures(!showSafetyFeatures)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4"
            >
              Sicherheit
              {safetyFeaturesFilter.length > 0 && (
                <span className="px-2 py-0.5 bg-[#f14011] text-white text-xs font-bold rounded-full normal-case tracking-normal">
                  {safetyFeaturesFilter.length}
                </span>
              )}
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showSafetyFeatures ? "rotate-180" : ""}`} />
            </button>
            {showSafetyFeatures && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {SAFETY_FEATURE_LIST.map((feature) => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={safetyFeaturesFilter.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSafetyFeaturesFilter([...safetyFeaturesFilter, feature]);
                        } else {
                          setSafetyFeaturesFilter(safetyFeaturesFilter.filter((f) => f !== feature));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section: Ausstattung */}
          <div className="mb-6">
            <button
              onClick={() => setShowEquipmentFeatures(!showEquipmentFeatures)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4"
            >
              Ausstattung
              {equipmentFeaturesFilter.length > 0 && (
                <span className="px-2 py-0.5 bg-[#f14011] text-white text-xs font-bold rounded-full normal-case tracking-normal">
                  {equipmentFeaturesFilter.length}
                </span>
              )}
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showEquipmentFeatures ? "rotate-180" : ""}`} />
            </button>
            {showEquipmentFeatures && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {EQUIPMENT_FEATURE_LIST.map((feature) => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={equipmentFeaturesFilter.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEquipmentFeaturesFilter([...equipmentFeaturesFilter, feature]);
                        } else {
                          setEquipmentFeaturesFilter(equipmentFeaturesFilter.filter((f) => f !== feature));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#f14011] focus:ring-[#f14011] cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setHasSearched(true)}
              className="btn btn-primary btn-lg group"
            >
              <SearchIcon className="w-5 h-5" />
              Suchen
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">{filtered.length}</span>
            </button>

            {activeFilterCount > 0 && (
              <button onClick={() => { resetAll(); setHasSearched(false); }} className="text-sm text-[#f14011] font-semibold hover:underline">
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
      {hasSearched && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          {currentSearchId && (
            <p className="text-sm text-gray-400 mb-4">
              Klicke auf das Lesezeichen-Symbol, um Fahrzeuge dieser Suche zuzuordnen.
            </p>
          )}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="animate-fade-in-up"
                  style={{ opacity: 0, animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <ResultCard
                    vehicle={vehicle}
                    currentSearchId={currentSearchId}
                    isVehicleSaved={currentSearchId ? isVehicleSavedInSearch(currentSearchId, vehicle.id) : false}
                    onToggleSave={() => { if (currentSearchId) toggleVehicleInSearch(currentSearchId, vehicle.id); }}
                    isFavorited={mounted ? isFavorite(vehicle.id) : false}
                    onToggleFavorite={() => toggleFavorite(vehicle.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
              <p className="text-gray-400 text-lg">Keine Fahrzeuge gefunden.</p>
              <button onClick={() => { resetAll(); setHasSearched(false); }} className="mt-4 text-[#f14011] font-semibold hover:underline">
                Filter zurücksetzen
              </button>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#2a2a2a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
