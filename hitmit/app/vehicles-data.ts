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
  vehicleType?: string;
  vehicleCategory?: string;
  mwstAusweisbar?: boolean;
  hu?: string;
  previousOwners?: number;
  cylinders?: number;
  engineDisplacement?: number;
  tankVolume?: number;
  interiorColor?: string;
  seatMaterial?: string;
  climateZones?: number;
  rimSize?: number;
  paintProtectionFilm?: boolean;
  noRepaint?: boolean;
  serviceBookMaintained?: boolean;
  manufacturerWarranty?: boolean;
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
    vehicleType: "PKW",
    vehicleCategory: "Coupé",
    mwstAusweisbar: true,
    hu: "03/2026",
    previousOwners: 1,
    cylinders: 6,
    engineDisplacement: 2993,
    tankVolume: 59,
    interiorColor: "Schwarz",
    seatMaterial: "Leder",
    climateZones: 2,
    rimSize: 19,
    paintProtectionFilm: true,
    noRepaint: true,
    serviceBookMaintained: true,
    manufacturerWarranty: false,
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
    vehicleType: "PKW",
    vehicleCategory: "Schrägheck",
    mwstAusweisbar: false,
    hu: "01/2027",
    previousOwners: 1,
    cylinders: 4,
    engineDisplacement: 1984,
    tankVolume: 50,
    interiorColor: "Schwarz",
    seatMaterial: "Stoff",
    climateZones: 2,
    rimSize: 19,
    paintProtectionFilm: false,
    noRepaint: true,
    serviceBookMaintained: true,
    manufacturerWarranty: false,
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
    vehicleType: "PKW",
    vehicleCategory: "Limousine",
    mwstAusweisbar: true,
    hu: "06/2025",
    previousOwners: 1,
    cylinders: 4,
    engineDisplacement: 1999,
    tankVolume: 66,
    interiorColor: "Schwarz",
    seatMaterial: "Leder",
    climateZones: 3,
    rimSize: 19,
    paintProtectionFilm: false,
    noRepaint: true,
    serviceBookMaintained: true,
    manufacturerWarranty: true,
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
    vehicleType: "PKW",
    vehicleCategory: "Sportwagen",
    mwstAusweisbar: false,
    hu: "09/2026",
    previousOwners: 2,
    cylinders: 6,
    engineDisplacement: 2981,
    tankVolume: 67,
    interiorColor: "Braun",
    seatMaterial: "Leder",
    climateZones: 2,
    rimSize: 20,
    paintProtectionFilm: true,
    noRepaint: true,
    serviceBookMaintained: true,
    manufacturerWarranty: true,
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
    vehicleType: "PKW",
    vehicleCategory: "Limousine",
    mwstAusweisbar: false,
    hu: "03/2027",
    previousOwners: 1,
    cylinders: 0,
    engineDisplacement: 0,
    tankVolume: 0,
    interiorColor: "Weiß",
    seatMaterial: "Stoff",
    climateZones: 1,
    rimSize: 19,
    paintProtectionFilm: true,
    noRepaint: true,
    serviceBookMaintained: false,
    manufacturerWarranty: false,
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
    vehicleType: "PKW",
    vehicleCategory: "Schrägheck",
    mwstAusweisbar: true,
    hu: "07/2026",
    previousOwners: 1,
    cylinders: 5,
    engineDisplacement: 2480,
    tankVolume: 55,
    interiorColor: "Schwarz",
    seatMaterial: "Alcantara",
    climateZones: 3,
    rimSize: 19,
    paintProtectionFilm: false,
    noRepaint: true,
    serviceBookMaintained: true,
    manufacturerWarranty: true,
    gradient: "from-gray-500 via-gray-700 to-gray-900",
  },
];

