import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Truck, Clock, MapPin, Phone, Star, ChevronRight,
  Shield, CreditCard, Smartphone, Banknote, Package,
  CheckCircle, ArrowRight, MessageCircle, Gift
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/hero-48h-delivery-nwmBqks655ZGdDDfya8dbh.webp";
const LIFESTYLE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/lifestyle-bedroom-h6krn835mojxD4zXBGoKPq.webp";

const CANAPE_EXCELLENT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-excellent-clean-NSFixs2vvWmm2KZbrrBBqL.webp";
const CANAPE_PREMIUM = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-premium-v2-HdWMbhFnc8FSscqxCXzBZu.webp";
const CANAPE_ARTICULADO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-articulado-clean-eHwfxaXXiMCRYiXe3s7YjH.webp";
const COLCHON_VISCONUBE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-hybrid-hr-clean-967DAKq2PKQgB5zAs3fLUg.webp";
const COLCHON_VISCOGRAFENO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-new-memory-hr-clean-mC9twP9Jw4fHPT9PjuVUvr.webp";
const COLCHON_MACANUU = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-hybrid-hr-clean-967DAKq2PKQgB5zAs3fLUg.webp";
const BASE_LUCY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/base-lucy-clean-jXtnAsBSxs6PHZnBuQTXMB.webp";

const WHATSAPP_NUMBER = "34711204284";
const SHOPIFY_STORE = "descanso-rapido-castilla.myshopify.com";

// Shopify variant IDs — keyed by product handle then size
// Canapés/base use "width × length cm" keys (e.g. "90 × 190 cm")
// Mattresses already use full dimension labels
const SHOPIFY_VARIANTS: Record<string, Record<string, number>> = {
  "canape-excellent": {
    "90 × 190 cm": 53953966178645, "90 × 200 cm": 53953966178645,
    "105 × 190 cm": 53953966211413, "105 × 200 cm": 53953966211413,
    "135 × 190 cm": 53953966244181, "135 × 200 cm": 53953966244181,
    "150 × 190 cm": 53953966276949, "150 × 200 cm": 53953966276949,
  },
  "canape-premium": {
    "90 × 190 cm": 53953966539093, "90 × 200 cm": 53953966539093,
    "135 × 190 cm": 53953966604629, "135 × 200 cm": 53953966604629,
    "150 × 190 cm": 53953966637397, "150 × 200 cm": 53953966637397,
  },
  "canape-articulado": {
    "135 × 190 cm": 53953966899541, "135 × 200 cm": 53953966899541,
    "150 × 190 cm": 53953966932309, "150 × 200 cm": 53953966932309,
    "160 × 190 cm": 53953966965077, "160 × 200 cm": 53953966965077,
    "180 × 190 cm": 53953966997845, "180 × 200 cm": 53953966997845,
  },
  "colchon-visconube": {
    "80/90 × 180/190 cm": 53994462118229, "80/90 × 200 cm": 53994462150997,
    "105 × 180/190 cm": 53994462183765, "105 × 200 cm": 53994462216533,
    "120 × 180/190 cm": 53994462249301, "120 × 200 cm": 53994462282069,
    "135 × 180/190 cm": 53994462314837, "135 × 200 cm": 53994462347605,
    "150 × 180/190 cm": 53994462380373, "150 × 200 cm": 53994462413141,
  },
  "colchon-viscografeno": {
    "80/90 × 180/190 cm": 53994462609749, "80/90 × 200 cm": 53994462642517,
    "105 × 180/190 cm": 53994462675285, "105 × 200 cm": 53994462708053,
    "120/135 × 180/190 cm": 53994462740821, "120/135 × 200 cm": 53994462773589,
    "150 × 180/190 cm": 53994462806357, "150 × 200 cm": 53994462839125,
  },
  "colchon-macanuu": {
    "80 × 180/190 cm": 53994463035733, "80 × 200 cm": 53994463068501,
    "90 × 180/190 cm": 53994463101269, "90 × 200 cm": 53994463134037,
    "105 × 180/190 cm": 53994463166805, "105 × 200 cm": 53994463199573,
    "120 × 180/190 cm": 53994463232341, "120 × 200 cm": 53994463265109,
    "135 × 180/190 cm": 53994463297877, "135 × 200 cm": 53994463330645,
    "150 × 180/190 cm": 53994463363413, "150 × 200 cm": 53994463396181,
  },
  "base-lucy": {
    "90 × 190 cm": 53953967620437, "90 × 200 cm": 53953967620437,
    "105 × 190 cm": 53953967653205, "105 × 200 cm": 53953967653205,
    "135 × 190 cm": 53953967685973, "135 × 200 cm": 53953967685973,
    "150 × 190 cm": 53953967718741, "150 × 200 cm": 53953967718741,
  },
};

