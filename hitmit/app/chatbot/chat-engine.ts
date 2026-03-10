import { CAR_BRANDS_MODELS, colorOptions, vehicles, type Vehicle } from "../vehicles-data";

// ============================================================================
// TYPES
// ============================================================================

export interface ParsedQuery {
  brand?: string;
  model?: string;
  priceMax?: number;
  priceMin?: number;
  mileageMax?: number;
  powerMin?: number;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  category?: string;
  color?: string;
  city?: string;
  sellerType?: "private" | "dealer";
  accidentFree?: boolean;
  features?: string[];
}

export interface ScoredVehicle {
  vehicle: Vehicle;
  score: number;
}

export interface BotResponse {
  text: string;
  vehicles: ScoredVehicle[];
  suggestions: string[];
}

// ============================================================================
// BRAND ALIASES (German slang / abbreviations)
// ============================================================================

const BRAND_ALIASES: Record<string, string> = {
  merc: "Mercedes-Benz",
  mercedes: "Mercedes-Benz",
  benz: "Mercedes-Benz",
  amg: "Mercedes-Benz",
  vw: "VW",
  volkswagen: "VW",
  porsche: "Porsche",
  beamer: "BMW",
  bimmer: "BMW",
  lambo: "Lamborghini",
  landy: "Land Rover",
  opel: "Opel",
  skoda: "Škoda",
  roller: "Rolls-Royce",
  rollsroyce: "Rolls-Royce",
  aston: "Aston Martin",
};

// ============================================================================
// CATEGORY KEYWORDS
// ============================================================================

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  SUV: ["suv", "geländewagen", "offroad"],
  Limousine: ["limousine", "sedan", "stufenheck"],
  Kombi: ["kombi", "touring", "avant", "variant", "estate"],
  Sportwagen: ["sportwagen", "sportauto", "sportscar"],
  Coupé: ["coupé", "coupe", "zweitürer"],
  Cabrio: ["cabrio", "cabriolet", "roadster", "convertible", "offen"],
  Schrägheck: ["schrägheck", "hatchback", "kompakt"],
  Van: ["van", "minivan", "bus", "transporter"],
};

// ============================================================================
// FUEL KEYWORDS
// ============================================================================

const FUEL_KEYWORDS: Record<string, string[]> = {
  Benzin: ["benzin", "benziner", "otto"],
  Diesel: ["diesel", "tdi", "cdi", "bluetec"],
  Elektro: ["elektro", "elektrisch", "elektroauto", "ev", "stromer", "e-auto"],
  Hybrid: ["hybrid", "plug-in", "phev", "plugin"],
};

// ============================================================================
// TRANSMISSION KEYWORDS
// ============================================================================

const TRANSMISSION_KEYWORDS: Record<string, string[]> = {
  Automatik: ["automatik", "automatisch", "dsg", "doppelkupplung", "pdk", "tiptronic", "s tronic", "9g-tronic", "wandler"],
  Schaltung: ["schaltung", "manuell", "schalter", "handschalter", "schaltgetriebe"],
};

// ============================================================================
// DRIVE TYPE KEYWORDS
// ============================================================================

const DRIVE_KEYWORDS: Record<string, string[]> = {
  Allrad: ["allrad", "4x4", "awd", "4wd", "quattro", "xdrive", "4matic", "4motion"],
  Frontantrieb: ["frontantrieb", "fwd", "vorderrad"],
  Hinterradantrieb: ["hinterrad", "hinterradantrieb", "rwd", "heckantrieb"],
};

// ============================================================================
// FEATURE KEYWORDS
// ============================================================================

const FEATURE_KEYWORDS: string[] = [
  "sitzheizung", "klimaautomatik", "navigation", "navi", "panoramadach",
  "panorama", "leder", "ledersitze", "kamera", "rückfahrkamera",
  "einparkhilfe", "parkassistent", "tempomat", "head-up", "headup",
  "soundsystem", "harman", "bose", "burmester", "carplay", "android auto",
  "keyless", "schiebedach", "standheizung", "anhängerkupplung",
  "sportpaket", "sportfahrwerk", "matrix", "led",
];

// ============================================================================
// PARSE USER QUERY
// ============================================================================

