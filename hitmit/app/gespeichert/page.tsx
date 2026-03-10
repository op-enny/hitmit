"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SubpageHeader } from "../subpage-header";
import {
  vehicles,
} from "../vehicles-data";
import type { Vehicle } from "../vehicles-data";
import { useSavedData } from "../use-saved-data";
import type { SavedSearch } from "../use-saved-data";
import { getDealers } from "../dealer-utils";
import { StarRating } from "../star-rating";

// ============================================================================
// HELPERS
// ============================================================================

function applyFilters(filters: SavedSearch["filters"]): Vehicle[] {
  return vehicles.filter((v) => {
    if (filters.brandFilter !== "Alle Marken" && v.brand !== filters.brandFilter) return false;
    if (filters.fuelFilter !== "Alle Kraftstoffe" && v.fuelType !== filters.fuelFilter) return false;
    // Price: direct comparison
    if (filters.priceMin !== "" && v.price < Number(filters.priceMin)) return false;
    if (filters.priceMax !== "" && v.price > Number(filters.priceMax)) return false;
    if (filters.yearFrom && v.year < Number(filters.yearFrom)) return false;
    if (filters.yearTo && v.year > Number(filters.yearTo)) return false;
    // Mileage: direct comparison
    if (filters.mileageMax !== "" && v.mileage > Number(filters.mileageMax)) return false;
    // Power: direct comparison
    if (filters.powerMin !== "" && v.powerPs < Number(filters.powerMin)) return false;
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
    if (filters.seatFilter && filters.seatFilter !== "" && filters.seatFilter !== "Alle" && v.seats !== filters.seatFilter) return false;
    if (filters.modelFilter && !v.model.toLowerCase().includes(filters.modelFilter.toLowerCase())) return false;
    if (filters.motorizationFilter && filters.motorizationFilter.length > 0 && !filters.motorizationFilter.some((m) => v.model.toLowerCase().includes(m.toLowerCase()))) return false;
    if (filters.variantFilter && !v.variant.toLowerCase().includes(filters.variantFilter.toLowerCase())) return false;
    if (filters.vehicleTypeFilter && filters.vehicleTypeFilter !== "Alle" && v.vehicleType !== filters.vehicleTypeFilter) return false;
    if (filters.vehicleCategoryFilter && filters.vehicleCategoryFilter !== "Alle" && v.vehicleCategory !== filters.vehicleCategoryFilter) return false;
    if (filters.mwstFilter && filters.mwstFilter !== "Alle") {
      if (filters.mwstFilter === "Ja" && !v.mwstAusweisbar) return false;
      if (filters.mwstFilter === "Nein" && v.mwstAusweisbar) return false;
    }
    if (filters.firstRegFrom || filters.firstRegTo) {
      const [mStr, yStr] = v.firstRegistration.split("/");
      const regDate = Number(yStr) * 100 + Number(mStr);
      if (filters.firstRegFrom) {
        const [fm, fy] = filters.firstRegFrom.split("/");
        if (regDate < Number(fy) * 100 + Number(fm)) return false;
      }
      if (filters.firstRegTo) {
        const [tm, ty] = filters.firstRegTo.split("/");
        if (regDate > Number(ty) * 100 + Number(tm)) return false;
      }
    }
    if (filters.huFilter && filters.huFilter !== "Alle") {
      if (!v.hu) return false;
      const [hm, hy] = v.hu.split("/");
      const huDate = new Date(Number(hy), Number(hm) - 1);
      const now = new Date();
      const in12 = new Date();
      in12.setMonth(in12.getMonth() + 12);
      if (filters.huFilter === "Neu (mind. 12 Monate)" && huDate < in12) return false;
      if (filters.huFilter === "Abgelaufen" && huDate >= now) return false;
    }
    if (filters.previousOwnersFilter && filters.previousOwnersFilter !== "Alle") {
      if (v.previousOwners === undefined) return false;
      if (filters.previousOwnersFilter === "4+") {
        if (v.previousOwners < 4) return false;
      } else {
        if (v.previousOwners !== Number(filters.previousOwnersFilter)) return false;
      }
    }
    if (filters.cylinderFilter && filters.cylinderFilter !== "Alle" && v.cylinders !== Number(filters.cylinderFilter)) return false;
    // Displacement: direct comparison
    if (filters.displacementMin !== "" && (!v.engineDisplacement || v.engineDisplacement < Number(filters.displacementMin))) return false;
    if (filters.displacementMax !== "" && (!v.engineDisplacement || v.engineDisplacement > Number(filters.displacementMax))) return false;
    // Tank volume: direct comparison
    if (filters.tankVolumeMin !== "" && (!v.tankVolume || v.tankVolume < Number(filters.tankVolumeMin))) return false;
    if (filters.manufacturerColorFilter && !v.color.toLowerCase().includes(filters.manufacturerColorFilter.toLowerCase())) return false;
    if (filters.interiorColorFilter && filters.interiorColorFilter !== "Alle Farben" && (!v.interiorColor || !v.interiorColor.toLowerCase().includes(filters.interiorColorFilter.toLowerCase()))) return false;
    if (filters.seatMaterialFilter && filters.seatMaterialFilter !== "Alle" && v.seatMaterial !== filters.seatMaterialFilter) return false;
    if (filters.climateZoneFilter && filters.climateZoneFilter !== "" && filters.climateZoneFilter !== "Alle" && v.climateZones !== Number(filters.climateZoneFilter)) return false;
    if (filters.rimSizeFilter && filters.rimSizeFilter !== "" && filters.rimSizeFilter !== "Alle" && v.rimSize !== Number(filters.rimSizeFilter)) return false;
    if (filters.paintProtectionFilmFilter && filters.paintProtectionFilmFilter !== "Alle") {
      if (filters.paintProtectionFilmFilter === "Ja" && !v.paintProtectionFilm) return false;
      if (filters.paintProtectionFilmFilter === "Nein" && v.paintProtectionFilm) return false;
    }
    if (filters.noRepaintFilter && filters.noRepaintFilter !== "Alle") {
      if (filters.noRepaintFilter === "Ja" && !v.noRepaint) return false;
      if (filters.noRepaintFilter === "Nein" && v.noRepaint) return false;
    }
    if (filters.serviceBookFilter && filters.serviceBookFilter !== "Alle") {
      if (filters.serviceBookFilter === "Ja" && !v.serviceBookMaintained) return false;
      if (filters.serviceBookFilter === "Nein" && v.serviceBookMaintained) return false;
    }
    if (filters.manufacturerWarrantyFilter && filters.manufacturerWarrantyFilter !== "Alle") {
      if (filters.manufacturerWarrantyFilter === "Vorhanden" && !v.manufacturerWarranty) return false;
      if (filters.manufacturerWarrantyFilter === "Nicht vorhanden" && v.manufacturerWarranty) return false;
    }
    if (filters.safetyFeaturesFilter && filters.safetyFeaturesFilter.length > 0) {
      const allFeatures = [...v.safetyFeatures];
      if (!filters.safetyFeaturesFilter.every((f: string) => allFeatures.some((vf) => vf.toLowerCase().includes(f.toLowerCase())))) return false;
    }
    if (filters.equipmentFeaturesFilter && filters.equipmentFeaturesFilter.length > 0) {
      const allFeatures = [...v.comfortFeatures, ...v.exteriorFeatures, ...v.multimediaFeatures];
      if (!filters.equipmentFeaturesFilter.every((f: string) => allFeatures.some((vf) => vf.toLowerCase().includes(f.toLowerCase())))) return false;
    }
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
  if (filters.priceMin !== "") params.set("priceMin", filters.priceMin);
  if (filters.priceMax !== "") params.set("priceMax", filters.priceMax);
  if (filters.yearFrom) params.set("yearFrom", filters.yearFrom);
  if (filters.yearTo) params.set("yearTo", filters.yearTo);
  if (filters.mileageMax !== "") params.set("mileageMax", filters.mileageMax);
  if (filters.powerMin !== "") params.set("powerMin", filters.powerMin);
  if (filters.transmissionFilter && filters.transmissionFilter !== "Alle") params.set("transmission", filters.transmissionFilter);
  if (filters.driveTypeFilter && filters.driveTypeFilter !== "Alle") params.set("driveType", filters.driveTypeFilter);
  if (filters.sellerTypeFilter && filters.sellerTypeFilter !== "Alle") params.set("sellerType", filters.sellerTypeFilter);
  if (filters.accidentFreeFilter === "Nur unfallfrei") params.set("accidentFree", "ja");
  if (filters.cityFilter) params.set("city", filters.cityFilter);
  if (filters.colorFilter && filters.colorFilter !== "Alle Farben") params.set("color", filters.colorFilter);
  if (filters.conditionFilter && filters.conditionFilter !== "Alle") params.set("condition", filters.conditionFilter);
  if (filters.doorFilter && filters.doorFilter !== "Alle") params.set("doors", filters.doorFilter);
  if (filters.seatFilter && filters.seatFilter !== "" && filters.seatFilter !== "Alle") params.set("seats", filters.seatFilter);
  if (filters.modelFilter) params.set("model", filters.modelFilter);
  if (filters.motorizationFilter && filters.motorizationFilter.length > 0) params.set("motorization", filters.motorizationFilter.join(","));
  if (filters.variantFilter) params.set("variant", filters.variantFilter);
  if (filters.vehicleTypeFilter && filters.vehicleTypeFilter !== "Alle") params.set("vehicleType", filters.vehicleTypeFilter);
  if (filters.vehicleCategoryFilter && filters.vehicleCategoryFilter !== "Alle") params.set("vehicleCategory", filters.vehicleCategoryFilter);
  if (filters.mwstFilter && filters.mwstFilter !== "Alle") params.set("mwst", filters.mwstFilter);
  if (filters.firstRegFrom) params.set("firstRegFrom", filters.firstRegFrom);
  if (filters.firstRegTo) params.set("firstRegTo", filters.firstRegTo);
  if (filters.huFilter && filters.huFilter !== "Alle") params.set("hu", filters.huFilter);
  if (filters.previousOwnersFilter && filters.previousOwnersFilter !== "Alle") params.set("previousOwners", filters.previousOwnersFilter);
  if (filters.cylinderFilter && filters.cylinderFilter !== "Alle") params.set("cylinders", filters.cylinderFilter);
  if (filters.displacementMin !== "") params.set("displacementMin", filters.displacementMin);
  if (filters.displacementMax !== "") params.set("displacementMax", filters.displacementMax);
  if (filters.tankVolumeMin !== "") params.set("tankVolumeMin", filters.tankVolumeMin);
  if (filters.manufacturerColorFilter) params.set("mfColor", filters.manufacturerColorFilter);
  if (filters.interiorColorFilter && filters.interiorColorFilter !== "Alle Farben") params.set("interiorColor", filters.interiorColorFilter);
  if (filters.seatMaterialFilter && filters.seatMaterialFilter !== "Alle") params.set("seatMaterial", filters.seatMaterialFilter);
  if (filters.climateZoneFilter && filters.climateZoneFilter !== "" && filters.climateZoneFilter !== "Alle") params.set("climateZones", filters.climateZoneFilter);
  if (filters.rimSizeFilter && filters.rimSizeFilter !== "" && filters.rimSizeFilter !== "Alle") params.set("rimSize", filters.rimSizeFilter);
  if (filters.paintProtectionFilmFilter && filters.paintProtectionFilmFilter !== "Alle") params.set("ppf", filters.paintProtectionFilmFilter);
  if (filters.noRepaintFilter && filters.noRepaintFilter !== "Alle") params.set("noRepaint", filters.noRepaintFilter);
  if (filters.serviceBookFilter && filters.serviceBookFilter !== "Alle") params.set("serviceBook", filters.serviceBookFilter);
  if (filters.manufacturerWarrantyFilter && filters.manufacturerWarrantyFilter !== "Alle") params.set("warranty", filters.manufacturerWarrantyFilter);
  if (filters.safetyFeaturesFilter && filters.safetyFeaturesFilter.length > 0) params.set("safety", filters.safetyFeaturesFilter.join(","));
  if (filters.equipmentFeaturesFilter && filters.equipmentFeaturesFilter.length > 0) params.set("equipment", filters.equipmentFeaturesFilter.join(","));
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
  const [showSavedVehicles, setShowSavedVehicles] = useState(false);
  const currentMatches = applyFilters(search.filters);
  const currentIds = currentMatches.map((v) => v.id);
  const newIds = currentIds.filter((id) => !search.seenVehicleIds.includes(id));
  const newCount = newIds.length;

  const savedVehiclesList = vehicles.filter((v) => (search.savedVehicleIds ?? []).includes(v.id));
  const savedCount = savedVehiclesList.length;

  const filterTags: string[] = [];
  const f = search.filters;
  if (f.brandFilter !== "Alle Marken") filterTags.push(f.brandFilter);
  if (f.fuelFilter !== "Alle Kraftstoffe") filterTags.push(f.fuelFilter);
  if (f.priceMin !== "") filterTags.push(`ab ${Number(f.priceMin).toLocaleString("de-DE")} €`);
  if (f.priceMax !== "") filterTags.push(`bis ${Number(f.priceMax).toLocaleString("de-DE")} €`);
  if (f.yearFrom) filterTags.push(`ab ${f.yearFrom}`);
  if (f.yearTo) filterTags.push(`bis ${f.yearTo}`);
  if (f.mileageMax !== "") filterTags.push(`bis ${Number(f.mileageMax).toLocaleString("de-DE")} km`);
  if (f.powerMin !== "") filterTags.push(`ab ${f.powerMin} PS`);
  if (f.transmissionFilter && f.transmissionFilter !== "Alle") filterTags.push(f.transmissionFilter);
  if (f.driveTypeFilter && f.driveTypeFilter !== "Alle") filterTags.push(f.driveTypeFilter);
  if (f.sellerTypeFilter && f.sellerTypeFilter !== "Alle") filterTags.push(f.sellerTypeFilter);
  if (f.accidentFreeFilter === "Nur unfallfrei") filterTags.push("Unfallfrei");
  if (f.cityFilter) filterTags.push(f.cityFilter);
  if (f.colorFilter && f.colorFilter !== "Alle Farben") filterTags.push(f.colorFilter);
  if (f.conditionFilter && f.conditionFilter !== "Alle") filterTags.push(f.conditionFilter);
  if (f.doorFilter && f.doorFilter !== "Alle") filterTags.push(`${f.doorFilter} Türen`);
  if (f.seatFilter && f.seatFilter !== "" && f.seatFilter !== "Alle") filterTags.push(`${f.seatFilter} Sitze`);
  if (f.modelFilter) filterTags.push(f.modelFilter);
  if (f.motorizationFilter && f.motorizationFilter.length > 0) filterTags.push(f.motorizationFilter.join(", "));
  if (f.variantFilter) filterTags.push(f.variantFilter);
  if (f.vehicleTypeFilter && f.vehicleTypeFilter !== "Alle") filterTags.push(f.vehicleTypeFilter);
  if (f.vehicleCategoryFilter && f.vehicleCategoryFilter !== "Alle") filterTags.push(f.vehicleCategoryFilter);
  if (f.mwstFilter && f.mwstFilter !== "Alle") filterTags.push(`MwSt: ${f.mwstFilter}`);
  if (f.firstRegFrom) filterTags.push(`EZ ab ${f.firstRegFrom}`);
  if (f.firstRegTo) filterTags.push(`EZ bis ${f.firstRegTo}`);
  if (f.huFilter && f.huFilter !== "Alle") filterTags.push(`HU: ${f.huFilter}`);
  if (f.previousOwnersFilter && f.previousOwnersFilter !== "Alle") filterTags.push(`${f.previousOwnersFilter} Vorbesitzer`);
  if (f.cylinderFilter && f.cylinderFilter !== "Alle") filterTags.push(`${f.cylinderFilter} Zylinder`);
  if (f.displacementMin !== "") filterTags.push(`ab ${Number(f.displacementMin).toLocaleString("de-DE")} ccm`);
  if (f.displacementMax !== "") filterTags.push(`bis ${Number(f.displacementMax).toLocaleString("de-DE")} ccm`);
  if (f.tankVolumeMin !== "") filterTags.push(`ab ${f.tankVolumeMin} L`);
  if (f.manufacturerColorFilter) filterTags.push(`Farbe: ${f.manufacturerColorFilter}`);
  if (f.interiorColorFilter && f.interiorColorFilter !== "Alle Farben") filterTags.push(`Innen: ${f.interiorColorFilter}`);
  if (f.seatMaterialFilter && f.seatMaterialFilter !== "Alle") filterTags.push(f.seatMaterialFilter);
  if (f.climateZoneFilter && f.climateZoneFilter !== "" && f.climateZoneFilter !== "Alle") filterTags.push(`${f.climateZoneFilter}-Zonen Klima`);
  if (f.rimSizeFilter && f.rimSizeFilter !== "" && f.rimSizeFilter !== "Alle") filterTags.push(`${f.rimSizeFilter} Zoll`);
  if (f.paintProtectionFilmFilter && f.paintProtectionFilmFilter !== "Alle") filterTags.push(`Steinschlagfolie: ${f.paintProtectionFilmFilter}`);
  if (f.noRepaintFilter && f.noRepaintFilter !== "Alle") filterTags.push(`Nachlackierungsfrei: ${f.noRepaintFilter}`);
  if (f.serviceBookFilter && f.serviceBookFilter !== "Alle") filterTags.push(`Scheckheft: ${f.serviceBookFilter}`);
  if (f.manufacturerWarrantyFilter && f.manufacturerWarrantyFilter !== "Alle") filterTags.push(`Garantie: ${f.manufacturerWarrantyFilter}`);
  if (f.safetyFeaturesFilter && f.safetyFeaturesFilter.length > 0) filterTags.push(`${f.safetyFeaturesFilter.length}x Sicherheit`);
  if (f.equipmentFeaturesFilter && f.equipmentFeaturesFilter.length > 0) filterTags.push(`${f.equipmentFeaturesFilter.length}x Ausstattung`);

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

      {/* Saved Vehicles Section */}
      {savedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowSavedVehicles(!showSavedVehicles)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-full"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {savedCount} gespeicherte{savedCount === 1 ? "s" : ""} Fahrzeug{savedCount === 1 ? "" : "e"}
            <svg
              className={`w-4 h-4 ml-auto transition-transform ${showSavedVehicles ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showSavedVehicles && (
            <div className="mt-3 space-y-2">
              {savedVehiclesList.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-gray-900 truncate">{v.brand} {v.model}</span>
                    {v.variant && <span className="text-gray-400 truncate">{v.variant}</span>}
                  </div>
                  <span className="text-[#f14011] font-semibold whitespace-nowrap ml-3">
                    {v.price.toLocaleString("de-DE")} €
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
  const [activeTab, setActiveTab] = useState<"searches" | "favorites" | "dealers">("searches");
  const { mounted, savedSearches, favorites, savedDealers, dealerReviews, removeSearch, markSearchSeen, toggleFavorite, toggleSavedDealer } = useSavedData();

  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));
  const allDealers = getDealers(dealerReviews);
  const savedDealerInfos = allDealers.filter((d) => savedDealers.includes(d.companyName));

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
          <button
            onClick={() => setActiveTab("dealers")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "dealers"
                ? "bg-[#f14011] text-white"
                : "bg-white dark:bg-[#141414] border border-gray-200 text-gray-600 hover:border-[#f14011] hover:text-[#f14011]"
            }`}
          >
            Händler ({savedDealerInfos.length})
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
        ) : activeTab === "favorites" ? (
          favoriteVehicles.length > 0 ? (
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
          )
        ) : savedDealerInfos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDealerInfos.map((dealer, index) => (
              <div
                key={dealer.companyName}
                className="animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/haendler/${encodeURIComponent(dealer.companyName)}`}
                        className="font-semibold text-gray-900 hover:text-[#f14011] transition-colors"
                      >
                        {dealer.companyName}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">{dealer.zip} {dealer.city}</p>
                    </div>
                    <button
                      onClick={() => toggleSavedDealer(dealer.companyName)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      aria-label="Händler entfernen"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {dealer.averageRating > 0 ? (
                      <>
                        <StarRating rating={dealer.averageRating} size="sm" />
                        <span className="text-sm text-gray-500">{dealer.averageRating.toFixed(1)}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">Keine Bewertungen</span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
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
            <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">Noch keine Händler gespeichert.</p>
            <Link
              href="/haendler"
              className="mt-4 inline-block text-[#f14011] font-semibold hover:underline"
            >
              Händler entdecken &rarr;
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