const productImages: Record<string, string> = {
  "canape-excellent": CANAPE_EXCELLENT,
  "canape-premium": CANAPE_PREMIUM,
  "canape-articulado": CANAPE_ARTICULADO,
  "colchon-visconube": COLCHON_VISCONUBE,
  "colchon-viscografeno": COLCHON_VISCOGRAFENO,
  "colchon-macanuu": COLCHON_MACANUU,
  "base-lucy": BASE_LUCY,
};

const productMeta = [
  { id: "colchon-macanuu",      badgeColor: "bg-teal-100 text-teal-800",   sizes: ["90 × 190 cm", "90 × 200 cm", "105 × 190 cm", "105 × 200 cm", "135 × 190 cm", "135 × 200 cm", "150 × 190 cm", "150 × 200 cm"], price: "Desde 209€", category: "colchones", deliveryDays: null },
  { id: "colchon-visconube",    badgeColor: "bg-green-100 text-green-800",  sizes: ["90 × 190 cm", "90 × 200 cm", "105 × 190 cm", "105 × 200 cm", "135 × 190 cm", "135 × 200 cm", "150 × 190 cm", "150 × 200 cm"], price: "Desde 189€", category: "colchones", deliveryDays: null },
  { id: "colchon-viscografeno", badgeColor: "bg-slate-100 text-slate-700",  sizes: ["90 × 190 cm", "90 × 200 cm", "105 × 190 cm", "105 × 200 cm", "135 × 190 cm", "135 × 200 cm", "150 × 190 cm", "150 × 200 cm"], price: "Desde 299€", category: "colchones", deliveryDays: null },
  { id: "canape-excellent",  badgeColor: "bg-amber-100 text-amber-800",  sizes: ["90cm", "105cm", "135cm", "150cm"], price: "Desde 399€", category: "canapes",   deliveryDays: null, hasLength: true },
  { id: "canape-premium",   badgeColor: "bg-slate-100 text-slate-700",  sizes: ["90cm", "135cm", "150cm"],            price: "Desde 329€", category: "canapes",   deliveryDays: null, hasLength: true },
  { id: "canape-articulado",badgeColor: "bg-blue-100 text-blue-800",    sizes: ["135cm", "150cm", "160cm", "180cm"],  price: "Desde 499€", category: "canapes",   deliveryDays: "5–10", hasLength: true },
  { id: "base-lucy",        badgeColor: "bg-purple-100 text-purple-700",sizes: ["90cm", "105cm", "135cm", "150cm"],                    price: "Desde 139€", category: "bases",    deliveryDays: null, hasLength: true },
];

const areas = ["Fuenlabrada", "Leganés", "Getafe", "Móstoles", "Alcorcón", "Parla", "Humanes", "Griñón", "Arroyomolinos", "Alcalá de Henares", "Torrejón", "Pozuelo", "Majadahonda", "Rivas", "Valdemoro"];

const testimonialNames = [
  { name: "María G.", location: "Fuenlabrada" },
  { name: "Carlos R.", location: "Leganés" },
  { name: "Ana M.", location: "Getafe" },
];

// Base EUR prices for each product — starting (smallest) price
// Formula: cost × 2 × 1.21 (inc. 21% VAT), rounded to nearest €9
const BASE_PRICES: Record<string, number> = {
  "colchon-visconube":    189,
  "colchon-viscografeno": 299,
  "colchon-macanuu":      209,
  "canape-excellent":     399,
  "canape-premium":       329,
  "canape-articulado":    499,
  "base-lucy":            139,
};

