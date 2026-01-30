"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
// HEADER COMPONENT
// ============================================================================

function Header() {
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
    { label: "So funktioniert's", href: "#how-it-works" },
    { label: "Für Verkäufer", href: "#sellers" },
    { label: "Highlights", href: "#featured" },
    { label: "Über uns", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#0a0a0a] rounded-xl flex items-center justify-center group-hover:bg-[#f14011] transition-colors duration-300">
              <span className="text-white font-display text-lg tracking-wider">H</span>
            </div>
            <span className="font-display text-2xl tracking-wide text-[#0a0a0a]">HITMIT</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#525252] font-medium text-sm hover:text-[#f14011] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="#contact" className="text-[#0a0a0a] font-semibold text-sm hover:text-[#f14011] transition-colors">
              Kontakt
            </a>
            <a
              href="#submit"
              className="btn btn-primary btn-md"
            >
              Auto einreichen
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#0a0a0a]"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white border-t border-[#e5e5e5] shadow-xl animate-fade-in-down">
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-[#525252] font-medium text-lg hover:text-[#f14011] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-[#e5e5e5]">
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
        <span className="font-display text-[20vw] text-[#0a0a0a]/[0.02] tracking-tight">
          HITMIT
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
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
              <span className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.9] tracking-tight text-[#0a0a0a] block">
                VERKAUFE DEIN
              </span>
              <span className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.9] tracking-tight block">
                <span className="text-[#0a0a0a]">AUTO </span>
                <span className="italic text-[#f14011]">SCHNELL</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#525252] max-w-lg leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              Reiche dein Fahrzeug ein und erreiche tausende potenzielle Käufer über unsere TikTok- und Instagram-Kanäle.
              Privatverkäufer und Händler willkommen.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              <a href="#submit" className="btn btn-primary btn-xl group">
                Auto einreichen
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#how-it-works" className="btn btn-ghost btn-xl">
                <PlayIcon className="w-5 h-5" />
                So funktioniert&apos;s
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
                <p className="text-sm font-semibold text-[#0a0a0a]">500+ Fahrzeuge verkauft</p>
                <p className="text-xs text-[#737373]">Werde Teil zufriedener Verkäufer</p>
              </div>
            </div>
          </div>

          {/* Hero Image / Visual */}
          <div className="relative animate-scale-in opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            {/* Main car showcase */}
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-8 border-2 border-dashed border-[#e5e5e5] rounded-full opacity-50" />

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
                <div className="absolute -top-4 -right-4 bg-[#f14011] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-float">
                  HIGHLIGHT
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 rounded-xl shadow-lg border border-[#e5e5e5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10b981]/10 rounded-lg flex items-center justify-center">
                      <CheckIcon className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#737373]">Durchschn. Verkaufszeit</p>
                      <p className="font-mono font-bold text-[#0a0a0a]">7 Tage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 lg:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-b border-[#e5e5e5]">
          {[
            { value: 50, suffix: "+", label: "Verkäufe pro Monat" },
            { value: 30, suffix: "+", label: "Automarken" },
            { value: 10, suffix: "K+", label: "Follower" },
            { value: 98, suffix: "%", label: "Zufriedene Verkäufer" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-4xl md:text-5xl text-[#0a0a0a]">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-[#737373] mt-1">{stat.label}</p>
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
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#fdd8d0] text-[#b72b0b] rounded-full text-sm font-semibold mb-4">
            Einfacher Prozess
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-[#0a0a0a] mb-4">
            SO <span className="italic text-[#f14011]">FUNKTIONIERT&apos;S</span>
          </h2>
          <p className="text-lg text-[#525252]">
            Auto verkaufen war noch nie so einfach. Unser optimierter Prozess bringt dein Fahrzeug vor tausende potenzielle Käufer.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] hover:border-[#f14011] transition-all duration-300 hover:shadow-xl"
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
              <h3 className="font-display text-xl text-[#0a0a0a] mb-3">{step.title}</h3>
              <p className="text-[#525252] leading-relaxed">{step.description}</p>

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-[#e5e5e5]" />
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

      <div className="relative max-w-7xl mx-auto px-6">
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
            <p className="text-lg text-[#a3a3a3] mb-8 max-w-lg">
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
                  <p className="text-[#a3a3a3]">
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
                  <p className="text-[#a3a3a3]">
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

        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0a0a0a] mb-6">
          FOLGE UNS AUF<br />
          <span className="italic text-[#f14011]">SOCIAL MEDIA</span>
        </h2>

        <p className="text-lg text-[#525252] mb-10 max-w-2xl mx-auto">
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
          <div className="flex items-center gap-2 text-[#525252]">
            <svg className="w-5 h-5 text-[#f14011]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-sm font-medium">50K+ Likes</span>
          </div>
          <div className="flex items-center gap-2 text-[#525252]">
            <svg className="w-5 h-5 text-[#f14011]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path fillRule="evenodd" d="M1.5 9.75v6.75a3 3 0 003 3h15a3 3 0 003-3V9.75H1.5zm1.5 4.5a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 010 3H4.5a1.5 1.5 0 01-1.5-1.5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">1M+ Aufrufe</span>
          </div>
          <div className="flex items-center gap-2 text-[#525252]">
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
// SUBMIT FORM SECTION
// ============================================================================

function SubmitFormSection() {
  const [formData, setFormData] = useState({
    sellerType: "",
    name: "",
    email: "",
    phone: "",
    carMake: "",
    carModel: "",
    year: "",
    price: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Vielen Dank für deine Einreichung! Wir melden uns innerhalb von 24 Stunden.");
  };

  return (
    <section id="submit" className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#fdd8d0] text-[#b72b0b] rounded-full text-sm font-semibold mb-4">
            Jetzt verkaufen
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-[#0a0a0a] mb-4">
            FAHRZEUG <span className="italic text-[#f14011]">EINREICHEN</span>
          </h2>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto">
            Fülle das Formular aus und unser Team prüft deine Einreichung innerhalb von 24 Stunden.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Seller Type */}
          <div>
            <label className="block text-sm font-semibold text-[#0a0a0a] mb-3">Ich bin...</label>
            <div className="grid grid-cols-2 gap-4">
              {["Privatverkäufer", "Händler/Gewerbe"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, sellerType: type })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.sellerType === type
                      ? "border-[#f14011] bg-[#fef2ef]"
                      : "border-[#e5e5e5] hover:border-[#d4d4d4]"
                  }`}
                >
                  <span className={`font-semibold ${formData.sellerType === type ? "text-[#f14011]" : "text-[#0a0a0a]"}`}>
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Vollständiger Name</label>
              <input
                type="text"
                required
                className="input"
                placeholder="Max Mustermann"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">E-Mail</label>
              <input
                type="email"
                required
                className="input"
                placeholder="max@beispiel.de"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Telefonnummer</label>
            <input
              type="tel"
              required
              className="input"
              placeholder="+49 170 1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Vehicle Info */}
          <div className="pt-6 border-t border-[#e5e5e5]">
            <h3 className="font-display text-2xl text-[#0a0a0a] mb-6">Fahrzeugdaten</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Marke</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="z.B. BMW, VW, Mercedes"
                  value={formData.carMake}
                  onChange={(e) => setFormData({ ...formData, carMake: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Modell</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="z.B. M4, Golf, C-Klasse"
                  value={formData.carModel}
                  onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Baujahr</label>
                <input
                  type="number"
                  required
                  className="input"
                  placeholder="2024"
                  min="1900"
                  max="2025"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Preis (€)</label>
                <input
                  type="number"
                  required
                  className="input"
                  placeholder="50000"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">Beschreibung</label>
              <textarea
                rows={4}
                className="input !rounded-2xl resize-none"
                placeholder="Erzähl uns mehr über dein Fahrzeug: Kilometerstand, Zustand, Ausstattung, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-xl w-full">
            Zur Prüfung einreichen
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          <p className="text-center text-sm text-[#737373]">
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
        { label: "Karriere", href: "#" },
        { label: "Presse", href: "#" },
      ],
    },
    {
      title: "Verkäufer",
      links: [
        { label: "Fahrzeug einreichen", href: "#submit" },
        { label: "Preise", href: "#" },
        { label: "Für Händler", href: "#sellers" },
        { label: "Erfolgsgeschichten", href: "#" },
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
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#f14011] rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-lg tracking-wider">H</span>
              </div>
              <span className="font-display text-2xl tracking-wide">HITMIT</span>
            </div>
            <p className="text-[#a3a3a3] mb-6 max-w-sm">
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
                      className="text-[#a3a3a3] hover:text-[#f14011] transition-colors text-sm"
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
          <p className="text-[#737373] text-sm">
            &copy; {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#737373] hover:text-white text-sm transition-colors">
              Datenschutz
            </a>
            <a href="#" className="text-[#737373] hover:text-white text-sm transition-colors">
              AGB
            </a>
            <a href="#" className="text-[#737373] hover:text-white text-sm transition-colors">
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
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <SellerTypesSection />
      <SocialCTASection />
      <SubmitFormSection />
      <Footer />
    </main>
  );
}
