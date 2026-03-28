// ============================================================================
// KI-Beschreibungsgenerator — Template-Engine mit Varianz
// ============================================================================

// Minimal type matching the VehicleFormData fields we need
interface GeneratorInput {
  brand: string;
  model: string;
  variant: string;
  vehicleType: string;
  constructionYear: string;
  firstRegistration: string;
  mileage: string;
  previousOwners: string;
  fuelType: string;
  powerPs: string;
  engineSize: string;
  transmission: string;
  driveType: string;
  condition: string;
  accidentFree: boolean | null;
  manufacturerCertified: boolean | null;
  offerTarget: string;
  repaintFree: boolean | null;
  serviceHistory: boolean | null;
  serviceHistoryAt: string;
  huValidUntil: string;
  colorGeneral: string;
  colorManufacturer: string;
  interiorColor: string;
  seatMaterial: string;
  doors: string;
  seats: string;
  emissionClass: string;
  environmentalBadge: string;
  rimSize: string;
  comfortFeatures: string[];
  safetyFeatures: string[];
  exteriorFeatures: string[];
  multimediaFeatures: string[];
  sellerType: "private" | "dealer" | "";
  priceNegotiable: boolean;
  extras: string;
  warrantyUntil: string;
  manufacturerWarrantyUntil: string;
  parkingAid: string[];
  vehicleOrigin: string;
}

// ============================================================================
// Vehicle type noun & article helpers (German grammar)
// ============================================================================

// Fahrzeug/Motorrad = neuter (das), LKW/Transporter = masculine (der)
interface VehicleGrammar {
  noun: string;       // Fahrzeug, Motorrad, LKW, Transporter
  artDef: string;     // Das, Das, Der, Der  (nominative, capitalized)
  artDefLc: string;   // das, das, der, der  (nominative, lowercase)
  dem: string;        // dieses, dieses, dieser, dieser (demonstrative)
  rel: string;        // das, das, der, der  (relative pronoun)
}

const VEHICLE_GRAMMAR: Record<string, VehicleGrammar> = {
  car:        { noun: "Fahrzeug",    artDef: "Das",  artDefLc: "das",  dem: "dieses",  rel: "das" },
  motorcycle: { noun: "Motorrad",    artDef: "Das",  artDefLc: "das",  dem: "dieses",  rel: "das" },
  truck:      { noun: "LKW",         artDef: "Der",  artDefLc: "der",  dem: "dieser",  rel: "der" },
  van:        { noun: "Transporter", artDef: "Der",  artDefLc: "der",  dem: "dieser",  rel: "der" },
  motorhome:  { noun: "Wohnmobil",  artDef: "Das",  artDefLc: "das",  dem: "dieses",  rel: "das" },
};

const DEFAULT_GRAMMAR: VehicleGrammar = VEHICLE_GRAMMAR.car;

function getGrammar(vehicleType: string): VehicleGrammar {
  return VEHICLE_GRAMMAR[vehicleType] ?? DEFAULT_GRAMMAR;
}

// ============================================================================
// Value → Label mappings
// ============================================================================

const FUEL_LABELS: Record<string, string> = {
  petrol: "Benzin",
  diesel: "Diesel",
  electric: "Elektro",
  hybrid: "Hybrid",
  pluginHybrid: "Plug-in-Hybrid",
  pluginHybridDiesel: "Plug-in-Hybrid (Diesel)",
  lpg: "LPG (Autogas)",
  cng: "CNG (Erdgas)",
  hydrogen: "Wasserstoff",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: "Schaltgetriebe",
  automatic: "Automatik",
  semiAutomatic: "Halbautomatik",
};

const DRIVE_LABELS: Record<string, string> = {
  fwd: "Frontantrieb",
  rwd: "Hinterradantrieb",
  awd: "Allradantrieb",
};

const CONDITION_LABELS: Record<string, string> = {
  new: "Neuwagen",
  used: "Gebrauchtwagen",
  yearOld: "Jahreswagen",
  demo: "Vorführwagen",
  dayReg: "Tageszulassung",
};

const COLOR_LABELS: Record<string, string> = {
  black: "Schwarz",
  white: "Weiß",
  silver: "Silber",
  gray: "Grau",
  blue: "Blau",
  red: "Rot",
  green: "Grün",
  brown: "Braun",
  beige: "Beige",
  yellow: "Gelb",
  orange: "Orange",
  gold: "Gold",
};

const SEAT_LABELS: Record<string, string> = {
  leather: "Leder",
  partLeather: "Teilleder",
  fabric: "Stoff",
  alcantara: "Alcantara",
  velour: "Velours",
};