// Per-size EUR prices (same order as productMeta sizes arrays)
// Mattress sizes: 90×190, 90×200, 105×190, 105×200, 135×190, 135×200, 150×190, 150×200
const PRICES_BY_SIZE: Record<string, number[]> = {
  "colchon-visconube":    [189, 209, 209, 239, 239, 259, 259, 289],
  "colchon-viscografeno": [299, 329, 329, 359, 379, 419, 409, 439],
  "colchon-macanuu":      [209, 239, 239, 259, 279, 299, 309, 329],
  // canape/base: alternating [width×190, width×200] pairs per width
  "canape-excellent":     [399, 419, 409, 429, 419, 439, 449, 469],  // 90, 105, 135, 150
  "canape-premium":       [329, 349, 429, 449, 469, 489],             // 90, 135, 150
  "canape-articulado":    [499, 519, 549, 569, 629, 649, 699, 719],  // 135, 150, 160, 180
  "base-lucy":            [139, 149, 169, 179, 169, 179, 179, 189],  // 90, 105, 135, 150
};

export default function Home() {
  const { lang, setLang, t } = useLang();
  const { formatPrice } = useCurrency();
  const [activeCategory, setActiveCategory] = useState<"all" | "canapes" | "colchones" | "bases">("all");
  const [pillowModal, setPillowModal] = useState<{ open: boolean; productId: string; productName: string; variantId: number | null }>({ open: false, productId: "", productName: "", variantId: null });
  const [pillowChoice, setPillowChoice] = useState<"double" | "two-singles" | null>(null);
  const [pillowError, setPillowError] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedLengths, setSelectedLengths] = useState<Record<string, string>>({});
  const [sizeModal, setSizeModal] = useState<{ open: boolean; productId: string; productName: string }>({ open: false, productId: "", productName: "" });

  // Build the variant key: for products with a length dropdown, combine width + length
  const getVariantKey = (productId: string, width: string, length?: string) => {
    const meta = productMeta.find(p => p.id === productId);
    if (meta && (meta as any).hasLength) {
      const len = length ?? selectedLengths[productId] ?? "190";
      return `${width.replace('cm', '')} × ${len} cm`;
    }
    return width;
  };

  const products = productMeta.map(m => ({
    ...m,
    image: productImages[m.id],
    name: t.products[m.id]?.name ?? m.id,
    subtitle: t.products[m.id]?.subtitle ?? "",
    description: t.products[m.id]?.description ?? "",
    badge: t.products[m.id]?.badge ?? "",
    displayPrice: `${lang === "es" ? "Desde" : "From"} ${formatPrice(BASE_PRICES[m.id] ?? 0)}`,
    deliveryDays: m.deliveryDays,
  }));

  const filtered = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory);

  const paymentMethods = [
    { icon: Banknote, label: t.payment1Label, desc: t.payment1Desc },
    { icon: Smartphone, label: t.payment2Label, desc: t.payment2Desc },
    { icon: CreditCard, label: t.payment3Label, desc: t.payment3Desc },
    { icon: Package, label: t.payment4Label, desc: t.payment4Desc },
  ];

  const testimonials = [
    { ...testimonialNames[0], stars: 5, text: t.testimonial1Text },
    { ...testimonialNames[1], stars: 5, text: t.testimonial2Text },
    { ...testimonialNames[2], stars: 5, text: t.testimonial3Text },
  ];

  const handleBuyNow = (productId: string, productName: string) => {
    const selectedSize = selectedSizes[productId];
    if (!selectedSize) {
      // Open size picker modal instead of inline error
      setSizeModal({ open: true, productId, productName });
      return;
    }
    const variantKey = getVariantKey(productId, selectedSize);
    const variantId = SHOPIFY_VARIANTS[productId]?.[variantKey] ?? null;
    setPillowChoice(null);
    setPillowError(false);
    setPillowModal({ open: true, productId, productName, variantId });
  };

  const handleSizeModalSelect = (size: string) => {
    const { productId, productName } = sizeModal;
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
    setSizeModal({ open: false, productId: "", productName: "" });
    // Immediately proceed to pillow modal with the chosen size
    const variantKey = getVariantKey(productId, size);
    const variantId = SHOPIFY_VARIANTS[productId]?.[variantKey] ?? null;
    setPillowChoice(null);
    setPillowError(false);
    setPillowModal({ open: true, productId, productName, variantId });
  };

  const handleContinueToCheckout = () => {
    if (!pillowChoice) {
      setPillowError(true);
      return;
    }
    const note = pillowChoice === "double" ? "Regalo: 1 almohada doble española" : "Regalo: 2 almohadas individuales";
    let url: string;
    if (pillowModal.variantId) {
      // Direct cart permalink with variant + note attribute
      url = `https://${SHOPIFY_STORE}/cart/${pillowModal.variantId}:1?attributes[Regalo almohada]=${encodeURIComponent(note)}`;
    } else {
      // Fallback: product page (customer picks size there)
      url = `https://${SHOPIFY_STORE}/products/${pillowModal.productId}?note=${encodeURIComponent(note)}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setPillowModal({ open: false, productId: "", productName: "", variantId: null });
  };

  // Clicking an option only selects it — no navigation
  const handlePillowSelect = (choice: "double" | "two-singles") => {
    setPillowChoice(choice);
    setPillowError(false);
  };

  // Get the product sizes for the current size modal
  const sizeModalProduct = productMeta.find(p => p.id === sizeModal.productId);
  const sizeModalPrices = PRICES_BY_SIZE[sizeModal.productId] ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Size Picker Modal ── */}
      <Dialog open={sizeModal.open} onOpenChange={(open) => setSizeModal(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">📐</span>
              {t.sizeModalTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t.sizeModalDesc(sizeModal.productName)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 my-3">
            {(sizeModalProduct?.sizes ?? []).map((size, idx) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeModalSelect(size)}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-border p-3 hover:border-primary hover:bg-primary/5 active:scale-[0.97] transition-all duration-150 text-left group"
              >
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{size}</span>
                <span className="text-xs text-primary font-medium mt-0.5">
                  {lang === 'es' ? 'Desde' : 'From'} {formatPrice(sizeModalPrices[idx] ?? 0)}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSizeModal({ open: false, productId: "", productName: "" })}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            {t.sizeModalCancel}
          </button>
        </DialogContent>
      </Dialog>

      {/* ── Pillow Gift Modal ── */}
      <Dialog open={pillowModal.open} onOpenChange={(open) => setPillowModal(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-primary" />
              {t.pillowTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t.pillowDesc(pillowModal.productName)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-2">
            {/* Option 1 */}
            <button
              type="button"
              onClick={() => handlePillowSelect("double")}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                pillowChoice === "double"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  pillowChoice === "double" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {pillowChoice === "double" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">{t.pillowOption1Title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.pillowOption1Desc}</div>
                </div>
              </div>
            </button>
            {/* Option 2 */}
            <button
              type="button"
              onClick={() => handlePillowSelect("two-singles")}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                pillowChoice === "two-singles"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  pillowChoice === "two-singles" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {pillowChoice === "two-singles" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">{t.pillowOption2Title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.pillowOption2Desc}</div>
                </div>
              </div>
            </button>
          </div>
          {pillowError && (
            <p className="text-xs text-center text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              {t.pillowError}
            </p>
          )}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            onClick={handleContinueToCheckout}
          >
            <CreditCard className="w-4 h-4" />
            {t.pillowContinue}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {t.pillowFooter}
          </p>
        </DialogContent>
      </Dialog>

      {/* ── Top delivery bar ── */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium tracking-wide">
        {t.topBar}
      </div>

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">DR</span>
            </div>
            <div>
              <div className="font-serif font-semibold text-foreground leading-tight text-base">Descanso Rápido</div>
              <div className="text-xs text-muted-foreground leading-tight">{t.brandSubtitle}</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#productos" className="text-muted-foreground hover:text-foreground transition-colors">{t.navProducts}</a>
            <a href="#showroom" className="text-muted-foreground hover:text-foreground transition-colors">{t.navShowroom}</a>
            <a href="#entrega" className="text-muted-foreground hover:text-foreground transition-colors">{t.navDelivery}</a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">{t.navContact}</a>
          </nav>
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center rounded-full border border-border bg-muted/50 p-0.5 text-xs font-medium shrink-0">
              <button
                onClick={() => setLang("es")}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 min-w-[36px] text-center ${lang === "es" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 min-w-[36px] text-center ${lang === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
            </div>
            {/* Currency: EUR only */}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20información%20sobre%20vuestros%20productos`}
               target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-1.5">
                <MessageCircle className="w-4 h-4" />
                {t.navWhatsApp}
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[520px]">
          {/* Left: text */}
          <div className="flex flex-col justify-center px-8 py-16 md:py-20 bg-warm-light/30">
            <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20 text-xs font-semibold tracking-wide">
              {t.heroBadge}
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              {t.heroTitle1}<br />
              <span className="text-primary">{t.heroTitle2}</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-md leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#productos">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
                  {t.heroCtaPrimary} <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="#showroom">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5">
                  <MapPin className="w-4 h-4" />
                  {t.heroCtaSecondary}
                </Button>
              </a>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-600" /> {t.heroTrust1}</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-600" /> {t.heroTrust2}</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-600" /> {t.heroTrust3}</span>
            </div>
          </div>
          {/* Right: image */}
          <div className="relative hidden md:block">
            <img src={HERO_IMG} alt="Mattress delivery Madrid" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/10" />
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{t.usp1Title}</div>
                <div className="text-xs text-muted-foreground">{t.usp2Title}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USP strip ── */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: t.usp1Title, desc: t.usp1Desc },
            { icon: MapPin, title: t.usp2Title, desc: t.usp2Desc },
            { icon: Shield, title: t.usp3Title, desc: t.usp3Desc },
            { icon: Phone, title: t.usp4Title, desc: t.usp4Desc },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">{title}</div>
                <div className="text-xs text-primary-foreground/70">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section id="productos" className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">{t.productsTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.productsSubtitle}</p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { key: "all", label: t.filterAll },
              { key: "canapes", label: t.filterCanapes },
              { key: "colchones", label: t.filterColchones },
              { key: "bases", label: t.filterBases },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as typeof activeCategory)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Card key={product.id} className="group overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden bg-muted/30 aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${product.badgeColor}`}>
                    {product.badge}
                  </span>
                  {/* Delivery time badge */}
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    product.deliveryDays
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                    <Truck className="w-3 h-3" />
                    {product.deliveryDays
                      ? (lang === "es" ? `${product.deliveryDays} días` : `${product.deliveryDays} days`)
                      : "48h"
                    }
                  </span>
                </div>
                <CardContent className="p-5">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-semibold text-lg text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                    </div>
                    <Link href={`/producto/${product.id}`} className="shrink-0">
                      <button className="text-xs text-primary hover:underline font-medium whitespace-nowrap">{t.productVerDetalles}</button>
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 mb-3 leading-relaxed">{product.description}</p>
                  {/* Size selector — width + optional length dropdowns */}
                  <div className="flex gap-2 mb-3">
                    <select
                      value={selectedSizes[product.id] ?? ""}
                      onChange={e => setSelectedSizes(prev => ({ ...prev, [product.id]: e.target.value }))}
                      className={`flex-1 text-sm rounded-md border px-3 py-2 bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        selectedSizes[product.id]
                          ? 'border-primary text-foreground font-medium'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      <option value="">{lang === 'es' ? '— Ancho —' : '— Width —'}</option>
                      {product.sizes.map((s, idx) => {
                        const prices = PRICES_BY_SIZE[product.id] ?? [];
                        const p = prices[idx * ((product as any).hasLength ? 2 : 1)];
                        return (
                          <option key={s} value={s}>
                            {s}{p != null ? `  —  ${formatPrice(p)}` : ''}
                          </option>
                        );
                      })}
                    </select>
                    {(product as any).hasLength && (
                      <select
                        value={selectedLengths[product.id] ?? "190"}
                        onChange={e => setSelectedLengths(prev => ({ ...prev, [product.id]: e.target.value }))}
                        className="w-24 text-sm rounded-md border border-border px-2 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="190">190 cm</option>
                        <option value="200">200 cm</option>
                      </select>
                    )}
                  </div>
                  <div className="mb-3">
                    {(() => {
                      const selSize = selectedSizes[product.id];
                      const selLen = selectedLengths[product.id] ?? "190";
                      const hasLen = (product as any).hasLength;
                      const widthIdx = selSize ? product.sizes.indexOf(selSize) : -1;
                      const prices = PRICES_BY_SIZE[product.id] ?? [];
                      // For hasLength products, prices alternate: [w0×190, w0×200, w1×190, w1×200, ...]
                      const priceIdx = hasLen
                        ? (widthIdx >= 0 ? widthIdx * 2 + (selLen === "200" ? 1 : 0) : 0)
                        : (widthIdx >= 0 ? widthIdx : 0);
                      const price = prices[priceIdx];
                      const prefix = widthIdx >= 0 ? '' : (lang === 'es' ? 'Desde ' : 'From ');
                      return (
                        <span className="font-semibold text-primary text-lg">
                          {price != null ? `${prefix}${formatPrice(price)}` : product.displayPrice}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                        onClick={() => handleBuyNow(product.id, product.name)}
                      >
                        <Gift className="w-3.5 h-3.5" /> {t.btnBuyNow}
                      </Button>
                      <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                        <Gift className="w-3 h-3 shrink-0" />
                        {t.btnBuyNowSub}
                      </p>
                    </div>
                    <div>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, me interesa el ${product.name}. ¿Podéis visitarme o puedo reservar sin pagar?`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="w-full block"
                            >
                              <Button size="sm" variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 gap-1.5">
                                <MessageCircle className="w-3.5 h-3.5" /> {t.btnTryPay}
                              </Button>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[220px] text-center text-xs leading-relaxed p-3">
                            <p className="font-semibold mb-1">🚐 {t.btnTryPay}</p>
                            <p>{t.tooltipTryPay}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3 shrink-0" />
                        {t.btnTryPaySub}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upsell prompt */}
          <div className="mt-10 bg-accent/50 rounded-2xl p-6 text-center border border-border">
            <p className="text-foreground font-medium mb-1">{t.upsellPromptTitle}</p>
            <p className="text-muted-foreground text-sm">{t.upsellPromptDesc}</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20pedir%20canapé%20y%20colchón%20juntos`}
               target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary gap-1.5">
                <MessageCircle className="w-4 h-4" /> {t.upsellPromptBtn}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Mobile Showroom ── */}
      <section id="showroom" className="py-16 bg-muted/40">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                {t.showroomBadge}
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t.showroomTitle}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {t.showroomDesc}
              </p>
              <p className="text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 leading-relaxed">
                {t.showroomNote}
              </p>
              <ul className="space-y-3 mb-8">
                {[t.showroomFeature1, t.showroomFeature2, t.showroomFeature3, t.showroomFeature4].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/reservar-visita">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <MapPin className="w-4 h-4" />
                  {t.showroomBtn}
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img src={LIFESTYLE_IMG} alt="Cosy bedroom" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
              {/* Coverage badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 max-w-[220px]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-foreground">{lang === 'es' ? 'Zona de cobertura' : 'Coverage area'}</div>
                    <div className="text-sm font-bold text-primary mt-0.5">{lang === 'es' ? 'Toda la Comunidad de Madrid' : 'All of Madrid Region'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivery section ── */}
      <section id="entrega" className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">{t.deliveryTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.deliverySubtitle}</p>
          </div>

          {/* ── Timeline comparison ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            {/* Column 1: Mobile showroom visit */}
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-serif font-bold text-foreground text-base">
                    {lang === "es" ? "Visita del Showroom Móvil" : "Mobile Showroom Visit"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === "es" ? "Venimos a tu casa" : "We come to you"}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { time: lang === "es" ? "Hoy" : "Today",        label: lang === "es" ? "Reservas tu visita por WhatsApp" : "Book your visit via WhatsApp",          color: "bg-primary" },
                  { time: lang === "es" ? "24–48h" : "24–48h",    label: lang === "es" ? "Llegamos con muestras reales a tu domicilio" : "We arrive with real samples at your home", color: "bg-primary" },
                  { time: lang === "es" ? "En el momento" : "Same visit", label: lang === "es" ? "Eliges, pruebas y confirmas en persona" : "You choose, try and confirm in person", color: "bg-primary" },
                  { time: lang === "es" ? "48–72h" : "48–72h",    label: lang === "es" ? "Entrega e instalación en tu hogar" : "Delivery and installation at your home", color: "bg-green-600" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${step.color}`} />
                      {i < 3 && <div className="w-px h-6 bg-border mt-1" />}
                    </div>
                    <div className="pb-1">
                      <span className="text-xs font-bold text-primary mr-2">{step.time}</span>
                      <span className="text-sm text-foreground">{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{lang === "es" ? "Sujeto a disponibilidad de stock. Te confirmamos disponibilidad al reservar." : "Subject to stock availability. We confirm availability when you book."}</span>
              </div>
            </div>

            {/* Column 2: Order online */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-serif font-bold text-foreground text-base">
                    {lang === "es" ? "Pedido Online" : "Order Online"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === "es" ? "Desde casa, en minutos" : "From home, in minutes"}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { time: lang === "es" ? "Ahora" : "Now",         label: lang === "es" ? "Seleccionas talla y modelo en la web" : "Select size and model on the website",    color: "bg-muted-foreground" },
                  { time: lang === "es" ? "Inmediato" : "Instant",  label: lang === "es" ? "Pago seguro online o contrarembolso" : "Secure online payment or cash on delivery", color: "bg-muted-foreground" },
                  { time: lang === "es" ? "48–72h" : "48–72h",      label: lang === "es" ? "Entrega e instalación en tu domicilio" : "Delivery and installation at your home",  color: "bg-green-600" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${step.color}`} />
                      {i < 2 && <div className="w-px h-6 bg-border mt-1" />}
                    </div>
                    <div className="pb-1">
                      <span className="text-xs font-bold text-muted-foreground mr-2">{step.time}</span>
                      <span className="text-sm text-foreground">{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{lang === "es" ? "Sujeto a disponibilidad. Si un artículo no está en stock, te avisamos antes de confirmar." : "Subject to availability. If an item is out of stock, we notify you before confirming."}</span>
              </div>
            </div>
          </div>

          {/* Shared delivery guarantee banner */}
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-serif font-bold text-lg">
                  {lang === "es" ? "Entrega garantizada en 48–72 horas" : "Guaranteed delivery in 48–72 hours"}
                </div>
                <div className="text-sm text-primary-foreground/80">
                  {lang === "es" ? "Toda la Comunidad de Madrid" : "Entire Community of Madrid"}
                </div>
              </div>
            </div>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lang === "es" ? "Hola, quiero saber más sobre los plazos de entrega" : "Hello, I'd like to know more about delivery times")}`}
               target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2 whitespace-nowrap">
                <MessageCircle className="w-4 h-4" />
                {lang === "es" ? "Consultar disponibilidad" : "Check availability"}
              </Button>
            </a>
          </div>

        </div>
      </section>

      {/* ── Payment methods ── */}
      <section className="py-12 bg-primary/5">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">{t.paymentTitle}</h2>
            <p className="text-muted-foreground text-sm">{t.paymentSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-card rounded-xl p-5 text-center border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-semibold text-foreground text-sm mb-1">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">{t.testimonialsTitle}</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-muted-foreground text-sm">5.0 · {lang === "es" ? "Más de 50 clientes satisfechos" : "50+ satisfied customers"}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t_) => (
              <Card key={t_.name} className="p-6 border border-border flex flex-col">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4 flex-1">"{t_.text}"</p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                    {t_.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{t_.name}</div>
                    <div className="text-xs text-muted-foreground">{t_.location}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
            {t.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20información%20sobre%20vuestros%20productos`}
               target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                {t.ctaBtn2}
              </Button>
            </a>
            <Link href="/reservar-visita">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                <MapPin className="w-5 h-5" />
                {lang === "es" ? "Reservar visita a domicilio" : "Book a home visit"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact / Footer ── */}
      <footer id="contacto" className="py-12 bg-foreground text-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-serif font-bold text-xl mb-2">Descanso Rápido Castilla</div>
              <p className="text-background/60 text-sm leading-relaxed">
                {t.footerTagline}
              </p>
            </div>
            <div>
              <div className="font-semibold mb-3 text-sm tracking-wide uppercase text-background/50">
                {lang === "es" ? "Zona de entrega" : "Delivery area"}
              </div>
              <div className="text-sm text-background/80 font-medium">
                {lang === 'es' ? 'Toda la Comunidad de Madrid' : 'All of the Madrid Region'}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3 text-sm tracking-wide uppercase text-background/50">
                {lang === "es" ? "Contacto" : "Contact"}
              </div>
              <div className="space-y-2 text-sm text-background/70">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Comunidad de Madrid</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-center text-xs text-background/40">
            {t.footerCopyright}
          </div>
        </div>
      </footer>

      {/* ── WhatsApp floating button ── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20información%20sobre%20vuestros%20productos`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
