export type PurchaseType = "pack" | "canape" | "mattress";
export type Availability = "express" | "september";
export type MattressTier = "express" | "essential" | "comfort" | "premium";
export type CanapeStyle = "express" | "premium";

export const WHATSAPP_NUMBER = "34711204284";

export const STANDARD_SIZES = ["90 × 190 cm", "105 × 190 cm", "120 × 190 cm", "135 × 190 cm", "150 × 190 cm", "Necesito otra medida"] as const;

export const EXPRESS_PACK_PRICES: Record<string, number> = {
  "90 × 190 cm": 249,
  "105 × 190 cm": 259,
  "120 × 190 cm": 269,
  "135 × 190 cm": 269,
  "150 × 190 cm": 299,
};

export const EXPRESS_COLOURS = ["Ártico", "Blanco", "Cambrian", "Cerezo", "Wengué"] as const;
export const PREMIUM_FINISHES = ["Blanco", "Nórdico", "Cambrian", "Wengué"] as const;

export const productTypeLabels: Record<PurchaseType, { es: string; en: string }> = {
  pack: { es: "Pack cama + colchón", en: "Bed + mattress pack" },
  canape: { es: "Solo canapé", en: "Storage bed only" },
  mattress: { es: "Solo colchón", en: "Mattress only" },
};

export const mattressTierDetails: Record<MattressTier, {
  es: { name: string; summary: string; availability: string; badge?: string };
  en: { name: string; summary: string; availability: string; badge?: string };
}> = {
  express: {
    es: { name: "Entrega Express", summary: "Una opción de valor para quien necesita su cama esta semana.", availability: "Disponible ahora", badge: "Entrega rápida" },
    en: { name: "Express Delivery", summary: "A value choice for customers who need their bed this week.", availability: "Available now", badge: "Fast delivery" },
  },
  essential: {
    es: { name: "Esencial", summary: "Una cama nueva y fiable a un precio sensato.", availability: "Desde septiembre" },
    en: { name: "Essential", summary: "A dependable new bed at a sensible price.", availability: "From September" },
  },
  comfort: {
    es: { name: "Confort", summary: "Nuestra opción equilibrada para el confort diario.", availability: "Desde septiembre", badge: "Equilibrio" },
    en: { name: "Comfort", summary: "Our balanced choice for everyday comfort.", availability: "From September", badge: "Balanced comfort" },
  },
  premium: {
    es: { name: "Premium", summary: "Para quien busca el mayor nivel de acabado y confort.", availability: "Desde septiembre" },
    en: { name: "Premium", summary: "For customers seeking the highest finish and comfort level.", availability: "From September" },
  },
};

export const canapeDetails: Record<CanapeStyle, {
  es: { name: string; summary: string; availability: string; features: string[] };
  en: { name: string; summary: string; availability: string; features: string[] };
}> = {
  express: {
    es: {
      name: "Canapé Express de Gran Capacidad",
      summary: "Máximo almacenaje con entrega y montaje rápido.",
      availability: "Disponible ahora",
      features: ["Almacenaje amplio", "Apertura hidráulica", "5 colores en stock"],
    },
    en: {
      name: "Express Large-Capacity Storage Bed",
      summary: "Maximum storage with fast delivery and assembly.",
      availability: "Available now",
      features: ["Large storage space", "Hydraulic opening", "5 colours in stock"],
    },
  },
  premium: {
    es: {
      name: "Canapé de Madera con Almacenaje",
      summary: "Un acabado madera cuidado con almacenaje profundo.",
      availability: "Desde septiembre",
      features: ["Interior de 29 cm aprox.", "Apertura lateral", "4 acabados madera"],
    },
    en: {
      name: "Wood Storage Bed",
      summary: "A considered wood finish with deep storage.",
      availability: "From September",
      features: ["Approx. 29 cm inner depth", "Side opening", "4 wood finishes"],
    },
  },
};

