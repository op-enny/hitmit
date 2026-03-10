"use client";

import { useState, useCallback } from "react";
import { ChatSearch } from "./chat-search";
import { ChatHelp } from "./chat-help";

type Tab = "search" | "help";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("search");

  const toggle = useCallback(() => setOpen((o) => !o), []);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        aria-label={open ? "Chat schließen" : "Chat öffnen"}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#f14011] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[60] flex w-[calc(100vw-3rem)] max-w-[400px] animate-scale-in flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:h-[550px] dark:border-[#2a2a2a] dark:bg-[#141414]"
          style={{ height: "min(550px, calc(100vh - 8rem))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-[#2a2a2a]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f14011] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-heading text-lg tracking-wide text-gray-900 dark:text-white">HITMIT Assistent</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-[#2a2a2a]">
            <button
              onClick={() => setTab("search")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === "search"
                  ? "border-b-2 border-[#f14011] text-[#f14011]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Fahrzeugsuche
            </button>
            <button
              onClick={() => setTab("help")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === "help"
                  ? "border-b-2 border-[#f14011] text-[#f14011]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Hilfe
            </button>
          </div>

          {/* Tab content */}
          <div className="flex min-h-0 flex-1 flex-col">
            {tab === "search" ? <ChatSearch /> : <ChatHelp />}
          </div>
        </div>
      )}
    </>
  );
}
