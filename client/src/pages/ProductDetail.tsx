import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  ArrowLeft, Truck, Shield, Star, CheckCircle, MessageCircle,
  CreditCard, Gift, ChevronRight, Package
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency, type Currency } from "@/contexts/CurrencyContext";

const WHATSAPP_NUMBER = "34711204284";
const SHOPIFY_STORE = "descanso-rapido-castilla.myshopify.com";

// Shopify variant IDs — keyed by product handle then size label (e.g. "90 × 190 cm")
const SHOPIFY_VARIANTS: Record<string, Record<string, number>> = {
  "canape-excellent": {
    "90 × 190 cm": 53953966178645, "105 × 190 cm": 53953966211413, "135 × 190 cm": 53953966244181,
    "150 × 190 cm": 53953966276949, "160 × 190 cm": 53953966309717, "180 × 190 cm": 53953966342485,
  },
  "canape-premium": {
    "90 × 190 cm": 53953966539093, "105 × 190 cm": 53953966571861, "135 × 190 cm": 53953966604629,
    "150 × 190 cm": 53953966637397, "160 × 190 cm": 53953966670165, "180 × 190 cm": 53953966702933,
  },
  "canape-articulado": {
    "135 × 190 cm": 53953966899541, "150 × 190 cm": 53953966932309,
    "160 × 190 cm": 53953966965077, "180 × 190 cm": 53953966997845,
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
    "80 × 190 cm": 53953967587669, "90 × 190 cm": 53953967620437, "105 × 190 cm": 53953967653205,
    "135 × 190 cm": 53953967685973, "150 × 190 cm": 53953967718741,
  },
};

const CANAPE_EXCELLENT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-excellent-clean-NSFixs2vvWmm2KZbrrBBqL.webp";
const CANAPE_PREMIUM = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-premium-v2-HdWMbhFnc8FSscqxCXzBZu.webp";
const CANAPE_ARTICULADO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-articulado-clean-eHwfxaXXiMCRYiXe3s7YjH.webp";
const COLCHON_VISCONUBE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-hybrid-hr-clean-967DAKq2PKQgB5zAs3fLUg.webp";
const COLCHON_VISCOGRAFENO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-new-memory-hr-clean-mC9twP9Jw4fHPT9PjuVUvr.webp";
const COLCHON_MACANUU = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-hybrid-hr-clean-967DAKq2PKQgB5zAs3fLUg.webp";
const BASE_LUCY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/base-lucy-clean-jXtnAsBSxs6PHZnBuQTXMB.webp";

interface ProductData {
  id: string;
  image: string;
  badgeColor: string;
  sizes: { label: string; price: string }[];
  category: "canapes" | "colchones" | "bases";
  upsellIds?: string[];
}

// Base EUR prices per size for each product
const BASE_PRICES_BY_SIZE: Record<string, number[]> = {
  "canape-excellent": [249, 279, 309, 339],
  "canape-premium": [329, 389, 429],
  "canape-articulado": [499, 549, 629, 699],
  "colchon-visconube": [215, 240, 240, 265, 265, 295, 265, 295, 295, 320],
  "colchon-viscografeno": [335, 370, 375, 405, 430, 465, 455, 495],
  "colchon-macanuu": [240, 265, 240, 265, 265, 295, 310, 335, 310, 335, 350, 375],
  "base-lucy": [129, 139, 159, 179, 199],
};