export type ConfiguratorSelection = {
  purchaseType: PurchaseType;
  availability: Availability;
  size: string;
  mattressTier?: MattressTier;
  canapeStyle?: CanapeStyle;
  finish?: string;
  postcode?: string;
  deliveryNeed?: "flexible" | "specific";
};

export function getExpressPackPrice(size: string) {
  return EXPRESS_PACK_PRICES[size];
}

function selectedLabel<T extends string>(value: T | undefined, labels: Record<T, { es: string; en: string }>, lang: "es" | "en") {
  return value ? labels[value][lang] : "";
}

export function buildWhatsAppEnquiry(selection: ConfiguratorSelection, lang: "es" | "en") {
  const isCustomSize = selection.size === "Necesito otra medida";
  const isSpanish = lang === "es";
  const mattress = selection.mattressTier ? mattressTierDetails[selection.mattressTier][lang].name : "";
  const canape = selection.canapeStyle ? canapeDetails[selection.canapeStyle][lang].name : "";
  const product = selectedLabel(selection.purchaseType, productTypeLabels, lang);
  const availability = selection.availability === "express"
    ? (isSpanish ? "Disponible ahora" : "Available now")
    : (isSpanish ? "Desde septiembre" : "From September");
  const expressPackPrice = selection.availability === "express" && selection.purchaseType === "pack"
    ? getExpressPackPrice(selection.size)
    : undefined;

  const lines = isSpanish
    ? [
        "Hola, quiero consultar mi selección.",
        `Producto: ${product}`,
        `Disponibilidad: ${availability}`,
        selection.size ? `Medida: ${isCustomSize ? "Necesito otra medida: ____ × ____ cm" : selection.size}` : "Medida: ____",
        expressPackPrice ? `Precio del Pack Express: €${expressPackPrice}` : "",
        mattress ? `Colchón: ${mattress}` : "",
        canape ? `Canapé: ${canape}` : "",
        selection.finish ? `Color / acabado: ${selection.finish}` : "",
        `Código postal: ${selection.postcode || "____"}`,
        selection.deliveryNeed === "specific" ? "Fecha ideal de entrega: ____" : "Estoy flexible para la mejor ruta disponible.",
        isCustomSize ? "¿Podéis confirmarme disponibilidad y precio para esta medida?" : "¿Podéis confirmarme la mejor opción de entrega y el precio final?",
      ]
    : [
        "Hello, I would like to ask about my selection.",
        `Product: ${product}`,
        `Availability: ${availability}`,
        selection.size ? `Size: ${isCustomSize ? "I need another size: ____ × ____ cm" : selection.size}` : "Size: ____",
        expressPackPrice ? `Express Pack price: €${expressPackPrice}` : "",
        mattress ? `Mattress: ${mattress}` : "",
        canape ? `Storage bed: ${canape}` : "",
        selection.finish ? `Colour / finish: ${selection.finish}` : "",
        `Postcode: ${selection.postcode || "____"}`,
        selection.deliveryNeed === "specific" ? "Preferred delivery date: ____" : "I am flexible for the best available route.",
        isCustomSize ? "Could you confirm availability and pricing for this size?" : "Could you confirm the best delivery option and final price?",
      ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.filter(Boolean).join("\n"))}`;
}

export function buildStandaloneWhatsAppEnquiry(productType: Exclude<PurchaseType, "pack">, lang: "es" | "en") {
  const isSpanish = lang === "es";
  const product = productTypeLabels[productType][lang];
  const lines = isSpanish
    ? [
        "Hola, quiero consultar un producto individual.",
        `Producto: ${product}`,
        "Medida que necesito: ____ × ____ cm",
        "Código postal: ____",
        "¿Podéis confirmarme opciones, disponibilidad y precio?",
      ]
    : [
        "Hello, I would like to ask about one product.",
        `Product: ${product}`,
        "Size I need: ____ × ____ cm",
        "Postcode: ____",
        "Could you confirm options, availability and price?",
      ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function getAvailableFinishes(canapeStyle: CanapeStyle) {
  return canapeStyle === "express" ? EXPRESS_COLOURS : PREMIUM_FINISHES;
}
