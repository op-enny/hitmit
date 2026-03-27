"use client";

import { useState, useEffect, useMemo } from "react";
import { SubpageHeader } from "../../subpage-header";
import { getDealerCompanyNames } from "../../dealer-utils";
import {
  getDealerCompany,
  setDealerCompany,
  getDashboardVehicles,
  getDashboardStats,
  updateVehicleOverride,
  type VehicleStatus,
  type DashboardVehicle,
} from "../../dealer-dashboard-utils";

// ============================================================================
// CONSTANTS
// ============================================================================

type StatusFilter = VehicleStatus | "all" | "archived";
type SortField = "price" | "mileage" | "year" | "firstRegistration" | "brand";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "available", label: "Verfügbar" },
  { value: "reserved", label: "Reserviert" },
  { value: "sold", label: "Verkauft" },
  { value: "archived", label: "Archiviert" },
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "price", label: "Preis" },
  { value: "mileage", label: "Kilometer" },
  { value: "year", label: "Baujahr" },
  { value: "firstRegistration", label: "Erstzulassung" },
  { value: "brand", label: "Marke" },
];

const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Verfügbar",
  reserved: "Reserviert",
  sold: "Verkauft",
};

const STATUS_COLORS: Record<VehicleStatus, string> = {
  available:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  reserved:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  sold: "bg-gray-200 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400",
};

// ============================================================================
// LOGIN SCREEN
// ============================================================================