// Static data (images, sizes, categories) — text comes from translations
const productMeta: Record<string, ProductData> = {
  "canape-excellent": {
    id: "canape-excellent",
    image: CANAPE_EXCELLENT,
    badgeColor: "bg-amber-100 text-amber-800",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 249€" },
      { label: "105 × 190 cm", price: "Desde 279€" },
      { label: "135 × 190 cm", price: "Desde 309€" },
      { label: "150 × 190 cm", price: "Desde 339€" },
    ],
    category: "canapes",
    upsellIds: ["colchon-visconube", "colchon-viscografeno"],
  },
  "canape-premium": {
    id: "canape-premium",
    image: CANAPE_PREMIUM,
    badgeColor: "bg-slate-100 text-slate-700",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 329€" },
      { label: "135 × 190 cm", price: "Desde 389€" },
      { label: "150 × 190 cm", price: "Desde 429€" },
    ],
    category: "canapes",
    upsellIds: ["colchon-viscografeno", "base-lucy"],
  },
  "canape-articulado": {
    id: "canape-articulado",
    image: CANAPE_ARTICULADO,
    badgeColor: "bg-blue-100 text-blue-800",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 499€" },
      { label: "105 × 190 cm", price: "Desde 549€" },
      { label: "135 × 190 cm", price: "Desde 629€" },
      { label: "150 × 190 cm", price: "Desde 699€" },
    ],
    category: "canapes",
    upsellIds: ["colchon-viscografeno"],
  },
  "colchon-visconube": {
    id: "colchon-visconube",
    image: COLCHON_VISCONUBE,
    badgeColor: "bg-green-100 text-green-800",
    sizes: [
      { label: "80/90 × 180/190 cm", price: "Desde 215€" },
      { label: "80/90 × 200 cm",     price: "Desde 240€" },
      { label: "105 × 180/190 cm",   price: "Desde 240€" },
      { label: "105 × 200 cm",       price: "Desde 265€" },
      { label: "120 × 180/190 cm",   price: "Desde 265€" },
      { label: "120 × 200 cm",       price: "Desde 295€" },
      { label: "135 × 180/190 cm",   price: "Desde 265€" },
      { label: "135 × 200 cm",       price: "Desde 295€" },
      { label: "150 × 180/190 cm",   price: "Desde 295€" },
      { label: "150 × 200 cm",       price: "Desde 320€" },
    ],
    category: "colchones",
    upsellIds: ["canape-excellent", "base-lucy"],
  },
  "colchon-viscografeno": {
    id: "colchon-viscografeno",
    image: COLCHON_VISCOGRAFENO,
    badgeColor: "bg-slate-100 text-slate-700",
    sizes: [
      { label: "80/90 × 180/190 cm",   price: "Desde 335€" },
      { label: "80/90 × 200 cm",       price: "Desde 370€" },
      { label: "105 × 180/190 cm",     price: "Desde 375€" },
      { label: "105 × 200 cm",         price: "Desde 405€" },
      { label: "120/135 × 180/190 cm", price: "Desde 430€" },
      { label: "120/135 × 200 cm",     price: "Desde 465€" },
      { label: "150 × 180/190 cm",     price: "Desde 455€" },
      { label: "150 × 200 cm",         price: "Desde 495€" },
    ],
    category: "colchones",
    upsellIds: ["canape-premium", "canape-articulado"],
  },
  "colchon-macanuu": {
    id: "colchon-macanuu",
    image: COLCHON_MACANUU,
    badgeColor: "bg-teal-100 text-teal-800",
    sizes: [
      { label: "80 × 180/190 cm",  price: "Desde 240€" },
      { label: "80 × 200 cm",      price: "Desde 265€" },
      { label: "90 × 180/190 cm",  price: "Desde 240€" },
      { label: "90 × 200 cm",      price: "Desde 265€" },
      { label: "105 × 180/190 cm", price: "Desde 265€" },
      { label: "105 × 200 cm",     price: "Desde 295€" },
      { label: "120 × 180/190 cm", price: "Desde 310€" },
      { label: "120 × 200 cm",     price: "Desde 335€" },
      { label: "135 × 180/190 cm", price: "Desde 310€" },
      { label: "135 × 200 cm",     price: "Desde 335€" },
      { label: "150 × 180/190 cm", price: "Desde 350€" },
      { label: "150 × 200 cm",     price: "Desde 375€" },
    ],
    category: "colchones",
    upsellIds: ["canape-excellent", "base-lucy"],
  },
  "base-lucy": {
    id: "base-lucy",
    image: BASE_LUCY,
    badgeColor: "bg-purple-100 text-purple-700",
    sizes: [
      { label: "80 × 190 cm", price: "Desde 129€" },
      { label: "90 × 190 cm", price: "Desde 139€" },
      { label: "105 × 190 cm", price: "Desde 159€" },
      { label: "135 × 190 cm", price: "Desde 179€" },
      { label: "150 × 190 cm", price: "Desde 199€" },
    ],
    category: "bases",
    upsellIds: ["colchon-visconube", "colchon-macanuu"],
  },
};

