import { vehicles } from "./vehicles-data";
import type { Vehicle } from "./vehicles-data";

// ============================================================================
// DEALER TYPES
// ============================================================================

export interface DealerReview {
  id: string;
  dealerCompanyName: string;
  authorName: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}

export interface DealerInfo {
  companyName: string;
  city: string;
  zip: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  vehicleCount: number;
  averageRating: number;
  reviewCount: number;
}

// ============================================================================
// HELPERS
// ============================================================================

export function getDealerVehicles(companyName: string): Vehicle[] {
  return vehicles.filter(
    (v) => v.sellerType === "dealer" && v.companyName === companyName,
  );
}

export function getDealers(reviews: DealerReview[]): DealerInfo[] {
  const dealerMap = new Map<string, Vehicle[]>();

  for (const v of vehicles) {
    if (v.sellerType === "dealer" && v.companyName) {
      const list = dealerMap.get(v.companyName) ?? [];
      list.push(v);
      dealerMap.set(v.companyName, list);
    }
  }

  return Array.from(dealerMap.entries()).map(([name, vehs]) => {
    const first = vehs[0];
    const dealerReviews = reviews.filter((r) => r.dealerCompanyName === name);
    const avg =
      dealerReviews.length > 0
        ? dealerReviews.reduce((sum, r) => sum + r.rating, 0) / dealerReviews.length
        : 0;

    return {
      companyName: name,
      city: first.city,
      zip: first.zip,
      contactName: first.contactName,
      contactPhone: first.contactPhone,
      contactEmail: first.contactEmail,
      vehicleCount: vehs.length,
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: dealerReviews.length,
    };
  });
}

export function getDealerByName(
  name: string,
  reviews: DealerReview[],
): DealerInfo | null {
  const dealers = getDealers(reviews);
  return dealers.find((d) => d.companyName === name) ?? null;
}

export function getDealerCompanyNames(): string[] {
  const names = new Set<string>();
  for (const v of vehicles) {
    if (v.sellerType === "dealer" && v.companyName) {
      names.add(v.companyName);
    }
  }
  return Array.from(names).sort();
}