const ORIGIN_LABELS: Record<string, string> = {
  euImport: "der EU",
  schweizImport: "der Schweiz",
  usaImport: "den USA",
  ukImport: "Großbritannien",
  sonstige: "dem Ausland",
};

const INTERIOR_COLOR_LABELS: Record<string, string> = {
  black: "Schwarz",
  gray: "Grau",
  beige: "Beige",
  brown: "Braun",
  white: "Weiß",
  red: "Rot",
  blue: "Blau",
};

// ============================================================================
// Seeded random for consistent output per vehicle
// ============================================================================

function createSeededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) | 0;
    return ((hash >>> 0) / 4294967296);
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

// ============================================================================
// Helper: label lookups
// ============================================================================

function label(map: Record<string, string>, value: string): string {
  return map[value] || "";
}

function formatNumber(val: string): string {
  const n = parseInt(val, 10);
  if (isNaN(n)) return "";
  return n.toLocaleString("de-DE");
}

function hasValue(val: string | boolean | null | undefined | string[]): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "boolean") return true;
  if (Array.isArray(val)) return val.length > 0;
  return val.trim() !== "";
}

// ============================================================================
// Premium brand detection
// ============================================================================

const PREMIUM_BRANDS = new Set([
  "Audi", "BMW", "Mercedes-Benz", "Porsche", "Jaguar", "Land Rover",
  "Lexus", "Maserati", "Ferrari", "Lamborghini", "Rolls-Royce", "DS",
  "Volvo", "Tesla",
]);

// ============================================================================
// Sentence template pools
// ============================================================================

// --- 1. Einleitung ---

function buildIntro(d: GeneratorInput, rand: () => number): string {
  const name = [d.brand, d.model, d.variant].filter(Boolean).join(" ");
  const year = d.constructionYear || "";
  const condLabel = label(CONDITION_LABELS, d.condition);
  const isPremium = PREMIUM_BRANDS.has(d.brand);
  const isDealer = d.sellerType === "dealer";
  const g = getGrammar(d.vehicleType);

  // Detect highlights for intro
  const lowKm = d.mileage && parseInt(d.mileage) < 50000;
  const isNew = d.condition === "new" || d.condition === "dayReg";

  const templates = [
    () => {
      const parts = [`Zum Verkauf steht ${isNew ? "ein neuer" : year ? `ein ${year}er` : "ein"} ${name}`];
      if (condLabel && !isNew) parts[0] += ` als ${condLabel}`;
      parts[0] += ".";
      if (lowKm) parts.push(`Mit nur ${formatNumber(d.mileage)} km ist ${g.dem} ${g.noun} besonders laufstark.`);
      return parts.join(" ");
    },
    () => {
      let s = isDealer
        ? `Wir bieten Ihnen ${year ? `diesen ${year}er` : "diesen"} ${name} an`
        : `Ich verkaufe ${year ? `meinen ${year}er` : "meinen"} ${name}`;
      if (condLabel && !isNew) s += ` (${condLabel})`;
      s += ".";
      if (isPremium) s += ` Ein ${g.noun}, ${g.rel} in puncto Qualität und Komfort keine Wünsche offen lässt.`;
      return s;
    },
    () => {
      let s = `${isPremium ? "Dieser beeindruckende" : "Dieser gepflegte"} ${name}`;
      if (year) s += ` aus ${year}`;
      s += ` sucht einen neuen Besitzer.`;
      if (lowKm) s += ` Der niedrige Kilometerstand von nur ${formatNumber(d.mileage)} km spricht für sich.`;
      return s;
    },
    () => {
      let s = isDealer
        ? `Entdecken Sie ${year ? `diesen ${year}er` : "diesen"} ${name}`
        : `Hier kommt ${year ? `mein ${year}er` : "mein"} ${name}`;
      if (condLabel && !isNew) s += ` — ${condLabel} in hervorragendem Zustand`;
      s += ".";
      return s;
    },
  ];

  return pick(templates, rand)();
}

// --- 2. Zustand & Historie ---

