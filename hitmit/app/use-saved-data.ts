"use client";

import { useEffect, useState, useCallback } from "react";
import {
  priceRanges,
  mileageOptions,
  powerOptions,
  displacementOptions,
  tankVolumeOptions,
} from "./vehicles-data";
import type { DealerReview } from "./dealer-utils";

export interface SavedSearch {
  id: string;
  createdAt: string;
  label: string;
  filters: {
    brandFilter: string;
    fuelFilter: string;
    priceMin: string;
    priceMax: string;
    yearFrom: string;
    yearTo: string;
    mileageMin: string;
    mileageMax: string;
    powerMin: string;
    powerMax: string;
    transmissionFilter: string;
    driveTypeFilter: string;
    sellerTypeFilter: string;
    accidentFreeFilter: string;
    cityFilter: string;
    cityRadius: string;
    colorFilter: string;
    conditionFilter: string;
    doorFilter: string;
    seatFilter: string;
    modelFilter: string;
    motorizationFilter: string[];
    variantFilter: string;
    vehicleTypeFilter: string;
    vehicleCategoryFilter: string;
    mwstFilter: string;
    firstRegFrom: string;
    firstRegTo: string;
    huFilter: string;
    previousOwnersFilter: string;
    cylinderFilter: string;
    displacementMin: string;
    displacementMax: string;
    tankVolumeMin: string;
    manufacturerColorFilter: string;
    interiorColorFilter: string;
    seatMaterialFilter: string;
    climateZoneFilter: string;
    rimSizeFilter: string;
    paintProtectionFilmFilter: string;
    noRepaintFilter: string;
    serviceBookFilter: string;
    manufacturerWarrantyFilter: string;
    ausstattungSearch: string;
    safetyFeaturesFilter: string[];
    equipmentFeaturesFilter: string[];
    nonSmokerFilter: string;
    petFreeFilter: string;
  };
  seenVehicleIds: number[];
  savedVehicleIds: number[];
}

