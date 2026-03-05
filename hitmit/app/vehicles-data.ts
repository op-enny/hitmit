// ============================================================================
// SHARED VEHICLE DATA
// ============================================================================

export interface Vehicle {
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
  paintThickness?: Record<string, string>;
  vehicleOrigin?: string;
  tireDepthFront?: string;
  tireDepthRear?: string;
  tireAgeFront?: string;
  tireAgeRear?: string;
  tireDamageFront?: boolean;
  tireDamageRear?: boolean;
  gradient: string;
}

export const vehicles: Vehicle[] = [
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
    paintThickness: { "Motorhaube": "105", "Kotflügel vorne links": "112", "Fahrertür": "98", "Kotflügel hinten rechts": "185", "Heckklappe": "102" },
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

export const brandOptions = ["Alle Marken", ...new Set(vehicles.map((v) => v.brand))];
export const fuelOptions = ["Alle Kraftstoffe", ...new Set(vehicles.map((v) => v.fuelType))];
export const priceRanges = [
  { label: "Alle Preise", min: 0, max: Infinity },
  { label: "Bis 40.000 €", min: 0, max: 40000 },
  { label: "40.000 – 70.000 €", min: 40000, max: 70000 },
  { label: "70.000 – 100.000 €", min: 70000, max: 100000 },
  { label: "Über 100.000 €", min: 100000, max: Infinity },
];
