import { vehicles } from "./vehicles-data";
import type { Vehicle } from "./vehicles-data";
import { getDealerVehicles } from "./dealer-utils";

// ============================================================================
// TYPES
// ============================================================================

export type VehicleStatus = "available" | "sold" | "reserved";

export interface DealerVehicleOverride {
  status: VehicleStatus;
  priceOverride?: number;
  notes?: string;
  archivedAt?: string;
  updatedAt: string;
}

export interface DashboardVehicle extends Vehicle {
  override: DealerVehicleOverride;
}

export interface DashboardStats {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  totalValue: number;
  averagePrice: number;
}

type InventoryStore = Record<number, DealerVehicleOverride>;

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

const DEALER_COMPANY_KEY = "hitmit_dealer_company";
const INVENTORY_KEY = "hitmit_dealer_inventory";

export function getDealerCompany(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DEALER_COMPANY_KEY);
}

export function setDealerCompany(name: string | null): void {
  if (typeof window === "undefined") return;
  if (name) {
    localStorage.setItem(DEALER_COMPANY_KEY, name);
  } else {
    localStorage.removeItem(DEALER_COMPANY_KEY);
  }
}

export function loadInventoryStore(): InventoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveInventoryStore(store: InventoryStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(store));
}

export function updateVehicleOverride(
  id: number,
  partial: Partial<DealerVehicleOverride>,
): InventoryStore {
  const store = loadInventoryStore();
  const existing = store[id] ?? {
    status: "available" as VehicleStatus,
    updatedAt: new Date().toISOString(),
  };
  store[id] = { ...existing, ...partial, updatedAt: new Date().toISOString() };
  saveInventoryStore(store);
  return store;
}

// ============================================================================
// DASHBOARD DATA
// ============================================================================

export function getDashboardVehicles(companyName: string): DashboardVehicle[] {
  const dealerVehicles = getDealerVehicles(companyName);
  const store = loadInventoryStore();

  return dealerVehicles.map((v) => {
    const override: DealerVehicleOverride = store[v.id] ?? {
      status: "available",
      updatedAt: new Date().toISOString(),
    };
    return { ...v, override };
  });
}

export function getDashboardStats(vehicles: DashboardVehicle[]): DashboardStats {
  const nonArchived = vehicles.filter((v) => !v.override.archivedAt);
  const available = nonArchived.filter((v) => v.override.status === "available");
  const reserved = nonArchived.filter((v) => v.override.status === "reserved");
  const sold = nonArchived.filter((v) => v.override.status === "sold");

  const prices = nonArchived.map(
    (v) => v.override.priceOverride ?? v.price,
  );
  const totalValue = prices.reduce((sum, p) => sum + p, 0);

  return {
    total: nonArchived.length,
    available: available.length,
    reserved: reserved.length,
    sold: sold.length,
    totalValue,
    averagePrice: nonArchived.length > 0 ? Math.round(totalValue / nonArchived.length) : 0,
  };
}