function DealerLogin({
  onLogin,
}: {
  onLogin: (company: string) => void;
}) {
  const companies = getDealerCompanyNames();
  const [selected, setSelected] = useState(companies[0] ?? "");

  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

      <section className="max-w-md mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="card p-8 animate-fade-in-up">
          <h1 className="font-display text-4xl tracking-wider text-gray-900 dark:text-[#ededed] text-center mb-2">
            Händler-Login
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
            Melde dich an, um dein Inventar zu verwalten.
          </p>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Händler auswählen
          </label>
          <select
            className="input w-full mb-6"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary btn-lg w-full"
            onClick={() => {
              if (selected) onLogin(selected);
            }}
            disabled={!selected}
          >
            Anmelden
          </button>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// EDIT MODAL
// ============================================================================

function EditModal({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: DashboardVehicle;
  onClose: () => void;
  onSave: () => void;
}) {
  const [status, setStatus] = useState<VehicleStatus>(vehicle.override.status);
  const [price, setPrice] = useState(
    String(vehicle.override.priceOverride ?? vehicle.price),
  );
  const [notes, setNotes] = useState(vehicle.override.notes ?? "");

  function handleSave() {
    const parsed = parseInt(price, 10);
    updateVehicleOverride(vehicle.id, {
      status,
      priceOverride: !isNaN(parsed) ? parsed : undefined,
      notes: notes.trim() || undefined,
    });
    onSave();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#141414] rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed]">
            Bearbeiten
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {vehicle.brand} {vehicle.model} {vehicle.variant} ({vehicle.year})
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className="input w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
            >
              {(Object.keys(STATUS_LABELS) as VehicleStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preis (&euro;)
            </label>
            <input
              type="number"
              className="input w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notizen
            </label>
            <textarea
              className="input w-full min-h-[80px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interne Notizen..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="btn btn-secondary btn-md flex-1"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button className="btn btn-primary btn-md flex-1" onClick={handleSave}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DASHBOARD
// ============================================================================

export default function DealerDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [company, setCompany] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<DashboardVehicle[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortAsc, setSortAsc] = useState(true);
  const [editVehicle, setEditVehicle] = useState<DashboardVehicle | null>(null);

  useEffect(() => {
    const saved = getDealerCompany();
    if (saved) {
      setCompany(saved);
      setVehicles(getDashboardVehicles(saved));
    }
    setMounted(true);
  }, []);

  function refreshVehicles() {
    if (company) setVehicles(getDashboardVehicles(company));
  }

  function handleLogin(name: string) {
    setDealerCompany(name);
    setCompany(name);
    setVehicles(getDashboardVehicles(name));
  }

  function handleLogout() {
    setDealerCompany(null);
    setCompany(null);
    setVehicles([]);
  }

  function handleStatusChange(id: number, newStatus: VehicleStatus) {
    updateVehicleOverride(id, { status: newStatus });
    refreshVehicles();
  }

  function handleArchive(id: number) {
    updateVehicleOverride(id, { archivedAt: new Date().toISOString() });
    refreshVehicles();
  }

  function handleUnarchive(id: number) {
    updateVehicleOverride(id, { archivedAt: undefined });
    refreshVehicles();
  }

  // Filtered + sorted vehicles
  const filteredVehicles = useMemo(() => {
    let list = vehicles;

    if (statusFilter === "archived") {
      list = list.filter((v) => v.override.archivedAt);
    } else if (statusFilter === "all") {
      list = list.filter((v) => !v.override.archivedAt);
    } else {
      list = list.filter(
        (v) => !v.override.archivedAt && v.override.status === statusFilter,
      );
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "price": {
          const pa = a.override.priceOverride ?? a.price;
          const pb = b.override.priceOverride ?? b.price;
          cmp = pa - pb;
          break;
        }
        case "mileage":
          cmp = a.mileage - b.mileage;
          break;
        case "year":
          cmp = a.year - b.year;
          break;
        case "firstRegistration":
          cmp = a.firstRegistration.localeCompare(b.firstRegistration);
          break;
        case "brand":
          cmp = a.brand.localeCompare(b.brand);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [vehicles, statusFilter, sortField, sortAsc]);

  const stats = useMemo(() => getDashboardStats(vehicles), [vehicles]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-mesh">
        <SubpageHeader />
      </div>
    );
  }

  if (!company) {
    return <DealerLogin onLogin={handleLogin} />;
  }

  const nextStatus: Record<VehicleStatus, VehicleStatus> = {
    available: "reserved",
    reserved: "sold",
    sold: "available",
  };

  function formatPrice(v: DashboardVehicle) {
    return (v.override.priceOverride ?? v.price).toLocaleString("de-DE");
  }

  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-gray-900 dark:text-[#ededed]">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
              {company}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-[#f14011] transition-colors self-start sm:self-auto"
          >
            Abmelden
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Gesamt", value: stats.total, color: "text-gray-900 dark:text-[#ededed]" },
            { label: "Verfügbar", value: stats.available, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Reserviert", value: stats.reserved, color: "text-amber-600 dark:text-amber-400" },
            { label: "Verkauft", value: stats.sold, color: "text-gray-500 dark:text-gray-400" },
            {
              label: "Gesamtwert",
              value: `${stats.totalValue.toLocaleString("de-DE")} \u20AC`,
              color: "text-gray-900 dark:text-[#ededed]",
              span: true,
            },
          ].map((card, i) => (
            <div
              key={card.label}
              className={`card p-4 animate-fade-in-up ${card.span ? "col-span-2 sm:col-span-1" : ""}`}
              style={{ opacity: 0, animationDelay: `${(i + 1) * 100}ms` }}
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {card.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter / Sort Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
        <div className="card p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === tab.value
                      ? "bg-[#f14011] text-white"
                      : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252525]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                className="input text-sm py-2"
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#252525] transition-colors"
                title={sortAsc ? "Aufsteigend" : "Absteigend"}
              >
                <svg
                  className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${sortAsc ? "" : "rotate-180"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Keine Fahrzeuge gefunden.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#2a2a2a]">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      Fahrzeug
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      Preis
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      km
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      Baujahr
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      EZ
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#1a1a1a]">
                  {filteredVehicles.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#111] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-[#ededed]">
                            {v.brand} {v.model}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {v.variant}
                          </p>
                          {v.override.notes && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                              {v.override.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-[#ededed] whitespace-nowrap">
                        {formatPrice(v)} &euro;
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {v.mileage.toLocaleString("de-DE")} km
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                        {v.year}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {v.firstRegistration}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[v.override.status]}`}
                        >
                          {STATUS_LABELS[v.override.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Cycle status */}
                          <button
                            onClick={() =>
                              handleStatusChange(v.id, nextStatus[v.override.status])
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                            title={`Status \u2192 ${STATUS_LABELS[nextStatus[v.override.status]]}`}
                          >
                            <svg
                              className="w-4 h-4 text-gray-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => setEditVehicle(v)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                            title="Bearbeiten"
                          >
                            <svg
                              className="w-4 h-4 text-gray-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          {/* Archive / Unarchive */}
                          {v.override.archivedAt ? (
                            <button
                              onClick={() => handleUnarchive(v.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                              title="Wiederherstellen"
                            >
                              <svg
                                className="w-4 h-4 text-emerald-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(v.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                              title="Archivieren"
                            >
                              <svg
                                className="w-4 h-4 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredVehicles.map((v, i) => (
                <div
                  key={v.id}
                  className="card p-4 animate-fade-in-up"
                  style={{
                    opacity: 0,
                    animationDelay: `${(i + 5) * 50}ms`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-[#ededed]">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {v.variant}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[v.override.status]}`}
                    >
                      {STATUS_LABELS[v.override.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
                    <div>
                      <span className="text-gray-400">Preis:</span>{" "}
                      <span className="font-semibold text-gray-900 dark:text-[#ededed]">
                        {formatPrice(v)} &euro;
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">km:</span>{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {v.mileage.toLocaleString("de-DE")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Baujahr:</span>{" "}
                      <span className="text-gray-700 dark:text-gray-300">{v.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">EZ:</span>{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {v.firstRegistration}
                      </span>
                    </div>
                  </div>

                  {v.override.notes && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      {v.override.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-[#2a2a2a]">
                    <button
                      onClick={() =>
                        handleStatusChange(v.id, nextStatus[v.override.status])
                      }
                      className="btn btn-ghost text-xs px-3 py-1.5 flex-1"
                    >
                      &rarr; {STATUS_LABELS[nextStatus[v.override.status]]}
                    </button>
                    <button
                      onClick={() => setEditVehicle(v)}
                      className="btn btn-ghost text-xs px-3 py-1.5 flex-1"
                    >
                      Bearbeiten
                    </button>
                    {v.override.archivedAt ? (
                      <button
                        onClick={() => handleUnarchive(v.id)}
                        className="btn btn-ghost text-xs px-3 py-1.5 flex-1 text-emerald-600"
                      >
                        Wiederherstellen
                      </button>
                    ) : (
                      <button
                        onClick={() => handleArchive(v.id)}
                        className="btn btn-ghost text-xs px-3 py-1.5 flex-1"
                      >
                        Archivieren
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Edit Modal */}
      {editVehicle && (
        <EditModal
          vehicle={editVehicle}
          onClose={() => setEditVehicle(null)}
          onSave={() => {
            setEditVehicle(null);
            refreshVehicles();
          }}
        />
      )}

      <footer className="border-t border-gray-200 dark:border-[#2a2a2a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