function buildHistory(d: GeneratorInput, rand: () => number): string {
  const parts: string[] = [];
  const g = getGrammar(d.vehicleType);

  // Mileage (if not already mentioned in intro with low-km highlight)
  const lowKm = d.mileage && parseInt(d.mileage) < 50000;
  if (d.mileage && !lowKm) {
    parts.push(pick([
      `Der Kilometerstand beträgt ${formatNumber(d.mileage)} km.`,
      `${g.artDef} ${g.noun} hat ${formatNumber(d.mileage)} km gelaufen.`,
      `Aktueller Tachostand: ${formatNumber(d.mileage)} km.`,
    ], rand));
  }

  // Previous owners
  if (hasValue(d.previousOwners)) {
    const n = parseInt(d.previousOwners);
    if (n === 1) {
      parts.push(pick([
        "Es handelt sich um einen Erstbesitz.",
        `${g.artDef} ${g.noun} hatte bisher nur einen Vorbesitzer.`,
        "Aus erster Hand.",
      ], rand));
    } else if (n === 2) {
      parts.push(`${g.artDef} ${g.noun} hatte bisher ${n} Vorbesitzer.`);
    } else if (!isNaN(n) && n > 0) {
      parts.push(`Anzahl Vorbesitzer: ${n}.`);
    }
  }

  // Accident-free
  if (d.accidentFree === true) {
    parts.push(pick([
      `${g.artDef} ${g.noun} ist unfallfrei.`,
      "Laut Vorbesitzer unfallfrei.",
      `Unfallfrei laut ${g.noun}historie.`,
    ], rand));
  }

  // Manufacturer certified
  if (d.manufacturerCertified === true) {
    parts.push(pick([
      `${g.artDef} ${g.noun} ist herstellerzertifiziert.`,
      "Zertifiziert vom Hersteller.",
      `Geprüft und zertifiziert nach Herstellerstandards.`,
    ], rand));
  }

  // Repaint-free
  if (d.repaintFree === true) {
    parts.push("Der Lack ist im Originalzustand (nachlackierungsfrei).");
  }

  // Service history
  if (d.serviceHistory === true) {
    const at = d.serviceHistoryAt;
    parts.push(pick([
      `Scheckheftgepflegt${at ? ` (${at})` : ""}.`,
      `Das Serviceheft wurde lückenlos geführt${at ? ` — zuletzt bei ${at}` : ""}.`,
      `Alle Wartungen wurden${at ? ` bei ${at}` : ""} regelmäßig durchgeführt.`,
    ], rand));
  }

  // Vehicle origin
  if (hasValue(d.vehicleOrigin) && d.vehicleOrigin !== "deutschland") {
    const originLabel = label(ORIGIN_LABELS, d.vehicleOrigin);
    if (originLabel) {
      parts.push(`${g.artDef} ${g.noun} wurde aus ${originLabel} importiert.`);
    }
  }

  // HU
  if (hasValue(d.huValidUntil)) {
    parts.push(`Die Hauptuntersuchung (HU/TÜV) ist gültig bis ${d.huValidUntil}.`);
  }

  // Warranty
  if (hasValue(d.warrantyUntil)) {
    parts.push(`Garantie bis ${d.warrantyUntil}.`);
  }
  if (hasValue(d.manufacturerWarrantyUntil)) {
    parts.push(`Herstellergarantie bis ${d.manufacturerWarrantyUntil}.`);
  }

  return parts.join(" ");
}

// --- 3. Motorisierung & Technik ---

function buildPowertrain(d: GeneratorInput, rand: () => number): string {
  const parts: string[] = [];
  const g = getGrammar(d.vehicleType);
  const fuel = label(FUEL_LABELS, d.fuelType);
  const trans = label(TRANSMISSION_LABELS, d.transmission);
  const drive = label(DRIVE_LABELS, d.driveType);
  const ps = d.powerPs ? `${d.powerPs} PS` : "";
  const engineL = d.engineSize ? `${(parseInt(d.engineSize) / 1000).toFixed(1)}L` : "";

  if (fuel || ps) {
    const techParts = [engineL, fuel, ps].filter(Boolean);
    if (techParts.length > 0) {
      parts.push(pick([
        `Unter der Haube arbeitet ein ${techParts.join(" ")}-Aggregat.`,
        `Angetrieben wird ${g.artDefLc} ${g.noun} von einem ${techParts.join(" ")}-Motor.`,
        `Die Motorisierung: ${techParts.join(", ")}.`,
      ], rand));
    }
  }

  if (trans || drive) {
    const driveInfo = [trans, drive].filter(Boolean).join(" mit ");
    if (driveInfo) {
      parts.push(pick([
        `Geschaltet wird über ein ${driveInfo}.`,
        `Ausgestattet mit ${driveInfo}.`,
        `Kraftübertragung: ${driveInfo}.`,
      ], rand));
    }
  }

  // Emission class
  if (hasValue(d.emissionClass)) {
    const emLabel = d.emissionClass.replace("euro", "Euro ");
    parts.push(`Abgasnorm: ${emLabel}.`);
  }

  return parts.join(" ");
}

