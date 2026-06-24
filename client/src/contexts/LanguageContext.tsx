import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "es" | "en";

export interface Translations {
  // Nav & top bar
  topBar: string;
  navProducts: string;
  navShowroom: string;
  navDelivery: string;
  navContact: string;
  navWhatsApp: string;
  brandSubtitle: string;

  // Hero
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroTrust1: string;
  heroTrust2: string;
  heroTrust3: string;

  // USP strip
  usp1Title: string;
  usp1Desc: string;
  usp2Title: string;
  usp2Desc: string;
  usp3Title: string;
  usp3Desc: string;
  usp4Title: string;
  usp4Desc: string;

  // Products section
  productsTitle: string;
  productsSubtitle: string;
  filterAll: string;
  filterCanapes: string;
  filterColchones: string;
  filterBases: string;
  productSizeHint: string;
  btnBuyNow: string;
  btnBuyNowSub: string;
  btnTryPay: string;
  btnTryPaySub: string;
  tooltipTryPay: string;
  upsellPromptTitle: string;
  upsellPromptDesc: string;
  upsellPromptBtn: string;
  productVerDetalles: string;

  // Size picker modal
  sizeModalTitle: string;
  sizeModalDesc: (name: string) => string;
  sizeModalContinue: string;
  sizeModalCancel: string;

  // Pillow modal
  pillowTitle: string;
  pillowDesc: (name: string) => string;
  pillowOption1Title: string;
  pillowOption1Desc: string;
  pillowOption2Title: string;
  pillowOption2Desc: string;
  pillowChooseLabel: string;
  pillowContinue: string;
  pillowError: string;
  pillowFooter: string;

  // Showroom section
  showroomBadge: string;
  showroomTitle: string;
  showroomDesc: string;
  showroomNote: string;
  showroomFeature1: string;
  showroomFeature2: string;
  showroomFeature3: string;
  showroomFeature4: string;
  showroomBtn: string;
  showroomAreas: string;

  // Delivery section
  deliveryTitle: string;
  deliverySubtitle: string;
  delivery1Title: string;
  delivery1Desc: string;
  delivery2Title: string;
  delivery2Desc: string;
  delivery3Title: string;
  delivery3Desc: string;
  delivery4Title: string;
  delivery4Desc: string;

  // Payment methods
  paymentTitle: string;
  paymentSubtitle: string;
  payment1Label: string;
  payment1Desc: string;
  payment2Label: string;
  payment2Desc: string;
  payment3Label: string;
  payment3Desc: string;
  payment4Label: string;
  payment4Desc: string;

  // Testimonials
  testimonialsTitle: string;
  testimonial1Text: string;
  testimonial2Text: string;
  testimonial3Text: string;

  // CTA section
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn1: string;
  ctaBtn2: string;

  // Footer
  footerTagline: string;
  footerAddress: string;
  footerCopyright: string;

  // Product names & descriptions
  products: {
    [key: string]: {
      name: string;
      subtitle: string;
      description: string;
      badge: string;
    };
  };
}

