import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  ArrowLeft, Truck, Shield, Star, CheckCircle, MessageCircle,
  CreditCard, Gift, ChevronRight, Package, Info
} from "lucide-react";

const WHATSAPP_NUMBER = "34711204284";

const CANAPE_EXCELLENT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-excellent-clean-NSFixs2vvWmm2KZbrrBBqL.webp";
const CANAPE_PREMIUM = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-premium-v2-HdWMbhFnc8FSscqxCXzBZu.webp";
const CANAPE_ARTICULADO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-articulado-clean-eHwfxaXXiMCRYiXe3s7YjH.webp";
const COLCHON_HYBRID = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-hybrid-hr-clean-967DAKq2PKQgB5zAs3fLUg.webp";
const COLCHON_MEMORY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-new-memory-hr-clean-mC9twP9Jw4fHPT9PjuVUvr.webp";
const BASE_LUCY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/base-lucy-clean-jXtnAsBSxs6PHZnBuQTXMB.webp";

interface ProductData {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
  longDescription: string;
  sizes: { label: string; price: string }[];
  features: string[];
  specs: { label: string; value: string }[];
  category: "canapes" | "colchones" | "bases";
  upsell?: { name: string; price: string; reason: string }[];
}

const products: Record<string, ProductData> = {
  "canape-excellent": {
    id: "canape-excellent",
    name: "Canapé Excellent",
    subtitle: "Canapé abatible de madera con almacenaje",
    image: CANAPE_EXCELLENT,
    badge: "Más vendido",
    badgeColor: "bg-amber-100 text-amber-800",
    description: "Canapé abatible de madera con 28 cm de almacenaje interior. Disponible en 4 colores.",
    longDescription: "El Canapé Excellent es nuestra opción más popular por su relación calidad-precio. Fabricado con estructura de madera maciza y tapa abatible de 3D transpirable, ofrece 28 cm de almacenaje interior — ideal para guardar ropa de cama, mantas y más. Disponible en blanco, gris, beige y wengué.",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 249€" },
      { label: "105 × 190 cm", price: "Desde 279€" },
      { label: "135 × 190 cm", price: "Desde 309€" },
      { label: "150 × 190 cm", price: "Desde 339€" },
    ],
    features: [
      "28 cm de almacenaje interior",
      "Tapa abatible con apertura suave",
      "Estructura de madera maciza reforzada",
      "Tapa 3D transpirable antiácaros",
      "Disponible en 4 colores",
      "Montaje incluido en entrega",
    ],
    specs: [
      { label: "Material", value: "Madera maciza + tapa 3D transpirable" },
      { label: "Almacenaje", value: "28 cm de profundidad" },
      { label: "Colores", value: "Blanco, Gris, Beige, Wengué" },
      { label: "Profundidad cama", value: "190 cm (estándar)" },
      { label: "Garantía", value: "2 años" },
      { label: "Entrega", value: "48 horas garantizadas" },
    ],
    category: "canapes",
    upsell: [
      { name: "Colchón New Memory HR", price: "Desde 149€", reason: "El colchón más popular para este canapé" },
      { name: "Colchón Hybrid HR", price: "Desde 299€", reason: "Máximo confort con muelles ensacados" },
    ],
  },
  "canape-premium": {
    id: "canape-premium",
    name: "Canapé Premium",
    subtitle: "Canapé abatible tapizado en polipiel",
    image: CANAPE_PREMIUM,
    badge: "Premium",
    badgeColor: "bg-slate-100 text-slate-700",
    description: "Canapé abatible tapizado en polipiel con 30 cm de almacenaje. Acabado elegante.",
    longDescription: "El Canapé Premium eleva el dormitorio con su tapizado en polipiel de alta calidad. Con 30 cm de almacenaje y una tapa de apertura suave, combina funcionalidad y elegancia. Ideal para dormitorios modernos o nórdicos. Disponible en gris perla, blanco roto y antracita.",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 329€" },
      { label: "135 × 190 cm", price: "Desde 389€" },
      { label: "150 × 190 cm", price: "Desde 429€" },
    ],
    features: [
      "30 cm de almacenaje interior",
      "Tapizado en polipiel resistente",
      "Apertura suave con pistones de gas",
      "Estructura reforzada de alta densidad",
      "Acabado cosido a mano",
      "Montaje incluido en entrega",
    ],
    specs: [
      { label: "Material", value: "Polipiel premium + estructura madera" },
      { label: "Almacenaje", value: "30 cm de profundidad" },
      { label: "Colores", value: "Gris perla, Blanco roto, Antracita" },
      { label: "Profundidad cama", value: "190 cm (estándar)" },
      { label: "Garantía", value: "2 años" },
      { label: "Entrega", value: "48 horas garantizadas" },
    ],
    category: "canapes",
    upsell: [
      { name: "Colchón Hybrid HR", price: "Desde 299€", reason: "Combina perfectamente con el Premium" },
      { name: "Base Tapizada Lucy", price: "Desde 129€", reason: "Para camas con cabecero separado" },
    ],
  },
  "canape-articulado": {
    id: "canape-articulado",
    name: "Canapé Articulado Motorizado",
    subtitle: "Somier articulado con motor eléctrico",
    image: CANAPE_ARTICULADO,
    badge: "Top gama",
    badgeColor: "bg-blue-100 text-blue-800",
    description: "Canapé articulado motorizado con somier de láminas integrado. Confort máximo.",
    longDescription: "El Canapé Articulado Motorizado es la cúspide del confort. Con motor eléctrico silencioso, puedes ajustar la posición de cabeza y pies con un mando a distancia. Las láminas de madera flexible se adaptan a tu cuerpo para un descanso óptimo. Incluye función anti-ronquidos (elevación de cabeza).",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 499€" },
      { label: "105 × 190 cm", price: "Desde 549€" },
      { label: "135 × 190 cm", price: "Desde 629€" },
      { label: "150 × 190 cm", price: "Desde 699€" },
    ],
    features: [
      "Motor eléctrico silencioso",
      "Mando a distancia incluido",
      "Láminas de madera flexible",
      "Función anti-ronquidos",
      "Posición lectura y TV",
      "Montaje e instalación incluidos",
    ],
    specs: [
      { label: "Motor", value: "Eléctrico silencioso (< 45dB)" },
      { label: "Control", value: "Mando a distancia inalámbrico" },
      { label: "Láminas", value: "Madera de abedul flexible" },
      { label: "Funciones", value: "Cabeza, pies, anti-ronquidos" },
      { label: "Garantía", value: "3 años (motor 5 años)" },
      { label: "Entrega", value: "48 horas garantizadas" },
    ],
    category: "canapes",
    upsell: [
      { name: "Colchón Hybrid HR", price: "Desde 299€", reason: "Recomendado para bases articuladas" },
    ],
  },
  "colchon-memory": {
    id: "colchon-memory",
    name: "Colchón New Memory HR",
    subtitle: "Viscoelástico de alta resistencia · 21 cm",
    image: COLCHON_MEMORY,
    badge: "Económico",
    badgeColor: "bg-green-100 text-green-800",
    description: "Colchón de espuma viscoelástica y HR de alta resistencia. Ideal para uso diario.",
    longDescription: "El Colchón New Memory HR ofrece la comodidad de la viscoelástica a un precio accesible. Con 21 cm de altura total, combina una capa superior de memoria viscoelástica con un núcleo de espuma HR de alta resistencia. Tratamiento antiácaros y funda lavable incluida.",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 149€" },
      { label: "105 × 190 cm", price: "Desde 169€" },
      { label: "135 × 190 cm", price: "Desde 189€" },
      { label: "150 × 190 cm", price: "Desde 209€" },
      { label: "160 × 190 cm", price: "Desde 229€" },
      { label: "180 × 190 cm", price: "Desde 249€" },
    ],
    features: [
      "Capa viscoelástica adaptable",
      "Núcleo HR de alta resistencia",
      "21 cm de altura total",
      "Tratamiento antiácaros",
      "Funda lavable con cremallera",
      "Reversible (cara verano/invierno)",
    ],
    specs: [
      { label: "Altura total", value: "21 cm" },
      { label: "Capa superior", value: "3 cm viscoelástica" },
      { label: "Núcleo", value: "HR alta resistencia 18 cm" },
      { label: "Funda", value: "Tejido Aloe Vera lavable" },
      { label: "Firmeza", value: "Media (adaptable)" },
      { label: "Garantía", value: "5 años" },
    ],
    category: "colchones",
    upsell: [
      { name: "Canapé Excellent", price: "Desde 249€", reason: "El canapé más popular para este colchón" },
      { name: "Base Tapizada Lucy", price: "Desde 129€", reason: "Base económica y resistente" },
    ],
  },
  "colchon-hybrid": {
    id: "colchon-hybrid",
    name: "Colchón Hybrid HR",
    subtitle: "Muelles ensacados + Viscoelástica Aloe · 31 cm",
    image: COLCHON_HYBRID,
    badge: "Premium",
    badgeColor: "bg-slate-100 text-slate-700",
    description: "Muelles ensacados con capa de viscoelástica con aloe vera. Alta resistencia para mayor peso.",
    longDescription: "El Colchón Hybrid HR combina lo mejor de dos mundos: la transpirabilidad y soporte de los muelles ensacados con la comodidad de la viscoelástica enriquecida con aloe vera. Con 31 cm de altura, ofrece un descanso premium. Especialmente recomendado para personas con más de 90 kg o parejas con pesos muy diferentes.",
    sizes: [
      { label: "90 × 190 cm", price: "Desde 299€" },
      { label: "105 × 190 cm", price: "Desde 339€" },
      { label: "135 × 190 cm", price: "Desde 379€" },
      { label: "150 × 190 cm", price: "Desde 419€" },
      { label: "160 × 190 cm", price: "Desde 449€" },
      { label: "180 × 190 cm", price: "Desde 499€" },
    ],
    features: [
      "Muelles ensacados independientes",
      "Capa viscoelástica con Aloe Vera",
      "31 cm de altura premium",
      "Alta transpirabilidad",
      "Ideal para peso superior a 90 kg",
      "Funda lavable con cremallera",
    ],
    specs: [
      { label: "Altura total", value: "31 cm" },
      { label: "Muelles", value: "Ensacados independientes" },
      { label: "Capa superior", value: "5 cm visco Aloe Vera" },
      { label: "Transpirabilidad", value: "Alta (muelles ventilados)" },
      { label: "Firmeza", value: "Media-alta" },
      { label: "Garantía", value: "10 años" },
    ],
    category: "colchones",
    upsell: [
      { name: "Canapé Premium", price: "Desde 329€", reason: "Combinación perfecta para dormitorio premium" },
      { name: "Canapé Articulado", price: "Desde 499€", reason: "Máximo confort con base articulada" },
    ],
  },
  "base-lucy": {
    id: "base-lucy",
    name: "Base Tapizada Lucy",
    subtitle: "Tela 3D transpirable con aireadores laterales",
    image: BASE_LUCY,
    badge: "Nuevo",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Base tapizada en tela 3D gris con aireadores laterales. Estructura tubular 40×30mm.",
    longDescription: "La Base Tapizada Lucy es la solución perfecta cuando quieres un look limpio y moderno sin canapé. Tapizada en tela 3D gris transpirable con aireadores laterales para evitar la humedad. Estructura tubular de acero 40×30mm de alta resistencia. Patas regulables en altura. Compatible con todos nuestros colchones.",
    sizes: [
      { label: "80 × 190 cm", price: "Desde 129€" },
      { label: "90 × 190 cm", price: "Desde 139€" },
      { label: "105 × 190 cm", price: "Desde 159€" },
      { label: "135 × 190 cm", price: "Desde 179€" },
      { label: "150 × 190 cm", price: "Desde 199€" },
    ],
    features: [
      "Tela 3D transpirable antiácaros",
      "Aireadores laterales anti-humedad",
      "Estructura tubular 40×30 mm",
      "Patas regulables en altura",
      "Fácil montaje sin herramientas",
      "Compatible con todos los colchones",
    ],
    specs: [
      { label: "Tapizado", value: "Tela 3D gris transpirable" },
      { label: "Estructura", value: "Acero tubular 40×30 mm" },
      { label: "Patas", value: "Regulables (25–30 cm)" },
      { label: "Aireadores", value: "Laterales anti-humedad" },
      { label: "Color", value: "Gris (único)" },
      { label: "Garantía", value: "2 años" },
    ],
    category: "bases",
    upsell: [
      { name: "Colchón New Memory HR", price: "Desde 149€", reason: "Colchón económico y cómodo para esta base" },
      { name: "Colchón Hybrid HR", price: "Desde 299€", reason: "Máximo confort sobre esta base" },
    ],
  },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? products[id] : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [pillowModal, setPillowModal] = useState(false);
  const [pillowChoice, setPillowChoice] = useState<"double" | "two-singles" | null>(null);
  const [pillowError, setPillowError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver a productos
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
    const sizeNote = selectedSize ? ` — Talla: ${selectedSize}` : "";
    const note = (pillowChoice === "double" ? "Regalo: 1 almohada doble española" : "Regalo: 2 almohadas individuales") + sizeNote;
    const url = `https://descanso-rapido-castilla.myshopify.com/products/${product.id}?note=${encodeURIComponent(note)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setPillowModal(false);
  };

  const handlePillowSelect = (choice: "double" | "two-singles") => {
    setPillowChoice(choice);
    setPillowError(false);
    const sizeNote = selectedSize ? ` — Talla: ${selectedSize}` : "";
    const note = (choice === "double" ? "Regalo: 1 almohada doble española" : "Regalo: 2 almohadas individuales") + sizeNote;
    const url = `https://descanso-rapido-castilla.myshopify.com/products/${product.id}?note=${encodeURIComponent(note)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setPillowModal(false);
  };

  const handleWhatsApp = () => {
    const sizeText = selectedSize ? ` en talla ${selectedSize}` : "";
    const msg = `Hola, me interesa el ${product.name}${sizeText}. ¿Podéis visitarme o puedo reservar sin pagar?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const selectedPrice = selectedSize
    ? product.sizes.find(s => s.label === selectedSize)?.price
    : product.sizes[0]?.price;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Pillow Gift Modal */}
        <Dialog open={pillowModal} onOpenChange={setPillowModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5 text-primary" />
                ¡Tu almohada de regalo!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Por comprar <strong>{product.name}</strong> online, te regalamos una almohada. ¿Cuál prefieres?
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
                  🛏️ Almohada doble española
                  <span className="text-xs text-primary font-medium">Elegir →</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Una almohada grande estilo matrimonial (150×45 cm aprox.)</div>
              </button>
              <button
                onClick={() => handlePillowSelect("two-singles")}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                  pillowChoice === "two-singles" ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div className="font-semibold text-sm text-foreground flex items-center justify-between">
                  🛏️🛏️ Dos almohadas individuales
                  <span className="text-xs text-primary font-medium">Elegir →</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Dos almohadas individuales (70×40 cm aprox. cada una)</div>
              </button>
            </div>
            {pillowError && (
              <p className="text-xs text-center text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                👆 Por favor, elige tu almohada de regalo para continuar
              </p>
            )}
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={handleContinueToCheckout}
            >
              <CreditCard className="w-4 h-4" />
              Continuar al pago →
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Entrega garantizada en 48h · 14 días de devolución gratuita
            </p>
          </DialogContent>
        </Dialog>

        {/* Top bar */}
        <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium tracking-wide">
          🚚 Entrega en 48 horas · Fuenlabrada y alrededores · Pago al recibir disponible
        </div>

        {/* Nav */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">DR</span>
              </div>
              <div>
                <div className="font-serif font-semibold text-foreground leading-tight text-base">Descanso Rápido</div>
                <div className="text-xs text-muted-foreground leading-tight">Castilla · Madrid</div>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver a productos</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#productos" className="hover:text-foreground transition-colors capitalize">
              {product.category === "canapes" ? "Canapés" : product.category === "colchones" ? "Colchones" : "Bases"}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Main product section */}
        <div className="container pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Badge className={`absolute top-4 left-4 text-xs font-semibold ${product.badgeColor}`}>
                {product.badge}
              </Badge>
              {/* Trust badges */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Entrega 48h", sub: "Garantizada" },
                  { icon: Shield, label: "Garantía", sub: "2–10 años" },
                  { icon: Package, label: "Montaje", sub: "Incluido" },
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
                  {product.name}
                </h1>
                <p className="text-muted-foreground mt-1">{product.subtitle}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{selectedPrice}</span>
                <span className="text-sm text-muted-foreground line-through">Precio de mercado +20%</span>
              </div>

              {/* Size selector */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-foreground">Elige tu medida:</span>
                  {!selectedSize && (
                    <span className="text-xs text-amber-600 font-medium">← Selecciona antes de comprar</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.sizes.map((size) => (
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
                      <div className="text-xs text-primary font-medium mt-0.5">{size.price}</div>
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
                  Comprar ahora
                </Button>
                <p className="text-xs text-center text-muted-foreground -mt-1">
                  🎁 Almohada gratis · 48h garantizadas · 14 días devolución
                </p>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-semibold gap-2 border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Probar o pagar contrarembolso
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm" side="bottom">
                    🚐 <strong>Showroom Móvil</strong> — Nos desplazamos a tu casa con muestras para que veas y toques el producto antes de decidir. Sin compromiso. O recíbelo y paga al repartidor en efectivo, Bizum o tarjeta.
                  </TooltipContent>
                </Tooltip>
                <p className="text-xs text-center text-muted-foreground -mt-1">
                  Prueba en casa o paga al recibir — sin tarjeta por adelantado
                </p>
              </div>

              {/* Short description */}
              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                {product.longDescription}
              </p>
            </div>
          </div>

          {/* Features & Specs */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">Características</h2>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specs */}
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">Especificaciones</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between px-4 py-3 text-sm ${
                      i % 2 === 0 ? "bg-muted/30" : "bg-background"
                    }`}
                  >
                    <span className="text-muted-foreground font-medium">{spec.label}</span>
                    <span className="text-foreground font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upsell */}
          {product.upsell && product.upsell.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Completa tu compra</h2>
              <p className="text-sm text-muted-foreground mb-5">Productos que combinan perfectamente con el {product.name}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.upsell.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 transition-colors bg-card">
                    <div>
                      <div className="font-semibold text-sm text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.reason}</div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-sm font-bold text-primary">{item.price}</div>
                      <Link href={`/producto/${item.name.toLowerCase().replace(/\s+/g, "-").replace(/[áàä]/g, "a").replace(/[éèë]/g, "e").replace(/[íìï]/g, "i").replace(/[óòö]/g, "o").replace(/[úùü]/g, "u").replace(/ñ/g, "n")}`}>
                        <button className="text-xs text-primary hover:underline mt-0.5">Ver →</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-6">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Entrega y pago
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { title: "Entrega en 48 horas", desc: "Fuenlabrada, Leganés, Getafe, Móstoles, Alcorcón, Parla y alrededores" },
                { title: "Montaje incluido", desc: "Nuestro equipo monta el producto en tu habitación sin coste adicional" },
                { title: "Formas de pago", desc: "Efectivo, Bizum, tarjeta crédito/débito o contrareembolso al recibir" },
                { title: "14 días de devolución", desc: "Si no estás satisfecho, recogemos el producto sin preguntas" },
              ].map(({ title, desc }) => (
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
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">Lo que dicen nuestros clientes</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "María G.", location: "Fuenlabrada", text: "Pedí el canapé el lunes y lo tenía el miércoles. El chico fue muy amable y lo subió él solo." },
                { name: "Carlos R.", location: "Leganés", text: "Vinieron a casa a enseñarme los colchones sin compromiso. Al final compré el Hybrid HR y estoy encantado." },
                { name: "Ana M.", location: "Getafe", text: "Precio muy competitivo y entrega rapidísima. El colchón es exactamente lo que buscaba." },
              ].map((t) => (
                <div key={t.name} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">"{t.text}"</p>
                  <div className="mt-3 text-xs text-muted-foreground font-medium">{t.name} · {t.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Descanso Rápido Castilla</p>
            <p>Fuenlabrada, Madrid · WhatsApp: <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-primary hover:underline">+34 711 204 284</a></p>
            <p className="mt-2 text-xs">© 2025 Descanso Rápido Castilla. Todos los derechos reservados.</p>
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