// --- 4. Ausstattungs-Highlights ---

function buildHighlights(d: GeneratorInput, rand: () => number): string {
  // Collect top features across categories
  const allFeatures: string[] = [
    ...d.comfortFeatures,
    ...d.safetyFeatures,
    ...d.exteriorFeatures,
    ...d.multimediaFeatures,
  ];

  if (allFeatures.length === 0) return "";

  // Prioritize premium features
  const premiumKeywords = [
    "Panoramadach", "Matrix-LED", "Head-up-Display", "Massagesitze",
    "Nachtsichtassistent", "360°-Kamera", "Soundsystem", "Standheizung",
    "Abstandsregeltempomat", "Elektrische Sitze", "Keyless",
    "Navigationssystem", "LED-Scheinwerfer",
  ];

  const premium = allFeatures.filter(f => premiumKeywords.some(kw => f.includes(kw)));
  const rest = allFeatures.filter(f => !premiumKeywords.some(kw => f.includes(kw)));

  // Take up to 8 features, prioritizing premium
  const selected = [...premium, ...rest].slice(0, 8);

  const isDealer = d.sellerType === "dealer";

  const g = getGrammar(d.vehicleType);
  const intros = [
    isDealer
      ? "Zu den Ausstattungs-Highlights zählen unter anderem:"
      : "An Ausstattung ist unter anderem dabei:",
    `${g.artDef} ${g.noun} überzeugt mit folgender Ausstattung:`,
    `Die ${premium.length >= 3 ? "hochwertige" : "umfangreiche"} Ausstattung umfasst:`,
  ];

  return pick(intros, rand) + " " + selected.join(", ") + ".";
}

// --- 5. Komfort & Multimedia ---

function buildComfortMultimedia(d: GeneratorInput, rand: () => number): string {
  const parts: string[] = [];

  // Seat material & interior
  const seat = label(SEAT_LABELS, d.seatMaterial);
  const intColor = label(INTERIOR_COLOR_LABELS, d.interiorColor);

  if (seat || intColor) {
    const interiorParts = [
      intColor ? `${intColor}es Interieur` : "",
      seat ? `${seat}ausstattung` : "",
    ].filter(Boolean);
    if (interiorParts.length > 0) {
      parts.push(pick([
        `Der Innenraum besticht durch ${interiorParts.join(" mit ")}.`,
        `Innen erwartet Sie ${interiorParts.join(" und ")}.`,
      ], rand));
    }
  }

  // Seats & doors
  if (hasValue(d.seats) && hasValue(d.doors)) {
    parts.push(`${d.seats}-Sitzer mit ${d.doors} Türen.`);
  }

  // Parking aids
  if (d.parkingAid && d.parkingAid.length > 0) {
    const aids = d.parkingAid.map(a => {
      if (a === "front") return "vorne";
      if (a === "rear") return "hinten";
      if (a === "selfSteering") return "selbstlenkend";
      return a;
    });
    parts.push(`Einparkhilfe ${aids.join(" und ")}.`);
  }

  return parts.join(" ");
}

// --- 6. Exterieur & Optik ---

function buildExterior(d: GeneratorInput, rand: () => number): string {
  const parts: string[] = [];
  const g = getGrammar(d.vehicleType);
  const color = label(COLOR_LABELS, d.colorGeneral);
  const mfColor = d.colorManufacturer;

  if (color || mfColor) {
    const colorDesc = mfColor ? `${mfColor} (${color})` : color;
    if (colorDesc) {
      parts.push(pick([
        `Die Außenfarbe: ${colorDesc}.`,
        `${g.artDef} ${g.noun} kommt in ${colorDesc}.`,
        `Außenfarbe: ${colorDesc}.`,
      ], rand));
    }
  }

  if (hasValue(d.rimSize)) {
    parts.push(`Felgengröße: ${d.rimSize} Zoll.`);
  }

  // Exterior features that weren't already listed in highlights
  const exteriorOnly = d.exteriorFeatures.filter(f =>
    ["Anhängerkupplung", "Dachreling", "Sportpaket", "Lackversiegelung"].includes(f)
  );
  if (exteriorOnly.length > 0) {
    parts.push(`Außerdem: ${exteriorOnly.join(", ")}.`);
  }

  return parts.join(" ");
}

// --- 7. Sicherheit ---

