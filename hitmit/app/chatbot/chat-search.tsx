"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { parseUserQuery, matchVehicles, generateBotResponse, type ScoredVehicle } from "./chat-engine";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  vehicles?: ScoredVehicle[];
  suggestions?: string[];
}

const INITIAL_SUGGESTIONS = ["SUV unter 50.000 €", "Elektroauto", "Sportwagen", "Alle Fahrzeuge"];

export function ChatSearch() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Hallo! Ich helfe dir, das passende Fahrzeug zu finden. Beschreibe einfach, wonach du suchst — z.B. *\"BMW unter 50.000 €\"* oder *\"Elektroauto mit Allrad\"*.",
      suggestions: INITIAL_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

    const delay = 500 + Math.random() * 300;
    setTimeout(() => {
      const query = parseUserQuery(text);
      const results = matchVehicles(query);
      const response = generateBotResponse(query, results);

      const botMsg: Message = {
        id: nextId.current++,
        role: "bot",
        text: response.text,
        vehicles: response.vehicles,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, delay);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;
    processQuery(trimmed);
  };

  const handleSuggestion = (s: string) => {
    if (typing) return;
    processQuery(s);
  };

  return (
    <>
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#f14011] px-3.5 py-2 text-sm text-white">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2 text-sm text-gray-800 dark:bg-[#1f1f1f] dark:text-gray-200">
                  <BotText text={msg.text} />
                </div>

                {/* Vehicle cards */}
                {msg.vehicles && msg.vehicles.length > 0 && (
                  <div className="space-y-2">
                    {msg.vehicles.map(({ vehicle: v, score }) => (
                      <VehicleCard key={v.id} vehicle={v} score={score} />
                    ))}
                  </div>
                )}

                {/* Suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-[#f14011] hover:text-[#f14011] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:border-[#f14011] dark:hover:text-[#f14011]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
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
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="z.B. BMW unter 50.000 €"
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
// SUBCOMPONENTS
// ============================================================================

function BotText({ text }: { text: string }) {
  // Simple markdown-like bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        // Handle newlines
        return part.split("\n").map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </span>
        ));
      })}
    </span>
  );
}

function VehicleCard({ vehicle: v, score }: { vehicle: ScoredVehicle["vehicle"]; score: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#2a2a2a]">
      {/* Gradient accent stripe */}
      <div className={`h-1 bg-gradient-to-r ${v.gradient}`} />
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {v.brand} {v.model}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {v.variant} · {v.year}
            </p>
          </div>
          <span className="font-display shrink-0 text-base text-[#f14011]">
            {v.price.toLocaleString("de-DE")} €
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span>{v.powerPs} PS</span>
          <span>{v.mileage.toLocaleString("de-DE")} km</span>
          <span>{v.fuelType}</span>
          <span>{v.city}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Übereinstimmung: {score}%
          </span>
          <a
            href={`/suchen?brand=${encodeURIComponent(v.brand)}&model=${encodeURIComponent(v.model)}`}
            className="text-[11px] font-semibold text-[#f14011] hover:underline"
          >
            Details →
          </a>
        </div>
      </div>
    </div>
  );
}