// Per-language extended content
const productContent: Record<string, Record<string, {
  subtitle: string;
  longDescription: string;
  features: string[];
  specs: { label: string; value: string }[];
  upsellReasons: string[];
}>> = {
  "canape-excellent": {
    es: {
      subtitle: "Canapé abatible de madera con almacenaje",
      longDescription: "El Canapé Excellent es nuestra opción más popular por su relación calidad-precio. Fabricado con estructura de madera maciza y tapa abatible de 3D transpirable, ofrece 28 cm de almacenaje interior — ideal para guardar ropa de cama, mantas y más. Disponible en blanco, gris, beige y wengué.",
      features: ["28 cm de almacenaje interior", "Tapa abatible con apertura suave", "Estructura de madera maciza reforzada", "Tapa 3D transpirable antiácaros", "Disponible en 4 colores", "Montaje incluido en entrega"],
      specs: [{ label: "Material", value: "Madera maciza + tapa 3D transpirable" }, { label: "Almacenaje", value: "28 cm de profundidad" }, { label: "Colores", value: "Blanco, Gris, Beige, Wengué" }, { label: "Profundidad cama", value: "190 cm (estándar)" }, { label: "Garantía", value: "2 años" }, { label: "Entrega", value: "48 horas garantizadas" }],
      upsellReasons: ["El colchón más popular para este canapé", "Máximo confort con muelles ensacados"],
    },
    en: {
      subtitle: "Lift-up storage bed in solid wood",
      longDescription: "The Excellent Storage Bed is our most popular model for its quality-to-price ratio. Built with a solid wood frame and breathable 3D lift-up top, it offers 28 cm of internal storage — perfect for bedding, blankets and more. Available in white, grey, beige and wenge.",
      features: ["28 cm of internal storage", "Smooth-opening lift-up top", "Reinforced solid wood frame", "Anti-mite breathable 3D top", "Available in 4 colours", "Assembly included on delivery"],
      specs: [{ label: "Material", value: "Solid wood + breathable 3D top" }, { label: "Storage depth", value: "28 cm" }, { label: "Colours", value: "White, Grey, Beige, Wenge" }, { label: "Bed depth", value: "190 cm (standard)" }, { label: "Warranty", value: "2 years" }, { label: "Delivery", value: "Guaranteed 48 hours" }],
      upsellReasons: ["Most popular mattress for this bed", "Maximum comfort with pocket springs"],
    },
  },
  "canape-premium": {
    es: {
      subtitle: "Canapé abatible tapizado en polipiel",
      longDescription: "El Canapé Premium eleva el dormitorio con su tapizado en polipiel de alta calidad. Con 30 cm de almacenaje y una tapa de apertura suave, combina funcionalidad y elegancia. Ideal para dormitorios modernos o nórdicos. Disponible en gris perla, blanco roto y antracita.",
      features: ["30 cm de almacenaje interior", "Tapizado en polipiel resistente", "Apertura suave con pistones de gas", "Estructura reforzada de alta densidad", "Acabado cosido a mano", "Montaje incluido en entrega"],
      specs: [{ label: "Material", value: "Polipiel premium + estructura madera" }, { label: "Almacenaje", value: "30 cm de profundidad" }, { label: "Colores", value: "Gris perla, Blanco roto, Antracita" }, { label: "Profundidad cama", value: "190 cm (estándar)" }, { label: "Garantía", value: "2 años" }, { label: "Entrega", value: "48 horas garantizadas" }],
      upsellReasons: ["Combina perfectamente con el Premium", "Para camas con cabecero separado"],
    },
    en: {
      subtitle: "Lift-up storage bed upholstered in faux leather",
      longDescription: "The Premium Storage Bed elevates the bedroom with its high-quality faux leather upholstery. With 30 cm of storage and a gas-piston smooth-open top, it combines functionality and elegance. Ideal for modern or Scandinavian bedrooms. Available in pearl grey, off-white and anthracite.",
      features: ["30 cm of internal storage", "Durable faux leather upholstery", "Gas-piston smooth opening", "High-density reinforced frame", "Hand-stitched finish", "Assembly included on delivery"],
      specs: [{ label: "Material", value: "Premium faux leather + wood frame" }, { label: "Storage depth", value: "30 cm" }, { label: "Colours", value: "Pearl grey, Off-white, Anthracite" }, { label: "Bed depth", value: "190 cm (standard)" }, { label: "Warranty", value: "2 years" }, { label: "Delivery", value: "Guaranteed 48 hours" }],
      upsellReasons: ["Perfect pairing with the Premium", "For beds with a separate headboard"],
    },
  },
  "canape-articulado": {
    es: {
      subtitle: "Somier articulado con motor eléctrico",
      longDescription: "El Canapé Articulado Motorizado es la cúspide del confort. Con motor eléctrico silencioso, puedes ajustar la posición de cabeza y pies con un mando a distancia. Las láminas de madera flexible se adaptan a tu cuerpo para un descanso óptimo. Incluye función anti-ronquidos.",
      features: ["Motor eléctrico silencioso", "Mando a distancia incluido", "Láminas de madera flexible", "Función anti-ronquidos", "Posición lectura y TV", "Montaje e instalación incluidos"],
      specs: [{ label: "Motor", value: "Eléctrico silencioso (< 45dB)" }, { label: "Control", value: "Mando a distancia inalámbrico" }, { label: "Láminas", value: "Madera de abedul flexible" }, { label: "Funciones", value: "Cabeza, pies, anti-ronquidos" }, { label: "Garantía", value: "3 años (motor 5 años)" }, { label: "Entrega", value: "48 horas garantizadas" }],
      upsellReasons: ["Recomendado para bases articuladas"],
    },
    en: {
      subtitle: "Adjustable bed base with electric motor",
      longDescription: "The Motorised Adjustable Bed is the pinnacle of comfort. With a whisper-quiet electric motor, you can adjust the head and foot positions with a remote control. Flexible birch wood slats adapt to your body for optimal rest. Includes anti-snore function.",
      features: ["Whisper-quiet electric motor", "Remote control included", "Flexible birch wood slats", "Anti-snore function", "Reading and TV positions", "Full installation included"],
      specs: [{ label: "Motor", value: "Electric silent (< 45dB)" }, { label: "Control", value: "Wireless remote control" }, { label: "Slats", value: "Flexible birch wood" }, { label: "Functions", value: "Head, feet, anti-snore" }, { label: "Warranty", value: "3 years (motor 5 years)" }, { label: "Delivery", value: "Guaranteed 48 hours" }],
      upsellReasons: ["Recommended for adjustable bases"],
    },
  },
  "colchon-visconube": {
    es: {
      subtitle: "Viscoelástico doble cara · 24 cm · HR 23 kg/m³",
      longDescription: "El Colchón Visconube es nuestra opción más accesible con tecnología viscoelástica real. Núcleo HR de 23 kg/m³ para un soporte duradero. Cara invierno con fibra hueca de silicona + capa viscoelástica + acolchado Super Soft en tejido stretch; cara verano con fibra hueca + tejido 3D de alta transpirabilidad. Banda lateral de diseño.",
      features: ["Doble cara invierno/verano", "Núcleo HR 23 kg/m³", "24 cm de altura total (±1 cm)", "Capa viscoelástica adaptable", "Tejido 3D alta transpirabilidad", "Acolchado Super Soft"],
      specs: [{ label: "Altura total", value: "24 cm (±1 cm)" }, { label: "Núcleo", value: "HR 23 kg/m³" }, { label: "Cara invierno", value: "Visco + Super Soft + stretch" }, { label: "Cara verano", value: "Fibra silicona + tejido 3D" }, { label: "Banda lateral", value: "Diseño" }, { label: "Garantía", value: "5 años" }],
      upsellReasons: ["El canapé más popular para este colchón", "Base económica y resistente"],
    },
    en: {
      subtitle: "Double-sided visco · 24 cm · HR 23 kg/m³",
      longDescription: "The Visconube Mattress is our most accessible option with real memory foam technology. HR core at 23 kg/m³ for lasting support. Winter side: silicone hollow fibre + memory foam layer + Super Soft padding in stretch fabric; summer side: hollow fibre + high-breathability 3D fabric. Design side band.",
      features: ["Double-sided winter/summer", "HR core 23 kg/m³", "24 cm total height (±1 cm)", "Adaptive memory foam layer", "High-breathability 3D fabric", "Super Soft padding"],
      specs: [{ label: "Total height", value: "24 cm (±1 cm)" }, { label: "Core", value: "HR 23 kg/m³" }, { label: "Winter side", value: "Visco + Super Soft + stretch" }, { label: "Summer side", value: "Hollow fibre + 3D fabric" }, { label: "Side band", value: "Design" }, { label: "Warranty", value: "5 years" }],
      upsellReasons: ["Most popular bed base for this mattress", "Economical and sturdy base"],
    },
  },
  "colchon-viscografeno": {
    es: {
      subtitle: "Visco grafeno doble cara · 29-30 cm · HR 25 kg/m³",
      longDescription: "El Colchón Viscografeno es nuestra opción premium. Núcleo HR de 25 kg/m³ de alta densidad. Cara invierno con lámina viscoelástica termoreguladora (grafeno) + fibra hueca de silicona + acolchado Super Soft en tejido stretch; cara verano con fibra hueca + tejido 3D de alta transpirabilidad. Banda lateral de diseño.",
      features: ["Doble cara invierno/verano", "Núcleo HR 25 kg/m³ alta densidad", "29-30 cm de altura premium", "Lámina viscoelástica termoreguladora", "Tejido 3D alta transpirabilidad", "Acolchado Super Soft"],
      specs: [{ label: "Altura total", value: "29-30 cm" }, { label: "Núcleo", value: "HR 25 kg/m³" }, { label: "Cara invierno", value: "Visco grafeno + Super Soft + stretch" }, { label: "Cara verano", value: "Fibra silicona + tejido 3D" }, { label: "Banda lateral", value: "Diseño" }, { label: "Garantía", value: "10 años" }],
      upsellReasons: ["Combinación perfecta para dormitorio premium", "Máximo confort con base articulada"],
    },
    en: {
      subtitle: "Graphene visco double-sided · 29-30 cm · HR 25 kg/m³",
      longDescription: "The Viscografeno Mattress is our premium option. High-density HR core at 25 kg/m³. Winter side: thermo-sensitive graphene memory foam layer + silicone hollow fibre + Super Soft padding in stretch fabric; summer side: hollow fibre + high-breathability 3D fabric. Design side band.",
      features: ["Double-sided winter/summer", "High-density HR core 25 kg/m³", "29-30 cm premium height", "Thermo-sensitive graphene visco layer", "High-breathability 3D fabric", "Super Soft padding"],
      specs: [{ label: "Total height", value: "29-30 cm" }, { label: "Core", value: "HR 25 kg/m³" }, { label: "Winter side", value: "Graphene visco + Super Soft + stretch" }, { label: "Summer side", value: "Hollow fibre + 3D fabric" }, { label: "Side band", value: "Design" }, { label: "Warranty", value: "10 years" }],
      upsellReasons: ["Perfect pairing for a premium bedroom", "Maximum comfort on an adjustable base"],
    },
  },
  "colchon-macanuu": {
    es: {
      subtitle: "HR doble cara · 26 cm · HR 25 kg/m³",
      longDescription: "El Colchón Macanuu ofrece la mejor relación calidad-precio de nuestra gama. Núcleo HR de 25 kg/m³ de alta densidad. Ambas caras con tejido stretch 300g, acolchado de fibra 250g y acolchado Super Soft. Banda lateral de tela. Ideal para quienes buscan durabilidad y confort sin pagar por la viscoelástica.",
      features: ["Doble cara simétrica", "Núcleo HR 25 kg/m³ alta densidad", "26 cm de altura total (±1 cm)", "Tejido stretch 300g ambas caras", "Acolchado fibra 250g + Super Soft", "Banda lateral de tela"],
      specs: [{ label: "Altura total", value: "26 cm (±1 cm)" }, { label: "Núcleo", value: "HR 25 kg/m³" }, { label: "Tejido", value: "Stretch 300g ambas caras" }, { label: "Acolchado", value: "Fibra 250g + Super Soft" }, { label: "Banda lateral", value: "Tela" }, { label: "Garantía", value: "5 años" }],
      upsellReasons: ["El canapé más popular para este colchón", "Base económica y resistente"],
    },
    en: {
      subtitle: "HR double-sided · 26 cm · HR 25 kg/m³",
      longDescription: "The Macanuu Mattress offers the best value in our range. High-density HR core at 25 kg/m³. Both sides feature 300g stretch fabric, 250g fibre padding and Super Soft padding. Fabric side band. Ideal for those seeking durability and comfort without paying for memory foam.",
      features: ["Symmetric double-sided", "High-density HR core 25 kg/m³", "26 cm total height (±1 cm)", "300g stretch fabric both sides", "250g fibre + Super Soft padding", "Fabric side band"],
      specs: [{ label: "Total height", value: "26 cm (±1 cm)" }, { label: "Core", value: "HR 25 kg/m³" }, { label: "Fabric", value: "300g stretch both sides" }, { label: "Padding", value: "250g fibre + Super Soft" }, { label: "Side band", value: "Fabric" }, { label: "Warranty", value: "5 years" }],
      upsellReasons: ["Most popular bed base for this mattress", "Economical and sturdy base"],
    },
  },
  "base-lucy": {
    es: {
      subtitle: "Tela 3D transpirable con aireadores laterales",
      longDescription: "La Base Tapizada Lucy es la solución perfecta cuando quieres un look limpio y moderno sin canapé. Tapizada en tela 3D gris transpirable con aireadores laterales para evitar la humedad. Estructura tubular de acero 40×30mm de alta resistencia. Patas regulables en altura.",
      features: ["Tela 3D transpirable antiácaros", "Aireadores laterales anti-humedad", "Estructura tubular 40×30 mm", "Patas regulables en altura", "Fácil montaje sin herramientas", "Compatible con todos los colchones"],
      specs: [{ label: "Tapizado", value: "Tela 3D gris transpirable" }, { label: "Estructura", value: "Acero tubular 40×30 mm" }, { label: "Patas", value: "Regulables (25–30 cm)" }, { label: "Aireadores", value: "Laterales anti-humedad" }, { label: "Color", value: "Gris (único)" }, { label: "Garantía", value: "2 años" }],
      upsellReasons: ["Colchón económico y cómodo para esta base", "Máximo confort sobre esta base"],
    },
    en: {
      subtitle: "Breathable 3D fabric with side air vents",
      longDescription: "The Lucy Divan Base is the perfect solution when you want a clean, modern look without a storage bed. Upholstered in breathable grey 3D fabric with side air vents to prevent moisture. 40×30 mm high-resistance tubular steel frame. Height-adjustable legs.",
      features: ["Anti-mite breathable 3D fabric", "Side air vents to prevent moisture", "40×30 mm tubular steel frame", "Height-adjustable legs", "Tool-free easy assembly", "Compatible with all mattresses"],
      specs: [{ label: "Upholstery", value: "Grey breathable 3D fabric" }, { label: "Frame", value: "40×30 mm tubular steel" }, { label: "Legs", value: "Adjustable (25–30 cm)" }, { label: "Air vents", value: "Side anti-moisture vents" }, { label: "Colour", value: "Grey (single)" }, { label: "Warranty", value: "2 years" }],
      upsellReasons: ["Economical and comfortable mattress for this base", "Maximum comfort on this base"],
    },
  },
};