const es: Translations = {
  topBar: "🚚 Entrega en 48 horas · Comunidad de Madrid · Pago al recibir disponible",
  navProducts: "Productos",
  navShowroom: "Showroom Móvil",
  navDelivery: "Entrega",
  navContact: "Contacto",
  navWhatsApp: "WhatsApp",
  brandSubtitle: "Castilla · Madrid",

  heroBadge: "⚡ Entrega garantizada en 48 horas",
  heroTitle1: "Tu cama nueva,",
  heroTitle2: "en dos días.",
  heroDesc: "Canapés, colchones y bases tapizadas de calidad. Entregamos con nuestras propias furgonetas en toda la Comunidad de Madrid.",
  heroCtaPrimary: "Ver productos",
  heroCtaSecondary: "Showroom en tu casa",
  heroTrust1: "Sin intermediarios",
  heroTrust2: "Pago al recibir",
  heroTrust3: "Montaje incluido",

  usp1Title: "Entrega 48h",
  usp1Desc: "Con nuestras furgonetas",
  usp2Title: "Comunidad de Madrid",
  usp2Desc: "Entrega en toda la región",
  usp3Title: "Sin riesgos",
  usp3Desc: "Paga al recibir",
  usp4Title: "Asesoramiento",
  usp4Desc: "Te llamamos y visitamos",

  productsTitle: "Nuestros productos",
  productsSubtitle: "Selección de canapés, colchones y bases tapizadas de calidad al mejor precio.",
  filterAll: "Todos",
  filterCanapes: "Canapés",
  filterColchones: "Colchones",
  filterBases: "Bases",
  productSizeHint: "Elige talla en la página del producto",
  btnBuyNow: "Comprar ahora",
  btnBuyNowSub: "🎁 Almohada gratis · 48h garantizadas · 14 días devolución",
  btnTryPay: "Probar o pagar contrarembolso",
  btnTryPaySub: "Prueba en casa o paga al recibir — sin tarjeta por adelantado",
  tooltipTryPay: "🚐 Probar o pagar contrarembolso\nVen a probar en casa con nuestro showroom móvil, o recibe el producto y paga al repartidor — en efectivo, Bizum o tarjeta. Sin riesgo, sin compromiso previo.",
  upsellPromptTitle: "💡 ¿Comprando canapé y colchón juntos?",
  upsellPromptDesc: "Consigue un descuento especial al pedir los dos. Escríbenos por WhatsApp y te hacemos precio.",
  upsellPromptBtn: "Consultar precio conjunto",
  productVerDetalles: "Ver detalles →",

  sizeModalTitle: "Elige tu talla",
  sizeModalDesc: (name) => `Selecciona el tamaño de tu ${name} para continuar al pago:`,
  sizeModalContinue: "Continuar →",
  sizeModalCancel: "Cancelar",

  pillowTitle: "¡Tu almohada de regalo!",
  pillowDesc: (name) => `Por comprar ${name} online, te regalamos una almohada. ¿Cuál prefieres?`,
  pillowOption1Title: "🛏️ Almohada doble española",
  pillowOption1Desc: "Una almohada grande estilo matrimonial (150×45 cm aprox.)",
  pillowOption2Title: "🛏️🛏️ Dos almohadas individuales",
  pillowOption2Desc: "Dos almohadas individuales (70×40 cm aprox. cada una)",
  pillowChooseLabel: "Elegir →",
  pillowContinue: "Continuar al pago →",
  pillowError: "👆 Por favor, elige tu almohada de regalo para continuar",
  pillowFooter: "Entrega garantizada en 48h · 14 días de devolución gratuita",

  showroomBadge: "🚐 Servicio exclusivo",
  showroomTitle: "La cama viene a ti",
  showroomDesc: "¿No puedes venir a vernos? Nosotros vamos a ti. Llegamos con un canapé montado en nuestra furgoneta showroom y una selección de colchones para que los pruebes tú mismo — túmbate, notálo, decide sin prisa y sin compromiso.",
  showroomNote: "⚠️ Nota: Los modelos disponibles en la furgoneta pueden variar según el día. Si el modelo exacto que buscas no está ese día, lo entregamos en 48h garantizadas.",
  showroomFeature1: "Visita gratuita y sin compromiso",
  showroomFeature2: "Canapé montado para ver y tocar en persona",
  showroomFeature3: "Colchones reales para tumbarte y probar",
  showroomFeature4: "Toda la Comunidad de Madrid",
  showroomBtn: "Reservar visita gratuita",
  showroomAreas: "Zonas de cobertura:",

  deliveryTitle: "Entrega en 48 horas",
  deliverySubtitle: "Garantizamos la entrega en 48 horas en toda la Comunidad de Madrid.",
  delivery1Title: "Pedido online",
  delivery1Desc: "Compra en nuestra web con tarjeta y recibe tu pedido en 48h.",
  delivery2Title: "Confirmación",
  delivery2Desc: "Te llamamos para confirmar la hora de entrega.",
  delivery3Title: "Entrega y montaje",
  delivery3Desc: "Nuestro equipo entrega y monta el producto en tu habitación.",
  delivery4Title: "Pago flexible",
  delivery4Desc: "Paga online, al recibir en efectivo, Bizum o tarjeta.",

  paymentTitle: "Formas de pago",
  paymentSubtitle: "Elige cómo prefieres pagar — sin complicaciones.",
  payment1Label: "Efectivo",
  payment1Desc: "Pago al recibir",
  payment2Label: "Bizum",
  payment2Desc: "Transferencia instantánea",
  payment3Label: "Tarjeta",
  payment3Desc: "Visa / Mastercard",
  payment4Label: "Contrareembolso",
  payment4Desc: "Paga en la entrega",

  testimonialsTitle: "Lo que dicen nuestros clientes",
  testimonial1Text: "Pedí el canapé el lunes y lo tenía el miércoles. El chico fue muy amable y lo subió él solo. Muy recomendable.",
  testimonial2Text: "Vinieron a casa a enseñarme los colchones sin compromiso. Al final compré el Hybrid HR y estoy encantado con la calidad.",
  testimonial3Text: "Precio muy competitivo y entrega rapidísima. El colchón es exactamente lo que buscaba. Repetiré seguro.",

  ctaTitle: "¿Listo para tu nueva cama?",
  ctaDesc: "Entrega en 48 horas garantizada. Paga al recibir. Sin riesgos.",
  ctaBtn1: "Ver todos los productos",
  ctaBtn2: "Hablar por WhatsApp",

  footerTagline: "Canapés, colchones y bases tapizadas. Entrega en 48h en toda la Comunidad de Madrid.",
  footerAddress: "Fuenlabrada, Madrid · +34 711 204 284",
  footerCopyright: "© 2025 Camas Madrid. Todos los derechos reservados.",

  products: {
    "canape-excellent": { name: "Canapé Excellent", subtitle: "Madera con almacenaje", description: "Canapé abatible de madera con 28 cm de almacenaje interior. Disponible en 4 colores.", badge: "Más vendido" },
    "canape-premium": { name: "Canapé Premium", subtitle: "Polipiel tapizado", description: "Canapé abatible tapizado en polipiel con 30 cm de almacenaje. Acabado elegante.", badge: "Premium" },
    "canape-articulado": { name: "Canapé Articulado", subtitle: "Motorizado con láminas", description: "Canapé articulado motorizado con somier de láminas integrado. Confort máximo.", badge: "Top gama" },
    "colchon-visconube": { name: "Colchón Visconube", subtitle: "Viscoelástico doble cara · 24 cm", description: "Núcleo HR 23 kg/m³. Cara invierno con viscoelástica + Super Soft; cara verano con tejido 3D transpirable. Banda lateral diseño.", badge: "Económico" },
    "colchon-viscografeno": { name: "Colchón Viscografeno", subtitle: "Visco grafeno doble cara · 29-30 cm", description: "Núcleo HR 25 kg/m³. Lámina viscoelástica termoreguladora + Super Soft en cara invierno; tejido 3D en cara verano.", badge: "Premium" },
    "colchon-macanuu": { name: "Colchón Macanuu", subtitle: "HR doble cara · 26 cm", description: "Núcleo HR 25 kg/m³. Ambas caras con tejido stretch 300g, fibra 250g y Super Soft. Banda lateral de tela.", badge: "Calidad-precio" },
    "base-lucy": { name: "Base Tapizada Lucy", subtitle: "Tela 3D transpirable", description: "Base tapizada en tela 3D gris con aireadores laterales. Estructura tubular 40×30mm.", badge: "Nuevo" },
  },
};

