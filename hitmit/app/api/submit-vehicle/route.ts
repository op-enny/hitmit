import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { v2 as cloudinary } from "cloudinary";

// ============================================================================
// CONFIGURATION (Lazy initialization to avoid build-time errors)
// ============================================================================

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ============================================================================
// TYPES - Based on CreateVehicleDto from Backend API
// ============================================================================

interface VehicleSubmissionDto {
  // Contact Information (not in CreateVehicleDto but needed for email)
  sellerType: "private" | "dealer";
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Required Vehicle Fields
  brand: string;
  model: string;
  price: number;
  zip: string;
  city: string;

  // Optional Vehicle Fields (from CreateVehicleDto)
  variant?: string;
  vehicleType?: string;
  vehicleCategory?: string;
  vin?: string;
  firstRegistration?: string;
  constructionYear?: number;
  huValidUntil?: string;
  mileage?: number;
  previousOwners?: number;
  fuelType?: string;
  powerPs?: number;
  transmission?: string;
  driveType?: string;
  cylinders?: number;
  engineSize?: number;
  tankSize?: number;
  emissionClass?: string;
  environmentalBadge?: string;
  particleFilter?: boolean;
  co2Emission?: number;
  colorGeneral?: string;
  colorManufacturer?: string;
  doors?: number;
  seats?: number;
  weight?: number;
  condition?: string;
  accidentFree?: boolean;
  repaintFree?: boolean;
  serviceHistory?: boolean;
  serviceHistoryAt?: string;
  warrantyUntil?: string;
  manufacturerWarrantyUntil?: string;
  interiorColor?: string;
  seatMaterial?: string;
  comfortFeatures?: string[];
  safetyFeatures?: string[];
  exteriorFeatures?: string[];
  multimediaFeatures?: string[];
  airbags?: string;
  parkingAid?: string[];
  cameraFront?: boolean;
  cameraRear?: boolean;
  climateZones?: number;
  rimSize?: number;
  tireConditionFront?: string;
  tireConditionRear?: string;
  priceNegotiable?: boolean;
  vatDeductible?: boolean;
  country?: string;
  lat?: number;
  lng?: number;
  description?: string;
  extras?: string;
  safetyOther?: string;
  comfortOther?: string;
  exteriorOther?: string;
  multimediaOther?: string;
  damageMap?: Record<string, string>;
  paintThicknessAvailable?: boolean;
  paintThickness?: Record<string, string>;
  paintThicknessImage?: string;

  // Images (base64 encoded)
  images?: string[];

  // Honeypot field (should be empty)
  website?: string;
}

// ============================================================================
// RATE LIMITING (In-memory, simple implementation)
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = process.env.NODE_ENV === "development" ? 100 : 5; // Max submissions per window
const RATE_LIMIT_WINDOW = process.env.NODE_ENV === "development" ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5 min in dev, 1 hour in prod

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

// Cleanup old entries periodically (only in non-edge runtime)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

// ============================================================================
// CONSTANTS & VALIDATION
// ============================================================================

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
const MAX_IMAGES = 10;
const MAX_DESCRIPTION_LENGTH = 5000;

const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid", "pluginHybrid", "lpg", "cng", "hydrogen", "other"];
const TRANSMISSIONS = ["manual", "automatic", "semiAutomatic"];
const DRIVE_TYPES = ["fwd", "rwd", "awd"];
const CONDITIONS = ["new", "used", "yearOld", "demo", "dayReg"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function formatNumber(num: number | undefined): string {
  if (num === undefined) return "-";
  return new Intl.NumberFormat("de-DE").format(num);
}

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateImageBase64(base64: string): { valid: boolean; error?: string } {
  if (!base64.startsWith("data:image/")) {
    return { valid: false, error: "Invalid image format" };
  }

  const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    return { valid: false, error: "Invalid base64 format" };
  }

  const allowedTypes = ["jpeg", "jpg", "png", "webp", "gif"];
  if (!allowedTypes.includes(matches[1].toLowerCase())) {
    return { valid: false, error: `Image type '${matches[1]}' not allowed` };
  }

  // Check size (base64 is ~33% larger than binary)
  const sizeInBytes = (matches[2].length * 3) / 4;
  if (sizeInBytes > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit` };
  }

  return { valid: true };
}

// ============================================================================
// CLOUDINARY UPLOAD
// ============================================================================

async function uploadToCloudinary(base64Image: string, index: number): Promise<string | null> {
  try {
    configureCloudinary();
    const timestamp = Date.now();
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "hitmit",
      public_id: `submission-${timestamp}-${index}`,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 900, crop: "limit" }, // Resize to max dimensions
        { quality: "auto:good" }, // Optimize quality
        { fetch_format: "auto" }, // Auto format (webp where supported)
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image ${index}:`, error);
    return null;
  }
}

