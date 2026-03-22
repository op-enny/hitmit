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
  damageMap?: Record<string, string>;
  vehicleOrigin?: string;
  tireType?: string;
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
  rimType?: string;
  rimSize?: number;
  paintProtectionFilm?: boolean;
  noRepaint?: boolean;
  serviceBookMaintained?: boolean;
  manufacturerWarranty?: boolean;
  nonSmokerVehicle?: boolean;
  petFreeVehicle?: boolean;
  emissionClass?: string;
  environmentalBadge?: string;
  particleFilter?: boolean;
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
    damageMap: { "rearRight": "Kleine Delle, Parkrempler", "leftRear": "Leichter Kratzer am Schweller" },
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
    nonSmokerVehicle: true,
    petFreeVehicle: true,
    emissionClass: "Euro 6d",
    environmentalBadge: "Grün (4)",
    particleFilter: true,
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
    nonSmokerVehicle: true,
    petFreeVehicle: false,
    emissionClass: "Euro 6d",
    environmentalBadge: "Grün (4)",
    particleFilter: true,
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
    nonSmokerVehicle: true,
    petFreeVehicle: true,
    emissionClass: "Euro 6d",
    environmentalBadge: "Grün (4)",
    particleFilter: true,
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
    nonSmokerVehicle: false,
    petFreeVehicle: true,
    emissionClass: "Euro 6d",
    environmentalBadge: "Grün (4)",
    particleFilter: true,
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
    nonSmokerVehicle: true,
    petFreeVehicle: false,
    emissionClass: "Emissionsfrei",
    environmentalBadge: "Grün (4)",
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
    nonSmokerVehicle: true,
    petFreeVehicle: true,
    emissionClass: "Euro 6d",
    environmentalBadge: "Grün (4)",
    particleFilter: true,
    gradient: "from-gray-500 via-gray-700 to-gray-900",
  },
];

