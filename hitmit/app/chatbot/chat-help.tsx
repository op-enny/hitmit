"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================================
// FAQ DATABASE
// ============================================================================

interface FaqEntry {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
}

const FAQ_DATABASE: FaqEntry[] = [
  {
    id: "submit",
    label: "Fahrzeug einreichen",
    keywords: ["einreichen", "inserieren", "inserieren", "einstellen", "verkaufen", "inserat", "anbieten", "anmelden", "hochladen"],
    answer: 'Um dein Fahrzeug auf HITMIT einzureichen, klicke auf **\u201EInserat einreichen\u201C** im Menü. Fülle das Formular mit allen Fahrzeugdaten aus, lade Fotos hoch und sende es ab. Unser Team prüft dein Inserat und veröffentlicht es anschließend auf unseren Social-Media-Kanälen.',
  },
  {
    id: "search",
    label: "Fahrzeug suchen",
    keywords: ["suchen", "suche", "finden", "filter", "filtern", "stöbern", "durchsuchen", "angebote"],
    answer: 'Gehe auf **\u201ESuchen\u201C** im Menü. Dort kannst du nach Marke, Modell, Preis, Kraftstoff, Getriebe und vielen weiteren Kriterien filtern. Du kannst Suchergebnisse auch speichern, um später benachrichtigt zu werden.',
  },
  {
    id: "costs",
    label: "Kosten & Gebühren",
    keywords: ["kosten", "gebühr", "gebühren", "preis", "bezahlen", "geld", "kostenlos", "gratis", "kostet", "zahlen", "provision"],
    answer: "Das Einreichen eines Inserats auf HITMIT ist **kostenlos**. Wir finanzieren uns über optionale Premium-Platzierungen und Händlerpartnerschaften. Es fallen keine versteckten Gebühren für Privatverkäufer an.",
  },
  {
    id: "saved",
    label: "Gespeicherte Suchen",
    keywords: ["gespeichert", "speichern", "merken", "favorit", "favoriten", "watchlist", "beobachten", "merkliste"],
    answer: 'Du kannst Suchfilter und einzelne Fahrzeuge als **Favoriten speichern**. Gehe dazu auf \u201ESuchen\u201C, stelle deine Filter ein und klicke auf \u201ESuche speichern\u201C. Gespeicherte Suchen findest du unter **\u201EGespeichert\u201C** im Menü.',
  },
  {
    id: "contact",
    label: "Verkäufer kontaktieren",
    keywords: ["kontakt", "kontaktieren", "anrufen", "schreiben", "telefon", "email", "nachricht", "erreichen", "melden"],
    answer: "Auf der Fahrzeug-Detailseite findest du die Kontaktdaten des Verkäufers (sofern freigegeben). Du kannst den Verkäufer per **Telefon oder E-Mail** direkt kontaktieren. HITMIT vermittelt keinen Kontakt \u2014 der Austausch findet direkt zwischen Käufer und Verkäufer statt.",
  },
  {
    id: "valuation",
    label: "Preis-Bewertung",
    keywords: ["bewertung", "bewerten", "wert", "marktwert", "preis-check", "preischeck", "fair", "günstig", "teuer", "angemessen"],
    answer: "HITMIT bietet eine automatische **Preis-Bewertung** für jedes Fahrzeug. Diese zeigt dir, ob der Preis fair, günstig oder eher hoch ist \u2014 basierend auf Marke, Modell, Alter, Kilometerstand und Zustand.",
  },
  {
    id: "about",
    label: "Was ist HITMIT?",
    keywords: ["hitmit", "was ist", "wer seid", "plattform", "über uns", "konzept", "idee", "wie funktioniert"],
    answer: "**HITMIT** ist ein moderner Auto-Marktplatz, der Fahrzeuge über **TikTok und Instagram** vermarktet. Verkäufer reichen ihr Inserat ein, und wir präsentieren es auf unseren Social-Media-Kanälen \u2014 so erreichen Fahrzeuge tausende potenzielle Käufer.",
  },
  {
    id: "dealer",
    label: "Für Händler",
    keywords: ["händler", "autohaus", "dealer", "gewerblich", "unternehmen", "b2b", "händlerkonto", "partner"],
    answer: 'Händler können HITMIT nutzen, um ihre Fahrzeuge über Social Media zu vermarkten. Wähle beim Einreichen einfach **\u201EGewerblich/Händler\u201C** als Verkäufertyp. Für größere Kontingente und Premium-Platzierungen kontaktiere uns gerne direkt.',
  },
];

// ============================================================================
// KEYWORD MATCHER
// ============================================================================

function findFaqAnswer(input: string): FaqEntry | null {
  const q = input.toLowerCase().trim();
  let bestMatch: FaqEntry | null = null;
  let bestScore = 0;

  for (const faq of FAQ_DATABASE) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (q.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

const QUICK_ACTIONS = ["Was ist HITMIT?", "Fahrzeug einreichen", "Kosten & Gebühren", "Für Händler"];

export function ChatHelp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Willkommen! Ich beantworte deine Fragen rund um HITMIT. Wähle ein Thema oder stelle eine Frage.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const processQuery = useCallback((text: string) => {
    const userMsg: Message = { id: nextId.current++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 400 + Math.random() * 300;
    setTimeout(() => {
      const faq = findFaqAnswer(text);
      const answer = faq
        ? faq.answer
        : "Das konnte ich leider nicht zuordnen. Versuche es mit einem der Themen oben oder formuliere deine Frage anders. Du kannst uns auch direkt über unsere Social-Media-Kanäle kontaktieren!";

      setMessages((prev) => [...prev, { id: nextId.current++, role: "bot", text: answer }]);
      setTyping(false);
    }, delay);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    processQuery(trimmed);
  };

  return (
    <>
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#f14011] px-3.5 py-2 text-sm text-white">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2 text-sm text-gray-800 dark:bg-[#1f1f1f] dark:text-gray-200">
                <BotText text={msg.text} />
              </div>
            )}

            {/* Quick actions after first bot message */}
            {i === 0 && msg.role === "bot" && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => processQuery(action)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-[#f14011] hover:text-[#f14011] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:border-[#f14011] dark:hover:text-[#f14011]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2.5 dark:bg-[#1f1f1f]">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 [animation-delay:0.15s]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400 [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 px-3 py-2.5 dark:border-[#2a2a2a]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Stelle eine Frage..."
          disabled={typing}
          className="input flex-1 !rounded-full !py-2 !text-sm"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f14011] text-white transition-opacity disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </>
  );
}

// ============================================================================
// BOT TEXT RENDERER
// ============================================================================

function BotText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
