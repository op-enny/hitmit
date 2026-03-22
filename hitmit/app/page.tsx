"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { generateDescription, checkCompleteness } from "./description-generator";
import { ThemeToggle } from "./theme-toggle";
import { CAR_BRANDS_MODELS, getBrandsForType, getModelsForBrand, getCategoriesForType, VEHICLE_TYPE_VALUE_TO_LABEL, DRIVE_TYPE_FORM_OPTIONS_BY_TYPE, CYLINDER_FORM_OPTIONS_BY_TYPE, DOOR_FORM_OPTIONS_BY_TYPE, SEAT_FORM_OPTIONS_BY_TYPE, isFieldVisibleForType, getComfortFeaturesForType, getSafetyFeaturesForType, getExteriorFeaturesForType, getMultimediaFeaturesForType, getVehicleNoun, getVehicleIcon, CLIMATE_OPTIONS } from "./vehicles-data";

// ============================================================================
// SVG ICONS
// ============================================================================

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const PlayIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CameraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const RocketIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const UsersIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// ============================================================================
// PAINT THICKNESS INFO BUTTON
// ============================================================================

function PaintThicknessInfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525252] dark:text-[#a3a3a3] hover:text-[#f14011] transition-colors mt-1"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
        </svg>
        Was bedeuten die Werte?
      </button>
      {isOpen && (
        <div className="mt-2 bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed]">Referenztabelle Lackdickenmessung</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#737373] dark:text-[#8a8a8a] hover:text-[#0a0a0a] dark:hover:text-[#ededed] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e5e5] dark:border-[#2a2a2a]">
                  <th className="text-left py-2 pr-4 font-semibold text-[#525252] dark:text-[#a3a3a3]">Wert (µm)</th>
                  <th className="text-left py-2 font-semibold text-[#525252] dark:text-[#a3a3a3]">Bedeutung</th>
                </tr>
              </thead>
              <tbody className="text-[#525252] dark:text-[#a3a3a3]">
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#10b981]">80 – 130</td>
                  <td className="py-2">Werkslackierung (Originallack)</td>
                </tr>
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#f59e0b]">130 – 250</td>
                  <td className="py-2">Nachlackiert (einfache Schicht)</td>
                </tr>
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#f14011]">250 – 400</td>
                  <td className="py-2">Mehrfach nachlackiert oder gespachtelt</td>
                </tr>
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#ef4444]">über 400</td>
                  <td className="py-2">Starke Spachtelarbeiten / Unfallschaden</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono font-semibold text-[#737373] dark:text-[#8a8a8a]">unter 80</td>
                  <td className="py-2">Möglicher Schliff oder Polierung</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#a3a3a3] dark:text-[#737373] mt-3">Hinweis: Werte können je nach Hersteller und Fahrzeugtyp leicht variieren.</p>
        </div>
      )}
    </div>
  );
}

function TireConditionInfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525252] dark:text-[#a3a3a3] hover:text-[#f14011] transition-colors mt-1"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
        </svg>
        Reifenprofiltiefe — Was bedeuten die Werte?
      </button>
      {isOpen && (
        <div className="mt-2 bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed]">Referenztabelle Reifenprofiltiefe</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#737373] dark:text-[#8a8a8a] hover:text-[#0a0a0a] dark:hover:text-[#ededed] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e5e5] dark:border-[#2a2a2a]">
                  <th className="text-left py-2 pr-4 font-semibold text-[#525252] dark:text-[#a3a3a3]">Profiltiefe</th>
                  <th className="text-left py-2 font-semibold text-[#525252] dark:text-[#a3a3a3]">Bewertung</th>
                </tr>
              </thead>
              <tbody className="text-[#525252] dark:text-[#a3a3a3]">
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#10b981]">&gt; 7 mm</td>
                  <td className="py-2">Neu</td>
                </tr>
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#34d399]">&gt; 6 mm</td>
                  <td className="py-2">Sehr gut</td>
                </tr>
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#f59e0b]">4 – 6 mm</td>
                  <td className="py-2">Gut</td>
                </tr>
                <tr className="border-b border-[#f5f5f5]">
                  <td className="py-2 pr-4 font-mono font-semibold text-[#f97316]">2 – 4 mm</td>
                  <td className="py-2">Gebraucht</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono font-semibold text-[#ef4444]">&lt; 2 mm</td>
                  <td className="py-2">Erneuerungsbedürftig</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#a3a3a3] dark:text-[#737373] mt-3">Hinweis: Gesetzliches Minimum in Deutschland ist 1,6 mm. Empfohlen wird ein Wechsel ab 3 mm.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ANIMATED COUNTER COMPONENT
// ============================================================================

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={countRef} className="tabular-nums">
      {count}
      <span className="text-[#f14011]">{suffix}</span>
    </span>
  );
}

// ============================================================================
// AUTH MODAL COMPONENT
// ============================================================================

function AuthModal({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    onLogin({ name: loginEmail.split("@")[0], email: loginEmail });
    setLoginEmail("");
    setLoginPassword("");
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regName || !regEmail || !regPassword || !regPasswordConfirm) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (!agbAccepted) {
      setError("Bitte AGB akzeptieren.");
      return;
    }
    onLogin({ name: regName, email: regEmail });
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegPasswordConfirm("");
    setAgbAccepted(false);
    onClose();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] bg-white dark:bg-[#141414] text-[#0a0a0a] dark:text-[#ededed] text-sm focus:outline-none focus:ring-2 focus:ring-[#f14011]/30 focus:border-[#f14011] transition-all";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-[#141414] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#737373] dark:text-[#8a8a8a] hover:text-[#0a0a0a] dark:hover:text-[#ededed] transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-[#e5e5e5] dark:border-[#2a2a2a]">
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "text-[#f14011] border-b-2 border-[#f14011]"
                : "text-[#737373] dark:text-[#8a8a8a] hover:text-[#0a0a0a] dark:hover:text-[#ededed]"
            }`}
            onClick={() => { setActiveTab("login"); setError(""); }}
          >
            Anmelden
          </button>
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "register"
                ? "text-[#f14011] border-b-2 border-[#f14011]"
                : "text-[#737373] dark:text-[#8a8a8a] hover:text-[#0a0a0a] dark:hover:text-[#ededed]"
            }`}
            onClick={() => { setActiveTab("register"); setError(""); }}
          >
            Registrieren
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] dark:text-[#ededed] mb-1">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputClass}
                  placeholder="name@beispiel.de"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] dark:text-[#ededed] mb-1">
                  Passwort
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right">
                <button type="button" className="text-xs text-[#f14011] hover:underline">
                  Passwort vergessen?
                </button>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full">
                Anmelden
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] dark:text-[#ededed] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className={inputClass}
                  placeholder="Max Mustermann"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] dark:text-[#ededed] mb-1">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={inputClass}
                  placeholder="name@beispiel.de"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] dark:text-[#ededed] mb-1">
                  Passwort
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a0a0a] dark:text-[#ededed] mb-1">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agbAccepted}
                  onChange={(e) => setAgbAccepted(e.target.checked)}
                  className="mt-1 accent-[#f14011]"
                />
                <span className="text-xs text-[#737373] dark:text-[#8a8a8a]">
                  Ich akzeptiere die{" "}
                  <span className="text-[#f14011] hover:underline cursor-pointer">AGB</span>{" "}
                  und{" "}
                  <span className="text-[#f14011] hover:underline cursor-pointer">Datenschutzrichtlinien</span>.
                </span>
              </label>
              <button type="submit" className="btn btn-primary btn-lg w-full">
                Registrieren
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header({
  authUser,
  onLoginClick,
  onLogout,
}: {
  authUser: { name: string; email: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Suchen", href: "/suchen" },
    { label: "Inserate", href: "/inserate" },
    { label: "Händler", href: "/haendler" },
    { label: "Gespeichert", href: "/gespeichert" },
    { label: "So funktioniert's", href: "#how-it-works" },
    { label: "Für Verkäufer", href: "#sellers" },
    { label: "Highlights", href: "#featured" },
    { label: "Über uns", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center group-hover:bg-[#f14011] transition-colors duration-300">
              <span className="text-white font-display text-lg tracking-wider">H</span>
            </div>
            <span className="font-display text-2xl tracking-wide text-[#0a0a0a] dark:text-[#ededed]">HITMIT</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#525252] dark:text-[#a3a3a3] font-medium text-sm hover:text-[#f14011] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {authUser ? (
              <>
                <div className="w-9 h-9 rounded-full bg-[#f14011] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {authUser.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-[#525252] dark:text-[#a3a3a3] font-semibold text-sm hover:text-[#f14011] transition-colors"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-[#0a0a0a] dark:text-[#ededed] font-semibold text-sm hover:text-[#f14011] transition-colors"
              >
                Anmelden
              </button>
            )}
            <a
              href="#submit"
              className="btn btn-primary btn-md"
            >
              Auto einreichen
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#0a0a0a] dark:text-[#ededed]"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white dark:bg-[#141414] border-t border-[#e5e5e5] dark:border-[#2a2a2a] shadow-xl animate-fade-in-down">
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-[#525252] dark:text-[#a3a3a3] font-medium text-lg hover:text-[#f14011] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#2a2a2a] space-y-3">
                {authUser ? (
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left text-[#525252] dark:text-[#a3a3a3] font-medium text-lg hover:text-[#f14011] transition-colors"
                  >
                    Abmelden ({authUser.name})
                  </button>
                ) : (
                  <button
                    onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left text-[#525252] dark:text-[#a3a3a3] font-medium text-lg hover:text-[#f14011] transition-colors"
                  >
                    Anmelden
                  </button>
                )}
                <a
                  href="#submit"
                  className="btn btn-primary btn-lg w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Auto einreichen
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-mesh overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#f14011]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#f14011]/5 rounded-full blur-3xl" />

      {/* Background text watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[20vw] text-[#0a0a0a]/[0.03] dark:text-[#ededed]/[0.02] tracking-tight">
          HITMIT
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-white rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-[#f14011] rounded-full animate-pulse" />
                Jetzt live auf TikTok & Instagram
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <span className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.9] tracking-tight text-[#0a0a0a] dark:text-[#ededed] block">
                VERKAUFE DEIN
              </span>
              <span className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.9] tracking-tight block">
                <span className="text-[#0a0a0a] dark:text-[#ededed]">AUTO </span>
                <span className="italic text-[#f14011]">SCHNELL</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#525252] dark:text-[#a3a3a3] max-w-lg leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              Reiche dein Fahrzeug ein und erreiche tausende potenzielle Käufer über unsere TikTok- und Instagram-Kanäle.
              Privatverkäufer und Händler willkommen.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              <a href="#submit" className="btn btn-primary btn-xl group">
                Auto einreichen
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/suchen" className="btn btn-ghost btn-xl group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                Finde dein Auto!
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f14011] to-[#f77a63] border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed]">500+ Fahrzeuge verkauft</p>
                <p className="text-xs text-[#737373] dark:text-[#8a8a8a]">Werde Teil zufriedener Verkäufer</p>
              </div>
            </div>
          </div>

          {/* Hero Image / Visual */}
          <div className="relative animate-scale-in opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            {/* Main car showcase */}
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-8 border-2 border-dashed border-[#e5e5e5] dark:border-[#2a2a2a] rounded-full opacity-50" />

              {/* Car placeholder - replace with actual image */}
              <div className="relative bg-gradient-to-br from-[#f5f5f5] to-white rounded-3xl p-8 shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="/images/highlight-area.webp"
                    alt="Red Ferrari 488"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 right-0 sm:-right-4 bg-[#f14011] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-float">
                  HIGHLIGHT
                </div>

                <div className="absolute -bottom-4 left-0 sm:-left-4 bg-white dark:bg-[#141414] px-4 py-3 rounded-xl shadow-lg border border-[#e5e5e5] dark:border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10b981]/10 rounded-lg flex items-center justify-center">
                      <CheckIcon className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373] dark:text-[#8a8a8a]">Durchschn. Verkaufszeit</p>
                      <p className="font-mono font-bold text-[#0a0a0a] dark:text-[#ededed]">7 Tage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 sm:mt-20 lg:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 py-8 border-t border-b border-[#e5e5e5] dark:border-[#2a2a2a]">
          {[
            { value: 50, suffix: "+", label: "Verkäufe pro Monat" },
            { value: 30, suffix: "+", label: "Automarken" },
            { value: 10, suffix: "K+", label: "Follower" },
            { value: 98, suffix: "%", label: "Zufriedene Verkäufer" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-4xl md:text-5xl text-[#0a0a0a] dark:text-[#ededed]">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-[#737373] dark:text-[#8a8a8a] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: <CameraIcon className="w-7 h-7" />,
      title: "Fahrzeug einreichen",
      description: "Fülle unser einfaches Formular mit deinen Fahrzeugdaten aus und lade Fotos hoch. Dauert nur 5 Minuten.",
    },
    {
      number: "02",
      icon: <RocketIcon className="w-7 h-7" />,
      title: "Wir erstellen Content",
      description: "Unser Team erstellt ansprechende TikTok- und Instagram-Inhalte, die dein Fahrzeug tausenden präsentieren.",
    },
    {
      number: "03",
      icon: <UsersIcon className="w-7 h-7" />,
      title: "Mit Käufern verbinden",
      description: "Interessierte Käufer melden sich direkt. Wir helfen bei der Kontaktaufnahme und dem Verkauf.",
    },
    {
      number: "04",
      icon: <ShieldIcon className="w-7 h-7" />,
      title: "Sicherer Verkauf",
      description: "Schließe deinen Verkauf mit Vertrauen ab. Wir begleiten dich durch den gesamten Prozess.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#fdd8d0] text-[#b72b0b] rounded-full text-sm font-semibold mb-4">
            Einfacher Prozess
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#0a0a0a] dark:text-[#ededed] mb-4">
            SO <span className="italic text-[#f14011]">FUNKTIONIERT&apos;S</span>
          </h2>
          <p className="text-lg text-[#525252] dark:text-[#a3a3a3]">
            Auto verkaufen war noch nie so einfach. Unser optimierter Prozess bringt dein Fahrzeug vor tausende potenzielle Käufer.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-5 sm:p-8 rounded-2xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] hover:border-[#f14011] transition-all duration-300 hover:shadow-xl"
            >
              {/* Step number */}
              <span className="absolute -top-4 -right-2 font-display text-7xl text-[#f14011]/10 group-hover:text-[#f14011]/20 transition-colors">
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#f14011]/10 flex items-center justify-center text-[#f14011] mb-6 group-hover:bg-[#f14011] group-hover:text-white transition-all duration-300">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl text-[#0a0a0a] dark:text-[#ededed] mb-3">{step.title}</h3>
              <p className="text-[#525252] dark:text-[#a3a3a3] leading-relaxed">{step.description}</p>

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-[#e5e5e5] dark:border-[#2a2a2a]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SELLER TYPES SECTION
// ============================================================================

function SellerTypesSection() {
  return (
    <section id="sellers" className="py-24 lg:py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-stripes opacity-30" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f14011]/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-white/10 text-[#f14011] rounded-full text-sm font-semibold mb-6">
              Für Alle
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">
              PRIVATVERKÄUFER <span className="italic text-[#f14011]">&</span><br />
              HÄNDLER
            </h2>
            <p className="text-lg text-[#a3a3a3] dark:text-[#737373] mb-8 max-w-lg">
              Ob du dein privates Fahrzeug verkaufst oder ein Autohaus-Inventar verwaltest –
              HITMIT bietet die perfekte Plattform, um engagierte Käufer zu erreichen.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Keine Einstellgebühren für Privatverkäufer",
                "Sammeleinreichung für Händler",
                "Professionelle Content-Erstellung",
                "Direkte Käuferverbindungen",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f14011] flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>

            <a href="#submit" className="btn btn-primary btn-xl">
              Jetzt starten
              <ChevronRightIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Right content - Cards */}
          <div className="space-y-6">
            {/* Private Seller Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#f14011] flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white mb-2">Privatverkäufer</h3>
                  <p className="text-[#a3a3a3] dark:text-[#737373]">
                    Du verkaufst dein privates Fahrzeug? Erreiche maximale Sichtbarkeit ohne Einstellgebühren.
                    Reiche einfach dein Auto ein und lass uns das Marketing übernehmen.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#f14011] flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white mb-2">Autohäuser & Händler</h3>
                  <p className="text-[#a3a3a3] dark:text-[#737373]">
                    Verkaufe dein Inventar schneller mit unseren Händler-Paketen. Sammeleinreichungen, bevorzugte Platzierung
                    und dedizierter Account-Support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOCIAL MEDIA CTA SECTION
// ============================================================================

function SocialCTASection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-[#fafafa] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f14011]/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <span className="inline-block px-4 py-1.5 bg-[#0a0a0a] text-white rounded-full text-sm font-semibold mb-6">
          Werde Teil der Community
        </span>

        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0a0a0a] dark:text-[#ededed] mb-6">
          FOLGE UNS AUF<br />
          <span className="italic text-[#f14011]">SOCIAL MEDIA</span>
        </h2>

        <p className="text-lg text-[#525252] dark:text-[#a3a3a3] mb-10 max-w-2xl mx-auto">
          Bleib auf dem Laufenden mit den neuesten Angeboten, Erfolgsgeschichten und Auto-Content.
          Werde Teil tausender Auto-Enthusiasten auf unseren Social-Kanälen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* TikTok Button */}
          <a
            href="https://tiktok.com/@hitmit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-xl bg-black text-white hover:bg-[#1f1f1f] group"
          >
            <TikTokIcon className="w-6 h-6" />
            Folge uns auf TikTok
            <span className="ml-2 px-2 py-0.5 bg-[#ee1d52] rounded text-xs">10K+</span>
          </a>

          {/* Instagram Button */}
          <a
            href="https://instagram.com/hitmit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-xl bg-instagram text-white hover:opacity-90 group"
          >
            <InstagramIcon className="w-6 h-6" />
            Folge uns auf Instagram
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">5K+</span>
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-[#525252] dark:text-[#a3a3a3]">
            <svg className="w-5 h-5 text-[#f14011]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-sm font-medium">50K+ Likes</span>
          </div>
          <div className="flex items-center gap-2 text-[#525252] dark:text-[#a3a3a3]">
            <svg className="w-5 h-5 text-[#f14011]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M1.5 9.75v6.75a3 3 0 003 3h15a3 3 0 003-3V9.75H1.5zm1.5 4.5a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 010 3H4.5a1.5 1.5 0 01-1.5-1.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">1M+ Aufrufe</span>
          </div>
          <div className="flex items-center gap-2 text-[#525252] dark:text-[#a3a3a3]">
            <svg className="w-5 h-5 text-[#f14011]" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
              <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
            </svg>
            <span className="text-sm font-medium">15K+ Follower</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SUBMIT FORM SECTION - Types and Constants
// ============================================================================

interface VehicleFormData {
  // Contact
  sellerType: "private" | "dealer" | "";
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  showContactName: "visible" | "hidden";
  contactEmail: string;
  contactPhone: string;
  showContactPhone: boolean;
  // Required Vehicle
  brand: string;
  model: string;
  price: string;
  zip: string;
  city: string;
  // Optional Vehicle
  modelDescription: string;
  variant: string;
  vehicleType: string;
  vehicleCategory: string;
  vin: string;
  firstRegistration: string;
  constructionYear: string;
  huValidUntil: string;
  mileage: string;
  previousOwners: string;
  fuelType: string;
  powerPs: string;
  transmission: string;
  driveType: string;
  cylinders: string;
  engineSize: string;
  tankSize: string;
  emissionClass: string;
  environmentalBadge: string;
  particleFilter: boolean | null;
  co2Emission: string;
  colorGeneral: string;
  colorManufacturer: string;
  doors: string;
  seats: string;
  weight: string;
  condition: string;
  accidentFree: boolean | null;
  repaintFree: boolean | null;
  stoneguardFilm: boolean | null;
  serviceHistory: boolean | null;
  taxiVersion: boolean | null;
  accessibleVehicle: boolean | null;
  serviceHistoryAt: string;
  warrantyUntil: string;
  manufacturerWarrantyUntil: string;
  interiorColor: string;
  seatMaterial: string;
  dashboardType: string;
  comfortFeatures: string[];
  safetyFeatures: string[];
  exteriorFeatures: string[];
  multimediaFeatures: string[];
  airbags: string[];
  parkingAid: string[];
  cameraFront: boolean | null;
  cameraRear: boolean | null;
  climateZones: string;
  rimType: string;
  rimSize: string;
  tireType: string[];
  tireConditionFront: string;
  tireConditionRear: string;
  tireDepthFront: string;
  tireDepthRear: string;
  tireAgeFront: string;
  tireAgeRear: string;
  tireDamageFront: boolean | null;
  tireDamageRear: boolean | null;
  tireRunflat: boolean | null;
  priceNegotiable: boolean;
  vatDeductible: boolean;
  vehicleOrigin: string;
  vehicleOriginOther: string;
  country: string;
  description: string;
  extras: string;
  // Sonstige text fields for each feature category
  safetyOther: string;
  comfortOther: string;
  exteriorOther: string;
  multimediaOther: string;
  // Damage map
  currentlyDamaged: boolean | null;
  damageMap: Record<string, string>;
  paintThicknessAvailable: boolean | null;
  paintThickness: Record<string, string>;
  paintThicknessImage: string;
  // Honeypot
  website: string;
}

const initialFormData: VehicleFormData = {
  sellerType: "",
  companyName: "",
  contactFirstName: "",
  contactLastName: "",
  showContactName: "visible",
  contactEmail: "",
  contactPhone: "",
  showContactPhone: true,
  brand: "",
  model: "",
  price: "",
  zip: "",
  city: "",
  modelDescription: "",
  variant: "",
  vehicleType: "",
  vehicleCategory: "",
  vin: "",
  firstRegistration: "",
  constructionYear: "",
  huValidUntil: "",
  mileage: "",
  previousOwners: "",
  fuelType: "",
  powerPs: "",
  transmission: "",
  driveType: "",
  cylinders: "",
  engineSize: "",
  tankSize: "",
  emissionClass: "",
  environmentalBadge: "",
  particleFilter: null,
  co2Emission: "",
  colorGeneral: "",
  colorManufacturer: "",
  doors: "",
  seats: "",
  weight: "",
  condition: "",
  accidentFree: null,
  repaintFree: null,
  stoneguardFilm: null,
  serviceHistory: null,
  taxiVersion: null,
  accessibleVehicle: null,
  serviceHistoryAt: "",
  warrantyUntil: "",
  manufacturerWarrantyUntil: "",
  interiorColor: "",
  seatMaterial: "",
  dashboardType: "",
  comfortFeatures: [],
  safetyFeatures: [],
  exteriorFeatures: [],
  multimediaFeatures: [],
  airbags: [],
  parkingAid: [],
  cameraFront: null,
  cameraRear: null,
  climateZones: "",
  rimType: "",
  rimSize: "",
  tireType: [],
  tireConditionFront: "",
  tireConditionRear: "",
  tireDepthFront: "",
  tireDepthRear: "",
  tireAgeFront: "",
  tireAgeRear: "",
  tireDamageFront: null,
  tireDamageRear: null,
  tireRunflat: null,
  priceNegotiable: false,
  vatDeductible: false,
  vehicleOrigin: "",
  vehicleOriginOther: "",
  country: "Deutschland",
  description: "",
  extras: "",
  safetyOther: "",
  comfortOther: "",
  exteriorOther: "",
  multimediaOther: "",
  currentlyDamaged: null,
  damageMap: {},
  paintThicknessAvailable: null,
  paintThickness: {},
  paintThicknessImage: "",
  website: "",
};

// Options for select fields
const FUEL_TYPE_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "petrol", label: "Benzin" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Elektro" },
  { value: "hybrid", label: "Hybrid" },
  { value: "pluginHybrid", label: "Plug-in-Hybrid" },
  { value: "pluginHybridDiesel", label: "Plug-in-Hybrid (Diesel)" },
  { value: "lpg", label: "LPG (Autogas)" },
  { value: "cng", label: "CNG (Erdgas)" },
  { value: "hydrogen", label: "Wasserstoff" },
  { value: "other", label: "Sonstige" },
];

const TRANSMISSION_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "manual", label: "Schaltgetriebe" },
  { value: "automatic", label: "Automatik" },
  { value: "semiAutomatic", label: "Halbautomatik" },
];

const DRIVE_TYPE_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "fwd", label: "Frontantrieb" },
  { value: "rwd", label: "Hinterradantrieb" },
  { value: "awd", label: "Allrad" },
];

const CONDITION_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "new", label: "Neuwagen" },
  { value: "used", label: "Gebraucht" },
  { value: "yearOld", label: "Jahreswagen" },
  { value: "demo", label: "Vorführwagen" },
  { value: "dayReg", label: "Tageszulassung" },
];

const VEHICLE_ORIGIN_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "deutschland", label: "Deutschland" },
  { value: "euImport", label: "EU-Import" },
  { value: "schweizImport", label: "Schweiz-Import" },
  { value: "usaImport", label: "USA-Import" },
  { value: "ukImport", label: "UK-Import" },
  { value: "japanImport", label: "Japan-Import" },
  { value: "sonstige", label: "Sonstige" },
];

const VEHICLE_TYPE_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "car", label: "PKW" },
  { value: "motorcycle", label: "Motorrad" },
  { value: "truck", label: "LKW" },
  { value: "van", label: "Transporter" },
  { value: "motorhome", label: "Wohnmobil" },
  { value: "other", label: "Sonstige" },
];

const VEHICLE_CATEGORY_OPTIONS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  car: [
    { value: "", label: "Bitte wählen" },
    { value: "sedan", label: "Limousine" },
    { value: "wagon", label: "Kombi" },
    { value: "hatchback", label: "Schrägheck" },
    { value: "suv", label: "SUV" },
    { value: "offroad", label: "Geländewagen" },
    { value: "sports", label: "Sportwagen" },
    { value: "coupe", label: "Coupé" },
    { value: "convertible", label: "Cabrio" },
    { value: "van", label: "Van / Minibus" },
    { value: "pickup", label: "Pick-up" },
    { value: "other", label: "Sonstige" },
  ],
  motorcycle: [
    { value: "", label: "Bitte wählen" },
    { value: "naked", label: "Naked Bike" },
    { value: "sport", label: "Sportler" },
    { value: "tourer", label: "Tourer" },
    { value: "enduro", label: "Enduro" },
    { value: "chopper", label: "Chopper/Cruiser" },
    { value: "scooter", label: "Roller" },
    { value: "supermoto", label: "Supermoto" },
    { value: "cross", label: "Cross" },
    { value: "adventure", label: "Adventure" },
  ],
  truck: [
    { value: "", label: "Bitte wählen" },
    { value: "semitrailer", label: "Sattelzugmaschine" },
    { value: "flatbed", label: "Pritsche" },
    { value: "tipper", label: "Kipper" },
    { value: "box", label: "Koffer" },
    { value: "mixer", label: "Betonmischer" },
    { value: "reefer", label: "Kühlkoffer" },
    { value: "tanker", label: "Tankwagen" },
  ],
  van: [
    { value: "", label: "Bitte wählen" },
    { value: "panel", label: "Kastenwagen" },
    { value: "flatbed", label: "Pritsche" },
    { value: "reefer", label: "Kühlwagen" },
    { value: "highroof", label: "Hochdachkombi" },
    { value: "doublecab", label: "Doppelkabine" },
    { value: "curtainside", label: "Planenwagen" },
  ],
  motorhome: [
    { value: "", label: "Bitte wählen" },
    { value: "integrated", label: "Integriert" },
    { value: "semiIntegrated", label: "Teilintegriert" },
    { value: "alcove", label: "Alkoven" },
    { value: "panel", label: "Kastenwagen" },
    { value: "campervan", label: "Van" },
    { value: "expedition", label: "Expeditionsmobil" },
  ],
};

function getFormCategoryOptions(vehicleType: string) {
  return VEHICLE_CATEGORY_OPTIONS_BY_TYPE[vehicleType] || VEHICLE_CATEGORY_OPTIONS_BY_TYPE.car;
}

function getFormBrands(vehicleType: string): string[] {
  const typeLabel = VEHICLE_TYPE_VALUE_TO_LABEL[vehicleType];
  if (typeLabel) return getBrandsForType(typeLabel);
  return getBrandsForType("Alle");
}

function getFormModels(vehicleType: string, brand: string): string[] {
  const typeLabel = VEHICLE_TYPE_VALUE_TO_LABEL[vehicleType];
  if (typeLabel) return getModelsForBrand(typeLabel, brand);
  return getModelsForBrand("Alle", brand);
}

function getFormTypeLabel(vehicleType: string): string {
  return VEHICLE_TYPE_VALUE_TO_LABEL[vehicleType] || "PKW";
}

function getFormCategoryLabel(vehicleType: string, vehicleCategory: string): string {
  const opts = VEHICLE_CATEGORY_OPTIONS_BY_TYPE[vehicleType] || VEHICLE_CATEGORY_OPTIONS_BY_TYPE.car;
  const match = opts.find((o) => o.value === vehicleCategory);
  return match?.label || "";
}

function getFormDriveTypeOptions(vehicleType: string) {
  const label = getFormTypeLabel(vehicleType);
  return DRIVE_TYPE_FORM_OPTIONS_BY_TYPE[label] || DRIVE_TYPE_FORM_OPTIONS_BY_TYPE.PKW;
}

function getFormCylinderOptions(vehicleType: string) {
  const label = getFormTypeLabel(vehicleType);
  return CYLINDER_FORM_OPTIONS_BY_TYPE[label] || CYLINDER_FORM_OPTIONS_BY_TYPE.PKW;
}

function getFormDoorOptions(vehicleType: string) {
  const label = getFormTypeLabel(vehicleType);
  return DOOR_FORM_OPTIONS_BY_TYPE[label] || DOOR_FORM_OPTIONS_BY_TYPE.PKW;
}

function getFormSeatOptions(vehicleType: string) {
  const label = getFormTypeLabel(vehicleType);
  return SEAT_FORM_OPTIONS_BY_TYPE[label] || SEAT_FORM_OPTIONS_BY_TYPE.PKW;
}

const COLOR_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "black", label: "Schwarz" },
  { value: "white", label: "Weiß" },
  { value: "silver", label: "Silber" },
  { value: "gray", label: "Grau" },
  { value: "blue", label: "Blau" },
  { value: "red", label: "Rot" },
  { value: "green", label: "Grün" },
  { value: "brown", label: "Braun" },
  { value: "beige", label: "Beige" },
  { value: "yellow", label: "Gelb" },
  { value: "orange", label: "Orange" },
  { value: "gold", label: "Gold" },
  { value: "other", label: "Sonstige" },
];

const EMISSION_CLASS_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "euro6e", label: "Euro 6e" },
  { value: "euro6d", label: "Euro 6d" },
  { value: "euro6dtemp", label: "Euro 6d-Temp" },
  { value: "euro6c", label: "Euro 6c" },
  { value: "euro6b", label: "Euro 6b" },
  { value: "euro6", label: "Euro 6" },
  { value: "euro5", label: "Euro 5" },
  { value: "euro4", label: "Euro 4" },
  { value: "euro3", label: "Euro 3" },
  { value: "euro2", label: "Euro 2" },
  { value: "euro1", label: "Euro 1" },
];

const ENVIRONMENTAL_BADGE_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "green", label: "Grün (4)" },
  { value: "yellow", label: "Gelb (3)" },
  { value: "red", label: "Rot (2)" },
  { value: "none", label: "Keine" },
];