export function parseUserQuery(input: string): ParsedQuery {
  const q = input.toLowerCase().trim();
  const query: ParsedQuery = {};

  // --- Brand detection ---
  for (const alias of Object.keys(BRAND_ALIASES)) {
    if (q.includes(alias)) {
      query.brand = BRAND_ALIASES[alias];
      break;
    }
  }
  if (!query.brand) {
    for (const brand of Object.keys(CAR_BRANDS_MODELS)) {
      if (q.includes(brand.toLowerCase())) {
        query.brand = brand;
        break;
      }
    }
  }

  // --- Model detection ---
  if (query.brand) {
    const models = CAR_BRANDS_MODELS[query.brand] || [];
    for (const model of models) {
      if (q.includes(model.toLowerCase())) {
        query.model = model;
        break;
      }
    }
  }

  // --- Price ---
  const pricePatterns = [
    /(?:unter|bis|max(?:imal)?|höchstens|maximal)\s*(\d[\d.,]*)\s*(?:€|euro|eur)?/i,
    /(\d[\d.,]*)\s*(?:€|euro|eur)\s*/i,
    /budget\s*(?:von|:)?\s*(\d[\d.,]*)/i,
  ];
  for (const pattern of pricePatterns) {
    const match = q.match(pattern);
    if (match) {
      const raw = match[1].replace(/\./g, "").replace(",", ".");
      const value = parseFloat(raw);
      if (value > 0) {
        query.priceMax = value < 1000 ? value * 1000 : value;
        break;
      }
    }
  }

  const priceMinMatch = q.match(/(?:ab|mindestens|von|über)\s*(\d[\d.,]*)\s*(?:€|euro|eur)?/i);
  if (priceMinMatch) {
    const raw = priceMinMatch[1].replace(/\./g, "").replace(",", ".");
    const value = parseFloat(raw);
    if (value > 0) {
      query.priceMin = value < 1000 ? value * 1000 : value;
    }
  }

  // --- Mileage ---
  const kmMatch = q.match(/(?:unter|bis|max(?:imal)?|weniger als|höchstens)\s*(\d[\d.,]*)\s*km/i);
  if (kmMatch) {
    const raw = kmMatch[1].replace(/\./g, "").replace(",", ".");
    query.mileageMax = parseFloat(raw);
  } else if (q.includes("wenig km") || q.includes("wenig kilometer") || q.includes("niedrig km")) {
    query.mileageMax = 30000;
  }

  // --- Power ---
  const psMatch = q.match(/(?:ab|mindestens|über|mind\.?)\s*(\d+)\s*(?:ps|pferdestärken|hp)/i);
  if (psMatch) {
    query.powerMin = parseInt(psMatch[1]);
  }

  // --- Fuel type ---
  for (const [fuelType, keywords] of Object.entries(FUEL_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      query.fuelType = fuelType;
      break;
    }
  }

  // --- Transmission ---
  for (const [trans, keywords] of Object.entries(TRANSMISSION_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      query.transmission = trans;
      break;
    }
  }

  // --- Drive type ---
  for (const [drive, keywords] of Object.entries(DRIVE_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      query.driveType = drive;
      break;
    }
  }

  // --- Category ---
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      query.category = cat;
      break;
    }
  }

  // --- Color ---
  for (const c of colorOptions) {
    if (c !== "Alle Farben" && c !== "Sonstige" && q.includes(c.toLowerCase())) {
      query.color = c;
      break;
    }
  }

  // --- City ---
  const cities = ["münchen", "berlin", "hamburg", "stuttgart", "wolfsburg", "ingolstadt", "köln", "frankfurt", "düsseldorf"];
  for (const city of cities) {
    if (q.includes(city)) {
      query.city = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // --- Seller type ---
  if (q.includes("privat") || q.includes("privatverkäufer")) {
    query.sellerType = "private";
  } else if (q.includes("händler") || q.includes("dealer") || q.includes("autohaus")) {
    query.sellerType = "dealer";
  }

  // --- Accident free ---
  if (q.includes("unfallfrei") || q.includes("kein unfall") || q.includes("ohne unfall")) {
    query.accidentFree = true;
  }

  // --- Features ---
  const matchedFeatures: string[] = [];
  for (const feat of FEATURE_KEYWORDS) {
    if (q.includes(feat)) {
      matchedFeatures.push(feat);
    }
  }
  if (matchedFeatures.length > 0) {
    query.features = matchedFeatures;
  }

  return query;
}

// ============================================================================
// MATCH VEHICLES
// ============================================================================

export function matchVehicles(query: ParsedQuery, allVehicles: Vehicle[] = vehicles): ScoredVehicle[] {
  const hasAnyCriteria = Object.keys(query).length > 0;
  if (!hasAnyCriteria) {
    return allVehicles.map((v) => ({ vehicle: v, score: 50 }));
  }

  const scored: ScoredVehicle[] = [];

  for (const v of allVehicles) {
    let score = 0;
    let maxPossible = 0;

    // Brand (25 pts)
    if (query.brand) {
      maxPossible += 25;
      if (v.brand.toLowerCase() === query.brand.toLowerCase()) {
        score += 25;
      }
    }

    // Model (20 pts)
    if (query.model) {
      maxPossible += 20;
      if (v.model.toLowerCase().includes(query.model.toLowerCase())) {
        score += 20;
      }
    }

    // Price (15 pts)
    if (query.priceMax || query.priceMin) {
      maxPossible += 15;
      let priceOk = true;
      if (query.priceMax && v.price > query.priceMax) priceOk = false;
      if (query.priceMin && v.price < query.priceMin) priceOk = false;
      if (priceOk) {
        score += 15;
      } else if (query.priceMax && v.price <= query.priceMax * 1.1) {
        score += 8; // close to budget
      }
    }

    // Fuel type (10 pts)
    if (query.fuelType) {
      maxPossible += 10;
      if (v.fuelType.toLowerCase() === query.fuelType.toLowerCase()) {
        score += 10;
      }
    }

    // Transmission (8 pts)
    if (query.transmission) {
      maxPossible += 8;
      if (v.transmission.toLowerCase().includes(query.transmission.toLowerCase())) {
        score += 8;
      }
    }

    // Drive type (7 pts)
    if (query.driveType) {
      maxPossible += 7;
      if (v.driveType.toLowerCase().includes(query.driveType.toLowerCase())) {
        score += 7;
      }
    }

    // Power (5 pts)
    if (query.powerMin) {
      maxPossible += 5;
      if (v.powerPs >= query.powerMin) {
        score += 5;
      }
    }

    // Mileage (5 pts)
    if (query.mileageMax) {
      maxPossible += 5;
      if (v.mileage <= query.mileageMax) {
        score += 5;
      }
    }

    // Category (5 pts)
    if (query.category) {
      maxPossible += 5;
      if (v.vehicleCategory?.toLowerCase() === query.category.toLowerCase()) {
        score += 5;
      }
    }

    // Features (10 pts)
    if (query.features && query.features.length > 0) {
      maxPossible += 10;
      const allFeatures = [
        ...v.comfortFeatures,
        ...v.safetyFeatures,
        ...v.exteriorFeatures,
        ...v.multimediaFeatures,
      ]
        .join(" ")
        .toLowerCase();
      let matched = 0;
      for (const feat of query.features) {
        if (allFeatures.includes(feat)) matched++;
      }
      score += Math.round((matched / query.features.length) * 10);
    }

    // Color (bonus 3 pts)
    if (query.color) {
      if (v.color.toLowerCase().includes(query.color.toLowerCase())) {
        score += 3;
      }
    }

    // City (bonus 3 pts)
    if (query.city) {
      if (v.city.toLowerCase() === query.city.toLowerCase()) {
        score += 3;
      }
    }

    // Seller type (bonus 2 pts)
    if (query.sellerType) {
      if (v.sellerType === query.sellerType) {
        score += 2;
      }
    }

    // Accident free (bonus 2 pts)
    if (query.accidentFree) {
      if (v.accidentFree) {
        score += 2;
      }
    }

    // Normalize to 0-100
    const normalizedScore = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 50;

    if (normalizedScore >= 20) {
      scored.push({ vehicle: v, score: normalizedScore });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

// ============================================================================
// GENERATE BOT RESPONSE
// ============================================================================

export function generateBotResponse(query: ParsedQuery, results: ScoredVehicle[]): BotResponse {
  const suggestions: string[] = [];
  let text: string;

  if (results.length === 0) {
    text = "Leider habe ich keine passenden Fahrzeuge gefunden. Versuche es mit anderen Suchkriterien!";
    suggestions.push("Alle Fahrzeuge anzeigen", "SUV", "Elektroauto", "Sportwagen");
    return { text, vehicles: [], suggestions };
  }

  const count = results.length;
  const topResults = results.slice(0, 5);
  const parts: string[] = [];

  if (count === 1) {
    parts.push("Ich habe **1 Fahrzeug** gefunden, das zu deiner Suche passt:");
  } else {
    parts.push(`Ich habe **${count} Fahrzeuge** gefunden:`);
  }

  // Describe what was searched
  const criteria: string[] = [];
  if (query.brand) criteria.push(query.brand);
  if (query.model) criteria.push(query.model);
  if (query.priceMax) criteria.push(`bis ${query.priceMax.toLocaleString("de-DE")} €`);
  if (query.priceMin) criteria.push(`ab ${query.priceMin.toLocaleString("de-DE")} €`);
  if (query.fuelType) criteria.push(query.fuelType);
  if (query.transmission) criteria.push(query.transmission);
  if (query.driveType) criteria.push(query.driveType);
  if (query.category) criteria.push(query.category);

  if (criteria.length > 0) {
    parts.push(`Gesucht: ${criteria.join(", ")}`);
  }

  text = parts.join("\n");

  // Suggest refinements for missing criteria
  if (!query.brand) suggestions.push("BMW", "Mercedes", "Audi");
  if (!query.priceMax && !query.priceMin) suggestions.push("Unter 50.000 €");
  if (!query.fuelType) suggestions.push("Elektroauto");
  if (!query.transmission) suggestions.push("Automatik");
  if (!query.category) suggestions.push("SUV");

  // Limit to 4 suggestions
  return { text, vehicles: topResults, suggestions: suggestions.slice(0, 4) };
}