function buildSafety(d: GeneratorInput): string {
  if (d.safetyFeatures.length === 0) return "";
  const g = getGrammar(d.vehicleType);

  // Safety features were already listed in highlights, so only mention
  // a brief summary if there are many
  if (d.safetyFeatures.length >= 5) {
    return `${g.artDef} ${g.noun} verfügt über ein umfassendes Sicherheitspaket mit modernen Assistenzsystemen.`;
  }
  return "";
}

// --- 8. Abschluss ---

function buildClosing(d: GeneratorInput, rand: () => number, imageCount: number): string {
  const isDealer = d.sellerType === "dealer";
  const parts: string[] = [];

  // Extras
  if (hasValue(d.extras)) {
    parts.push(`Weitere Extras: ${d.extras}`);
  }

  // Images
  if (imageCount > 0) {
    parts.push(pick([
      `Überzeugen Sie sich selbst anhand der ${imageCount} Bilder.`,
      `Weitere Details entnehmen Sie bitte den ${imageCount} Bildern.`,
      `${imageCount} Bilder vermitteln einen guten Gesamteindruck.`,
    ], rand));
  }

  // Price negotiable
  if (d.priceNegotiable) {
    parts.push(pick([
      "Preis ist verhandelbar.",
      "Über den Preis lässt sich reden.",
      "Preisverhandlung möglich.",
    ], rand));
  }

  // Closing invitation
  if (isDealer) {
    parts.push(pick([
      "Vereinbaren Sie gerne einen Besichtigungstermin. Wir freuen uns auf Ihre Anfrage!",
      "Kontaktieren Sie uns für eine Probefahrt oder weitere Informationen.",
      "Wir beraten Sie gerne persönlich. Rufen Sie uns an oder schreiben Sie uns!",
    ], rand));
  } else {
    parts.push(pick([
      "Bei Interesse einfach melden — Besichtigung und Probefahrt jederzeit möglich.",
      "Fragen beantworte ich gerne. Besichtigung nach Absprache.",
      "Einfach anschreiben bei Interesse!",
    ], rand));
  }

  return parts.join(" ");
}

// ============================================================================
// Main generator function
// ============================================================================

export function generateDescription(formData: GeneratorInput, imageCount: number = 0): string {
  // Create seed from stable vehicle data for consistent output
  const seed = [formData.brand, formData.model, formData.variant, formData.constructionYear, formData.mileage].join("|");
  const rand = createSeededRandom(seed);

  // Build each section
  const sections = [
    buildIntro(formData, rand),
    buildHistory(formData, rand),
    buildPowertrain(formData, rand),
    buildHighlights(formData, rand),
    buildComfortMultimedia(formData, rand),
    buildExterior(formData, rand),
    buildSafety(formData),
    buildClosing(formData, rand, imageCount),
  ].filter(s => s.length > 0);

  // Join with paragraph breaks for readability
  return sections.join("\n\n");
}

// ============================================================================
// Field completeness check — returns tips for improving the description
// ============================================================================

interface CompletenessResult {
  filledCount: number;
  totalRelevant: number;
  missingTips: string[];
}

export function checkCompleteness(formData: GeneratorInput): CompletenessResult {
  const checks: { field: boolean; tip: string }[] = [
    { field: hasValue(formData.constructionYear), tip: "Baujahr" },
    { field: hasValue(formData.mileage), tip: "Kilometerstand" },
    { field: hasValue(formData.powerPs), tip: "Leistung (PS)" },
    { field: hasValue(formData.fuelType), tip: "Kraftstoffart" },
    { field: hasValue(formData.transmission), tip: "Getriebe" },
    { field: hasValue(formData.condition), tip: "Zustand" },
    { field: formData.accidentFree !== null, tip: "Unfallfrei" },
    { field: formData.manufacturerCertified !== null, tip: "Herstellerzertifiziert" },
    { field: formData.serviceHistory !== null, tip: "Scheckheft" },
    { field: hasValue(formData.colorGeneral), tip: "Farbe" },
    { field: formData.comfortFeatures.length > 0, tip: "Komfort-Ausstattung" },
    { field: formData.safetyFeatures.length > 0, tip: "Sicherheits-Ausstattung" },
    { field: formData.exteriorFeatures.length > 0, tip: "Exterieur" },
    { field: formData.multimediaFeatures.length > 0, tip: "Multimedia" },
  ];

  const filled = checks.filter(c => c.field).length;
  const missing = checks.filter(c => !c.field).map(c => c.tip);

  return {
    filledCount: filled,
    totalRelevant: checks.length,
    missingTips: missing.slice(0, 4), // Show max 4 tips
  };
}
