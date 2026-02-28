"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ============================================================================
// TYPES
// ============================================================================

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  mileage: number;
  powerPs: number;
  fuelType: string;
  transmission: string;
  color: string;
  city: string;
  zip: string;
  sellerType: "private" | "dealer";
  companyName?: string;
  contactName: string;
  showContactName: boolean;
  contactPhone: string;
  showContactPhone: boolean;
  contactEmail: string;
  description: string;
  condition: string;
  doors: string;
  seats: string;
  driveType: string;
  firstRegistration: string;
  accidentFree: boolean;
  comfortFeatures: string[];
  safetyFeatures: string[];
  exteriorFeatures: string[];
  multimediaFeatures: string[];
  gradient: string;
}

// ============================================================================
// EXAMPLE VEHICLES
// ============================================================================

const vehicles: Vehicle[] = [
  {
    id: 1,
    brand: "BMW",
    model: "M4 Competition",
    variant: "xDrive Coupé",
    year: 2022,
    price: 84900,
    mileage: 18500,
    powerPs: 510,
    fuelType: "Benzin",
    transmission: "Automatik",
    color: "Frozen Portimao Blau",
    city: "München",
    zip: "80331",
    sellerType: "dealer",
    companyName: "Bavaria Motors GmbH",
    contactName: "Thomas Huber",
    showContactName: true,
    contactPhone: "+49 89 1234567",
    showContactPhone: true,
    contactEmail: "info@bavaria-motors.de",
    description:
      "BMW M4 Competition xDrive in der exklusiven Frozen Portimao Blau Lackierung. Vollausgestattet mit M Carbon Paket, M Drivers Package, Harman Kardon Surround Sound und Head-Up Display. Scheckheftgepflegt beim BMW Vertragshändler. Nichtraucher-Fahrzeug.",
    condition: "Gebraucht",
    doors: "2",
    seats: "4",
    driveType: "Allrad",
    firstRegistration: "03/2022",
    accidentFree: true,
    comfortFeatures: ["Sitzheizung", "Klimaautomatik", "Keyless Go", "Head-Up Display"],
    safetyFeatures: ["Spurhalteassistent", "Totwinkelwarner", "Notbremsassistent"],
    exteriorFeatures: ["M Carbon Dach", "M Carbon Paket", "LED Scheinwerfer", "19/20 Zoll M Felgen"],
    multimediaFeatures: ["Harman Kardon", "Apple CarPlay", "Android Auto", "Navigation"],
    gradient: "from-blue-600 via-blue-800 to-gray-900",
  },
  {
    id: 2,
    brand: "VW",
    model: "Golf 8 GTI",
    variant: "Clubsport",
    year: 2023,
    price: 37900,
    mileage: 12000,
    powerPs: 300,
    fuelType: "Benzin",
    transmission: "Automatik (DSG)",
    color: "Pure White",
    city: "Wolfsburg",
    zip: "38440",
    sellerType: "private",
    contactName: "Markus Weber",
    showContactName: true,
    contactPhone: "+49 170 9876543",
    showContactPhone: false,
    contactEmail: "m.weber@email.de",
    description:
      "Golf 8 GTI Clubsport mit 300 PS, DSG und Panoramadach. Immer in der VW-Werkstatt gewartet, alle Inspektionen durchgeführt. Winterräder auf Stahlfelgen inklusive. Nichtraucher, Garagenfahrzeug.",
    condition: "Gebraucht",
    doors: "5",
    seats: "5",
    driveType: "Frontantrieb",
    firstRegistration: "01/2023",
    accidentFree: true,
    comfortFeatures: ["Panoramadach", "Sitzheizung", "Klimaautomatik", "Rückfahrkamera"],
    safetyFeatures: ["ACC", "Spurhalteassistent", "Notbremsassistent", "Müdigkeitserkennung"],
    exteriorFeatures: ["LED Matrix Scheinwerfer", "19 Zoll Felgen", "Heckspoiler"],
    multimediaFeatures: ["Discover Pro", "Apple CarPlay", "Android Auto", "Wireless Charging"],
    gradient: "from-red-500 via-red-700 to-gray-900",
  },
  {
    id: 3,
    brand: "Mercedes-Benz",
    model: "C 300",
    variant: "AMG Line Limousine",
    year: 2021,
    price: 41500,
    mileage: 34000,
    powerPs: 258,
    fuelType: "Benzin",
    transmission: "Automatik (9G-TRONIC)",
    color: "Obsidianschwarz Metallic",
    city: "Stuttgart",
    zip: "70173",
    sellerType: "dealer",
    companyName: "Stern Automobile Stuttgart",
    contactName: "Sandra Müller",
    showContactName: true,
    contactPhone: "+49 711 5556677",
    showContactPhone: true,
    contactEmail: "verkauf@stern-automobile.de",
    description:
      "Mercedes-Benz C 300 AMG Line mit Burmester Soundsystem, 360° Kamera und MBUX Augmented Reality Navigation. Gepflegtes Fahrzeug aus erster Hand. Garantie bis 03/2026.",
    condition: "Gebraucht",
    doors: "4",
    seats: "5",
    driveType: "Hinterradantrieb",
    firstRegistration: "06/2021",
    accidentFree: true,
    comfortFeatures: ["Sitzheizung vorn & hinten", "Klimaautomatik 3-Zonen", "Ambientebeleuchtung 64 Farben", "Keyless Go"],
    safetyFeatures: ["360° Kamera", "Aktiver Bremsassistent", "Totwinkelassistent", "Parktronic"],
    exteriorFeatures: ["AMG Styling", "Multibeam LED", "19 Zoll AMG Felgen", "Panorama-Schiebedach"],
    multimediaFeatures: ["Burmester Surround", "MBUX", "Wireless CarPlay", "Head-Up Display"],
    gradient: "from-gray-700 via-gray-900 to-black",
  },
  {
    id: 4,
    brand: "Porsche",
    model: "911 Carrera S",
    variant: "992 PDK",
    year: 2020,
    price: 124900,
    mileage: 22000,
    powerPs: 450,
    fuelType: "Benzin",
    transmission: "Automatik (PDK)",
    color: "Gentianblau Metallic",
    city: "Hamburg",
    zip: "20095",
    sellerType: "private",
    contactName: "Dr. Alexander Fischer",
    showContactName: false,
    contactPhone: "+49 172 1112233",
    showContactPhone: true,
    contactEmail: "a.fischer@email.de",
    description:
      "Porsche 911 Carrera S (992) mit Sport Chrono Paket, PASM Sportfahrwerk, Sport Abgasanlage und Bose Surround. Porsche Approved Garantie übertragbar. Lückenlose Servicehistorie im Porsche Zentrum Hamburg.",
    condition: "Gebraucht",
    doors: "2",
    seats: "4",
    driveType: "Hinterradantrieb",
    firstRegistration: "09/2020",
    accidentFree: true,
    comfortFeatures: ["Sport Chrono Paket", "Sitzheizung", "Sitzbelüftung", "14-Wege Sportsitze"],
    safetyFeatures: ["PASM", "Porsche Stability Management", "Nachtsichtassistent"],
    exteriorFeatures: ["Sport Design Paket", "LED Matrix Scheinwerfer", "20/21 Zoll Carrera S Felgen"],
    multimediaFeatures: ["Bose Surround", "PCM 6.0", "Apple CarPlay", "Sport Chrono Display"],
    gradient: "from-indigo-600 via-indigo-900 to-gray-900",
  },
  {
    id: 5,
    brand: "Tesla",
    model: "Model 3",
    variant: "Long Range AWD",
    year: 2023,
    price: 43900,
    mileage: 15000,
    powerPs: 498,
    fuelType: "Elektro",
    transmission: "Automatik",
    color: "Pearl White Multi-Coat",
    city: "Berlin",
    zip: "10115",
    sellerType: "private",
    contactName: "Julia Schreiber",
    showContactName: true,
    contactPhone: "+49 176 4445566",
    showContactPhone: true,
    contactEmail: "j.schreiber@email.de",
    description:
      "Tesla Model 3 Long Range mit Allradantrieb, Full Self-Driving Capability und weißem Premium-Interieur. Akku-Gesundheit 97%. Supercharger-Zugang inklusive. Wallbox kann optional übernommen werden.",
    condition: "Gebraucht",
    doors: "4",
    seats: "5",
    driveType: "Allrad",
    firstRegistration: "03/2023",
    accidentFree: true,
    comfortFeatures: ["Glasdach", "Sitzheizung alle Sitze", "Lenkradheizung", "Automatisches Einparken"],
    safetyFeatures: ["Autopilot", "Notbremsassistent", "Spurhalteassistent", "8 Kameras"],
    exteriorFeatures: ["19 Zoll Sport Felgen", "Tönungsfolie", "Chrome Delete"],
    multimediaFeatures: ["15 Zoll Touchscreen", "Premium Audio", "Netflix/YouTube", "Spotify"],
    gradient: "from-sky-400 via-sky-600 to-gray-900",
  },
  {
    id: 6,
    brand: "Audi",
    model: "RS3 Sportback",
    variant: "8Y 400 PS",
    year: 2022,
    price: 61900,
    mileage: 25000,
    powerPs: 400,
    fuelType: "Benzin",
    transmission: "Automatik (S tronic)",
    color: "Nardograu",
    city: "Ingolstadt",
    zip: "85049",
    sellerType: "dealer",
    companyName: "Audi Zentrum Ingolstadt",
    contactName: "Michael Bauer",
    showContactName: true,
    contactPhone: "+49 841 7788990",
    showContactPhone: true,
    contactEmail: "verkauf@audi-ingolstadt.de",
    description:
      "Audi RS3 Sportback mit dem legendären 2.5 TFSI 5-Zylinder. RS Sportabgasanlage mit Klappensteuerung, RS Dynamikpaket plus, Matrix LED Scheinwerfer und B&O Sound System. Audi Garantie bis 12/2025.",
    condition: "Gebraucht",
    doors: "5",
    seats: "5",
    driveType: "Allrad (quattro)",
    firstRegistration: "07/2022",
    accidentFree: true,
    comfortFeatures: ["RS Sportsitze", "Sitzheizung", "3-Zonen Klimaautomatik", "Keyless Entry"],
    safetyFeatures: ["Audi Pre Sense", "Spurhalteassistent", "Adaptiver Tempomat"],
    exteriorFeatures: ["RS Heckspoiler", "Matrix LED", "19 Zoll RS Felgen", "RS Sportabgasanlage"],
    multimediaFeatures: ["B&O Sound System", "MMI Navigation Plus", "Audi Virtual Cockpit Plus", "Wireless CarPlay"],
    gradient: "from-gray-500 via-gray-700 to-gray-900",
  },
];