const SEARCHES_KEY = "hitmit_saved_searches";
const FAVORITES_KEY = "hitmit_favorites";
const SAVED_DEALERS_KEY = "hitmit_saved_dealers";
const DEALER_REVIEWS_KEY = "hitmit_dealer_reviews";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateSearch(raw: any): SavedSearch {
  const f = raw.filters ?? {};

  // Migrate priceFilter (old: number index) → priceMin + priceMax
  let priceMin = f.priceMin ?? "";
  let priceMax = f.priceMax ?? "";
  if (f.priceFilter !== undefined && typeof f.priceFilter === "number" && f.priceFilter !== 0) {
    const range = priceRanges[f.priceFilter];
    if (range) {
      priceMin = range.min > 0 ? String(range.min) : "";
      priceMax = range.max < Infinity ? String(range.max) : "";
    }
  }

  // Migrate mileageFilter (old: number index) → mileageMax
  let mileageMax = f.mileageMax ?? "";
  if (f.mileageFilter !== undefined && typeof f.mileageFilter === "number" && f.mileageFilter !== 0) {
    const opt = mileageOptions[f.mileageFilter];
    if (opt && opt.max < Infinity) {
      mileageMax = String(opt.max);
    }
  }

  // Migrate powerFilter (old: number index) → powerMin
  let powerMin = f.powerMin ?? "";
  if (f.powerFilter !== undefined && typeof f.powerFilter === "number" && f.powerFilter !== 0) {
    const opt = powerOptions[f.powerFilter];
    if (opt && opt.min > 0) {
      powerMin = String(opt.min);
    }
  }

  // Migrate displacementFilter (old: number index) → displacementMax
  let displacementMax = f.displacementMax ?? "";
  if (f.displacementFilter !== undefined && typeof f.displacementFilter === "number" && f.displacementFilter !== 0) {
    const opt = displacementOptions[f.displacementFilter];
    if (opt) {
      if (opt.max === -1) {
        displacementMax = "3001"; // "Über 3000" → use 3001 as proxy
      } else if (opt.max < Infinity) {
        displacementMax = String(opt.max);
      }
    }
  }

  // Migrate tankVolumeFilter (old: number index) → tankVolumeMin
  let tankVolumeMin = f.tankVolumeMin ?? "";
  if (f.tankVolumeFilter !== undefined && typeof f.tankVolumeFilter === "number" && f.tankVolumeFilter !== 0) {
    const opt = tankVolumeOptions[f.tankVolumeFilter];
    if (opt && opt.min > 0) {
      tankVolumeMin = String(opt.min);
    }
  }

  // Migrate seatFilter, climateZoneFilter, rimSizeFilter: "Alle" → ""
  const seatFilter = f.seatFilter === "Alle" ? "" : (f.seatFilter ?? "");
  const climateZoneFilter = f.climateZoneFilter === "Alle" ? "" : (f.climateZoneFilter ?? "");
  const rimSizeFilter = f.rimSizeFilter === "Alle" ? "" : (f.rimSizeFilter ?? "");

  return {
    id: raw.id ?? crypto.randomUUID(),
    createdAt: raw.createdAt ?? new Date().toISOString(),
    label: raw.label ?? "",
    filters: {
      brandFilter: f.brandFilter ?? "Alle Marken",
      fuelFilter: f.fuelFilter ?? "Alle Kraftstoffe",
      priceMin,
      priceMax,
      yearFrom: f.yearFrom ?? "",
      yearTo: f.yearTo ?? "",
      mileageMin: f.mileageMin ?? "",
      mileageMax,
      powerMin,
      powerMax: f.powerMax ?? "",
      transmissionFilter: f.transmissionFilter ?? "Alle",
      driveTypeFilter: f.driveTypeFilter ?? "Alle",
      sellerTypeFilter: f.sellerTypeFilter ?? "Alle",
      accidentFreeFilter: f.accidentFreeFilter ?? "Alle",
      cityFilter: f.cityFilter ?? "",
      cityRadius: f.cityRadius ?? "",
      colorFilter: f.colorFilter ?? "Alle Farben",
      conditionFilter: f.conditionFilter ?? "Alle",
      doorFilter: f.doorFilter ?? "Alle",
      seatFilter,
      modelFilter: f.modelFilter ?? "",
      motorizationFilter: f.motorizationFilter ?? [],
      variantFilter: f.variantFilter ?? "",
      vehicleTypeFilter: f.vehicleTypeFilter ?? "Alle",
      vehicleCategoryFilter: f.vehicleCategoryFilter ?? "Alle",
      mwstFilter: f.mwstFilter ?? "Alle",
      firstRegFrom: f.firstRegFrom ?? "",
      firstRegTo: f.firstRegTo ?? "",
      huFilter: f.huFilter ?? "Alle",
      previousOwnersFilter: f.previousOwnersFilter ?? "Alle",
      cylinderFilter: f.cylinderFilter ?? "Alle",
      displacementMin: f.displacementMin ?? "",
      displacementMax,
      tankVolumeMin,
      manufacturerColorFilter: f.manufacturerColorFilter ?? "",
      interiorColorFilter: f.interiorColorFilter ?? "Alle Farben",
      seatMaterialFilter: f.seatMaterialFilter ?? "Alle",
      climateZoneFilter,
      rimSizeFilter,
      paintProtectionFilmFilter: f.paintProtectionFilmFilter ?? "Alle",
      noRepaintFilter: f.noRepaintFilter ?? "Alle",
      serviceBookFilter: f.serviceBookFilter ?? "Alle",
      manufacturerWarrantyFilter: f.manufacturerWarrantyFilter ?? "Alle",
      ausstattungSearch: f.ausstattungSearch ?? "",
      safetyFeaturesFilter: f.safetyFeaturesFilter ?? [],
      equipmentFeaturesFilter: f.equipmentFeaturesFilter ?? [],
      nonSmokerFilter: f.nonSmokerFilter ?? "Alle",
      petFreeFilter: f.petFreeFilter ?? "Alle",
    },
    seenVehicleIds: raw.seenVehicleIds ?? [],
    savedVehicleIds: raw.savedVehicleIds ?? [],
  };
}

