// ============================================================================
// TYPES
// ============================================================================

export type TireRating = "new" | "veryGood" | "good" | "used" | "needsReplacement";

export interface TireRatingInfo {
  label: string;
  color: string;
  bgColor: string;
}

export interface TireScoreInput {
  depth: number;   // Profiltiefe in mm
  age: number;     // Alter in Jahren
  damageFree: boolean; // Schadensfreiheit
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const TIRE_RATING_INFO: Record<TireRating, TireRatingInfo> = {
  new:              { label: "Neu",                  color: "text-green-800",  bgColor: "bg-green-100" },
  veryGood:         { label: "Sehr gut",             color: "text-green-700",  bgColor: "bg-green-50" },
  good:             { label: "Gut",                  color: "text-yellow-700", bgColor: "bg-yellow-50" },
  used:             { label: "Gebraucht",            color: "text-orange-700", bgColor: "bg-orange-50" },
  needsReplacement: { label: "Erneuerungsbedürftig", color: "text-red-700",   bgColor: "bg-red-50" },
};

// ============================================================================
// SCORE CALCULATION
// ============================================================================

function depthScore(mm: number): number {
  if (mm > 7) return 5;
  if (mm > 6) return 4;
  if (mm >= 4) return 3;
  if (mm >= 2) return 2;
  return 1;
}

function ageScore(years: number): number {
  if (years <= 2) return 5;
  if (years <= 4) return 4;
  if (years <= 6) return 3;
  if (years <= 8) return 2;
  return 1;
}

function damageScore(damageFree: boolean): number {
  return damageFree ? 5 : 1;
}

function scoreToRating(score: number): TireRating {
  if (score >= 4.5) return "new";
  if (score >= 3.5) return "veryGood";
  if (score >= 2.5) return "good";
  if (score >= 1.5) return "used";
  return "needsReplacement";
}

/**
 * Berechnet den Reifen-Score für eine Achse.
 * Gibt null zurück wenn nicht alle drei Felder ausgefüllt sind.
 */
export function calculateTireScore(
  depth: string,
  age: string,
  damageFree: boolean | null,
): TireRating | null {
  const d = parseFloat(depth);
  const a = parseFloat(age);

  if (isNaN(d) || isNaN(a) || damageFree === null) {
    return null;
  }

  const weighted =
    depthScore(d) * 0.60 +
    ageScore(a) * 0.25 +
    damageScore(damageFree) * 0.15;

  return scoreToRating(weighted);
}