// ============================================================================
// FILTER OPTIONS
// ============================================================================

const brandOptions = ["Alle Marken", ...new Set(vehicles.map((v) => v.brand))];
const fuelOptions = ["Alle Kraftstoffe", ...new Set(vehicles.map((v) => v.fuelType))];
const priceRanges = [
  { label: "Alle Preise", min: 0, max: Infinity },
  { label: "Bis 40.000 €", min: 0, max: 40000 },
  { label: "40.000 – 70.000 €", min: 40000, max: 70000 },
  { label: "70.000 – 100.000 €", min: 70000, max: 100000 },
  { label: "Über 100.000 €", min: 100000, max: Infinity },
];

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
// DETAIL MODAL
// ============================================================================

function DetailModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
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

          {/* Key specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Kilometer", value: `${vehicle.mileage.toLocaleString("de-DE")} km` },
              { label: "Leistung", value: `${vehicle.powerPs} PS` },
              { label: "Kraftstoff", value: vehicle.fuelType },
              { label: "Getriebe", value: vehicle.transmission },
              { label: "Antrieb", value: vehicle.driveType },
              { label: "Farbe", value: vehicle.color },
              { label: "Türen", value: vehicle.doors },
              { label: "Sitze", value: vehicle.seats },
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
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Beschreibung</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{vehicle.description}</p>
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

function VehicleCard({ vehicle, onClick }: { vehicle: Vehicle; onClick: () => void }) {
  return (
    <div className="card cursor-pointer overflow-hidden group" onClick={onClick}>
      {/* Image Placeholder */}
      <div className={`h-48 bg-gradient-to-br ${vehicle.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-white/15 text-6xl tracking-wider select-none group-hover:scale-110 transition-transform duration-500">
            {vehicle.brand}
          </span>
        </div>
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

export default function InseratePage() {
  const [brandFilter, setBrandFilter] = useState("Alle Marken");
  const [fuelFilter, setFuelFilter] = useState("Alle Kraftstoffe");
  const [priceFilter, setPriceFilter] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) => {
    if (brandFilter !== "Alle Marken" && v.brand !== brandFilter) return false;
    if (fuelFilter !== "Alle Kraftstoffe" && v.fuelType !== fuelFilter) return false;
    const range = priceRanges[priceFilter];
    if (v.price < range.min || v.price >= range.max) return false;
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
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-[#f14011] transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
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
              onChange={(e) => setBrandFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
            >
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Price */}
          <div className="relative">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
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
              className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-[#f14011] focus:border-[#f14011] focus:outline-none transition-colors cursor-pointer"
            >
              {fuelOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Result count */}
          <div className="flex items-center px-4 text-sm text-gray-400">
            {filtered.length} {filtered.length === 1 ? "Fahrzeug" : "Fahrzeuge"}
          </div>
        </div>
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
                <VehicleCard vehicle={vehicle} onClick={() => setSelectedVehicle(vehicle)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Keine Fahrzeuge gefunden.</p>
            <button
              onClick={() => {
                setBrandFilter("Alle Marken");
                setFuelFilter("Alle Kraftstoffe");
                setPriceFilter(0);
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
        <DetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      )}
    </div>
  );
}