export const CAR_BRANDS_MODELS: Record<string, string[]> = {
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta", "4C", "MiTo"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q8", "S3", "S4", "S5", "S6", "S7", "S8", "TT", "R8"],
  "BMW": ["1er", "2er", "3er", "4er", "5er", "6er", "7er", "8er", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "Z4", "i3", "i4", "i5", "i7", "iX", "iX1", "iX3", "M2", "M3", "M4", "M5", "M8"],
  "BYD": ["Atto 3", "Dolphin", "Seal", "Seal U", "Tang", "Han", "Song Plus"],
  "Chevrolet": ["Camaro", "Corvette", "Spark", "Trax", "Equinox", "Blazer", "Tahoe"],
  "Citroën": ["C1", "C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo", "SpaceTourer", "ë-C4"],
  "Cupra": ["Formentor", "Born", "Leon", "Ateca", "Tavascan"],
  "Dacia": ["Sandero", "Duster", "Jogger", "Spring", "Logan"],
  "Dongfeng": ["Box", "Voyah Free", "Voyah Dream", "Nammi 01"],
  "DS": ["DS 3", "DS 4", "DS 7", "DS 9"],
  "Ferrari": ["296 GTB", "296 GTS", "SF90", "F8", "Roma", "Portofino", "812", "Purosangue"],
  "Fiat": ["500", "500X", "500L", "Panda", "Tipo", "Punto", "Ducato", "500e"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Explorer", "Mustang", "Mustang Mach-E", "Ranger", "Transit", "Galaxy", "S-MAX", "Tourneo"],
  "GWM": ["ORA 03", "ORA 07", "WEY 03", "WEY 05", "Tank 300", "Tank 500"],
  "Honda": ["Civic", "Jazz", "HR-V", "CR-V", "ZR-V", "e:Ny1", "e"],
  "Hyundai": ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "Ioniq 5", "Ioniq 6", "Nexo", "Bayon"],
  "Jaecoo": ["J7", "J8"],
  "Jaguar": ["XE", "XF", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Avenger"],
  "Kia": ["Picanto", "Rio", "Ceed", "ProCeed", "XCeed", "Sportage", "Sorento", "Niro", "EV6", "EV9", "Stinger"],
  "Lamborghini": ["Huracán", "Urus", "Revuelto"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
  "Leapmotor": ["T03", "C10", "C16", "B10"],
  "Lexus": ["UX", "NX", "RX", "LX", "ES", "IS", "LC", "LS", "RZ"],
  "Lynk & Co": ["01", "02"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "MC20", "Grecale", "GranTurismo"],
  "Maxus": ["eDeliver 3", "eDeliver 7", "T90 EV", "MIFA 9"],
  "Mazda": ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30"],
  "MG": ["MG4", "MG5", "ZS", "ZS EV", "HS", "Marvel R", "Cyberster", "MG3"],
  "Mercedes-Benz": [
    "A-Klasse", "B-Klasse", "C-Klasse", "E-Klasse", "S-Klasse",
    "CLA", "CLS",
    "GLA", "GLB", "GLC", "GLE", "GLS", "G-Klasse",
    "EQA", "EQB", "EQC", "EQE", "EQS",
    "AMG GT", "SL",
    "V-Klasse", "Vito", "Sprinter",
  ],
  "Mini": ["3-Türer", "5-Türer", "Cabrio", "Clubman", "Countryman", "Electric"],
  "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
  "NIO": ["ET5", "ET5 Touring", "ET7", "EL6", "EL7", "EL8"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya", "GT-R", "Navara"],
  "Omoda": ["C5", "C7", "C9"],
  "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Zafira"],
  "Peugeot": ["208", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Traveller", "e-208", "e-2008", "e-308"],
  "Polestar": ["2", "3", "4"],
  "Porsche": ["911", "718 Boxster", "718 Cayman", "Panamera", "Cayenne", "Macan", "Taycan"],
  "Renault": ["Clio", "Captur", "Mégane", "Arkana", "Austral", "Espace", "Kangoo", "Zoe", "Mégane E-Tech", "Scenic E-Tech"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra"],
  "Škoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
  "Smart": ["fortwo", "forfour", "#1", "#3"],
  "Subaru": ["Impreza", "XV", "Forester", "Outback", "Solterra", "BRZ", "WRX"],
  "Suzuki": ["Swift", "Ignis", "Vitara", "S-Cross", "Jimny", "Across"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  "Toyota": ["Aygo X", "Yaris", "Yaris Cross", "Corolla", "Camry", "C-HR", "RAV4", "Highlander", "Land Cruiser", "Supra", "GR86", "bZ4X", "Proace"],
  "VW": ["Polo", "Golf", "ID.3", "ID.4", "ID.5", "ID.7", "ID. Buzz", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Passat", "Arteon", "Taigo", "up!", "Caddy", "Multivan", "Transporter", "Amarok"],
  "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "S90", "V60", "V90", "EX30", "EX90"],
  "XPeng": ["G6", "G9", "P7"],
  "Zeekr": ["001", "X", "007"],
  "Sonstige": ["Anderes Modell"],
};

export const MERCEDES_MOTORIZATIONS: Record<string, string[]> = {
  "A-Klasse": ["A 160", "A 180", "A 180 d", "A 200", "A 200 d", "A 220", "A 220 d", "A 250", "A 250 e", "A 35 AMG", "A 45 AMG", "A 45 S AMG"],
  "B-Klasse": ["B 160", "B 180", "B 180 d", "B 200", "B 200 d", "B 220 d", "B 250 e"],
  "C-Klasse": ["C 160", "C 180", "C 180 d", "C 200", "C 200 d", "C 220 d", "C 250 d", "C 300", "C 300 d", "C 300 e", "C 300 de", "C 400 d", "C 43 AMG", "C 63 AMG", "C 63 S AMG"],
  "E-Klasse": ["E 200", "E 200 d", "E 220 d", "E 300", "E 300 d", "E 300 e", "E 300 de", "E 350", "E 350 d", "E 400 d", "E 450", "E 53 AMG", "E 63 AMG", "E 63 S AMG"],
  "S-Klasse": ["S 350 d", "S 400 d", "S 450", "S 500", "S 580", "S 580 e", "S 680", "S 63 AMG", "S 63 S AMG"],
  "CLA": ["CLA 180", "CLA 200", "CLA 200 d", "CLA 220 d", "CLA 250", "CLA 250 e", "CLA 35 AMG", "CLA 45 AMG", "CLA 45 S AMG"],
  "CLS": ["CLS 220 d", "CLS 300 d", "CLS 350 d", "CLS 400 d", "CLS 450", "CLS 53 AMG"],
  "GLA": ["GLA 180", "GLA 200", "GLA 200 d", "GLA 220 d", "GLA 250", "GLA 250 e", "GLA 35 AMG", "GLA 45 AMG", "GLA 45 S AMG"],
  "GLB": ["GLB 180", "GLB 200", "GLB 200 d", "GLB 220 d", "GLB 250", "GLB 35 AMG"],
  "GLC": ["GLC 200", "GLC 200 d", "GLC 220 d", "GLC 250 d", "GLC 300", "GLC 300 d", "GLC 300 e", "GLC 300 de", "GLC 350 d", "GLC 350 e", "GLC 400 d", "GLC 400 e", "GLC 43 AMG", "GLC 63 AMG", "GLC 63 S AMG"],
  "GLE": ["GLE 300 d", "GLE 350", "GLE 350 d", "GLE 350 de", "GLE 400 d", "GLE 400 e", "GLE 450", "GLE 53 AMG", "GLE 63 AMG", "GLE 63 S AMG"],
  "GLS": ["GLS 350 d", "GLS 400 d", "GLS 450", "GLS 580", "GLS 600 Maybach", "GLS 63 AMG"],
  "G-Klasse": ["G 350 d", "G 400 d", "G 450 d", "G 500", "G 63 AMG"],
  "EQA": ["EQA 250", "EQA 250+", "EQA 300", "EQA 350"],
  "EQB": ["EQB 250", "EQB 250+", "EQB 300", "EQB 350"],
  "EQC": ["EQC 400"],
  "EQE": ["EQE 300", "EQE 350", "EQE 350+", "EQE 500", "EQE 43 AMG", "EQE 53 AMG"],
  "EQS": ["EQS 350", "EQS 450", "EQS 450+", "EQS 500", "EQS 580", "EQS 53 AMG"],
  "AMG GT": ["AMG GT", "AMG GT S", "AMG GT R", "AMG GT C", "AMG GT 43", "AMG GT 53", "AMG GT 63", "AMG GT 63 S"],
  "SL": ["SL 43", "SL 55 AMG", "SL 63 AMG"],
  "V-Klasse": ["V 220 d", "V 250 d", "V 300 d", "EQV"],
  "Vito": ["Vito"],
  "Sprinter": ["Sprinter"],
};

export const brandOptions = ["Alle Marken", ...Object.keys(CAR_BRANDS_MODELS).sort()];
export const fuelOptions = [
  "Alle Kraftstoffe",
  "Benzin",
  "Diesel",
  "Elektro",
  "Hybrid",
  "Plug-in-Hybrid",
  "Erdgas (CNG)",
  "Wasserstoff",
];
export const priceRanges = [
  { label: "Alle Preise", min: 0, max: Infinity },
  { label: "Bis 40.000 €", min: 0, max: 40000 },
  { label: "40.000 – 70.000 €", min: 40000, max: 70000 },
  { label: "70.000 – 100.000 €", min: 70000, max: 100000 },
  { label: "Über 100.000 €", min: 100000, max: Infinity },
];

export const yearOptions: number[] = [];
for (let y = 2026; y >= 2015; y--) yearOptions.push(y);

export const mileageOptions = [
  { label: "Alle", max: Infinity },
  { label: "Bis 10.000 km", max: 10000 },
  { label: "Bis 25.000 km", max: 25000 },
  { label: "Bis 50.000 km", max: 50000 },
  { label: "Bis 100.000 km", max: 100000 },
  { label: "Bis 150.000 km", max: 150000 },
];

export const powerOptions = [
  { label: "Alle", min: 0 },
  { label: "Ab 100 PS", min: 100 },
  { label: "Ab 150 PS", min: 150 },
  { label: "Ab 200 PS", min: 200 },
  { label: "Ab 300 PS", min: 300 },
  { label: "Ab 400 PS", min: 400 },
  { label: "Ab 500 PS", min: 500 },
];

export const transmissionOptions = ["Alle", "Automatik", "Schaltung"];
export const driveTypeOptions = ["Alle", "Frontantrieb", "Hinterradantrieb", "Allrad"];
export const sellerTypeOptions = ["Alle", "Privat", "Händler"];
export const colorOptions = [
  "Alle Farben",
  "Schwarz",
  "Weiß",
  "Grau",
  "Silber",
  "Blau",
  "Rot",
  "Braun",
  "Orange",
  "Grün",
  "Beige",
  "Gelb",
  "Sonstige",
];
export const conditionOptions = ["Alle", "Neuwagen", "Gebraucht", "Unfallwagen", "Tageszulassung"];
export const doorOptions = ["Alle", "2/3", "4/5", "6/7"];
export const seatOptions = ["Alle", "2", "4", "5", "7"];
export const vehicleTypeOptions = ["Alle", "PKW", "Motorrad", "LKW", "Transporter", "Sonstige"];
export const vehicleCategoryOptions = ["Alle", "Limousine", "Kombi", "Schrägheck", "SUV", "Geländewagen", "Sportwagen", "Coupé", "Cabrio", "Van / Minibus", "Pick-up"];
export const cylinderOptions = ["Alle", "3", "4", "5", "6", "8", "10", "12", "16"];
export const displacementOptions = [
  { label: "Alle", max: Infinity },
  { label: "Bis 1.000 ccm", max: 1000 },
  { label: "Bis 1.500 ccm", max: 1500 },
  { label: "Bis 2.000 ccm", max: 2000 },
  { label: "Bis 2.500 ccm", max: 2500 },
  { label: "Bis 3.000 ccm", max: 3000 },
  { label: "Über 3.000 ccm", max: -1 },
];
export const tankVolumeOptions = [
  { label: "Alle", min: 0 },
  { label: "Ab 40 l", min: 40 },
  { label: "Ab 50 l", min: 50 },
  { label: "Ab 60 l", min: 60 },
  { label: "Ab 70 l", min: 70 },
  { label: "Ab 80 l", min: 80 },
];
export const previousOwnerOptions = ["Alle", "0", "1", "2", "3", "4+"];
export const huOptions = ["Alle", "Neu (mind. 12 Monate)", "Abgelaufen"];
export const interiorColorOptions = [
  "Alle Farben",
  "Schwarz",
  "Weiß",
  "Grau",
  "Braun",
  "Beige",
  "Rot",
  "Blau",
  "Sonstige",
];
export const seatMaterialOptions = ["Alle", "Leder", "Teilleder", "Stoff", "Alcantara", "Velours", "Sonstige"];
export const climateZoneOptions = ["Alle", "1", "2", "3", "4"];
export const rimSizeOptions = ["Alle", "15", "16", "17", "18", "19", "20", "21", "22"];

export const SAFETY_FEATURE_LIST = [
  "ABS",
  "ESP",
  "Traktionskontrolle",
  "Spurhalteassistent",
  "Totwinkelassistent",
  "Notbremsassistent",
  "Müdigkeitserkennung",
  "Verkehrszeichenerkennung",
  "Nachtsichtassistent",
  "Head-up-Display",
  "Reifendruckkontrolle",
  "Querverkehrsassistent",
  "Isofix",
  "ACC",
  "360° Kamera",
  "Parktronic",
  "Autopilot",
];

export const EQUIPMENT_FEATURE_LIST = [
  "Klimaanlage",
  "Klimaautomatik",
  "Sitzheizung",
  "Lenkradheizung",
  "Elektrische Sitze",
  "Massagesitze",
  "Panoramadach",
  "Schiebedach",
  "Elektrische Heckklappe",
  "Keyless Entry",
  "Standheizung",
  "Tempomat",
  "Abstandsregeltempomat",
  "Sitzbelüftung",
  "LED-Scheinwerfer",
  "Matrix-LED",
  "Tagfahrlicht",
  "Nebelscheinwerfer",
  "Alufelgen",
  "Dachreling",
  "Anhängerkupplung",
  "Sportpaket",
  "Navigationssystem",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "DAB-Radio",
  "Soundsystem",
  "Rückfahrkamera",
  "360°-Kamera",
  "WLAN-Hotspot",
  "Induktives Laden",
];