const en: Translations = {
  topBar: "🚚 48-hour delivery · Community of Madrid · Pay on delivery available",
  navProducts: "Products",
  navShowroom: "Mobile Showroom",
  navDelivery: "Delivery",
  navContact: "Contact",
  navWhatsApp: "WhatsApp",
  brandSubtitle: "Castilla · Madrid",

  heroBadge: "⚡ 48-hour delivery guaranteed",
  heroTitle1: "Your new bed,",
  heroTitle2: "in two days.",
  heroDesc: "Quality storage beds, mattresses and divan bases. We deliver with our own vans across the entire Community of Madrid.",
  heroCtaPrimary: "View products",
  heroCtaSecondary: "Home showroom visit",
  heroTrust1: "No middlemen",
  heroTrust2: "Pay on delivery",
  heroTrust3: "Assembly included",

  usp1Title: "48h Delivery",
  usp1Desc: "With our own vans",
  usp2Title: "Community of Madrid",
  usp2Desc: "Delivery across the region",
  usp3Title: "Zero risk",
  usp3Desc: "Pay on delivery",
  usp4Title: "Expert advice",
  usp4Desc: "We call and visit you",

  productsTitle: "Our products",
  productsSubtitle: "A curated range of storage beds, mattresses and divan bases at direct-from-manufacturer prices.",
  filterAll: "All",
  filterCanapes: "Storage Beds",
  filterColchones: "Mattresses",
  filterBases: "Divan Bases",
  productSizeHint: "Choose size on the product page",
  btnBuyNow: "Buy now",
  btnBuyNowSub: "🎁 Free pillow · 48h guaranteed · 14-day returns",
  btnTryPay: "Try first or pay on delivery",
  btnTryPaySub: "Try at home or pay the driver — no card needed upfront",
  tooltipTryPay: "🚐 Try first or pay on delivery\nWe bring samples to your home so you can see and feel the product before deciding. Or receive it and pay the driver in cash, Bizum or card. No risk, no commitment.",
  upsellPromptTitle: "💡 Buying a storage bed and mattress together?",
  upsellPromptDesc: "Get a special bundle discount. Message us on WhatsApp and we'll give you a price.",
  upsellPromptBtn: "Ask for bundle price",
  productVerDetalles: "View details →",

  sizeModalTitle: "Choose your size",
  sizeModalDesc: (name) => `Select the size of your ${name} to continue to checkout:`,
  sizeModalContinue: "Continue →",
  sizeModalCancel: "Cancel",

  pillowTitle: "Your free pillow!",
  pillowDesc: (name) => `As a thank you for buying ${name} online, we're including a free pillow. Which would you prefer?`,
  pillowOption1Title: "🛏️ Spanish double pillow",
  pillowOption1Desc: "One large matrimonial-style pillow (approx. 150×45 cm)",
  pillowOption2Title: "🛏️🛏️ Two individual pillows",
  pillowOption2Desc: "Two standard pillows (approx. 70×40 cm each)",
  pillowChooseLabel: "Choose →",
  pillowContinue: "Continue to checkout →",
  pillowError: "👆 Please choose your free pillow to continue",
  pillowFooter: "48h guaranteed delivery · Free 14-day returns",

  showroomBadge: "🚐 Exclusive service",
  showroomTitle: "The bed comes to you",
  showroomDesc: "Can't come to us? We come to you. We arrive with a fully assembled storage bed in our showroom van and a selection of real mattresses you can actually lie on — try them properly, take your time, and decide with no pressure.",
  showroomNote: "⚠️ Note: The models on the van may vary by day. If the exact model you want isn't available that day, we guarantee delivery within 48 hours.",
  showroomFeature1: "Free visit, no obligation to buy",
  showroomFeature2: "A real assembled bed to see and touch in person",
  showroomFeature3: "Real mattresses to lie on and try out",
  showroomFeature4: "Across the entire Community of Madrid",
  showroomBtn: "Book a free home visit",
  showroomAreas: "Coverage areas:",

  deliveryTitle: "48-hour delivery",
  deliverySubtitle: "We guarantee delivery within 48 hours across the entire Community of Madrid.",
  delivery1Title: "Order online",
  delivery1Desc: "Buy on our website by card and receive your order within 48 hours.",
  delivery2Title: "Confirmation call",
  delivery2Desc: "We call you to confirm the delivery time slot.",
  delivery3Title: "Delivery & assembly",
  delivery3Desc: "Our team delivers and assembles the product in your room.",
  delivery4Title: "Flexible payment",
  delivery4Desc: "Pay online, or on delivery in cash, Bizum or card.",

  paymentTitle: "Payment options",
  paymentSubtitle: "Choose how you want to pay — no complications.",
  payment1Label: "Cash",
  payment1Desc: "Pay on delivery",
  payment2Label: "Bizum",
  payment2Desc: "Instant bank transfer",
  payment3Label: "Card",
  payment3Desc: "Visa / Mastercard",
  payment4Label: "Cash on delivery",
  payment4Desc: "Pay the driver on arrival",

  testimonialsTitle: "What our customers say",
  testimonial1Text: "I ordered the storage bed on Monday and had it by Wednesday. The delivery guy was really helpful and brought it up on his own. Highly recommend.",
  testimonial2Text: "They came to my house to show me the mattresses with no pressure. I ended up buying the Hybrid HR and I'm delighted with the quality.",
  testimonial3Text: "Very competitive prices and incredibly fast delivery. The mattress is exactly what I was looking for. I'll definitely order again.",

  ctaTitle: "Ready for your new bed?",
  ctaDesc: "48-hour delivery guaranteed. Pay on delivery. Zero risk.",
  ctaBtn1: "View all products",
  ctaBtn2: "Chat on WhatsApp",

  footerTagline: "Storage beds, mattresses and divan bases. 48h delivery across the Community of Madrid.",
  footerAddress: "Fuenlabrada, Madrid · +34 711 204 284",
  footerCopyright: "© 2025 Camas Madrid. All rights reserved.",

  products: {
    "canape-excellent": { name: "Excellent Storage Bed", subtitle: "Solid wood with storage", description: "Lift-up storage bed in solid wood with 28 cm of internal storage. Available in 4 colours.", badge: "Best seller" },
    "canape-premium": { name: "Premium Storage Bed", subtitle: "Faux leather upholstered", description: "Lift-up storage bed upholstered in faux leather with 30 cm of storage. Elegant finish.", badge: "Premium" },
    "canape-articulado": { name: "Motorised Adjustable Bed", subtitle: "Electric with slatted base", description: "Motorised adjustable bed with integrated slatted base. Maximum comfort.", badge: "Top of range" },
    "colchon-visconube": { name: "Visconube Mattress", subtitle: "Double-sided visco · 24 cm", description: "HR core 23 kg/m³. Winter side: memory foam + Super Soft padding; summer side: 3D breathable fabric. Design side band.", badge: "Economy" },
    "colchon-viscografeno": { name: "Viscografeno Mattress", subtitle: "Graphene visco double-sided · 29-30 cm", description: "HR core 25 kg/m³. Thermo-sensitive graphene visco layer + Super Soft on winter side; 3D breathable fabric on summer side.", badge: "Premium" },
    "colchon-macanuu": { name: "Macanuu Mattress", subtitle: "HR double-sided · 26 cm", description: "HR core 25 kg/m³. Both sides: 300g stretch fabric, 250g fibre padding and Super Soft. Fabric side band.", badge: "Best value" },
    "base-lucy": { name: "Lucy Divan Base", subtitle: "Breathable 3D fabric", description: "Divan base upholstered in grey 3D breathable fabric with side air vents. 40×30mm tubular frame.", badge: "New" },
  },
};

export const translations: Record<Lang, Translations> = { es, en };

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
  t: es,
});

function getInitialLang(): Lang {
  // If the visitor arrives via bedsmadrid.com (or www.bedsmadrid.com), default to English
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  if (hostname === "bedsmadrid.com" || hostname === "www.bedsmadrid.com") {
    return "en";
  }
  return "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  // Also handle navigation to the site after initial load (e.g. if hostname changes in dev)
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === "bedsmadrid.com" || hostname === "www.bedsmadrid.com") {
      setLang("en");
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