function loadSearches(): SavedSearch[] {
  try {
    const raw = localStorage.getItem(SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(migrateSearch) : [];
  } catch {
    return [];
  }
}

function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadSavedDealers(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_DEALERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadDealerReviews(): DealerReview[] {
  try {
    const raw = localStorage.getItem(DEALER_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSavedData() {
  const [mounted, setMounted] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [savedDealers, setSavedDealers] = useState<string[]>([]);
  const [dealerReviews, setDealerReviews] = useState<DealerReview[]>([]);

  useEffect(() => {
    setSavedSearches(loadSearches());
    setFavorites(loadFavorites());
    setSavedDealers(loadSavedDealers());
    setDealerReviews(loadDealerReviews());
    setMounted(true);
  }, []);

  const persistSearches = useCallback((next: SavedSearch[]) => {
    setSavedSearches(next);
    localStorage.setItem(SEARCHES_KEY, JSON.stringify(next));
  }, []);

  const persistFavorites = useCallback((next: number[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }, []);

  const saveSearch = useCallback(
    (label: string, filters: SavedSearch["filters"], currentVehicleIds: number[]): string => {
      const id = crypto.randomUUID();
      const entry: SavedSearch = {
        id,
        createdAt: new Date().toISOString(),
        label,
        filters,
        seenVehicleIds: currentVehicleIds,
        savedVehicleIds: [],
      };
      persistSearches([entry, ...loadSearches()]);
      return id;
    },
    [persistSearches],
  );

  const removeSearch = useCallback(
    (id: string) => {
      persistSearches(loadSearches().filter((s) => s.id !== id));
    },
    [persistSearches],
  );

  const markSearchSeen = useCallback(
    (id: string, currentVehicleIds: number[]) => {
      persistSearches(
        loadSearches().map((s) =>
          s.id === id ? { ...s, seenVehicleIds: currentVehicleIds } : s,
        ),
      );
    },
    [persistSearches],
  );

  const toggleVehicleInSearch = useCallback(
    (searchId: string, vehicleId: number) => {
      persistSearches(
        loadSearches().map((s) => {
          if (s.id !== searchId) return s;
          const ids = s.savedVehicleIds ?? [];
          const next = ids.includes(vehicleId)
            ? ids.filter((id) => id !== vehicleId)
            : [...ids, vehicleId];
          return { ...s, savedVehicleIds: next };
        }),
      );
    },
    [persistSearches],
  );

  const isVehicleSavedInSearch = useCallback(
    (searchId: string, vehicleId: number): boolean => {
      const search = savedSearches.find((s) => s.id === searchId);
      return search ? (search.savedVehicleIds ?? []).includes(vehicleId) : false;
    },
    [savedSearches],
  );

  const toggleFavorite = useCallback(
    (vehicleId: number) => {
      const current = loadFavorites();
      const next = current.includes(vehicleId)
        ? current.filter((id) => id !== vehicleId)
        : [...current, vehicleId];
      persistFavorites(next);
    },
    [persistFavorites],
  );

  const isFavorite = useCallback(
    (vehicleId: number) => favorites.includes(vehicleId),
    [favorites],
  );

  // ---- Dealer methods ----

  const persistSavedDealers = useCallback((next: string[]) => {
    setSavedDealers(next);
    localStorage.setItem(SAVED_DEALERS_KEY, JSON.stringify(next));
  }, []);

  const persistDealerReviews = useCallback((next: DealerReview[]) => {
    setDealerReviews(next);
    localStorage.setItem(DEALER_REVIEWS_KEY, JSON.stringify(next));
  }, []);

  const toggleSavedDealer = useCallback(
    (companyName: string) => {
      const current = loadSavedDealers();
      const next = current.includes(companyName)
        ? current.filter((n) => n !== companyName)
        : [...current, companyName];
      persistSavedDealers(next);
    },
    [persistSavedDealers],
  );

  const isSavedDealer = useCallback(
    (companyName: string) => savedDealers.includes(companyName),
    [savedDealers],
  );

  const addDealerReview = useCallback(
    (review: Omit<DealerReview, "id" | "createdAt">) => {
      const entry: DealerReview = {
        ...review,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const next = [entry, ...loadDealerReviews()];
      persistDealerReviews(next);
    },
    [persistDealerReviews],
  );

  const getDealerReviewsForDealer = useCallback(
    (companyName: string) =>
      dealerReviews.filter((r) => r.dealerCompanyName === companyName),
    [dealerReviews],
  );

  return {
    mounted,
    savedSearches,
    favorites,
    savedDealers,
    dealerReviews,
    saveSearch,
    removeSearch,
    markSearchSeen,
    toggleVehicleInSearch,
    isVehicleSavedInSearch,
    toggleFavorite,
    isFavorite,
    toggleSavedDealer,
    isSavedDealer,
    addDealerReview,
    getDealerReviewsForDealer,
  };
}
