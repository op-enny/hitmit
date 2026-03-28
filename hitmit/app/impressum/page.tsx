"use client";

import { SubpageHeader } from "../subpage-header";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <SubpageHeader />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-gray-900 dark:text-[#ededed] animate-fade-in-up">
          Impressum
        </h1>

        <div className="mt-8 space-y-8 text-gray-700 dark:text-gray-300 animate-fade-in-up" style={{ opacity: 0, animationDelay: "100ms" }}>
          <div>
            <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed] mb-2">
              Angaben gem&auml;&szlig; &sect; 5 TMG
            </h2>
            <p>
              HITMIT GmbH<br />
              Musterstra&szlig;e 42<br />
              80331 M&uuml;nchen<br />
              Deutschland
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed] mb-2">
              Vertreten durch
            </h2>
            <p>Gesch&auml;ftsf&uuml;hrer: Max Mustermann</p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed] mb-2">
              Kontakt
            </h2>
            <p>
              Telefon: +49 (0) 89 123456-0<br />
              E-Mail: info@hitmit.de
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed] mb-2">
              Registereintrag
            </h2>
            <p>
              Eintragung im Handelsregister<br />
              Registergericht: Amtsgericht M&uuml;nchen<br />
              Registernummer: HRB 123456
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed] mb-2">
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gem&auml;&szlig; &sect; 27a UStG:<br />
              DE 123 456 789
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wider text-gray-900 dark:text-[#ededed] mb-2">
              Haftungsausschluss
            </h2>
            <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mt-3 mb-1">Haftung f&uuml;r Inhalte</h3>
            <p className="text-sm leading-relaxed">
              Die Inhalte unserer Seiten wurden mit gr&ouml;&szlig;ter Sorgfalt erstellt. F&uuml;r die Richtigkeit,
              Vollst&auml;ndigkeit und Aktualit&auml;t der Inhalte k&ouml;nnen wir jedoch keine Gew&auml;hr &uuml;bernehmen.
              Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs. 1 TMG f&uuml;r eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>

            <h3 className="font-semibold text-gray-900 dark:text-[#ededed] mt-3 mb-1">Haftung f&uuml;r Links</h3>
            <p className="text-sm leading-relaxed">
              Unser Angebot enth&auml;lt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr
              &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-[#2a2a2a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} HITMIT. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
