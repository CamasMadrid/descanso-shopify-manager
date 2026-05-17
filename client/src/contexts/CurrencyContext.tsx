import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Currency = "EUR" | "USD" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Convert a EUR base price (number) to the selected currency and format it */
  formatPrice: (eurPrice: number) => string;
  /** Parse a "Desde 249€" string, convert, and return formatted string */
  convertPriceString: (priceStr: string) => string;
}

// Approximate fixed rates (EUR as base). Update periodically if needed.
const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
};

const SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

// "Desde" label per language — we keep it simple and use the stored lang
const DESDE: Record<string, string> = {
  es: "Desde",
  en: "From",
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem("currency") as Currency | null;
      if (stored && ["EUR", "USD", "GBP"].includes(stored)) return stored;
    } catch {}
    return "EUR";
  });

  useEffect(() => {
    try { localStorage.setItem("currency", currency); } catch {}
  }, [currency]);

  const setCurrency = (c: Currency) => setCurrencyState(c);

  const formatPrice = (eurPrice: number): string => {
    const converted = Math.round(eurPrice * RATES[currency]);
    const sym = SYMBOLS[currency];
    // USD/GBP: symbol before number; EUR: number then symbol
    if (currency === "EUR") return `${converted}${sym}`;
    return `${sym}${converted}`;
  };

  /**
   * Parses strings like "Desde 249€" or "From €249" and converts.
   * Falls back to the original string if parsing fails.
   */
  const convertPriceString = (priceStr: string): string => {
    // Extract numeric value — look for digits (possibly with comma/dot)
    const match = priceStr.match(/(\d[\d.,]*)/);
    if (!match) return priceStr;
    const eurValue = parseFloat(match[1].replace(",", "."));
    if (isNaN(eurValue)) return priceStr;

    const converted = Math.round(eurValue * RATES[currency]);
    const sym = SYMBOLS[currency];

    // Detect the "Desde"/"From" prefix
    const lang = (() => { try { return localStorage.getItem("lang") ?? "es"; } catch { return "es"; } })();
    const prefix = DESDE[lang] ?? "Desde";

    if (currency === "EUR") return `${prefix} ${converted}${sym}`;
    return `${prefix} ${sym}${converted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPriceString }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