export const CAR_BRANDS_MODELS: Record<string, string[]> = {
  "Abarth": ["595", "695", "500e"],
  "Acura": ["Integra", "TLX", "MDX", "RDX", "NSX"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta", "4C", "MiTo"],
  "Alpina": ["B3", "B4", "D3", "B5", "D5", "B7", "B8", "XB7", "XD3", "XD4"],
  "Alpine": ["A110", "A110 S", "A110 R", "A290"],
  "Aston Martin": ["Vantage", "DB11", "DB12", "DBS", "DBX", "DBX707", "Valkyrie"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q8", "S3", "S4", "S5", "S6", "S7", "S8", "TT", "R8", "80", "90", "100", "200", "V8", "Urquattro", "Coupé", "Cabriolet"],
  "BMW": [
    // 1er
    "1er", "114i", "116i", "118i", "120i", "125i", "128ti",
    "114d", "116d", "118d", "120d", "125d",
    // 2er
    "2er", "218i", "220i", "225i", "230i",
    "216d", "218d", "220d", "225d", "225xe",
    // 2er Gran Coupé
    "218i Gran Coupé", "220i Gran Coupé", "228i Gran Coupé",
    "216d Gran Coupé", "218d Gran Coupé", "220d Gran Coupé",
    // 3er
    "3er", "316i", "318i", "320i", "325i", "328i", "330i", "330e", "335i", "340i",
    "316d", "318d", "320d", "325d", "328d", "330d", "335d",
    // 3er Gran Turismo
    "318i Gran Turismo", "320i Gran Turismo", "328i Gran Turismo", "330i Gran Turismo", "335i Gran Turismo", "340i Gran Turismo",
    "318d Gran Turismo", "320d Gran Turismo", "325d Gran Turismo", "330d Gran Turismo", "335d Gran Turismo",
    // 4er
    "4er", "420i", "428i", "430i", "435i", "440i",
    "418d", "420d", "425d", "430d", "435d",
    // 4er Gran Coupé
    "420i Gran Coupé", "428i Gran Coupé", "430i Gran Coupé", "435i Gran Coupé", "440i Gran Coupé",
    "418d Gran Coupé", "420d Gran Coupé", "425d Gran Coupé", "430d Gran Coupé", "435d Gran Coupé",
    // 5er
    "5er", "520i", "523i", "525i", "528i", "530i", "530e", "535i", "540i", "545e",
    "518d", "520d", "525d", "530d", "535d", "540d",
    // 5er Gran Turismo
    "528i Gran Turismo", "535i Gran Turismo", "550i Gran Turismo",
    "520d Gran Turismo", "525d Gran Turismo", "530d Gran Turismo", "535d Gran Turismo",
    // 6er
    "6er", "630i", "640i", "645i", "650i",
    "620d", "630d", "640d",
    // 6er Gran Turismo
    "630i Gran Turismo", "640i Gran Turismo",
    "620d Gran Turismo", "630d Gran Turismo", "640d Gran Turismo",
    // 6er Gran Coupé
    "640i Gran Coupé", "650i Gran Coupé",
    "640d Gran Coupé",
    // 7er
    "7er", "725i", "728i", "730i", "735i", "740i", "745e", "750i", "760i",
    "725d", "728d", "730d", "735d", "740d", "745d", "750d",
    // 8er
    "8er", "840i",
    "840d", "840d xDrive",
    // 8er Gran Coupé
    "840i Gran Coupé",
    "840d xDrive Gran Coupé",
    // X-Modelle
    "X1", "X1 sDrive16i", "X1 sDrive18i", "X1 sDrive20i", "X1 xDrive20i", "X1 xDrive25i", "X1 xDrive25e",
    "X1 sDrive16d", "X1 sDrive18d", "X1 xDrive18d", "X1 xDrive20d", "X1 xDrive25d",
    "X2", "X2 sDrive18i", "X2 sDrive20i", "X2 xDrive20i",
    "X2 sDrive16d", "X2 sDrive18d", "X2 xDrive20d", "X2 xDrive25e",
    "X3", "X3 xDrive20i", "X3 xDrive30i", "X3 xDrive30e",
    "X3 sDrive18d", "X3 xDrive20d", "X3 xDrive30d",
    "X4", "X4 xDrive20i", "X4 xDrive30i",
    "X4 xDrive20d", "X4 xDrive30d",
    "X5", "X5 xDrive30i", "X5 xDrive40i", "X5 xDrive50i", "X5 xDrive45e",
    "X5 xDrive25d", "X5 xDrive30d", "X5 xDrive40d",
    "X6", "X6 xDrive35i", "X6 xDrive40i", "X6 xDrive50i",
    "X6 xDrive30d", "X6 xDrive40d",
    "X7", "X7 xDrive40i",
    "X7 xDrive30d", "X7 xDrive40d",
    // M Performance
    "M135i", "M135i xDrive", "M140i",
    "M235i xDrive", "M240i xDrive", "M235i xDrive Gran Coupé",
    "M340i", "M340i xDrive", "M340d xDrive",
    "M440i xDrive", "M440i xDrive Gran Coupé",
    "M550i xDrive", "M550d xDrive",
    "M760i xDrive", "M760e xDrive",
    "M850i xDrive", "M850i xDrive Gran Coupé",
    "X2 M35i", "X3 M40i", "X3 M40d", "X4 M40i", "X4 M40d",
    "X5 M50i", "X5 M50d", "X6 M50i", "X6 M50d", "X7 M60i xDrive", "X7 M50d",
    "Z4 M40i",
    "i4 M50", "i5 M60 xDrive", "i7 M70 xDrive", "iX M60",
    // M Rein (Pure M)
    "M2", "M2 Competition", "M2 CS",
    "M3", "M3 Competition", "M3 CS", "M3 CSL",
    "M4", "M4 Competition", "M4 CS", "M4 CSL", "M4 GTS",
    "M5", "M5 Competition", "M5 CS",
    "M8", "M8 Competition",
    "X3 M", "X3 M Competition",
    "X4 M", "X4 M Competition",
    "X5 M", "X5 M Competition",
    "X6 M", "X6 M Competition",
    "XM", "XM Label Red",
    // Z-Modelle
    "Z1", "Z3", "Z4", "Z4 sDrive20i", "Z4 sDrive30i", "Z8",
    // i-Modelle (Elektro)
    "i3", "i3s",
    "i4", "i4 eDrive35", "i4 eDrive40",
    "i5", "i5 eDrive40",
    "i7", "i7 eDrive50", "i7 xDrive60",
    "iX", "iX xDrive40", "iX xDrive50",
    "iX1", "iX1 xDrive30",
    "iX3",
    // Klassiker
    "2002", "850i",
  ],
  "Bentley": ["Continental GT", "Continental GTC", "Flying Spur", "Bentayga", "Mulsanne", "Arnage", "Azure", "Brooklands"],
  "Bugatti": ["Chiron", "Chiron Sport", "Chiron Pur Sport", "Divo", "Centodieci", "Mistral", "Tourbillon"],
  "Buick": ["Enclave", "Encore", "Envision", "LaCrosse"],
  "BYD": ["Atto 3", "Dolphin", "Seal", "Seal U", "Tang", "Han", "Song Plus"],
  "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "Lyriq", "Celestiq"],
  "Chevrolet": ["Camaro", "Corvette", "Spark", "Trax", "Equinox", "Blazer", "Tahoe"],
  "Chrysler": ["300", "Pacifica", "Voyager"],
  "Citroën": ["C1", "C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo", "SpaceTourer", "ë-C4"],
  "Corvette": ["C8 Stingray", "C8 Z06", "C8 E-Ray"],
  "Cupra": ["Formentor", "Born", "Leon", "Ateca", "Tavascan"],
  "Dacia": ["Sandero", "Duster", "Jogger", "Spring", "Logan"],
  "Daewoo": ["Matiz", "Kalos", "Lacetti", "Nubira", "Evanda"],
  "Daihatsu": ["Sirion", "Terios", "Copen", "Rocky"],
  "Dallara": ["Stradale"],
  "Datsun": ["Go", "Go+", "redi-GO", "on-DO", "mi-DO"],
  "DS Automobiles": ["DS 3", "DS 4", "DS 7", "DS 9"],
  "Ferrari": ["296 GTB", "296 GTS", "SF90", "F8", "Roma", "Portofino", "812", "Purosangue"],
  "Fiat": ["500", "500X", "500L", "Panda", "Tipo", "Punto", "Ducato", "500e"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Explorer", "Mustang", "Mustang Mach-E", "Ranger", "Transit", "Galaxy", "S-MAX", "Tourneo", "Escort", "Sierra", "Mondeo", "Capri", "Granada", "Ka", "Focus RS", "Focus ST", "Fiesta ST"],
  "GMC": ["Sierra", "Yukon", "Canyon", "Acadia", "Terrain", "Hummer EV"],
  "GWM": ["ORA 03", "ORA 07", "WEY 03", "WEY 05", "Tank 300", "Tank 500"],
  "Honda": ["Civic", "Jazz", "HR-V", "CR-V", "ZR-V", "e:Ny1", "e", "S2000", "NSX NA1", "Integra Type R", "Prelude", "CRX", "Accord"],
  "Hyundai": ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "Ioniq 5", "Ioniq 6", "Nexo", "Bayon"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
  "Isuzu": ["D-Max", "MU-X"],
  "Jaguar": ["XE", "XF", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Avenger"],
  "Kia": ["Picanto", "Rio", "Ceed", "ProCeed", "XCeed", "Sportage", "Sorento", "Niro", "EV6", "EV9", "Stinger"],
  "Koenigsegg": ["Jesko", "Gemera", "Regera", "Agera", "CC850", "CCX"],
  "KTM": ["X-Bow", "X-Bow GT", "X-Bow GTX"],
  "Lada": ["Niva", "Vesta", "Granta", "XRAY"],
  "Lamborghini": ["Huracán", "Urus", "Revuelto"],
  "Lancia": ["Ypsilon", "Delta", "Stratos", "037", "Fulvia", "Thema"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
  "Lexus": ["UX", "NX", "RX", "LX", "ES", "IS", "LC", "LS", "RZ"],
  "Lincoln": ["Navigator", "Aviator", "Corsair", "Nautilus", "Continental", "Town Car"],
  "Lotus": ["Emira", "Eletre", "Emeya", "Evora", "Exige", "Elise", "Esprit", "Europa"],
  "Lynk & Co": ["01", "02"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "MC20", "Grecale", "GranTurismo"],
  "Maxus": ["eDeliver 3", "eDeliver 7", "T90 EV", "MIFA 9"],
  "Maybach": ["S 580", "S 680", "GLS 600"],
  "Mazda": ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30", "MX-5 NA", "MX-5 NB", "MX-5 NC", "MX-5 ND", "RX-7", "RX-8", "323", "626"],
  "McLaren": ["720S", "750S", "765LT", "Artura", "GT", "P1", "Senna", "Speedtail", "570S", "600LT"],
  "MG": ["MG4", "MG5", "ZS", "ZS EV", "HS", "Marvel R", "Cyberster", "MG3"],
  "Mercedes-Benz": [
    "A-Klasse", "B-Klasse", "C-Klasse", "E-Klasse", "S-Klasse",
    "CLA", "CLS",
    "GLA", "GLB", "GLC", "GLE", "GLS", "G-Klasse",
    "EQA", "EQB", "EQC", "EQE", "EQS",
    "AMG GT", "SL",
    "V-Klasse", "Vito", "Sprinter",
    "W123", "W124", "W201 (190er)", "W202", "W210", "W211", "R107", "R129", "W140", "CLK", "SLK", "SLR McLaren",
  ],
  "Mini": ["3-Türer", "5-Türer", "Cabrio", "Clubman", "Countryman", "Electric"],
  "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
  "NIO": ["ET5", "ET5 Touring", "ET7", "EL6", "EL7", "EL8"],
  "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya", "GT-R", "Navara", "Skyline", "Silvia", "350Z", "370Z", "300ZX", "Patrol", "Primera"],
  "Pagani": ["Huayra", "Utopia", "Zonda"],
  "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Zafira", "Manta", "Kadett", "Calibra", "Omega", "Vectra", "Speedster", "GT", "Senator"],
  "Piaggio": ["MP3", "Beverly", "Liberty"],
  "Peugeot": ["208", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Traveller", "e-208", "e-2008", "e-308"],
  "Pontiac": ["Firebird", "GTO", "Trans Am", "Bonneville", "Grand Prix"],
  "Polestar": ["2", "3", "4"],
  "Porsche": ["911", "718 Boxster", "718 Cayman", "Panamera", "Cayenne", "Macan", "Taycan", "356", "914", "924", "928", "944", "968", "964", "993", "996", "997", "991", "959", "Carrera GT"],
  "Rimac": ["Nevera", "Concept One"],
  "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan", "Spectre", "Silver Shadow", "Silver Spirit"],
  "Renault": ["Clio", "Captur", "Mégane", "Arkana", "Austral", "Espace", "Kangoo", "Zoe", "Mégane E-Tech", "Scenic E-Tech"],
  "Saab": ["9-3", "9-5", "900", "9000", "96"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra"],
  "Škoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
  "Smart": ["fortwo", "forfour", "#1", "#3"],
  "SsangYong": ["Tivoli", "Korando", "Rexton", "Musso", "Torres"],
  "Subaru": ["Impreza", "XV", "Forester", "Outback", "Solterra", "BRZ", "WRX", "Legacy", "SVX"],
  "Suzuki": ["Swift", "Ignis", "Vitara", "S-Cross", "Jimny", "Across"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  "Toyota": ["Aygo X", "Yaris", "Yaris Cross", "Corolla", "Camry", "C-HR", "RAV4", "Highlander", "Land Cruiser", "Supra", "GR86", "bZ4X", "Proace", "MR2", "Celica", "Supra A80", "Supra A70", "AE86", "Starlet", "Land Cruiser J80"],
  "VW": ["Polo", "Golf", "ID.3", "ID.4", "ID.5", "ID.7", "ID. Buzz", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Passat", "Arteon", "Taigo", "up!", "Caddy", "Multivan", "Transporter", "Amarok", "Käfer", "T1", "T2", "T3", "T4", "T5", "T6", "Scirocco", "Corrado", "Golf I", "Golf II", "Golf III", "Golf IV", "Bora", "Lupo", "Phaeton", "Eos"],
  "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "S90", "V60", "V90", "EX30", "EX90"],
  "Wiesmann": ["GT MF4", "GT MF5", "Project Thunderball"],
  "Andere": ["Anderes Modell"],
};

// ============================================================================
// MOTORCYCLE BRANDS & MODELS
// ============================================================================

export const MOTORCYCLE_BRANDS_MODELS: Record<string, string[]> = {
  "Aprilia": ["RS 660", "Tuono 660", "RSV4", "Tuono V4", "SR GT", "SX 125", "RX 125", "Shiver 900", "Dorsoduro 900"],
  "BMW": ["R 1250 GS", "R 1250 RT", "S 1000 RR", "S 1000 R", "S 1000 XR", "F 900 R", "F 900 XR", "F 850 GS", "F 750 GS", "R nineT", "R 18", "G 310 R", "G 310 GS", "CE 04", "M 1000 RR"],
  "Ducati": ["Panigale V4", "Panigale V2", "Streetfighter V4", "Streetfighter V2", "Monster", "Multistrada V4", "Diavel V4", "Hypermotard 950", "Scrambler", "DesertX", "SuperSport 950"],
  "Harley-Davidson": ["Sportster S", "Nightster", "Fat Boy", "Road Glide", "Street Glide", "Road King", "Heritage Classic", "Low Rider", "Breakout", "Pan America", "LiveWire"],
  "Honda": ["CBR 1000 RR-R", "CBR 650 R", "CB 650 R", "CB 500 F", "CB 500 X", "CRF 1100 L Africa Twin", "NC 750 X", "CMX 500 Rebel", "Forza 750", "X-ADV", "PCX 125", "Gold Wing"],
  "Husqvarna": ["Norden 901", "Svartpilen 401", "Vitpilen 401", "Svartpilen 125", "701 Supermoto", "701 Enduro", "FE 350", "TE 300"],
  "Indian": ["Scout", "Scout Bobber", "Chief", "Chieftain", "Challenger", "Pursuit", "Springfield", "FTR 1200"],
  "Kawasaki": ["Ninja ZX-10R", "Ninja ZX-6R", "Ninja 650", "Ninja 400", "Z 900", "Z 650", "Z H2", "Versys 650", "Versys 1000", "Vulcan S", "KLR 650", "W800"],
  "KTM": ["1290 Super Duke R", "890 Duke R", "390 Duke", "125 Duke", "1290 Super Adventure", "890 Adventure", "390 Adventure", "RC 390", "690 SMC R", "300 EXC"],
  "Moto Guzzi": ["V7", "V85 TT", "V100 Mandello", "Stelvio"],
  "Royal Enfield": ["Continental GT 650", "Interceptor 650", "Himalayan", "Classic 350", "Meteor 350", "Hunter 350", "Scram 411", "Super Meteor 650"],
  "Suzuki": ["GSX-R 1000", "GSX-S 1000", "GSX-S 750", "GSX-8S", "V-Strom 1050", "V-Strom 800", "V-Strom 650", "SV 650", "Hayabusa", "Burgman 400"],
  "Triumph": ["Speed Triple 1200", "Street Triple 765", "Tiger 1200", "Tiger 900", "Tiger 660", "Trident 660", "Bonneville T120", "Scrambler 1200", "Rocket 3", "Speed 400"],
  "Yamaha": ["YZF-R1", "YZF-R7", "YZF-R3", "MT-09", "MT-07", "MT-03", "Ténéré 700", "Tracer 9", "XSR 900", "XSR 700", "XMAX 300", "TMAX 560", "Niken"],
  "Andere": ["Anderes Modell"],
};

// ============================================================================
// TRUCK BRANDS & MODELS
// ============================================================================

export const TRUCK_BRANDS_MODELS: Record<string, string[]> = {
  "DAF": ["XF", "XG", "XG+", "CF", "LF", "XD"],
  "FUSO": ["Canter", "Fighter", "Super Great"],
  "Iveco": ["S-Way", "X-Way", "Eurocargo", "Daily", "T-Way"],
  "MAN": ["TGX", "TGS", "TGM", "TGL", "TGE"],
  "Mercedes-Benz": ["Actros", "Arocs", "Atego", "Econic", "eActros", "Unimog"],
  "Renault Trucks": ["T High", "T", "C", "K", "D", "D Wide", "Master Red Edition"],
  "Scania": ["R-Serie", "S-Serie", "G-Serie", "P-Serie", "L-Serie", "XT"],
  "Volvo": ["FH", "FH16", "FM", "FMX", "FE", "FL"],
  "Andere": ["Anderes Modell"],
};

// ============================================================================
// TRANSPORTER BRANDS & MODELS
// ============================================================================

export const TRANSPORTER_BRANDS_MODELS: Record<string, string[]> = {
  "Citroën": ["Jumpy", "Jumper", "Berlingo Van", "ë-Jumpy", "ë-Berlingo Van"],
  "Fiat": ["Ducato", "Scudo", "Doblò Cargo", "Fiorino", "E-Ducato", "E-Scudo"],
  "Ford": ["Transit", "Transit Custom", "Transit Connect", "Transit Courier", "E-Transit"],
  "Iveco": ["Daily", "eDaily"],
  "MAN": ["TGE"],
  "Maxus": ["eDeliver 3", "eDeliver 7", "eDeliver 9", "T90 EV"],
  "Mercedes-Benz": ["Sprinter", "Vito", "Citan", "eSprinter", "eVito"],
  "Nissan": ["NV300", "NV400", "Interstar", "Townstar"],
  "Opel": ["Movano", "Vivaro", "Combo Cargo", "Movano-e", "Vivaro-e"],
  "Peugeot": ["Boxer", "Expert", "Partner", "e-Expert", "e-Partner"],
  "Renault": ["Master", "Trafic", "Kangoo", "Master E-Tech", "Trafic E-Tech"],
  "Toyota": ["Proace", "Proace City", "Proace Electric"],
  "VW": ["Crafter", "Transporter", "Caddy Cargo", "ID. Buzz Cargo", "e-Crafter"],
  "Andere": ["Anderes Modell"],
};

export const MOTORHOME_BRANDS_MODELS: Record<string, string[]> = {
  "Adria": ["Matrix", "Coral", "Sonic", "Compact", "Twin"],
  "Bürstner": ["Lyseo", "Ixeo", "Elegance", "Campeo", "Copa"],
  "Carado": ["T", "A", "V", "CV"],
  "Carthago": ["Liner", "Chic", "C-Tourer", "Malibu Van"],
  "Chausson": ["Titanium", "Flash", "Twist", "X"],
  "Dethleffs": ["Pulse", "Trend", "Esprit", "Globebus", "Evan"],
  "Eura Mobil": ["Integra Line", "Profila", "Contura", "Van"],
  "Fendt": ["Bianco", "Tendenza", "Diamant"],
  "Frankia": ["Platin", "Titan", "Neo", "Yucon"],
  "Globecar": ["Campscout", "Roadscout", "Summit"],
  "Hobby": ["Optima", "Siesta", "Vantana"],
  "Hymer": ["B-Klasse", "Exsis", "ML-T", "Free", "Grand Canyon"],
  "Knaus": ["Van TI", "Sky TI", "Sun TI", "BoxStar", "BoxLife"],
  "LMC": ["Explorer", "Cruiser", "Innovan"],
  "Malibu": ["Van", "Genius", "Charming"],
  "Morelo": ["Palace", "Grand Empire", "Loft", "Home"],
  "Niesmann+Bischoff": ["Arto", "Flair", "iSmove", "Smove"],
  "Pilote": ["Galaxy", "Pacific", "Van"],
  "Pössl": ["Summit", "Roadcruiser", "Campster", "Vanster"],
  "Rapido": ["Serie M", "Serie C", "Serie A", "Van"],
  "Sunlight": ["T", "A", "Cliff", "Van"],
  "Weinsberg": ["CaraCore", "CaraCompact", "CaraTour", "X-Cursion"],
  "Andere": ["Anderes Modell"],
};

// ============================================================================
// CATEGORY OPTIONS BY TYPE
// ============================================================================

export const carCategoryOptions = ["Alle", "Limousine", "Kombi", "Schrägheck", "SUV", "Geländewagen", "Sportwagen", "Coupé", "Cabrio", "Van / Minibus", "Pick-up"];
export const motorcycleCategoryOptions = ["Alle", "Naked Bike", "Sportler", "Tourer", "Enduro", "Chopper/Cruiser", "Roller", "Supermoto", "Cross", "Adventure"];
export const truckCategoryOptions = ["Alle", "Sattelzugmaschine", "Pritsche", "Kipper", "Koffer", "Betonmischer", "Kühlkoffer", "Tankwagen"];
export const transporterCategoryOptions = ["Alle", "Kastenwagen", "Pritsche", "Kühlwagen", "Hochdachkombi", "Doppelkabine", "Planenwagen"];
export const motorhomeCategoryOptions = ["Alle", "Integriert", "Teilintegriert", "Alkoven", "Kastenwagen", "Van", "Expeditionsmobil"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export type VehicleTypeKey = "Alle" | "PKW" | "Motorrad" | "LKW" | "Transporter" | "Wohnmobil" | "Andere";

const BRANDS_BY_TYPE: Record<string, Record<string, string[]>> = {
  PKW: CAR_BRANDS_MODELS,
  Motorrad: MOTORCYCLE_BRANDS_MODELS,
  LKW: TRUCK_BRANDS_MODELS,
  Transporter: TRANSPORTER_BRANDS_MODELS,
  Wohnmobil: MOTORHOME_BRANDS_MODELS,
};

export function getBrandsForType(type: string): string[] {
  if (type && type !== "Alle" && type !== "Andere" && BRANDS_BY_TYPE[type]) {
    return Object.keys(BRANDS_BY_TYPE[type]).sort();
  }
  // "Alle" or unknown → merge all types, deduplicate, sort
  const allBrands = new Set<string>();
  for (const brandsModels of Object.values(BRANDS_BY_TYPE)) {
    for (const brand of Object.keys(brandsModels)) {
      allBrands.add(brand);
    }
  }
  return [...allBrands].sort();
}

export function getModelsForBrand(type: string, brand: string): string[] {
  if (!brand) return [];
  if (type && type !== "Alle" && type !== "Andere" && BRANDS_BY_TYPE[type]) {
    return BRANDS_BY_TYPE[type][brand] ?? [];
  }
  // "Alle" → merge models from all types for this brand, deduplicate
  const allModels = new Set<string>();
  for (const brandsModels of Object.values(BRANDS_BY_TYPE)) {
    if (brandsModels[brand]) {
      for (const model of brandsModels[brand]) {
        allModels.add(model);
      }
    }
  }
  return [...allModels];
}

export function getCategoriesForType(type: string): string[] {
  switch (type) {
    case "PKW": return carCategoryOptions;
    case "Motorrad": return motorcycleCategoryOptions;
    case "LKW": return truckCategoryOptions;
    case "Transporter": return transporterCategoryOptions;
    case "Wohnmobil": return motorhomeCategoryOptions;
    default: {
      // "Alle" → merge all categories, deduplicate, keep "Alle" first
      const all = new Set<string>();
      for (const opts of [carCategoryOptions, motorcycleCategoryOptions, truckCategoryOptions, transporterCategoryOptions, motorhomeCategoryOptions]) {
        for (const o of opts) {
          if (o !== "Alle") all.add(o);
        }
      }
      return ["Alle", ...all];
    }
  }
}

export function getBrandOptionsForType(type: string): string[] {
  return ["Alle Marken", ...getBrandsForType(type)];
}

export const VEHICLE_TYPE_VALUE_TO_LABEL: Record<string, string> = {
  car: "PKW",
  motorcycle: "Motorrad",
  truck: "LKW",
  van: "Transporter",
  motorhome: "Wohnmobil",
  other: "Andere",
};

export const VEHICLE_TYPE_LABEL_TO_VALUE: Record<string, string> = {
  PKW: "car",
  Motorrad: "motorcycle",
  LKW: "truck",
  Transporter: "van",
  Wohnmobil: "motorhome",
  Andere: "other",
};

// Vehicle type labels for dynamic UI text
const VEHICLE_LABELS: Record<string, { noun: string; icon: string }> = {
  PKW:         { noun: "Fahrzeug",    icon: "🚗" },
  Motorrad:    { noun: "Motorrad",    icon: "🏍️" },
  LKW:         { noun: "LKW",         icon: "🚛" },
  Transporter: { noun: "Transporter", icon: "🚐" },
  Wohnmobil:   { noun: "Wohnmobil",  icon: "🏕️" },
};

export function getVehicleNoun(type: string): string {
  return VEHICLE_LABELS[type]?.noun ?? "Fahrzeug";
}

export function getVehicleIcon(type: string): string {
  return VEHICLE_LABELS[type]?.icon ?? "🚗";
}

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
  "Plug-in-Hybrid (Benzin/Elektro)",
  "Plug-in-Hybrid (Diesel/Elektro)",
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

export const transmissionOptions = ["Alle", "Automatik", "Halbautomatik", "Schaltung"];
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
  "Andere",
];
export const conditionOptions = ["Alle", "Neuwagen", "Gebraucht", "Vorführwagen", "Unfallwagen (nicht fahrtüchtig)", "Tageszulassung"];
export const doorOptions = ["Alle", "2/3", "4/5", "6/7"];
export const seatOptions = ["Alle", "2", "4", "5", "7"];
export const vehicleTypeOptions = ["Alle", "PKW", "Motorrad", "LKW", "Transporter", "Wohnmobil", "Andere"];
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
  "Andere",
];
export const seatMaterialOptions = ["Alle", "Leder", "Teilleder", "Stoff", "Alcantara", "Velours", "Andere"];
export const climateZoneOptions = ["Alle", "1", "2", "3", "4"];
export const rimSizeOptions = ["Alle", "15", "16", "17", "18", "19", "20", "21", "22"];

export const rimTypeOptions = ["Alle", "Alufelgen", "Stahlfelgen"];
export const tireTypeOptions = ["Alle", "Sommerreifen", "Winterreifen", "Allwetterreifen"];
export const emissionClassOptions = ["Alle", "Euro 6e", "Euro 6d", "Euro 6d-Temp", "Euro 6c", "Euro 6b", "Euro 6", "Euro 5", "Euro 4", "Euro 3", "Euro 2", "Euro 1", "Emissionsfrei"];
export const environmentalBadgeOptions = ["Alle", "Grün (4)", "Gelb (3)", "Rot (2)", "Keine"];
export const particleFilterOptions = ["Alle", "Ja", "Nein"];

export const SAFETY_FEATURE_LIST = [
  "ABS",
  "ESP",
  "Traktionskontrolle",
  "Spurhalteassistent",
  "Totwinkelassistent",
  "Querverkehrsassistent",
  "Notbremsassistent",
  "Abstandswarner",
  "Müdigkeitserkennung",
  "Verkehrszeichenerkennung",
  "Nachtsichtassistent",
  "Head-up-Display",
  "Reifendruckkontrolle",
  "Isofix",
  "ACC",
  "Parktronic",
  "360° Kamera",
  "Autopilot",
];

export const EQUIPMENT_FEATURE_LIST = [
  // Klima
  "Klimaanlage",
  "Klimaautomatik 1-Zone",
  "Klimaautomatik 2-Zonen",
  "Klimaautomatik 3-Zonen",
  "Klimaautomatik 4-Zonen",
  "Klimaautomatik 5-Zonen",
  // Heizung & Kühlung
  "Sitzheizung",
  "Sitzbelüftung",
  "Lenkradheizung",
  "Standheizung",
  // Sitze
  "Elektrische Sitze",
  "Massagesitze",
  "Armlehne",
  // Dach
  "Panoramadach",
  "Schiebedach",
  // Elektrisch
  "Elektrische Heckklappe",
  "Keyless Entry",
  // Fahrassistenz
  "Tempomat",
  "Limiter",
  "Abstandsregeltempomat",
  // Licht
  "LED-Scheinwerfer",
  "Matrix-LED",
  "Tagfahrlicht",
  "Nebelscheinwerfer",
  // Exterieur
  "Alufelgen",
  "Stahlfelgen",
  "Dachreling",
  "Anhängerkupplung",
  "Sportpaket",
  // Multimedia
  "Navigationssystem",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "DAB-Radio",
  "Soundsystem",
  "CD-Wechsler",
  // Anschlüsse
  "Rückfahrkamera",
  "360°-Kamera",
  "WLAN-Hotspot",
  "Induktive Ladestation",
];

// ============================================================================
// TYPE-SPECIFIC FEATURE LISTS
// ============================================================================

export const CLIMATE_OPTIONS = [
  "Klimaanlage",
  "Klimaautomatik 1-Zone",
  "Klimaautomatik 2-Zonen",
  "Klimaautomatik 3-Zonen",
  "Klimaautomatik 4-Zonen",
  "Klimaautomatik 5-Zonen",
];

export const COMFORT_FEATURES_BY_TYPE: Record<string, string[]> = {
  PKW: [
    // Klima
    "Klimaanlage", "Klimaautomatik 1-Zone", "Klimaautomatik 2-Zonen", "Klimaautomatik 3-Zonen", "Klimaautomatik 4-Zonen", "Klimaautomatik 5-Zonen",
    // Heizung & Kühlung
    "Sitzheizung", "Sitzbelüftung vorne", "Sitzbelüftung hinten", "Lenkradheizung", "Standheizung", "Beheizbare Frontscheibe",
    // Sitze
    "Elektrische Sitze", "Memory-Sitze", "Massagesitze", "Lordosenstütze", "Armlehne",
    // Dach
    "Panoramadach", "Schiebedach",
    // Elektrische Helfer
    "Elektrische Fensterheber", "Elektrisch anklappbare Spiegel", "Elektrische Heckklappe",
    // Zugang
    "Keyless Entry", "Keyless-Go",
    // Fahrassistenz
    "Tempomat", "Limiter", "Abstandsregeltempomat",
    // Sensoren & Beleuchtung
    "Lichtsensor", "Regensensor", "Ambientebeleuchtung",
  ],
  Motorrad: [
    "Griffheizung", "Sitzheizung", "Tempomat", "Limiter",
    "Windschild", "Topcase", "Seitenkoffer", "Handprotektoren",
    "Sozius-Fußrasten", "USB-Anschluss", "12V-Steckdose",
  ],
  LKW: [
    "Klimaanlage", "Standheizung", "Tempomat", "Limiter", "Abstandsregeltempomat",
    "Kühlbox", "Liegebett", "Luftfederung", "Elektrische Fensterheber",
  ],
  Transporter: [
    "Klimaanlage", "Klimaautomatik 1-Zone", "Klimaautomatik 2-Zonen", "Sitzheizung", "Standheizung",
    "Tempomat", "Limiter", "Abstandsregeltempomat", "Keyless Entry",
    "Elektrische Fensterheber", "Trennwand", "Lichtsensor", "Regensensor",
  ],
  Wohnmobil: [
    "Klimaanlage", "Standheizung", "Sitzheizung", "Fußbodenheizung",
    "Tempomat", "Limiter",
    "Markise", "Warmwasserboiler", "Elektrische Trittstufe", "Rahmenfenster",
    "Verdunkelungssystem", "Lichtsensor", "Regensensor",
  ],
};

export const SAFETY_FEATURES_BY_TYPE: Record<string, string[]> = {
  PKW: [
    // Stabilität
    "ABS", "ESP", "Traktionskontrolle",
    // Assistenten
    "Spurhalteassistent", "Totwinkelassistent", "Querverkehrsassistent", "Notbremsassistent", "Abstandswarner",
    // Erkennung
    "Müdigkeitserkennung", "Verkehrszeichenerkennung", "Nachtsichtassistent",
    // Anzeige & Kontrolle
    "Head-up-Display", "Reifendruckkontrolle",
    // Kindersicherheit
    "Isofix",
    // Parken & Kamera
    "Einparkhilfe vorne", "Einparkhilfe hinten", "Parktronic", "Selbstparkend", "Rückfahrkamera", "360°-Grad-Kamera",
  ],
  Motorrad: [
    "ABS", "Kurven-ABS", "Traktionskontrolle", "Wheelie-Kontrolle",
    "Quickshifter", "Fahrmodi", "Notbremsassistent", "Reifendruckkontrolle",
  ],
  LKW: [
    "ABS", "ESP", "Spurhalteassistent", "Totwinkelassistent", "Abbiegeassistent",
    "Notbremsassistent", "Abstandswarner", "Reifendruckkontrolle", "ACC",
    "Einparkhilfe vorne", "Einparkhilfe hinten",
  ],
  Transporter: [
    "ABS", "ESP", "Traktionskontrolle", "Spurhalteassistent", "Totwinkelassistent", "Abbiegeassistent",
    "Notbremsassistent", "Abstandswarner", "Reifendruckkontrolle", "ACC",
    "Einparkhilfe vorne", "Einparkhilfe hinten", "Parktronic", "Rückfahrkamera",
  ],
  Wohnmobil: [
    "ABS", "ESP", "Spurhalteassistent", "Totwinkelassistent",
    "Notbremsassistent", "Abstandswarner", "Reifendruckkontrolle",
    "Gaswarner",
    "Einparkhilfe vorne", "Einparkhilfe hinten", "Rückfahrkamera",
  ],
};

export const EXTERIOR_FEATURES_BY_TYPE: Record<string, string[]> = {
  PKW: [
    // Licht
    "LED-Scheinwerfer", "Xenon-Scheinwerfer", "Matrix-LED", "Tagfahrlicht", "Nebelscheinwerfer",
    // Felgen
    "Alufelgen", "Stahlfelgen",
    // Rest
    "Dachreling", "Anhängerkupplung", "Sportpaket", "Lackversiegelung",
  ],
  Motorrad: [
    "LED-Scheinwerfer", "Tagfahrlicht", "Sturzbügel", "Soziusgriffe",
    "Gepäckträger", "Sportauspuff", "Kettenschutz",
  ],
  LKW: [
    "LED-Scheinwerfer", "Nebelscheinwerfer", "Spoiler", "Seitenverkleidung",
    "Rampe", "Anhängerkupplung", "Dachspoiler", "Alufelgen", "Stahlfelgen",
  ],
  Transporter: [
    "LED-Scheinwerfer", "Tagfahrlicht", "Nebelscheinwerfer", "Anhängerkupplung",
    "Dachreling", "Dachgalerie", "Trittbretter", "Laderaumverkleidung", "Alufelgen", "Stahlfelgen",
  ],
  Wohnmobil: [
    "LED-Scheinwerfer", "Markise", "Fahrradträger", "Anhängerkupplung",
    "Dachreling", "SAT-Anlage", "Solaranlage", "Dachklimaanlage", "Alufelgen", "Stahlfelgen",
  ],
};

export const MULTIMEDIA_FEATURES_BY_TYPE: Record<string, string[]> = {
  PKW: [
    // Navigation
    "Navigationssystem",
    // Konnektivität
    "Apple CarPlay", "Android Auto", "Bluetooth", "WLAN-Hotspot",
    // Audio
    "DAB-Radio", "Soundsystem", "CD-Wechsler",
    // Anschlüsse & Laden
    "USB", "Induktive Ladestation",
  ],
  Motorrad: [
    "Navigationssystem", "Bluetooth-Kommunikation", "GPS-Halterung",
    "TFT-Display", "Connectivity",
  ],
  LKW: [
    "Navigationssystem", "Bluetooth", "Freisprecheinrichtung",
    "DAB-Radio", "CD-Wechsler", "Rückfahrkamera",
  ],
  Transporter: [
    "Navigationssystem", "Apple CarPlay", "Android Auto", "Bluetooth",
    "DAB-Radio", "CD-Wechsler", "Rückfahrkamera", "USB",
  ],
  Wohnmobil: [
    "Navigationssystem", "Apple CarPlay", "Android Auto", "Bluetooth", "WLAN-Hotspot",
    "DAB-Radio", "CD-Wechsler", "TV", "Rückfahrkamera",
  ],
};

export const SUSPENSION_FEATURES_BY_TYPE: Record<string, string[]> = {
  PKW: [
    "Sportfahrwerk", "Luftfahrwerk", "Adaptives Fahrwerk", "Tieferlegung",
    "Gewindefahrwerk", "Elektronische Dämpferregelung",
  ],
  Motorrad: [
    "Sportfahrwerk", "Elektronisches Fahrwerk", "Upside-Down-Gabel",
    "Mono-Federbein", "Lenkungsdämpfer",
  ],
  LKW: [
    "Luftfederung", "Blattfederung", "Komfortfahrwerk",
  ],
  Transporter: [
    "Luftfederung", "Tieferlegung", "Sportfahrwerk", "Komfortfahrwerk",
  ],
  Wohnmobil: [
    "Luftfederung", "Tieferlegung", "Komfortfahrwerk", "Verstärkte Federn",
  ],
};

// ============================================================================
// ELECTRIC / PLUG-IN-HYBRID SPECIFIC FEATURES
// ============================================================================

const EV_FUELS = ["Elektro", "Plug-in-Hybrid (Benzin/Elektro)", "Plug-in-Hybrid (Diesel/Elektro)"];

export function isElectricFuel(fuels: string[]): boolean {
  return fuels.some((f) => EV_FUELS.includes(f));
}

export const EV_COMFORT_FEATURES: string[] = [
  "Vorklimatisierung", "Wärmepumpe", "One-Pedal-Driving", "Frunk",
  "Rekuperation einstellbar", "Batterieheizung", "V2H (Vehicle-to-Home)",
  "V2L (Vehicle-to-Load)",
];

export const EV_SAFETY_FEATURES: string[] = [
  "Autopilot", "Fußgängererkennung", "Akustisches Warnsystem (AVAS)",
];

export const EV_EXTERIOR_FEATURES: string[] = [
  "Ladeanschluss CCS", "Ladeanschluss Typ 2", "Bidirektionales Laden",
  "Schnellladefähig (DC)", "Ladeklappenbeleuchtung",
];

export const EV_MULTIMEDIA_FEATURES: string[] = [
  "OTA-Updates", "App-Steuerung", "Reichweitenanzeige", "Ladeplanung & Navigation",
  "Energieverbrauchsanzeige",
];

export const EV_SUSPENSION_FEATURES: string[] = [
  "Adaptives Luftfahrwerk",
];

export function getComfortFeaturesForType(type: string, fuels: string[] = []): string[] {
  const base = (type && type !== "Alle" && type !== "" && COMFORT_FEATURES_BY_TYPE[type])
    ? COMFORT_FEATURES_BY_TYPE[type]
    : COMFORT_FEATURES_BY_TYPE.PKW;
  if (isElectricFuel(fuels)) {
    return [...base, ...EV_COMFORT_FEATURES.filter((f) => !base.includes(f))];
  }
  return base;
}

export function getSafetyFeaturesForType(type: string, fuels: string[] = []): string[] {
  const base = (type && type !== "Alle" && type !== "" && SAFETY_FEATURES_BY_TYPE[type])
    ? SAFETY_FEATURES_BY_TYPE[type]
    : SAFETY_FEATURES_BY_TYPE.PKW;
  if (isElectricFuel(fuels)) {
    return [...base, ...EV_SAFETY_FEATURES.filter((f) => !base.includes(f))];
  }
  return base;
}

export function getExteriorFeaturesForType(type: string, fuels: string[] = []): string[] {
  const base = (type && type !== "Alle" && type !== "" && EXTERIOR_FEATURES_BY_TYPE[type])
    ? EXTERIOR_FEATURES_BY_TYPE[type]
    : EXTERIOR_FEATURES_BY_TYPE.PKW;
  if (isElectricFuel(fuels)) {
    return [...base, ...EV_EXTERIOR_FEATURES.filter((f) => !base.includes(f))];
  }
  return base;
}

export function getMultimediaFeaturesForType(type: string, fuels: string[] = []): string[] {
  const base = (type && type !== "Alle" && type !== "" && MULTIMEDIA_FEATURES_BY_TYPE[type])
    ? MULTIMEDIA_FEATURES_BY_TYPE[type]
    : MULTIMEDIA_FEATURES_BY_TYPE.PKW;
  if (isElectricFuel(fuels)) {
    return [...base, ...EV_MULTIMEDIA_FEATURES.filter((f) => !base.includes(f))];
  }
  return base;
}

export function getSuspensionFeaturesForType(type: string, fuels: string[] = []): string[] {
  const base = (type && type !== "Alle" && type !== "" && SUSPENSION_FEATURES_BY_TYPE[type])
    ? SUSPENSION_FEATURES_BY_TYPE[type]
    : SUSPENSION_FEATURES_BY_TYPE.PKW;
  if (isElectricFuel(fuels)) {
    return [...base, ...EV_SUSPENSION_FEATURES.filter((f) => !base.includes(f))];
  }
  return base;
}

export function getEquipmentFeaturesForType(type: string, fuels: string[] = []): string[] {
  return [
    ...getComfortFeaturesForType(type, fuels),
    ...getExteriorFeaturesForType(type, fuels),
    ...getMultimediaFeaturesForType(type, fuels),
    ...getSuspensionFeaturesForType(type, fuels),
  ];
}

// ============================================================================
// TYPE-SPECIFIC SELECT OPTIONS (Form: value/label pairs)
// ============================================================================

export const DRIVE_TYPE_FORM_OPTIONS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  PKW: [
    { value: "", label: "Bitte wählen" },
    { value: "fwd", label: "Frontantrieb" },
    { value: "rwd", label: "Hinterradantrieb" },
    { value: "awd", label: "Allrad" },
  ],
  Motorrad: [
    { value: "", label: "Bitte wählen" },
    { value: "chain", label: "Kette" },
    { value: "shaft", label: "Kardan" },
    { value: "belt", label: "Riemen" },
  ],
  LKW: [
    { value: "", label: "Bitte wählen" },
    { value: "rwd", label: "Hinterradantrieb" },
    { value: "awd", label: "Allrad" },
  ],
  Transporter: [
    { value: "", label: "Bitte wählen" },
    { value: "fwd", label: "Frontantrieb" },
    { value: "rwd", label: "Hinterradantrieb" },
    { value: "awd", label: "Allrad" },
  ],
  Wohnmobil: [
    { value: "", label: "Bitte wählen" },
    { value: "fwd", label: "Frontantrieb" },
    { value: "rwd", label: "Hinterradantrieb" },
    { value: "awd", label: "Allrad" },
  ],
};

export const CYLINDER_FORM_OPTIONS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  PKW: [
    { value: "", label: "Bitte wählen" },
    { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" },
    { value: "6", label: "6" }, { value: "8", label: "8" }, { value: "10", label: "10" },
    { value: "12", label: "12" }, { value: "16", label: "16" },
  ],
  Motorrad: [
    { value: "", label: "Bitte wählen" },
    { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" },
    { value: "4", label: "4" }, { value: "6", label: "6" },
  ],
  LKW: [
    { value: "", label: "Bitte wählen" },
    { value: "4", label: "4" }, { value: "6", label: "6" },
    { value: "8", label: "8" }, { value: "12", label: "12" },
  ],
  Transporter: [
    { value: "", label: "Bitte wählen" },
    { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "6", label: "6" },
  ],
  Wohnmobil: [
    { value: "", label: "Bitte wählen" },
    { value: "4", label: "4" }, { value: "6", label: "6" },
  ],
};

export const DOOR_FORM_OPTIONS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  PKW: [
    { value: "", label: "Bitte wählen" },
    { value: "2/3", label: "2/3" }, { value: "4/5", label: "4/5" }, { value: "6/7", label: "6/7" },
  ],
  LKW: [
    { value: "", label: "Bitte wählen" },
    { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" },
  ],
  Transporter: [
    { value: "", label: "Bitte wählen" },
    { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" },
  ],
  Wohnmobil: [
    { value: "", label: "Bitte wählen" },
    { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" },
  ],
};

export const SEAT_FORM_OPTIONS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  PKW: [
    { value: "", label: "Bitte wählen" },
    { value: "2", label: "2" }, { value: "4", label: "4" }, { value: "5", label: "5" },
    { value: "7", label: "7" }, { value: "9", label: "9" },
  ],
  Motorrad: [
    { value: "", label: "Bitte wählen" },
    { value: "1", label: "1" }, { value: "2", label: "2" },
  ],
  LKW: [
    { value: "", label: "Bitte wählen" },
    { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" },
  ],
  Transporter: [
    { value: "", label: "Bitte wählen" },
    { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "5", label: "5" },
    { value: "6", label: "6" }, { value: "7", label: "7" }, { value: "8", label: "8" }, { value: "9", label: "9" },
  ],
  Wohnmobil: [
    { value: "", label: "Bitte wählen" },
    { value: "2", label: "2" }, { value: "4", label: "4" }, { value: "5", label: "5" },
    { value: "6", label: "6" }, { value: "7", label: "7" },
  ],
};

// ============================================================================
// TYPE-SPECIFIC FILTER OPTIONS (string arrays for suchen/inserate)
// ============================================================================

export function getDriveTypeOptionsForType(type: string): string[] {
  switch (type) {
    case "Motorrad": return ["Alle", "Kette", "Kardan", "Riemen"];
    case "LKW": return ["Alle", "Hinterradantrieb", "Allrad"];
    case "Transporter": return ["Alle", "Frontantrieb", "Hinterradantrieb", "Allrad"];
    case "Wohnmobil": return ["Alle", "Frontantrieb", "Hinterradantrieb", "Allrad"];
    default: return driveTypeOptions;
  }
}

export function getCylinderOptionsForType(type: string): string[] {
  switch (type) {
    case "Motorrad": return ["Alle", "1", "2", "3", "4", "6"];
    case "LKW": return ["Alle", "4", "6", "8", "12"];
    case "Transporter": return ["Alle", "3", "4", "6"];
    case "Wohnmobil": return ["Alle", "4", "6"];
    default: return cylinderOptions;
  }
}

export function getDoorOptionsForType(type: string): string[] {
  switch (type) {
    case "LKW": return ["Alle", "1", "2", "3"];
    case "Transporter": return ["Alle", "3", "4", "5"];
    case "Wohnmobil": return ["Alle", "2", "3", "4"];
    default: return doorOptions;
  }
}

export function getSeatOptionsForType(type: string): string[] {
  switch (type) {
    case "Motorrad": return ["Alle", "1", "2"];
    case "LKW": return ["Alle", "1", "2", "3"];
    case "Transporter": return ["Alle", "2", "3", "5", "6", "7", "8", "9"];
    case "Wohnmobil": return ["Alle", "2", "4", "5", "6", "7"];
    default: return seatOptions;
  }
}

// ============================================================================
// FIELD VISIBILITY PER TYPE
// ============================================================================

const HIDDEN_FIELDS_BY_TYPE: Record<string, Set<string>> = {
  Motorrad: new Set([
    "doors", "climateZones", "airbags", "parkingAid", "cameraFront", "cameraRear",
    "interiorColor", "seatMaterial", "damageMap", "paintThickness",
    "nonSmokerVehicle", "petFreeVehicle", "noRepaint", "paintProtectionFilm",
    "tireType", "rimSize",
  ]),
  LKW: new Set([
    "climateZones", "airbags", "interiorColor", "seatMaterial",
    "damageMap", "paintThickness", "nonSmokerVehicle", "petFreeVehicle",
    "paintProtectionFilm",
  ]),
  Transporter: new Set([
    "damageMap", "paintThickness", "nonSmokerVehicle", "petFreeVehicle",
    "paintProtectionFilm",
  ]),
  Wohnmobil: new Set([
    "damageMap", "paintThickness",
  ]),
};

export function isFieldVisibleForType(field: string, type: string): boolean {
  if (!type || type === "Alle" || type === "PKW" || type === "") return true;
  const hidden = HIDDEN_FIELDS_BY_TYPE[type];
  if (!hidden) return true;
  return !hidden.has(field);
}