// ============================================================================
// EMAIL TEMPLATE
// ============================================================================

function generateEmailHtml(data: VehicleSubmissionDto, imageUrls: string[], paintThicknessImageUrl: string | null = null): string {
  const sellerTypeLabel = data.sellerType === "dealer" ? "Händler/Gewerbe" : "Privatverkäufer";
  const s = (val: string | undefined) => sanitizeHtml(val || "-");
  const n = (val: number | undefined) => val !== undefined ? formatNumber(val) : "-";
  const b = (val: boolean | undefined) => val === true ? "Ja" : val === false ? "Nein" : "-";
  const arr = (val: string[] | undefined) => val?.length ? val.map(sanitizeHtml).join(", ") : "-";

  const imageGalleryHtml = imageUrls.length > 0 ? `
    <div class="section">
      <div class="section-title">📷 Bilder (${imageUrls.length})</div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${imageUrls.map((url, i) => `
          <a href="${url}" target="_blank" style="display: block;">
            <img src="${url}" alt="Bild ${i + 1}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
          </a>
        `).join("")}
      </div>
    </div>
  ` : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: linear-gradient(135deg, #f14011 0%, #d63a0f 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
    .content { padding: 25px; }
    .section { margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #eee; }
    .section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .section-title { font-size: 14px; font-weight: 600; color: #f14011; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
    .grid { width: 100%; }
    .grid-row { display: flex; flex-wrap: wrap; margin: 0 -10px; }
    .grid-cell { flex: 1; min-width: 45%; padding: 8px 10px; }
    .label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 14px; color: #333; margin-top: 2px; }
    .vehicle-title { font-size: 24px; font-weight: 700; color: #0a0a0a; margin-bottom: 5px; }
    .price { font-size: 28px; font-weight: 700; color: #f14011; }
    .badge { display: inline-block; background: #fef2ef; color: #f14011; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
    .description-box { background: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; }
    .contact-box { background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; }
    a { color: #f14011; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .cta-button { display: inline-block; background: #f14011; color: white !important; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Neue Fahrzeugeinreichung</h1>
    </div>
    <div class="content">
      <!-- Summary -->
      <div class="section">
        <span class="badge">${sellerTypeLabel}</span>
        <div class="vehicle-title">${s(data.brand)} ${s(data.model)}${data.variant ? ` ${s(data.variant)}` : ""}</div>
        <div class="price">${formatPrice(data.price)}</div>
        ${data.priceNegotiable ? '<div style="color: #666; font-size: 14px; margin-top: 5px;">💬 Preis verhandelbar</div>' : ""}
      </div>

      <!-- Contact Information -->
      <div class="section">
        <div class="section-title">👤 Kontaktdaten</div>
        <div class="contact-box">
          <div class="grid">
            <div class="grid-row">
              <div class="grid-cell">
                <div class="label">Name</div>
                <div class="value">${s(data.contactName)}</div>
              </div>
              <div class="grid-cell">
                <div class="label">Telefon</div>
                <div class="value"><a href="tel:${s(data.contactPhone)}">${s(data.contactPhone)}</a></div>
              </div>
            </div>
            <div class="grid-row">
              <div class="grid-cell">
                <div class="label">E-Mail</div>
                <div class="value"><a href="mailto:${s(data.contactEmail)}">${s(data.contactEmail)}</a></div>
              </div>
            </div>
          </div>
          <a href="mailto:${s(data.contactEmail)}" class="cta-button">Verkäufer kontaktieren</a>
        </div>
      </div>

      <!-- Images -->
      ${imageGalleryHtml}

      <!-- Basic Vehicle Data -->
      <div class="section">
        <div class="section-title">📋 Fahrzeugdaten</div>
        <div class="grid">
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Marke</div><div class="value">${s(data.brand)}</div></div>
            <div class="grid-cell"><div class="label">Modell</div><div class="value">${s(data.model)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Variante</div><div class="value">${s(data.variant)}</div></div>
            <div class="grid-cell"><div class="label">Fahrzeugtyp</div><div class="value">${s(data.vehicleType)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Kategorie</div><div class="value">${s(data.vehicleCategory)}</div></div>
            <div class="grid-cell"><div class="label">VIN</div><div class="value">${s(data.vin)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Erstzulassung</div><div class="value">${s(data.firstRegistration)}</div></div>
            <div class="grid-cell"><div class="label">Baujahr</div><div class="value">${n(data.constructionYear)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">HU gültig bis</div><div class="value">${s(data.huValidUntil)}</div></div>
            <div class="grid-cell"><div class="label">Kilometerstand</div><div class="value">${data.mileage !== undefined ? `${formatNumber(data.mileage)} km` : "-"}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Vorbesitzer</div><div class="value">${n(data.previousOwners)}</div></div>
            <div class="grid-cell"><div class="label">Zustand</div><div class="value">${s(data.condition)}</div></div>
          </div>
        </div>
      </div>

      <!-- Technical Data -->
      <div class="section">
        <div class="section-title">⚙️ Technische Daten</div>
        <div class="grid">
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Kraftstoff</div><div class="value">${s(data.fuelType)}</div></div>
            <div class="grid-cell"><div class="label">Leistung</div><div class="value">${data.powerPs !== undefined ? `${n(data.powerPs)} PS` : "-"}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Getriebe</div><div class="value">${s(data.transmission)}</div></div>
            <div class="grid-cell"><div class="label">Antrieb</div><div class="value">${s(data.driveType)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Zylinder</div><div class="value">${n(data.cylinders)}</div></div>
            <div class="grid-cell"><div class="label">Hubraum</div><div class="value">${data.engineSize !== undefined ? `${formatNumber(data.engineSize)} ccm` : "-"}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Tankvolumen</div><div class="value">${data.tankSize !== undefined ? `${n(data.tankSize)} L` : "-"}</div></div>
            <div class="grid-cell"><div class="label">Gewicht</div><div class="value">${data.weight !== undefined ? `${formatNumber(data.weight)} kg` : "-"}</div></div>
          </div>
        </div>
      </div>

      <!-- Emissions -->
      <div class="section">
        <div class="section-title">🌱 Umwelt & Emissionen</div>
        <div class="grid">
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Emissionsklasse</div><div class="value">${s(data.emissionClass)}</div></div>
            <div class="grid-cell"><div class="label">Umweltplakette</div><div class="value">${s(data.environmentalBadge)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">CO2-Emission</div><div class="value">${data.co2Emission !== undefined ? `${n(data.co2Emission)} g/km` : "-"}</div></div>
            <div class="grid-cell"><div class="label">Partikelfilter</div><div class="value">${b(data.particleFilter)}</div></div>
          </div>
        </div>
      </div>

      <!-- Exterior & Interior -->
      <div class="section">
        <div class="section-title">🎨 Exterieur & Interieur</div>
        <div class="grid">
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Außenfarbe</div><div class="value">${s(data.colorGeneral)}</div></div>
            <div class="grid-cell"><div class="label">Herstellerfarbe</div><div class="value">${s(data.colorManufacturer)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Türen</div><div class="value">${n(data.doors)}</div></div>
            <div class="grid-cell"><div class="label">Sitze</div><div class="value">${n(data.seats)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Innenfarbe</div><div class="value">${s(data.interiorColor)}</div></div>
            <div class="grid-cell"><div class="label">Sitzmaterial</div><div class="value">${s(data.seatMaterial)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Klimazonen</div><div class="value">${n(data.climateZones)}</div></div>
            <div class="grid-cell"><div class="label">Felgengröße</div><div class="value">${data.rimSize !== undefined ? `${n(data.rimSize)} Zoll` : "-"}</div></div>
          </div>
        </div>
      </div>

      <!-- Condition & History -->
      <div class="section">
        <div class="section-title">📜 Zustand & Historie</div>
        <div class="grid">
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Unfallfrei</div><div class="value">${b(data.accidentFree)}</div></div>
            <div class="grid-cell"><div class="label">Nachlackierungsfrei</div><div class="value">${b(data.repaintFree)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Scheckheftgepflegt</div><div class="value">${b(data.serviceHistory)}</div></div>
            <div class="grid-cell"><div class="label">Letzter Service bei</div><div class="value">${s(data.serviceHistoryAt)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Garantie bis</div><div class="value">${s(data.warrantyUntil)}</div></div>
            <div class="grid-cell"><div class="label">Herstellergarantie</div><div class="value">${s(data.manufacturerWarrantyUntil)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Reifen vorne</div><div class="value">${s(data.tireConditionFront)}</div></div>
            <div class="grid-cell"><div class="label">Reifen hinten</div><div class="value">${s(data.tireConditionRear)}</div></div>
          </div>
        </div>
      </div>

      <!-- Features -->
      ${(data.comfortFeatures?.length || data.safetyFeatures?.length || data.exteriorFeatures?.length || data.multimediaFeatures?.length) ? `
      <div class="section">
        <div class="section-title">✨ Ausstattung</div>
        ${data.comfortFeatures?.length ? `<div style="margin-bottom: 10px;"><strong>Komfort:</strong> ${arr(data.comfortFeatures)}${data.comfortOther ? `, Sonstige: ${s(data.comfortOther)}` : ""}</div>` : ""}
        ${data.safetyFeatures?.length ? `<div style="margin-bottom: 10px;"><strong>Sicherheit:</strong> ${arr(data.safetyFeatures)}${data.safetyOther ? `, Sonstige: ${s(data.safetyOther)}` : ""}</div>` : ""}
        ${data.exteriorFeatures?.length ? `<div style="margin-bottom: 10px;"><strong>Exterieur:</strong> ${arr(data.exteriorFeatures)}${data.exteriorOther ? `, Sonstige: ${s(data.exteriorOther)}` : ""}</div>` : ""}
        ${data.multimediaFeatures?.length ? `<div style="margin-bottom: 10px;"><strong>Multimedia:</strong> ${arr(data.multimediaFeatures)}${data.multimediaOther ? `, Sonstige: ${s(data.multimediaOther)}` : ""}</div>` : ""}
        ${data.airbags ? `<div style="margin-bottom: 10px;"><strong>Airbags:</strong> ${s(data.airbags)}</div>` : ""}
        ${data.parkingAid && data.parkingAid.length > 0 ? `<div style="margin-bottom: 10px;"><strong>Einparkhilfe:</strong> ${data.parkingAid.map(s).join(", ")}</div>` : ""}
        ${data.cameraFront !== undefined ? `<div style="margin-bottom: 10px;"><strong>Kamera vorne:</strong> ${data.cameraFront ? "Ja" : "Nein"}</div>` : ""}
        ${data.cameraRear !== undefined ? `<div style="margin-bottom: 10px;"><strong>Kamera hinten:</strong> ${data.cameraRear ? "Ja" : "Nein"}</div>` : ""}
      </div>
      ` : ""}

      ${data.damageMap && Object.keys(data.damageMap).length > 0 ? `
      <div class="section">
        <div class="section-title">🔍 Schadenskarte</div>
        ${Object.entries(data.damageMap).map(([zone, desc]) => `<div style="margin-bottom: 5px;"><strong>${s(zone)}:</strong> ${s(desc as string)}${data.paintThicknessAvailable && data.paintThickness?.[zone] ? ` <span style="color: #888;">(${s(data.paintThickness[zone])} µm)</span>` : ""}</div>`).join("")}
        ${data.paintThicknessAvailable !== undefined ? `<div style="margin-top: 10px;"><strong>Lackdickenmessung:</strong> ${data.paintThicknessAvailable ? "Ja" : "Nein"}</div>` : ""}
        ${paintThicknessImageUrl ? `<div style="margin-top: 10px;"><strong>Messprotokoll:</strong><br/><a href="${paintThicknessImageUrl}" target="_blank"><img src="${paintThicknessImageUrl}" alt="Messprotokoll" style="max-width: 200px; border-radius: 8px; margin-top: 5px;" /></a></div>` : ""}
      </div>
      ` : ""}

      <!-- Location -->
      <div class="section">
        <div class="section-title">📍 Standort</div>
        <div class="grid">
          <div class="grid-row">
            <div class="grid-cell"><div class="label">PLZ</div><div class="value">${s(data.zip)}</div></div>
            <div class="grid-cell"><div class="label">Stadt</div><div class="value">${s(data.city)}</div></div>
          </div>
          <div class="grid-row">
            <div class="grid-cell"><div class="label">Land</div><div class="value">${s(data.country) || "Deutschland"}</div></div>
            <div class="grid-cell"><div class="label">MwSt. ausweisbar</div><div class="value">${b(data.vatDeductible)}</div></div>
          </div>
        </div>
      </div>

      <!-- Description -->
      ${data.description ? `
      <div class="section">
        <div class="section-title">📝 Beschreibung</div>
        <div class="description-box">${sanitizeHtml(data.description)}</div>
      </div>
      ` : ""}

      <!-- Extras -->
      ${data.extras ? `
      <div class="section">
        <div class="section-title">➕ Extras</div>
        <div class="description-box">${sanitizeHtml(data.extras)}</div>
      </div>
      ` : ""}
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
      Diese E-Mail wurde automatisch von HITMIT generiert.
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// VALIDATION
// ============================================================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateSubmission(data: VehicleSubmissionDto): ValidationResult {
  const errors: string[] = [];

  // Honeypot check (should be empty)
  if (data.website) {
    errors.push("Spam detected");
    return { valid: false, errors };
  }

  // Required fields
  if (!data.contactName?.trim()) errors.push("Name ist erforderlich");
  if (!data.contactEmail?.trim()) errors.push("E-Mail ist erforderlich");
  if (!data.contactPhone?.trim()) errors.push("Telefonnummer ist erforderlich");
  if (!data.brand?.trim()) errors.push("Marke ist erforderlich");
  if (!data.model?.trim()) errors.push("Modell ist erforderlich");
  if (data.price === undefined || data.price <= 0) errors.push("Gültiger Preis ist erforderlich");
  if (!data.zip?.trim()) errors.push("PLZ ist erforderlich");
  if (!data.city?.trim()) errors.push("Stadt ist erforderlich");

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.contactEmail && !emailRegex.test(data.contactEmail)) {
    errors.push("Ungültige E-Mail-Adresse");
  }

  // Seller type
  if (!["private", "dealer"].includes(data.sellerType)) {
    errors.push("Ungültiger Verkäufertyp");
  }

  // Optional field validations
  if (data.constructionYear && (data.constructionYear < 1900 || data.constructionYear > new Date().getFullYear() + 1)) {
    errors.push("Ungültiges Baujahr");
  }

  if (data.mileage !== undefined && data.mileage < 0) {
    errors.push("Ungültiger Kilometerstand");
  }

  if (data.fuelType && !FUEL_TYPES.includes(data.fuelType)) {
    errors.push("Ungültiger Kraftstofftyp");
  }

  if (data.transmission && !TRANSMISSIONS.includes(data.transmission)) {
    errors.push("Ungültiges Getriebe");
  }

  if (data.driveType && !DRIVE_TYPES.includes(data.driveType)) {
    errors.push("Ungültiger Antrieb");
  }

  if (data.condition && !CONDITIONS.includes(data.condition)) {
    errors.push("Ungültiger Zustand");
  }

  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`Beschreibung darf maximal ${MAX_DESCRIPTION_LENGTH} Zeichen lang sein`);
  }

  // Image validations
  if (data.images) {
    if (data.images.length > MAX_IMAGES) {
      errors.push(`Maximal ${MAX_IMAGES} Bilder erlaubt`);
    }

    for (let i = 0; i < Math.min(data.images.length, MAX_IMAGES); i++) {
      const result = validateImageBase64(data.images[i]);
      if (!result.valid) {
        errors.push(`Bild ${i + 1}: ${result.error}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Check configuration
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { success: false, error: "E-Mail-Service nicht konfiguriert" },
        { status: 500 }
      );
    }

    // Rate limiting
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Zu viele Anfragen. Bitte versuche es später erneut.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    let data: VehicleSubmissionDto;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Ungültige Anfrage" },
        { status: 400 }
      );
    }

    // Validate submission
    const validation = validateSubmission(data);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    let imageUrls: string[] = [];
    if (data.images?.length && process.env.CLOUDINARY_CLOUD_NAME) {
      const uploadPromises = data.images
        .slice(0, MAX_IMAGES)
        .map((img, i) => uploadToCloudinary(img, i));

      const results = await Promise.all(uploadPromises);
      imageUrls = results.filter((url): url is string => url !== null);
    }

    // Upload paint thickness measurement image
    let paintThicknessImageUrl: string | null = null;
    if (data.paintThicknessImage && process.env.CLOUDINARY_CLOUD_NAME) {
      const imgValidation = validateImageBase64(data.paintThicknessImage);
      if (imgValidation.valid) {
        paintThicknessImageUrl = await uploadToCloudinary(data.paintThicknessImage, 99);
      }
    }

    // Send email via Resend
    const recipientEmail = process.env.SUBMISSION_EMAIL || "team@hitmit.de";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const { error } = await getResendClient().emails.send({
      from: `HITMIT <${fromEmail}>`,
      to: [recipientEmail],
      replyTo: data.contactEmail,
      subject: `🚗 Neue Einreichung: ${data.brand} ${data.model} - ${formatPrice(data.price)}`,
      html: generateEmailHtml(data, imageUrls, paintThicknessImageUrl),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, error: "E-Mail konnte nicht gesendet werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fahrzeug erfolgreich eingereicht. Wir melden uns innerhalb von 24 Stunden.",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
      },
      { status: 500 }
    );
  }
}