export default function ProductDetail() {
  const { lang, setLang, t } = useLang();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { id } = useParams<{ id: string }>();
  const meta = id ? productMeta[id] : null;
  const content = id ? productContent[id]?.[lang] : null;
  const tProduct = id ? t.products[id] : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [pillowModal, setPillowModal] = useState(false);
  const [pillowChoice, setPillowChoice] = useState<"double" | "two-singles" | null>(null);
  const [pillowError, setPillowError] = useState(false);

  if (!meta || !content || !tProduct) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{lang === "es" ? "Producto no encontrado" : "Product not found"}</p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {lang === "es" ? "Volver a productos" : "Back to products"}
          </Button>
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    setPillowChoice(null);
    setPillowError(false);
    setPillowModal(true);
  };

  const handleContinueToCheckout = () => {
    if (!pillowChoice) {
      setPillowError(true);
      return;
    }
    const note = pillowChoice === "double" ? "Regalo: 1 almohada doble española" : "Regalo: 2 almohadas individuales";
    const variantId = id && selectedSize ? SHOPIFY_VARIANTS[id]?.[selectedSize] : null;
    let url: string;
    if (variantId) {
      url = `https://${SHOPIFY_STORE}/cart/${variantId}:1?attributes[Regalo almohada]=${encodeURIComponent(note)}`;
    } else {
      url = `https://${SHOPIFY_STORE}/products/${meta.id}?note=${encodeURIComponent(note)}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setPillowModal(false);
  };

  const handlePillowSelect = (choice: "double" | "two-singles") => {
    setPillowChoice(choice);
    setPillowError(false);
    const note = choice === "double" ? "Regalo: 1 almohada doble española" : "Regalo: 2 almohadas individuales";
    const variantId = id && selectedSize ? SHOPIFY_VARIANTS[id]?.[selectedSize] : null;
    let url: string;
    if (variantId) {
      url = `https://${SHOPIFY_STORE}/cart/${variantId}:1?attributes[Regalo almohada]=${encodeURIComponent(note)}`;
    } else {
      url = `https://${SHOPIFY_STORE}/products/${meta.id}?note=${encodeURIComponent(note)}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setPillowModal(false);
  };

  const handleWhatsApp = () => {
    const sizeText = selectedSize ? ` (${selectedSize})` : "";
    const msg = lang === "es"
      ? `Hola, me interesa el ${tProduct.name}${sizeText}. ¿Podéis visitarme o puedo reservar sin pagar?`
      : `Hello, I'm interested in the ${tProduct.name}${sizeText}. Can you visit me or can I reserve without paying upfront?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  // Convert prices using currency context
  const getSizePrice = (sizeIdx: number): string => {
    const baseArr = id ? BASE_PRICES_BY_SIZE[id] : undefined;
    const base = baseArr?.[sizeIdx];
    if (base == null) return meta.sizes[sizeIdx]?.price ?? "";
    const prefix = lang === "es" ? "Desde" : "From";
    return `${prefix} ${formatPrice(base)}`;
  };

  const selectedSizeIdx = selectedSize ? meta.sizes.findIndex(s => s.label === selectedSize) : 0;
  const selectedPrice = getSizePrice(selectedSizeIdx < 0 ? 0 : selectedSizeIdx);

  const categoryLabel = lang === "es"
    ? (meta.category === "canapes" ? "Canapés" : meta.category === "colchones" ? "Colchones" : "Bases")
    : (meta.category === "canapes" ? "Storage Beds" : meta.category === "colchones" ? "Mattresses" : "Divan Bases");

  const deliveryItems = lang === "es" ? [
    { title: "Entrega en 48 horas", desc: "Toda la Comunidad de Madrid" },
    { title: "Montaje incluido", desc: "Nuestro equipo monta el producto en tu habitación sin coste adicional" },
    { title: "Formas de pago", desc: "Efectivo, Bizum, tarjeta crédito/débito o contrareembolso al recibir" },
    { title: "14 días de devolución", desc: "Si no estás satisfecho, recogemos el producto sin preguntas" },
  ] : [
    { title: "48-hour delivery", desc: "Entire Community of Madrid" },
    { title: "Assembly included", desc: "Our team assembles the product in your room at no extra cost" },
    { title: "Payment options", desc: "Cash, Bizum, credit/debit card or cash on delivery" },
    { title: "14-day returns", desc: "If you're not satisfied, we collect the product — no questions asked" },
  ];

  const testimonials = lang === "es" ? [
    { name: "María G.", location: "Fuenlabrada", text: "Pedí el canapé el lunes y lo tenía el miércoles. El chico fue muy amable y lo subió él solo." },
    { name: "Carlos R.", location: "Leganés", text: "Vinieron a casa a enseñarme los colchones sin compromiso. Al final compré el Hybrid HR y estoy encantado." },
    { name: "Ana M.", location: "Getafe", text: "Precio muy competitivo y entrega rapidísima. El colchón es exactamente lo que buscaba." },
  ] : [
    { name: "María G.", location: "Fuenlabrada", text: "I ordered the storage bed on Monday and had it by Wednesday. The delivery guy was really helpful and brought it up on his own." },
    { name: "Carlos R.", location: "Leganés", text: "They came to my house to show me the mattresses with no pressure. I ended up buying the Hybrid HR and I'm delighted." },
    { name: "Ana M.", location: "Getafe", text: "Very competitive prices and incredibly fast delivery. The mattress is exactly what I was looking for." },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Pillow Gift Modal */}
        <Dialog open={pillowModal} onOpenChange={setPillowModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5 text-primary" />
                {t.pillowTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t.pillowDesc(tProduct.name)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 my-2">
              <button
                onClick={() => handlePillowSelect("double")}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                  pillowChoice === "double" ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div className="font-semibold text-sm text-foreground flex items-center justify-between">
                  {t.pillowOption1Title}
                  <span className="text-xs text-primary font-medium">{t.pillowChooseLabel}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.pillowOption1Desc}</div>
              </button>
              <button
                onClick={() => handlePillowSelect("two-singles")}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                  pillowChoice === "two-singles" ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div className="font-semibold text-sm text-foreground flex items-center justify-between">
                  {t.pillowOption2Title}
                  <span className="text-xs text-primary font-medium">{t.pillowChooseLabel}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.pillowOption2Desc}</div>
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

        {/* Top bar */}
        <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium tracking-wide">
          {t.topBar}
        </div>

        {/* Nav */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/manus-storage/camas-madrid-logo_4301d5f6.png"
                alt={t.brandName}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <div className="flex items-center rounded-full border border-border bg-muted/50 p-0.5 text-xs font-medium">
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
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === "es" ? "Volver a productos" : "Back to products"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">{lang === "es" ? "Inicio" : "Home"}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#productos" className="hover:text-foreground transition-colors">{categoryLabel}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{tProduct.name}</span>
          </nav>
        </div>

        {/* Main product section */}
        <div className="container pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                <img src={meta.image} alt={tProduct.name} className="w-full h-full object-cover" />
              </div>
              <Badge className={`absolute top-4 left-4 text-xs font-semibold ${meta.badgeColor}`}>
                {tProduct.badge}
              </Badge>
              {/* Trust badges */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: lang === "es" ? "Entrega 48h" : "48h Delivery", sub: lang === "es" ? "Garantizada" : "Guaranteed" },
                  { icon: Shield, label: lang === "es" ? "Garantía" : "Warranty", sub: "2–10 años" },
                  { icon: Package, label: lang === "es" ? "Montaje" : "Assembly", sub: lang === "es" ? "Incluido" : "Included" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 text-center">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{label}</span>
                    <span className="text-[10px] text-muted-foreground">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {tProduct.name}
                </h1>
                <p className="text-muted-foreground mt-1">{content.subtitle}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{selectedPrice}</span>
                <span className="text-sm text-muted-foreground line-through">{lang === "es" ? "Precio de mercado +20%" : "Market price +20%"}</span>
              </div>

              {/* Size selector */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-foreground">{lang === "es" ? "Elige tu medida:" : "Choose your size:"}</span>
                  {!selectedSize && (
                    <span className="text-xs text-amber-600 font-medium">{lang === "es" ? "← Selecciona antes de comprar" : "← Select before buying"}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {meta.sizes.map((size, idx) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`rounded-lg border-2 p-3 text-left transition-all ${
                        selectedSize === size.label
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-sm font-semibold text-foreground">{size.label}</div>
                      <div className="text-xs text-primary font-medium mt-0.5">{getSizePrice(idx)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold gap-2"
                  onClick={handleBuyNow}
                >
                  <CreditCard className="w-5 h-5" />
                  {t.btnBuyNow}
                </Button>
                <p className="text-xs text-center text-muted-foreground -mt-1">
                  {t.btnBuyNowSub}
                </p>
                {/* Delivery notice for Articulado */}
                {id === "canape-articulado" && (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800">
                    <span className="text-base leading-none mt-0.5">⏱️</span>
                    <p>
                      {lang === "es"
                        ? <><strong>Entrega en 5–10 días laborables.</strong> El mecanismo motorizado requiere un plazo de preparación adicional. El resto de nuestros productos se entregan en <strong>48 horas</strong>.</>
                        : <><strong>Delivery in 5–10 working days.</strong> The motorised mechanism requires extra preparation time. All our other products are delivered in <strong>48 hours</strong>.</>
                      }
                    </p>
                  </div>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-semibold gap-2 border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      {t.btnTryPay}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm" side="bottom">
                    🚐 <strong>{lang === "es" ? "Showroom Móvil" : "Mobile Showroom"}</strong> — {t.tooltipTryPay}
                  </TooltipContent>
                </Tooltip>
                <p className="text-xs text-center text-muted-foreground -mt-1">
                  {t.btnTryPaySub}
                </p>
              </div>

              {/* Short description */}
              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                {content.longDescription}
              </p>
            </div>
          </div>

          {/* Features & Specs */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">{lang === "es" ? "Características" : "Features"}</h2>
              <ul className="space-y-2">
                {content.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">{lang === "es" ? "Especificaciones" : "Specifications"}</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                {content.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                  >
                    <span className="text-muted-foreground font-medium">{spec.label}</span>
                    <span className="text-foreground font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upsell */}
          {meta.upsellIds && meta.upsellIds.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">
                {lang === "es" ? "Completa tu compra" : "Complete your setup"}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                {lang === "es" ? `Productos que combinan perfectamente con el ${tProduct.name}` : `Products that pair perfectly with the ${tProduct.name}`}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {meta.upsellIds.map((upsellId, idx) => {
                  const upsellProduct = t.products[upsellId];
                  const upsellMeta = productMeta[upsellId];
                  const reason = content.upsellReasons[idx] ?? "";
                  if (!upsellProduct || !upsellMeta) return null;
                  return (
                    <div key={upsellId} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 transition-colors bg-card">
                      <div>
                        <div className="font-semibold text-sm text-foreground">{upsellProduct.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{reason}</div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-sm font-bold text-primary">{upsellMeta.sizes[0]?.price}</div>
                        <Link href={`/producto/${upsellId}`}>
                          <button className="text-xs text-primary hover:underline mt-0.5">{lang === "es" ? "Ver →" : "View →"}</button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-6">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              {lang === "es" ? "Entrega y pago" : "Delivery & payment"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {deliveryItems.map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">{title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-12">
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">{t.testimonialsTitle}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {testimonials.map((review) => (
                <div key={review.name} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">"{review.text}"</p>
                  <div className="mt-3 text-xs text-muted-foreground font-medium">{review.name} · {review.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">{t.brandName}</p>
            <p>Comunidad de Madrid · WhatsApp: <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-primary hover:underline">+34 711 204 284</a></p>
            <p className="mt-2 text-xs">{t.footerCopyright}</p>
          </div>
        </footer>

        {/* WhatsApp floating */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, me interesa uno de vuestros productos. ¿Podéis ayudarme?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </a>
      </div>
    </TooltipProvider>
  );
}