const SEAT_MATERIAL_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "leather", label: "Leder" },
  { value: "partLeather", label: "Teilleder" },
  { value: "fabric", label: "Stoff" },
  { value: "alcantara", label: "Alcantara" },
  { value: "velour", label: "Velours" },
  { value: "other", label: "Sonstige" },
];

const AIRBAG_FEATURES = [
  "Fahrer-Airbag", "Beifahrer-Airbag", "Seitenairbags vorne", "Seitenairbags hinten",
  "Kopfairbags / Curtain-Airbags", "Knieairbag", "Mittelairbag", "Fußgänger-Airbag",
];

const PARKING_AID_FEATURES = [
  "Einparkhilfe vorne",
  "Einparkhilfe hinten",
  "360°-Grad-Kamera",
  "Selbstparkend",
];

const CYLINDER_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
  { value: "10", label: "10" },
  { value: "12", label: "12" },
  { value: "16", label: "16" },
];

const DOOR_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "2/3", label: "2/3" },
  { value: "4/5", label: "4/5" },
  { value: "6/7", label: "6/7" },
];

const TIRE_CONDITION_OPTIONS = [
  { value: "", label: "Bitte wählen" },
  { value: "new", label: "Neu" },
  { value: "good", label: "Gut" },
  { value: "fair", label: "Ausreichend" },
  { value: "worn", label: "Abgefahren" },
];

