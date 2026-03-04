import { VEHICLE_BASE_PRICES, DEFAULT_BRAND_AVERAGE } from "./vehicle-base-prices";

// ============================================================================
// TYPES
// ============================================================================

export interface ValuationInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  accidentFree: boolean;
  askingPrice: number;
}

export interface ValuationBreakdown {
  neupreis: number;
  alter: number;
  altersFaktor: number;
  abschreibungBetrag: number;
  erwarteteKm: number;
  kmDifferenz: number;
  kmKorrektur: number;
  kmKorrekturBetrag: number;
  kraftstoffAdj: number;
  kraftstoffBetrag: number;
  unfallAdj: number;
  unfallBetrag: number;
  marktwert: number;
  einkaufspreis: number;
  einkaufMin: number;
  einkaufMax: number;
  preisRating: PriceRating;
}

export type PriceRating = "top" | "good" | "fair" | "expensive";

export interface PriceRatingInfo {
  label: string;
  color: string;
  bgColor: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AVG_KM_PER_YEAR = 15000;
const DEALER_MARGIN = 0.78;
const SPREAD = 0.08; // ±8% for min/max range

// Depreciation per year: Y1=-24%, Y2=-15%, Y3=-10%, Y4=-8%, Y5=-7%, then -5%/yr
const DEPRECIATION_RATES = [0.24, 0.15, 0.10, 0.08, 0.07];
const DEPRECIATION_AFTER_Y5 = 0.05;
const MIN_RESIDUAL = 0.05; // minimum 5% of Neupreis

// ============================================================================
// HELPERS
// ============================================================================

function getBasePrice(brand: string, model: string): number {
  const brandData = VEHICLE_BASE_PRICES[brand];
  if (!brandData) return DEFAULT_BRAND_AVERAGE;

  // Exact match
  if (brandData[model] !== undefined) return brandData[model];

  // Partial match: check if any key is contained in the model or vice-versa
  for (const key of Object.keys(brandData)) {
    if (key === "_brandAverage") continue;
    if (model.includes(key) || key.includes(model)) return brandData[key];
  }

  return brandData._brandAverage ?? DEFAULT_BRAND_AVERAGE;
}

function calcAltersFaktor(alter: number): number {
  let residual = 1.0;
  for (let y = 0; y < alter; y++) {
    const rate = y < DEPRECIATION_RATES.length ? DEPRECIATION_RATES[y] : DEPRECIATION_AFTER_Y5;
    residual *= 1 - rate;
  }
  return Math.max(residual, MIN_RESIDUAL);
}

function calcKmKorrektur(mileage: number, alter: number): number {
  const expected = alter * AVG_KM_PER_YEAR;
  const diff = mileage - expected; // positive = more km than expected
  // ±2% per 10.000 km deviation
  return -(diff / 10000) * 0.02;
}

function calcKraftstoffAdj(fuelType: string): number {
  const ft = fuelType.toLowerCase();
  if (ft === "elektro") return 0.04;
  if (ft.includes("plug-in") || ft.includes("phev") || ft.includes("hybrid")) return 0.03;
  if (ft === "diesel") return -0.05;
  return 0;
}

function calcUnfallAdj(accidentFree: boolean): number {
  return accidentFree ? 0.05 : -0.10;
}

// ============================================================================
// MAIN VALUATION
// ============================================================================

export function calculateValuation(input: ValuationInput): ValuationBreakdown {
  const currentYear = new Date().getFullYear();
  const alter = Math.max(0, currentYear - input.year);
  const neupreis = getBasePrice(input.brand, input.model);

  const altersFaktor = calcAltersFaktor(alter);
  const abschreibungBetrag = neupreis * (1 - altersFaktor);

  const kmKorrektur = calcKmKorrektur(input.mileage, alter);
  const erwarteteKm = alter * AVG_KM_PER_YEAR;
  const kmDifferenz = input.mileage - erwarteteKm;

  const kraftstoffAdj = calcKraftstoffAdj(input.fuelType);
  const unfallAdj = calcUnfallAdj(input.accidentFree);

  // MarktPreis = Neupreis × AltersFaktor × (1 + kmAdj + KraftstoffAdj + UnfallfreiAdj)
  const marktwert = Math.round(
    neupreis * altersFaktor * (1 + kmKorrektur + kraftstoffAdj + unfallAdj)
  );

  const einkaufspreis = Math.round(marktwert * DEALER_MARGIN);
  const einkaufMin = Math.round(einkaufspreis * (1 - SPREAD));
  const einkaufMax = Math.round(einkaufspreis * (1 + SPREAD));

  const kmKorrekturBetrag = Math.round(neupreis * altersFaktor * kmKorrektur);
  const kraftstoffBetrag = Math.round(neupreis * altersFaktor * kraftstoffAdj);
  const unfallBetrag = Math.round(neupreis * altersFaktor * unfallAdj);

  // Price rating based on asking price vs market value
  const deviation = (input.askingPrice - marktwert) / marktwert;
  let preisRating: PriceRating;
  if (deviation <= -0.10) preisRating = "top";
  else if (deviation <= -0.03) preisRating = "good";
  else if (deviation <= 0.08) preisRating = "fair";
  else preisRating = "expensive";

  return {
    neupreis,
    alter,
    altersFaktor,
    abschreibungBetrag,
    erwarteteKm,
    kmDifferenz,
    kmKorrektur,
    kmKorrekturBetrag,
    kraftstoffAdj,
    kraftstoffBetrag,
    unfallAdj,
    unfallBetrag,
    marktwert,
    einkaufspreis,
    einkaufMin,
    einkaufMax,
    preisRating,
  };
}

// ============================================================================
// RATING DISPLAY INFO
// ============================================================================

export const PRICE_RATING_INFO: Record<PriceRating, PriceRatingInfo> = {
  top: { label: "Top-Preis", color: "text-green-800", bgColor: "bg-green-100" },
  good: { label: "Guter Preis", color: "text-green-700", bgColor: "bg-green-50" },
  fair: { label: "Fairer Preis", color: "text-yellow-700", bgColor: "bg-yellow-50" },
  expensive: { label: "Teuer", color: "text-red-700", bgColor: "bg-red-50" },
};
