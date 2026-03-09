"use client";

import { useEffect, useState, useCallback } from "react";

export interface SavedSearch {
  id: string;
  createdAt: string;
  label: string;
  filters: {
    brandFilter: string;
    fuelFilter: string;
    priceFilter: number;
    yearFrom: string;
    yearTo: string;
    mileageFilter: number;
    powerFilter: number;
    transmissionFilter: string;
    driveTypeFilter: string;
    sellerTypeFilter: string;
    accidentFreeFilter: string;
    cityFilter: string;
    colorFilter: string;
    conditionFilter: string;
    doorFilter: string;
    seatFilter: string;
    modelFilter: string;
    motorizationFilter: string;
    variantFilter: string;
    vehicleTypeFilter: string;
    vehicleCategoryFilter: string;
    mwstFilter: string;
    firstRegFrom: string;
    firstRegTo: string;
    huFilter: string;
    previousOwnersFilter: string;
    cylinderFilter: string;
    displacementFilter: number;
    tankVolumeFilter: number;
    manufacturerColorFilter: string;
    interiorColorFilter: string;
    seatMaterialFilter: string;
    climateZoneFilter: string;
    rimSizeFilter: string;
    paintProtectionFilmFilter: string;
    noRepaintFilter: string;
    serviceBookFilter: string;
    manufacturerWarrantyFilter: string;
    safetyFeaturesFilter: string[];
    equipmentFeaturesFilter: string[];
  };
  seenVehicleIds: number[];
}

const SEARCHES_KEY = "hitmit_saved_searches";
const FAVORITES_KEY = "hitmit_favorites";

function loadSearches(): SavedSearch[] {
  try {
    const raw = localStorage.getItem(SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
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

export function useSavedData() {
  const [mounted, setMounted] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setSavedSearches(loadSearches());
    setFavorites(loadFavorites());
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
    (label: string, filters: SavedSearch["filters"], currentVehicleIds: number[]) => {
      const entry: SavedSearch = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        label,
        filters,
        seenVehicleIds: currentVehicleIds,
      };
      persistSearches([entry, ...loadSearches()]);
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

  return {
    mounted,
    savedSearches,
    favorites,
    saveSearch,
    removeSearch,
    markSearchSeen,
    toggleFavorite,
    isFavorite,
  };
}