const COMFORT_FEATURES = [
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
  "Sitzbelüftung vorne",
  "Sitzbelüftung hinten",
  "Keyless-Go",
];

const SAFETY_FEATURES = [
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
];

const EXTERIOR_FEATURES = [
  "LED-Scheinwerfer",
  "Xenon-Scheinwerfer",
  "Matrix-LED",
  "Tagfahrlicht",
  "Nebelscheinwerfer",
  "Alufelgen",
  "Dachreling",
  "Anhängerkupplung",
  "Sportpaket",
  "Lackversiegelung",
];

const MULTIMEDIA_FEATURES = [
  "Navigationssystem",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "USB",
  "DAB-Radio",
  "Soundsystem",
  "Rückfahrkamera",
  "360°-Kamera",
  "WLAN-Hotspot",
  "Induktive Ladestation",
];

// ============================================================================
// SUBMIT FORM SECTION - Components
// ============================================================================

function FormSection({
  title,
  icon,
  children,
  defaultOpen = false
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-[#fafafa] dark:bg-[#1a1a1a] hover:bg-[#f5f5f5] dark:hover:bg-[#1f1f1f] transition-colors rounded-t-2xl"
      >
        <span className="flex items-center gap-3 font-semibold text-[#0a0a0a] dark:text-[#ededed]">
          <span className="text-xl">{icon}</span>
          {title}
        </span>
        <ChevronRightIcon className={`w-5 h-5 text-[#737373] dark:text-[#8a8a8a] transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-6 space-y-6 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
          {children}
        </div>
      )}
    </div>
  );
}

function FormInput({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">
        {label}
        {required && <span className="text-[#f14011] ml-1">*</span>}
      </label>
      <input className="input" required={required} {...props} />
    </div>
  );
}

function FormSelect({
  label,
  required,
  options,
  ...props
}: {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">
        {label}
        {required && <span className="text-[#f14011] ml-1">*</span>}
      </label>
      <select className="input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10" required={required} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function FormCombobox({
  label,
  required,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  grouped,
}: {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  grouped?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setSearch("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    onChange(newValue);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">
        {label}
        {required && <span className="text-[#f14011] ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="input pr-10"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          required={required}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] dark:text-[#8a8a8a] hover:text-[#525252] dark:hover:text-[#a3a3a3]"
          disabled={disabled}
        >
          <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {grouped ? (() => {
            let lastLetter = "";
            return filteredOptions.map((option) => {
              const letter = option.charAt(0).toUpperCase();
              const showHeader = letter !== lastLetter;
              lastLetter = letter;
              return (
                <div key={option}>
                  {showHeader && (
                    <div className="px-4 py-1.5 text-[10px] font-bold text-[#737373] dark:text-[#8a8a8a] uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#111] sticky top-0">
                      {letter}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-[#f5f5f5] dark:hover:bg-[#1f1f1f] transition-colors ${
                      value === option ? "bg-[#fef2ef] text-[#f14011] font-medium" : "text-[#0a0a0a] dark:text-[#ededed]"
                    }`}
                  >
                    {option}
                  </button>
                </div>
              );
            });
          })() : filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-2.5 text-left hover:bg-[#f5f5f5] dark:hover:bg-[#1f1f1f] transition-colors ${
                value === option ? "bg-[#fef2ef] text-[#f14011] font-medium" : "text-[#0a0a0a] dark:text-[#ededed]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        checked ? "bg-[#f14011] border-[#f14011]" : "border-[#d4d4d4] dark:border-[#3d3d3d] group-hover:border-[#a3a3a3]"
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[#525252] dark:text-[#a3a3a3]">{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function FormTriState({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">{label}</label>
      <div className="flex gap-2">
        {[
          { val: true, label: "Ja" },
          { val: false, label: "Nein" },
          { val: null, label: "K.A." },
        ].map((opt) => (
          <button
            key={String(opt.val)}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt.val
                ? "bg-[#f14011] text-white"
                : "bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#525252] dark:text-[#a3a3a3] hover:bg-[#e5e5e5]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FormBinaryState({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">{label}</label>
      <div className="flex gap-2">
        {[
          { val: true, label: "Ja" },
          { val: false, label: "Nein" },
        ].map((opt) => (
          <button
            key={String(opt.val)}
            type="button"
            onClick={() => onChange(value === opt.val ? null : opt.val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt.val
                ? "bg-[#f14011] text-white"
                : "bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#525252] dark:text-[#a3a3a3] hover:bg-[#e5e5e5]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FormFeatureSelectWithOther({
  label,
  features,
  selected,
  onChange,
  otherValue,
  onOtherChange,
}: {
  label: string;
  features: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  otherValue: string;
  onOtherChange: (value: string) => void;
}) {
  const toggleFeature = (feature: string) => {
    if (selected.includes(feature)) {
      onChange(selected.filter((f) => f !== feature));
    } else {
      onChange([...selected, feature]);
    }
  };

  const [showOther, setShowOther] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <button
            key={feature}
            type="button"
            onClick={() => toggleFeature(feature)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selected.includes(feature)
                ? "bg-[#f14011] text-white"
                : "bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#525252] dark:text-[#a3a3a3] hover:bg-[#e5e5e5]"
            }`}
          >
            {feature}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowOther(!showOther)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            showOther || otherValue
              ? "bg-[#f14011] text-white"
              : "bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#525252] dark:text-[#a3a3a3] hover:bg-[#e5e5e5]"
          }`}
        >
          Sonstige
        </button>
      </div>
      {(showOther || otherValue) && (
        <input
          type="text"
          className="input mt-2"
          placeholder="Weitere Ausstattung eingeben..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
        />
      )}
    </div>
  );
}

function FormFeatureSelect({
  label,
  features,
  selected,
  onChange,
}: {
  label: string;
  features: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggleFeature = (feature: string) => {
    if (selected.includes(feature)) {
      onChange(selected.filter((f) => f !== feature));
    } else {
      onChange([...selected, feature]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <button
            key={feature}
            type="button"
            onClick={() => toggleFeature(feature)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selected.includes(feature)
                ? "bg-[#f14011] text-white"
                : "bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#525252] dark:text-[#a3a3a3] hover:bg-[#e5e5e5]"
            }`}
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
}

const DAMAGE_ZONES = [
  { id: "frontLeft", label: "Vorne links", x: 62, y: 18 },
  { id: "frontCenter", label: "Vorne Mitte", x: 50, y: 10 },
  { id: "frontRight", label: "Vorne rechts", x: 38, y: 18 },
  { id: "leftFront", label: "Seite links vorne", x: 72, y: 38 },
  { id: "leftRear", label: "Seite links hinten", x: 72, y: 62 },
  { id: "rightFront", label: "Seite rechts vorne", x: 28, y: 38 },
  { id: "rightRear", label: "Seite rechts hinten", x: 28, y: 62 },
  { id: "roof", label: "Dach", x: 50, y: 50 },
  { id: "rearLeft", label: "Hinten links", x: 62, y: 82 },
  { id: "rearCenter", label: "Hinten Mitte", x: 50, y: 90 },
  { id: "rearRight", label: "Hinten rechts", x: 38, y: 82 },
];

function DamageMap({
  damageMap,
  onChange,
  paintThicknessAvailable,
  paintThickness,
  onPaintThicknessChange,
}: {
  damageMap: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
  paintThicknessAvailable: boolean | null;
  paintThickness: Record<string, string>;
  onPaintThicknessChange: (map: Record<string, string>) => void;
}) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-3">Schadenskarte</label>
      <p className="text-sm text-[#737373] dark:text-[#8a8a8a] mb-3">Klicke auf eine Zone um Schäden einzutragen</p>
      <div className="relative bg-[#f5f5f5] dark:bg-[#1f1f1f] rounded-2xl p-4" style={{ minHeight: 320 }}>
        <svg viewBox="0 0 100 100" className="w-full max-w-[320px] mx-auto" style={{ height: 280 }}>
          <defs>
            <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="100%" stopColor="#d4d4d4" />
            </linearGradient>
            <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>

          {/* Car body outline */}
          <path
            d="M 35 8 Q 35 5 38 5 L 62 5 Q 65 5 65 8
               L 67 20 Q 68 22 70 23 L 72 24 Q 74 25 74 28
               L 74 72 Q 74 75 72 76 L 70 77 Q 68 78 67 80
               L 65 92 Q 65 95 62 95 L 38 95 Q 35 95 35 92
               L 33 80 Q 32 78 30 77 L 28 76 Q 26 75 26 72
               L 26 28 Q 26 25 28 24 L 30 23 Q 32 22 33 20 Z"
            fill="url(#carBody)" stroke="#a3a3a3" strokeWidth="0.8"
          />

          {/* Hood */}
          <path
            d="M 37 8 Q 37 6 39 6 L 61 6 Q 63 6 63 8 L 64 18 Q 64 19 63 19 L 37 19 Q 36 19 36 18 Z"
            fill="#d4d4d4" stroke="#b0b0b0" strokeWidth="0.4"
          />

          {/* Windshield */}
          <path
            d="M 36 20 L 64 20 Q 65 20 65 21 L 66 29 Q 66 30 65 30 L 35 30 Q 34 30 34 29 L 35 21 Q 35 20 36 20 Z"
            fill="url(#glass)" stroke="#7daadb" strokeWidth="0.5" opacity="0.85"
          />

          {/* Roof */}
          <path
            d="M 35 31 L 65 31 Q 66 31 66 32 L 66 68 Q 66 69 65 69 L 35 69 Q 34 69 34 68 L 34 32 Q 34 31 35 31 Z"
            fill="#d9d9d9" stroke="#b0b0b0" strokeWidth="0.4"
          />

          {/* Rear window */}
          <path
            d="M 35 70 L 65 70 Q 66 70 66 71 L 65 79 Q 65 80 64 80 L 36 80 Q 35 80 34 79 L 34 71 Q 34 70 35 70 Z"
            fill="url(#glass)" stroke="#7daadb" strokeWidth="0.5" opacity="0.85"
          />

          {/* Trunk */}
          <path
            d="M 36 81 L 64 81 Q 64 81 64 82 L 63 92 Q 63 93 62 93 L 38 93 Q 37 93 37 92 L 36 82 Q 36 81 36 81 Z"
            fill="#d4d4d4" stroke="#b0b0b0" strokeWidth="0.4"
          />

          {/* Left mirror */}
          <ellipse cx="74" cy="26" rx="3" ry="2" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="0.4" />
          {/* Right mirror */}
          <ellipse cx="26" cy="26" rx="3" ry="2" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="0.4" />

          {/* Wheels */}
          <rect x="70" y="14" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          <rect x="70" y="72" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          <rect x="23" y="14" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />
          <rect x="23" y="72" width="7" height="14" rx="2.5" fill="#404040" stroke="#333" strokeWidth="0.5" />

          {/* Wheel rims */}
          <rect x="71.5" y="18" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          <rect x="71.5" y="76" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          <rect x="24.5" y="18" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />
          <rect x="24.5" y="76" width="4" height="6" rx="1.5" fill="#666" stroke="#555" strokeWidth="0.3" />

          {/* Headlights */}
          <ellipse cx="40" cy="7" rx="3" ry="1.2" fill="#fef08a" stroke="#eab308" strokeWidth="0.3" opacity="0.7" />
          <ellipse cx="60" cy="7" rx="3" ry="1.2" fill="#fef08a" stroke="#eab308" strokeWidth="0.3" opacity="0.7" />

          {/* Taillights */}
          <ellipse cx="40" cy="93" rx="3" ry="1.2" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.3" opacity="0.7" />
          <ellipse cx="60" cy="93" rx="3" ry="1.2" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.3" opacity="0.7" />

          {/* A-pillar lines */}
          <line x1="36" y1="20" x2="34" y2="31" stroke="#b0b0b0" strokeWidth="0.3" />
          <line x1="64" y1="20" x2="66" y2="31" stroke="#b0b0b0" strokeWidth="0.3" />

          {/* C-pillar lines */}
          <line x1="36" y1="80" x2="34" y2="69" stroke="#b0b0b0" strokeWidth="0.3" />
          <line x1="64" y1="80" x2="66" y2="69" stroke="#b0b0b0" strokeWidth="0.3" />

          {/* Zone markers */}
          {DAMAGE_ZONES.map((zone) => (
            <g key={zone.id}>
              <circle
                cx={zone.x}
                cy={zone.y}
                r={damageMap[zone.id] ? 4 : 3}
                fill={damageMap[zone.id] ? "#f14011" : "rgba(120,120,120,0.5)"}
                stroke="white"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
              />
              {damageMap[zone.id] && (
                <text x={zone.x} y={zone.y - 6} textAnchor="middle" fontSize="3.5" fill="#f14011" fontWeight="bold">!</text>
              )}
            </g>
          ))}
        </svg>
      </div>
      {selectedZone && (
        <div className="mt-3 p-3 bg-[#fafafa] dark:bg-[#1a1a1a] rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a]">
          <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-1">
            {DAMAGE_ZONES.find((z) => z.id === selectedZone)?.label}
          </label>
          <input
            type="text"
            className="input"
            placeholder="Schaden beschreiben (z.B. Kratzer, Delle, Lackschaden)"
            value={damageMap[selectedZone] || ""}
            onChange={(e) => {
              const newMap = { ...damageMap };
              if (e.target.value) {
                newMap[selectedZone] = e.target.value;
              } else {
                delete newMap[selectedZone];
              }
              onChange(newMap);
            }}
          />
          {paintThicknessAvailable === true && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-[#737373] dark:text-[#8a8a8a] mb-1">Lackdicke (µm)</label>
              <input
                type="number"
                className="input [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="z.B. 120"
                value={paintThickness[selectedZone] || ""}
                onChange={(e) => {
                  const newMap = { ...paintThickness };
                  if (e.target.value) {
                    newMap[selectedZone] = e.target.value;
                  } else {
                    delete newMap[selectedZone];
                  }
                  onPaintThicknessChange(newMap);
                }}
              />
            </div>
          )}
        </div>
      )}
      {Object.keys(damageMap).length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed]">Eingetragene Schäden:</p>
          {Object.entries(damageMap).map(([zoneId, desc]) => (
            <div key={zoneId} className="flex items-center justify-between text-sm bg-[#fef2f2] rounded-lg px-3 py-1.5">
              <span>
                <strong>{DAMAGE_ZONES.find((z) => z.id === zoneId)?.label}:</strong> {desc}
                {paintThicknessAvailable === true && paintThickness[zoneId] && (
                  <span className="ml-2 text-[#737373] dark:text-[#8a8a8a]">({paintThickness[zoneId]} µm)</span>
                )}
              </span>
              <button
                type="button"
                className="text-[#f14011] hover:text-[#d63a0f] ml-2"
                onClick={() => {
                  const newMap = { ...damageMap };
                  delete newMap[zoneId];
                  onChange(newMap);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageUpload({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 10;
  const MAX_SIZE_MB = 5;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const newImages: string[] = [];
    for (const file of filesToProcess) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`${file.name} ist größer als ${MAX_SIZE_MB}MB`);
        continue;
      }
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} ist kein Bild`);
        continue;
      }
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }
    onChange([...images, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-3">
        Bilder <span className="font-normal text-[#737373] dark:text-[#8a8a8a]">(max. {MAX_IMAGES}, je max. {MAX_SIZE_MB}MB)</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f5f5] dark:bg-[#1f1f1f] group">
            <img src={img} alt={`Bild ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#d4d4d4] dark:border-[#3d3d3d] hover:border-[#f14011] flex flex-col items-center justify-center gap-2 text-[#737373] dark:text-[#8a8a8a] hover:text-[#f14011] transition-colors"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm font-medium">Hinzufügen</span>
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// ============================================================================
// SUBMIT FORM SECTION - Main Component
// ============================================================================

function SubmitFormSection() {
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const nameFieldRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof VehicleFormData>(field: K, value: VehicleFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "contactFirstName" || field === "contactLastName") {
      setNameError(null);
    }
  };

  const validateName = (name: string): boolean => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return false;
    if (/^(.)\1+$/.test(trimmed)) return false;
    if (!/^[a-zA-ZÀ-ÿäöüÄÖÜß\s'-]+$/.test(trimmed)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstName = formData.contactFirstName.trim();
    const lastName = formData.contactLastName.trim();

    if (!validateName(firstName) || !validateName(lastName)) {
      setNameError("Bitte gib einen gültigen Vor- und Nachnamen ein (jeweils mindestens 2 Buchstaben).");
      nameFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { contactFirstName, contactLastName, ...rest } = formData;
      const payload = {
        ...rest,
        contactName: `${contactFirstName.trim()} ${contactLastName.trim()}`,
        showContactName: formData.showContactName === "visible",
        sellerType: formData.sellerType || "private",
        price: parseFloat(formData.price) || 0,
        constructionYear: formData.constructionYear ? parseInt(formData.constructionYear) : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        previousOwners: formData.previousOwners ? parseInt(formData.previousOwners) : undefined,
        powerPs: formData.powerPs ? parseInt(formData.powerPs) : undefined,
        cylinders: formData.cylinders ? parseInt(formData.cylinders) : undefined,
        engineSize: formData.engineSize ? parseInt(formData.engineSize) : undefined,
        tankSize: formData.tankSize ? parseInt(formData.tankSize) : undefined,
        co2Emission: formData.co2Emission ? parseInt(formData.co2Emission) : undefined,
        doors: formData.doors ? parseInt(formData.doors) : undefined,
        seats: formData.seats ? parseInt(formData.seats) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        climateZones: formData.climateZones ? parseInt(formData.climateZones) : undefined,
        rimSize: formData.rimSize ? parseInt(formData.rimSize) : undefined,
        images,
      };

      const response = await fetch("/api/submit-vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message });
        setFormData(initialFormData);
        setImages([]);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.errors?.join(", ") || result.error || "Ein Fehler ist aufgetreten"
        });
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Netzwerkfehler. Bitte versuche es erneut." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="submit" className="py-24 lg:py-32 bg-[#fafafa] dark:bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#fdd8d0] text-[#b72b0b] rounded-full text-sm font-semibold mb-4">
            Jetzt verkaufen
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-[#0a0a0a] dark:text-[#ededed] mb-4">
            FAHRZEUG <span className="italic text-[#f14011]">EINREICHEN</span>
          </h2>
          <p className="text-lg text-[#525252] dark:text-[#a3a3a3] max-w-2xl mx-auto">
            Fülle das Formular aus und unser Team prüft deine Einreichung innerhalb von 24 Stunden.
          </p>
        </div>

        {submitStatus && (
          <div className={`mb-8 p-4 rounded-xl ${
            submitStatus.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            <p className="font-medium">{submitStatus.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#141414] rounded-3xl shadow-xl p-4 sm:p-8 md:p-12 space-y-6">
          {/* Honeypot - hidden from users */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
            className="absolute opacity-0 pointer-events-none"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Seller Type */}
          <div>
            <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-3">
              Ich bin... <span className="text-[#f14011]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "private", label: "Privatverkäufer" },
                { value: "dealer", label: "Händler/Gewerbe" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateField("sellerType", type.value as "private" | "dealer")}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all ${
                    formData.sellerType === type.value
                      ? "border-[#f14011] bg-[#fef2ef]"
                      : "border-[#e5e5e5] dark:border-[#2a2a2a] hover:border-[#d4d4d4] dark:hover:border-[#3d3d3d]"
                  }`}
                >
                  <span className={`font-semibold text-xs sm:text-base ${formData.sellerType === type.value ? "text-[#f14011]" : "text-[#0a0a0a] dark:text-[#ededed]"}`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-6 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
            <h3 className="font-display text-2xl text-[#0a0a0a] dark:text-[#ededed] mb-6">Kontaktdaten</h3>
            {formData.sellerType === "dealer" && (
              <div className="mb-6">
                <FormInput
                  label="Unternehmen"
                  type="text"
                  placeholder="Autohaus Mustermann GmbH"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                />
              </div>
            )}
            <div ref={nameFieldRef} className="grid md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label="Vorname"
                required
                type="text"
                placeholder="Max"
                value={formData.contactFirstName}
                onChange={(e) => updateField("contactFirstName", e.target.value)}
              />
              <FormInput
                label="Nachname"
                required
                type="text"
                placeholder="Mustermann"
                value={formData.contactLastName}
                onChange={(e) => updateField("contactLastName", e.target.value)}
              />
            </div>
            {nameError && (
              <p className="text-sm text-[#ef4444] mb-4">{nameError}</p>
            )}
            {formData.sellerType === "private" && (
              <div className="mb-6">
                <FormSelect
                  label="Name öffentlich sichtbar?"
                  options={[
                    { value: "visible", label: "Ja, Name im Inserat anzeigen" },
                    { value: "hidden", label: "Nein, Name nicht öffentlich anzeigen" },
                  ]}
                  value={formData.showContactName}
                  onChange={(e) => updateField("showContactName", e.target.value as "visible" | "hidden")}
                />
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label="E-Mail"
                required
                type="email"
                placeholder="max@beispiel.de"
                value={formData.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
              />
            </div>
            <div>
              <FormInput
                label="Telefonnummer"
                type="tel"
                placeholder="+49 170 1234567"
                value={formData.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
              />
              {formData.contactPhone && (
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showContactPhone}
                    onChange={(e) => updateField("showContactPhone", e.target.checked)}
                    className="w-4 h-4 rounded border-[#d4d4d4] dark:border-[#3d3d3d] text-[#f14011] focus:ring-[#f14011]"
                  />
                  <span className="text-sm text-[#737373] dark:text-[#8a8a8a]">Telefonnummer öffentlich anzeigen</span>
                </label>
              )}
            </div>
          </div>

          {/* Basic Vehicle Info - Always visible */}
          <div className="pt-6 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
            <h3 className="font-display text-2xl text-[#0a0a0a] dark:text-[#ededed] mb-6">{getVehicleNoun(getFormTypeLabel(formData.vehicleType))}daten</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <FormSelect
                label="Fahrzeugtyp"
                options={VEHICLE_TYPE_OPTIONS}
                value={formData.vehicleType}
                onChange={(e) => {
                  const newType = e.target.value;
                  updateField("vehicleType", newType);
                  // Reset brand, model, category when type changes
                  updateField("brand", "");
                  updateField("model", "");
                  updateField("vehicleCategory", "");
                  // Reset type-specific fields
                  updateField("driveType", "");
                  updateField("cylinders", "");
                  updateField("doors", "");
                  updateField("seats", "");
                  updateField("comfortFeatures", []);
                  updateField("safetyFeatures", []);
                  updateField("exteriorFeatures", []);
                  updateField("multimediaFeatures", []);
                  updateField("airbags", []);
                  updateField("parkingAid", []);
                  updateField("cameraFront", null);
                  updateField("cameraRear", null);
                  updateField("damageMap", {});
                  updateField("paintThickness", {});
                  updateField("paintThicknessAvailable", null);
                  updateField("paintThicknessImage", "");
                }}
              />
              <FormCombobox
                label="Marke"
                required
                placeholder="Marke auswählen oder eingeben"
                options={getFormBrands(formData.vehicleType)}
                value={formData.brand}
                onChange={(value) => {
                  updateField("brand", value);
                  // Reset model when brand changes
                  const models = getFormModels(formData.vehicleType, value);
                  if (formData.model && !models.includes(formData.model)) {
                    updateField("model", "");
                  }
                }}
              />
              <FormCombobox
                label="Modell"
                required
                placeholder={formData.brand ? "Modell auswählen oder eingeben" : "Zuerst Marke wählen"}
                options={getFormModels(formData.vehicleType, formData.brand)}
                value={formData.model}
                onChange={(value) => updateField("model", value)}
                disabled={!formData.brand}
                grouped
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <FormInput
                label="Modellbeschreibung"
                type="text"
                placeholder={({ "motorcycle": "z.B. CB 650 R, MT-07", "truck": "z.B. Actros 1845, TGX 18.510", "van": "z.B. Sprinter 314 CDI, Transit Custom", "motorhome": "z.B. B-Klasse ML-T 580, Van TI 650 MEG" })[formData.vehicleType] || "z.B. 320d xDrive, A 200 AMG Line"}
                value={formData.modelDescription}
                onChange={(e) => updateField("modelDescription", e.target.value)}
              />
              <FormInput
                label="Variante"
                type="text"
                placeholder={({ "motorcycle": "z.B. ABS, Rally, Adventure", "truck": "z.B. StreamSpace, GigaSpace", "van": "z.B. Kastenwagen, Hochdach, L2H2", "motorhome": "z.B. Alkoven, Teilintegriert, Kastenwagen" })[formData.vehicleType] || "z.B. Competition, GTI"}
                value={formData.variant}
                onChange={(e) => updateField("variant", e.target.value)}
              />
              <FormSelect
                label="Karosserieform"
                options={getFormCategoryOptions(formData.vehicleType)}
                value={formData.vehicleCategory}
                onChange={(e) => updateField("vehicleCategory", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label="Preis (€)"
                required
                type="number"
                placeholder="50000"
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
              <div className="flex items-end gap-6">
                <FormCheckbox
                  label="Preis verhandelbar"
                  checked={formData.priceNegotiable}
                  onChange={(checked) => updateField("priceNegotiable", checked)}
                />
                <FormCheckbox
                  label="MwSt. ausweisbar"
                  checked={formData.vatDeductible}
                  onChange={(checked) => updateField("vatDeductible", checked)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormInput
                label="PLZ"
                required
                type="text"
                placeholder="80331"
                value={formData.zip}
                onChange={(e) => updateField("zip", e.target.value)}
              />
              <FormInput
                label="Stadt"
                required
                type="text"
                placeholder="München"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
              <FormInput
                label="Land"
                type="text"
                placeholder="Deutschland"
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="pt-6 border-t border-[#e5e5e5] dark:border-[#2a2a2a] space-y-4">
            <p className="text-sm text-[#737373] dark:text-[#8a8a8a] mb-2">Weitere Details (optional)</p>

            {/* Vehicle Details */}
            <FormSection title={`${getVehicleNoun(getFormTypeLabel(formData.vehicleType))}details`} icon={getVehicleIcon(getFormTypeLabel(formData.vehicleType))}>
              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Baujahr"
                  type="number"
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.constructionYear}
                  onChange={(e) => updateField("constructionYear", e.target.value)}
                />
                <FormInput
                  label="Erstzulassung"
                  type="month"
                  value={formData.firstRegistration}
                  onChange={(e) => updateField("firstRegistration", e.target.value)}
                />
                <FormInput
                  label="HU gültig bis"
                  type="month"
                  value={formData.huValidUntil}
                  onChange={(e) => updateField("huValidUntil", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Kilometerstand"
                  type="number"
                  placeholder="50000"
                  min="0"
                  step="10000"
                  value={formData.mileage}
                  onChange={(e) => updateField("mileage", e.target.value)}
                />
                <FormInput
                  label="Vorbesitzer"
                  type="number"
                  placeholder="1"
                  min="0"
                  value={formData.previousOwners}
                  onChange={(e) => updateField("previousOwners", e.target.value)}
                />
                <FormSelect
                  label="Zustand"
                  options={CONDITION_OPTIONS}
                  value={formData.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                />
              </div>
              <FormInput
                label="FIN / VIN"
                type="text"
                placeholder="WVWZZZ3CZWE123456"
                maxLength={17}
                value={formData.vin}
                onChange={(e) => updateField("vin", e.target.value.toUpperCase())}
              />
            </FormSection>

            {/* Technical Data */}
            <FormSection title="Technische Daten" icon="⚙️">
              <div className="grid md:grid-cols-3 gap-6">
                <FormSelect
                  label="Kraftstoff"
                  options={FUEL_TYPE_OPTIONS}
                  value={formData.fuelType}
                  onChange={(e) => updateField("fuelType", e.target.value)}
                />
                <FormInput
                  label="Leistung (PS)"
                  type="text"
                  inputMode="numeric"
                  placeholder="300"
                  value={formData.powerPs}
                  onChange={(e) => updateField("powerPs", e.target.value)}
                />
                <FormSelect
                  label="Getriebe"
                  options={TRANSMISSION_OPTIONS}
                  value={formData.transmission}
                  onChange={(e) => updateField("transmission", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <FormSelect
                  label="Antrieb"
                  options={getFormDriveTypeOptions(formData.vehicleType)}
                  value={formData.driveType}
                  onChange={(e) => updateField("driveType", e.target.value)}
                />
                <FormSelect
                  label="Zylinder"
                  options={getFormCylinderOptions(formData.vehicleType)}
                  value={formData.cylinders}
                  onChange={(e) => updateField("cylinders", e.target.value)}
                />
                <FormInput
                  label="Hubraum (ccm)"
                  type="text"
                  inputMode="numeric"
                  placeholder="2998"
                  value={formData.engineSize}
                  onChange={(e) => updateField("engineSize", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Tankvolumen (L)"
                  type="text"
                  inputMode="numeric"
                  placeholder="60"
                  value={formData.tankSize}
                  onChange={(e) => updateField("tankSize", e.target.value)}
                />
                <FormInput
                  label="Leergewicht (kg)"
                  type="text"
                  inputMode="numeric"
                  placeholder="1500"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
              </div>
            </FormSection>

            {/* Emissions */}
            <FormSection title="Umwelt & Emissionen" icon="🌱">
              <div className="grid md:grid-cols-3 gap-6">
                <FormSelect
                  label="Emissionsklasse"
                  options={EMISSION_CLASS_OPTIONS}
                  value={formData.emissionClass}
                  onChange={(e) => updateField("emissionClass", e.target.value)}
                />
                <FormSelect
                  label="Umweltplakette"
                  options={ENVIRONMENTAL_BADGE_OPTIONS}
                  value={formData.environmentalBadge}
                  onChange={(e) => updateField("environmentalBadge", e.target.value)}
                />
                <FormInput
                  label="CO₂-Emission (g/km)"
                  type="text"
                  inputMode="numeric"
                  placeholder="150"
                  value={formData.co2Emission}
                  onChange={(e) => updateField("co2Emission", e.target.value)}
                />
              </div>
              <FormBinaryState
                label="Partikelfilter"
                value={formData.particleFilter}
                onChange={(val) => updateField("particleFilter", val)}
              />
            </FormSection>

            {/* Exterior & Interior */}
            <FormSection title="Exterieur & Interieur" icon="🎨">
              <div className="grid md:grid-cols-2 gap-6">
                <FormSelect
                  label="Außenfarbe"
                  options={COLOR_OPTIONS}
                  value={formData.colorGeneral}
                  onChange={(e) => updateField("colorGeneral", e.target.value)}
                />
                <FormInput
                  label="Herstellerfarbe"
                  type="text"
                  placeholder={({ "motorcycle": "z.B. Racing Red", "truck": "z.B. Fernverkehrsweiß", "van": "z.B. Reflexsilber", "motorhome": "z.B. Polarweiß" })[formData.vehicleType] || "z.B. Alpinweiß, Tansanitblau"}
                  value={formData.colorManufacturer}
                  onChange={(e) => updateField("colorManufacturer", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {isFieldVisibleForType("doors", getFormTypeLabel(formData.vehicleType)) && (
                  <FormSelect
                    label="Türen"
                    options={getFormDoorOptions(formData.vehicleType)}
                    value={formData.doors}
                    onChange={(e) => updateField("doors", e.target.value)}
                  />
                )}
                <FormSelect
                  label="Sitze"
                  options={getFormSeatOptions(formData.vehicleType)}
                  value={formData.seats}
                  onChange={(e) => updateField("seats", e.target.value)}
                />
                {isFieldVisibleForType("interiorColor", getFormTypeLabel(formData.vehicleType)) && (
                  <FormSelect
                    label="Innenfarbe"
                    options={COLOR_OPTIONS}
                    value={formData.interiorColor}
                    onChange={(e) => updateField("interiorColor", e.target.value)}
                  />
                )}
                {isFieldVisibleForType("seatMaterial", getFormTypeLabel(formData.vehicleType)) && (
                  <FormSelect
                    label="Sitzmaterial"
                    options={SEAT_MATERIAL_OPTIONS}
                    value={formData.seatMaterial}
                    onChange={(e) => updateField("seatMaterial", e.target.value)}
                  />
                )}
                <FormSelect
                  label="Tacho"
                  options={[
                    { value: "", label: "Bitte wählen" },
                    { value: "digital", label: "Volldigital" },
                    { value: "analog", label: "Analog" },
                  ]}
                  value={formData.dashboardType}
                  onChange={(e) => updateField("dashboardType", e.target.value)}
                />
              </div>
              {isFieldVisibleForType("rimSize", getFormTypeLabel(formData.vehicleType)) && (
                <div className="grid md:grid-cols-3 gap-6">
                  <FormSelect
                    label="Felgenart"
                    options={[
                      { value: "", label: "Bitte wählen" },
                      { value: "Alufelgen", label: "Alufelgen" },
                      { value: "Stahlfelgen", label: "Stahlfelgen" },
                    ]}
                    value={formData.rimType}
                    onChange={(e) => updateField("rimType", e.target.value)}
                  />
                  <FormInput
                    label="Felgengröße (Zoll)"
                    type="text"
                    inputMode="numeric"
                    placeholder="19"
                    value={formData.rimSize}
                    onChange={(e) => updateField("rimSize", e.target.value)}
                  />
                </div>
              )}
            </FormSection>

            {/* Condition & History */}
            <FormSection title="Zustand & Historie" icon="📜">
              {isFieldVisibleForType("paintProtectionFilm", getFormTypeLabel(formData.vehicleType)) && (
                <div className="grid md:grid-cols-2 gap-6">
                  <FormBinaryState
                    label="Steinschlagschutzfolie"
                    value={formData.stoneguardFilm}
                    onChange={(val) => updateField("stoneguardFilm", val)}
                  />
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-6">
                <FormBinaryState
                  label="Unfallfrei"
                  value={formData.accidentFree}
                  onChange={(val) => updateField("accidentFree", val)}
                />
                {isFieldVisibleForType("noRepaint", getFormTypeLabel(formData.vehicleType)) && (
                  <FormBinaryState
                    label="Nachlackierungsfrei"
                    value={formData.repaintFree}
                    onChange={(val) => updateField("repaintFree", val)}
                  />
                )}
                <FormBinaryState
                  label="Scheckheftgepflegt"
                  value={formData.serviceHistory}
                  onChange={(val) => updateField("serviceHistory", val)}
                />
                <FormBinaryState
                  label="Taxiausführung"
                  value={formData.taxiVersion}
                  onChange={(val) => updateField("taxiVersion", val)}
                />
                <FormBinaryState
                  label="Barrierefreies Fahrzeug"
                  value={formData.accessibleVehicle}
                  onChange={(val) => updateField("accessibleVehicle", val)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormSelect
                  label={`${getVehicleNoun(getFormTypeLabel(formData.vehicleType))}herkunft`}
                  options={VEHICLE_ORIGIN_OPTIONS}
                  value={formData.vehicleOrigin}
                  onChange={(e) => updateField("vehicleOrigin", e.target.value)}
                />
                {formData.vehicleOrigin === "sonstige" && (
                  <FormInput
                    label="Herkunftsland"
                    type="text"
                    placeholder="z.B. Südkorea, Kanada, Australien"
                    value={formData.vehicleOriginOther}
                    onChange={(e) => updateField("vehicleOriginOther", e.target.value)}
                  />
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Letzter Service bei"
                  type="text"
                  placeholder="z.B. BMW Niederlassung München"
                  value={formData.serviceHistoryAt}
                  onChange={(e) => updateField("serviceHistoryAt", e.target.value)}
                />
                <FormInput
                  label="Garantie bis"
                  type="month"
                  value={formData.warrantyUntil}
                  onChange={(e) => updateField("warrantyUntil", e.target.value)}
                />
              </div>
              <FormInput
                label="Herstellergarantie bis"
                type="month"
                value={formData.manufacturerWarrantyUntil}
                onChange={(e) => updateField("manufacturerWarrantyUntil", e.target.value)}
              />

              {/* Reifendetails */}
              {isFieldVisibleForType("tireType", getFormTypeLabel(formData.vehicleType)) && (
                <FormFeatureSelect
                  label="Reifenart"
                  features={["Sommerreifen", "Winterreifen", "Allwetterreifen"]}
                  selected={formData.tireType}
                  onChange={(selected) => updateField("tireType", selected)}
                />
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <FormSelect
                  label="Reifenzustand vorne"
                  options={TIRE_CONDITION_OPTIONS}
                  value={formData.tireConditionFront}
                  onChange={(e) => updateField("tireConditionFront", e.target.value)}
                />
                <FormSelect
                  label="Reifenzustand hinten"
                  options={TIRE_CONDITION_OPTIONS}
                  value={formData.tireConditionRear}
                  onChange={(e) => updateField("tireConditionRear", e.target.value)}
                />
              </div>
              <FormBinaryState
                label="Runflat-Reifen"
                value={formData.tireRunflat}
                onChange={(val) => updateField("tireRunflat", val)}
              />
              <TireConditionInfoButton />
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Profiltiefe vorne (mm)"
                  type="number"
                  placeholder="z.B. 5.5"
                  value={formData.tireDepthFront}
                  onChange={(e) => updateField("tireDepthFront", e.target.value)}
                />
                <FormInput
                  label="Profiltiefe hinten (mm)"
                  type="number"
                  placeholder="z.B. 5.5"
                  value={formData.tireDepthRear}
                  onChange={(e) => updateField("tireDepthRear", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Reifenalter vorne (Jahre)"
                  type="number"
                  placeholder="z.B. 2"
                  value={formData.tireAgeFront}
                  onChange={(e) => updateField("tireAgeFront", e.target.value)}
                />
                <FormInput
                  label="Reifenalter hinten (Jahre)"
                  type="number"
                  placeholder="z.B. 2"
                  value={formData.tireAgeRear}
                  onChange={(e) => updateField("tireAgeRear", e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormBinaryState
                  label="Reifen schadensfrei vorne"
                  value={formData.tireDamageFront}
                  onChange={(val) => updateField("tireDamageFront", val)}
                />
                <FormBinaryState
                  label="Reifen schadensfrei hinten"
                  value={formData.tireDamageRear}
                  onChange={(val) => updateField("tireDamageRear", val)}
                />
              </div>

              {/* Schadenskarte */}
              {isFieldVisibleForType("damageMap", getFormTypeLabel(formData.vehicleType)) && (
                <>
                  <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
                    <FormBinaryState
                      label={`${getVehicleNoun(getFormTypeLabel(formData.vehicleType))} aktuell beschädigt`}
                      value={formData.currentlyDamaged}
                      onChange={(val) => updateField("currentlyDamaged", val)}
                    />
                  </div>
                  <DamageMap
                    damageMap={formData.damageMap}
                    onChange={(map) => updateField("damageMap", map)}
                    paintThicknessAvailable={formData.paintThicknessAvailable}
                    paintThickness={formData.paintThickness}
                    onPaintThicknessChange={(map) => updateField("paintThickness", map)}
                  />
                </>
              )}
              {isFieldVisibleForType("paintThickness", getFormTypeLabel(formData.vehicleType)) && (
                <>
                  <FormBinaryState
                    label="Lackdickenmessung vorhanden"
                    value={formData.paintThicknessAvailable}
                    onChange={(val) => updateField("paintThicknessAvailable", val)}
                  />
                  {formData.paintThicknessAvailable === true && (
                    <PaintThicknessInfoButton />
                  )}
                </>
              )}
              {isFieldVisibleForType("paintThickness", getFormTypeLabel(formData.vehicleType)) && formData.paintThicknessAvailable === true && (
                    <div>
                      <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">Messprotokoll-Foto</label>
                      <p className="text-sm text-[#737373] dark:text-[#8a8a8a] mb-2">Foto des Lackdickenmessprotokolls hochladen</p>
                      {formData.paintThicknessImage ? (
                        <div className="relative inline-block">
                          <img
                            src={formData.paintThicknessImage}
                            alt="Messprotokoll"
                            className="w-32 h-32 object-cover rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a]"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 w-6 h-6 bg-[#f14011] text-white rounded-full text-xs flex items-center justify-center hover:bg-[#d63a0f]"
                            onClick={() => updateField("paintThicknessImage", "")}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-[#d4d4d4] dark:border-[#3d3d3d] rounded-xl cursor-pointer hover:border-[#f14011] transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                alert("Bild darf maximal 5MB groß sein");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  updateField("paintThicknessImage", reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <div className="text-center">
                            <CameraIcon className="w-6 h-6 mx-auto text-[#a3a3a3] dark:text-[#737373] mb-1" />
                            <span className="text-xs text-[#a3a3a3] dark:text-[#737373]">Foto</span>
                          </div>
                        </label>
                      )}
                    </div>
                  )}
            </FormSection>

            {/* Safety */}
            <FormSection title="Sicherheit" icon="🛡️">
              {isFieldVisibleForType("airbags", getFormTypeLabel(formData.vehicleType)) && (
                <FormFeatureSelect
                  label="Airbags"
                  features={AIRBAG_FEATURES}
                  selected={formData.airbags}
                  onChange={(selected) => updateField("airbags", selected)}
                />
              )}
              {isFieldVisibleForType("parkingAid", getFormTypeLabel(formData.vehicleType)) && (
                <FormFeatureSelect
                  label="Einparkhilfe"
                  features={PARKING_AID_FEATURES}
                  selected={formData.parkingAid}
                  onChange={(selected) => updateField("parkingAid", selected)}
                />
              )}
              {(isFieldVisibleForType("cameraFront", getFormTypeLabel(formData.vehicleType)) || isFieldVisibleForType("cameraRear", getFormTypeLabel(formData.vehicleType))) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {isFieldVisibleForType("cameraFront", getFormTypeLabel(formData.vehicleType)) && (
                    <FormBinaryState
                      label="Kamera vorne"
                      value={formData.cameraFront}
                      onChange={(val) => updateField("cameraFront", val)}
                    />
                  )}
                  {isFieldVisibleForType("cameraRear", getFormTypeLabel(formData.vehicleType)) && (
                    <FormBinaryState
                      label="Kamera hinten"
                      value={formData.cameraRear}
                      onChange={(val) => updateField("cameraRear", val)}
                    />
                  )}
                </div>
              )}
              <FormFeatureSelectWithOther
                label="Sicherheitsausstattung"
                features={getSafetyFeaturesForType(getFormTypeLabel(formData.vehicleType), [], [getFormCategoryLabel(formData.vehicleType, formData.vehicleCategory)])}
                selected={formData.safetyFeatures}
                onChange={(selected) => updateField("safetyFeatures", selected)}
                otherValue={formData.safetyOther}
                onOtherChange={(val) => updateField("safetyOther", val)}
              />
            </FormSection>

            {/* Features */}
            <FormSection title="Ausstattung" icon="✨">
              {formData.vehicleType !== "motorcycle" && (
                <div>
                  <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-3">Klimaanlage / Klimaautomatik</label>
                  <select
                    value={formData.comfortFeatures.find((f) => CLIMATE_OPTIONS.includes(f)) || ""}
                    onChange={(e) => {
                      const without = formData.comfortFeatures.filter((f) => !CLIMATE_OPTIONS.includes(f));
                      if (e.target.value) {
                        updateField("comfortFeatures", [...without, e.target.value]);
                      } else {
                        updateField("comfortFeatures", without);
                      }
                    }}
                    className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#f14011] focus:border-transparent"
                  >
                    <option value="">Keine</option>
                    {CLIMATE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}
              <FormFeatureSelectWithOther
                label="Komfort"
                features={getComfortFeaturesForType(getFormTypeLabel(formData.vehicleType), [], [getFormCategoryLabel(formData.vehicleType, formData.vehicleCategory)]).filter((f) => !CLIMATE_OPTIONS.includes(f))}
                selected={formData.comfortFeatures}
                onChange={(selected) => updateField("comfortFeatures", selected)}
                otherValue={formData.comfortOther}
                onOtherChange={(val) => updateField("comfortOther", val)}
              />
              <FormFeatureSelectWithOther
                label="Exterieur"
                features={getExteriorFeaturesForType(getFormTypeLabel(formData.vehicleType), [], [getFormCategoryLabel(formData.vehicleType, formData.vehicleCategory)])}
                selected={formData.exteriorFeatures}
                onChange={(selected) => updateField("exteriorFeatures", selected)}
                otherValue={formData.exteriorOther}
                onOtherChange={(val) => updateField("exteriorOther", val)}
              />
              <FormFeatureSelectWithOther
                label="Multimedia"
                features={getMultimediaFeaturesForType(getFormTypeLabel(formData.vehicleType), [], [getFormCategoryLabel(formData.vehicleType, formData.vehicleCategory)])}
                selected={formData.multimediaFeatures}
                onChange={(selected) => updateField("multimediaFeatures", selected)}
                otherValue={formData.multimediaOther}
                onOtherChange={(val) => updateField("multimediaOther", val)}
              />
            </FormSection>

            <FormSection title="Bilder" icon="📷" defaultOpen>
              <ImageUpload images={images} onChange={setImages} />
            </FormSection>

            {/* Description */}
            <FormSection title="Beschreibung" icon="📝" defaultOpen>
              <div>
                <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">{getVehicleNoun(getFormTypeLabel(formData.vehicleType))}beschreibung</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    disabled={!formData.brand || !formData.model}
                    onClick={() => {
                      if (formData.description.trim()) {
                        if (!window.confirm("Bestehende Beschreibung ersetzen?")) return;
                      }
                      const text = generateDescription(formData, images.length);
                      updateField("description", text);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                    Beschreibung generieren
                  </button>
                  {formData.description.trim() && (
                    <button
                      type="button"
                      disabled={!formData.brand || !formData.model}
                      onClick={() => {
                        const text = generateDescription(formData, images.length);
                        updateField("description", text);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#525252] dark:text-[#a3a3a3] bg-[#f5f5f5] dark:bg-[#1f1f1f] hover:bg-[#e5e5e5] transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                      </svg>
                      Neu generieren
                    </button>
                  )}
                </div>
                {!formData.brand || !formData.model ? (
                  <p className="text-sm text-amber-600 mb-3">Bitte zuerst Marke und Modell auswählen, um eine Beschreibung zu generieren.</p>
                ) : (() => {
                  const completeness = checkCompleteness(formData);
                  if (completeness.missingTips.length > 0 && !formData.description.trim()) {
                    return (
                      <p className="text-sm text-[#737373] dark:text-[#8a8a8a] mb-3">
                        💡 Tipp: Fülle weitere Felder aus für eine bessere Beschreibung ({completeness.missingTips.slice(0, 3).join(", ")})
                      </p>
                    );
                  }
                  return null;
                })()}
                <textarea
                  rows={8}
                  className="input !rounded-2xl resize-none"
                  placeholder={`Erzähl uns mehr über dein ${getVehicleNoun(getFormTypeLabel(formData.vehicleType))}: besondere Ausstattung, Wartungshistorie, Gründe für den Verkauf, etc.`}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  maxLength={5000}
                />
                <p className="text-sm text-[#737373] dark:text-[#8a8a8a] mt-1">{formData.description.length}/5000 Zeichen</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0a0a0a] dark:text-[#ededed] mb-2">Extras / Sonderausstattung</label>
                <textarea
                  rows={3}
                  className="input !rounded-2xl resize-none"
                  placeholder="Weitere Extras, die nicht in den Kategorien oben aufgeführt sind..."
                  value={formData.extras}
                  onChange={(e) => updateField("extras", e.target.value)}
                  maxLength={2000}
                />
              </div>
            </FormSection>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
              </>
            ) : (
              <>
                Zur Prüfung einreichen
                <ChevronRightIcon className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#737373] dark:text-[#8a8a8a]">
            Mit der Einreichung stimmst du unseren AGB und Datenschutzbestimmungen zu.
          </p>
        </form>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

function Footer() {
  const footerLinks = [
    {
      title: "Unternehmen",
      links: [
        { label: "Über uns", href: "#about" },
        { label: "So funktioniert's", href: "#how-it-works" },
        { label: "Presse", href: "#" },
      ],
    },
    {
      title: "Verkäufer",
      links: [
        { label: "Fahrzeug einreichen", href: "#submit" },
        { label: "Preise", href: "#" },
        { label: "Für Händler", href: "#sellers" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Hilfe-Center", href: "#" },
        { label: "Kontakt", href: "#contact" },
        { label: "FAQ", href: "#" },
        { label: "Sicherheitstipps", href: "#" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#f14011] rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-lg tracking-wider">H</span>
              </div>
              <span className="font-display text-2xl tracking-wide">HITMIT</span>
            </div>
            <p className="text-[#a3a3a3] dark:text-[#737373] mb-6 max-w-sm">
              Der moderne Auto-Marktplatz. Verkaufe dein Fahrzeug über die Kraft von Social Media.
              Erreiche tausende Käufer auf TikTok und Instagram.
            </p>
            <div className="flex gap-4">
              <a
                href="https://tiktok.com/@hitmit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f14011] transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/hitmit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#f14011] transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-white mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#a3a3a3] dark:text-[#737373] hover:text-[#f14011] transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#737373] dark:text-[#8a8a8a] text-sm">
            &copy; {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#737373] dark:text-[#8a8a8a] hover:text-white text-sm transition-colors">
              Datenschutz
            </a>
            <a href="#" className="text-[#737373] dark:text-[#8a8a8a] hover:text-white text-sm transition-colors">
              AGB
            </a>
            <a href="#" className="text-[#737373] dark:text-[#8a8a8a] hover:text-white text-sm transition-colors">
              Cookie-Richtlinie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Home() {
  const [authUser, setAuthUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Header
        authUser={authUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={() => setAuthUser(null)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(user) => setAuthUser(user)}
      />
      <HeroSection />
      <HowItWorksSection />
      <SellerTypesSection />
      <SocialCTASection />
      <SubmitFormSection />
      <Footer />
    </main>
  );
}
