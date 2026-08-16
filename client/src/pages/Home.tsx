import React, { useState } from "react";
import { Link } from "wouter";
import {
  Check, ChevronDown, Clock3, MapPin, MessageCircle, PackageCheck,
  Ruler, Sparkles, Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import {
  STANDARD_SIZES,
  WHATSAPP_NUMBER,
  buildStandaloneWhatsAppEnquiry,
  buildWhatsAppEnquiry,
  canapeDetails,
  getExpressPackPrice,
  getAvailableFinishes,
  mattressTierDetails,
  productTypeLabels,
  type Availability,
  type MattressTier,
  type PurchaseType,
} from "@/lib/bedConfigurator";

const EXPRESS_CANAPE_CLOSED = "/manus-storage/express-canape-closed_ef8e4f68.jpg";
const EXPRESS_CANAPE_OPEN = "/manus-storage/express-canape-open_d9775294.jpg";
const EXPRESS_CANAPE_IMAGES: Record<string, string> = {
  "Ártico": EXPRESS_CANAPE_CLOSED,
  Blanco: "/manus-storage/express-canape-blanco_8a7cf9c2.png",
  Cambrian: "/manus-storage/express-canape-cambrian_15ce54d3.png",
  Cerezo: "/manus-storage/express-canape-cerezo_9431351e.png",
  "Wengué": "/manus-storage/express-canape-wengue_b62d82bc.png",
};
const SEPTEMBER_CANAPE_IMAGES: Record<string, string> = {
  Blanco: "/manus-storage/september-canape-closed-blanco_4f3b89a2.png",
  "Nórdico": "/manus-storage/september-canape-closed-nordico_cfc2b7a0.png",
  "Wengué": "/manus-storage/september-canape-closed-wengue_3801b18a.png",
  Cambrian: "/manus-storage/september-canape-closed-cambrian_53eedea9.png",
};

const colourTokens: Record<string, string> = {
  "Ártico": "#d9d2c8",
  "Blanco": "#f4f0e8",
  "Cambrian": "#b48a62",
  "Cerezo": "#8d5d3d",
  "Wengué": "#3b2420",
  "Nórdico": "#cbc6b6",
};

function ChoiceCard({
  active,
  onClick,
  title,
  description,
  badge,
  image,
  imageAlt,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
  badge?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.98] ${
        active
          ? "border-primary bg-primary/[0.06] shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
      }`}
    >
      {badge && (
        <span className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
          active ? "bg-primary text-primary-foreground" : "bg-emerald-100 text-emerald-800"
        }`}>
          {badge}
        </span>
      )}
      {image && <img src={image} alt={imageAlt ?? title} className="mb-3 aspect-[16/8] w-full rounded-xl object-cover" />}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-bold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
        }`}>
          {active && <Check className="h-3 w-3" />}
        </span>
      </div>
    </button>
  );
}

export default function Home() {
  const { lang, setLang, t } = useLang();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("pack");
  const [availability, setAvailability] = useState<Availability>("express");
  const [size, setSize] = useState("");
  const [mattressTier, setMattressTier] = useState<MattressTier>("express");
  const [finish, setFinish] = useState("");
  const [postcode, setPostcode] = useState("");
  const [deliveryNeed, setDeliveryNeed] = useState<"flexible" | "specific">("flexible");
  const [sizeError, setSizeError] = useState(false);

  const isSpanish = lang === "es";
  const copy = isSpanish
    ? {
        rollingOffers: ["Cama matrimonio 135 × 190 · €269", "Descuento al comprar 2 camas**", "Camas desde €249"],
        rollingOfferLabel: "Ofertas destacadas",
        twoBedFootnote: "**Mismo día, misma dirección y cualquier medida. Contacta para confirmar el descuento.",
        heroKicker: "Cama completa, sin esperar a septiembre",
        heroTitle: "Elige tu cama en pocos pasos.",
        heroText: "Empieza con nuestro Pack Express en stock. Si puedes esperar, también podrás reservar nuestras tres gamas de colchón y el canapé de madera para septiembre.",
        heroCta: "Crear mi selección",
        heroFreeDelivery: "Entrega gratis*",
        deliveryFootnote: "*Dentro de 25 km de Madrid centro y otras zonas seleccionadas. Contacta para confirmación.",
        stock: "Disponible ahora",
        productTitle: "1. ¿Qué necesitas?",
        timingTitle: "2. ¿Cuándo la necesitas?",
        timingExpress: "La necesito esta semana",
        timingSeptember: "Puedo esperar a septiembre",
        timingExpressDesc: "Muestra solamente el Pack Express y sus colores en stock.",
        timingSeptemberDesc: "Descubre tres colchones y el canapé de madera disponibles desde septiembre.",
        sizeTitle: "3. Elige tu medida",
        expressSizeTitle: "1. Elige tu medida",
        sizePlaceholder: "Selecciona una medida",
        mattressTitle: "4. Elige tu nivel de colchón",
        canapeTitle: "5. Tu canapé",
        finishTitle: "6. Elige el color o acabado",
        expressFinishTitle: "2. Elige tu color",
        finishHint: "Todos estos acabados están disponibles para la opción seleccionada.",
        expressFinishHint: "Selecciona tu color. Verás la cama después de elegir medida y color.",
        previewTitle: "Vista previa de tu selección",
        seeSeptember: "¿Puedes esperar? Ver opciones para septiembre",
        standaloneTitle: "¿Solo necesitas una pieza?",
        standaloneText: "Escríbenos directamente y te damos opciones, precio y disponibilidad.",
        standaloneCanape: "Solo canapé",
        standaloneMattress: "Solo colchón",
        postcodeTitle: "7. Código postal y entrega",
        postcodePlaceholder: "Tu código postal",
        freeZone: "Entrega gratis*",
        outsideZone: "¿Más lejos? Te damos la ruta más económica o el precio para el día que lo necesitas.",
        flexible: "Puedo ser flexible con el día",
        specific: "Necesito un día concreto",
        summaryTitle: "Tu selección",
        expressPrice: "Precio del Pack Express",
        send: "Consultar mi selección por WhatsApp",
        customSend: "Consultar medida especial por WhatsApp",
        chooseSize: "Elige tu medida para continuar",
        chooseExpressSelection: "Elige medida y color para continuar",
        customSize: "Necesito otra medida",
        expressIncluded: "Incluido en el Pack Express",
        howTitle: "Así de sencillo",
        deliveryTitle: "Entrega clara, sin sorpresas",
        freeDelivery: "Zona gratuita",
        freeDeliveryDesc: "Entrega y montaje incluidos dentro de la zona de 25 km.",
        routeDelivery: "Fuera de la zona",
        routeDeliveryDesc: "Te damos la mejor opción según nuestra próxima ruta por tu área.",
        urgentDelivery: "Día concreto o urgente",
        urgentDeliveryDesc: "Te confirmamos disponibilidad y cualquier coste antes de reservar.",
        openStorage: "Ver almacenaje interior",
        closeStorage: "Ver cama cerrada",
        imageAlt: "Canapé Express de Gran Capacidad con colchón",
        footer: "Camas, colchones y canapés con atención personal en Madrid.",
      }
    : {
        rollingOffers: ["Standard double 135 × 190 · €269", "Discount when you buy 2 beds**", "Beds from €249"],
        rollingOfferLabel: "Featured offers",
        twoBedFootnote: "**Same day, same address and any size. Contact us to confirm the discount.",
        heroKicker: "A complete bed, without waiting until September",
        heroTitle: "Choose your bed in a few simple steps.",
        heroText: "Start with our in-stock Pack Express. If you can wait, you can also reserve our three mattress ranges and wood storage bed for September.",
        heroCta: "Build my selection",
        heroFreeDelivery: "Free delivery*",
        deliveryFootnote: "*Within 25 km of central Madrid and selected additional zones. Contact us to confirm.",
        stock: "Available now",
        productTitle: "1. What do you need?",
        timingTitle: "2. When do you need it?",
        timingExpress: "I need it this week",
        timingSeptember: "I can wait until September",
        timingExpressDesc: "Shows only the in-stock Pack Express and its available colours.",
        timingSeptemberDesc: "Discover three mattress ranges and the wood storage bed available from September.",
        sizeTitle: "3. Choose your size",
        expressSizeTitle: "1. Choose your size",
        sizePlaceholder: "Select a size",
        mattressTitle: "4. Choose your mattress level",
        canapeTitle: "5. Your storage bed",
        finishTitle: "6. Choose colour or finish",
        expressFinishTitle: "2. Choose your colour",
        finishHint: "These finishes are available for the selected option.",
        expressFinishHint: "Select your colour. Your bed preview will appear once you choose size and colour.",
        previewTitle: "Your selection preview",
        seeSeptember: "Can you wait? View September options",
        standaloneTitle: "Only need one item?",
        standaloneText: "Message us directly for options, price and availability.",
        standaloneCanape: "Storage bed only",
        standaloneMattress: "Mattress only",
        postcodeTitle: "7. Postcode and delivery",
        postcodePlaceholder: "Your postcode",
        freeZone: "Free delivery*",
        outsideZone: "Further away? We will give you the most economical route or the price for the day you need it.",
        flexible: "I can be flexible with the day",
        specific: "I need a specific day",
        summaryTitle: "Your selection",
        expressPrice: "Express Pack price",
        send: "Ask about my selection on WhatsApp",
        customSend: "Ask about a custom size on WhatsApp",
        chooseSize: "Choose your size to continue",
        chooseExpressSelection: "Choose a size and colour to continue",
        customSize: "I need another size",
        expressIncluded: "Included in the Pack Express",
        howTitle: "Simple from start to finish",
        deliveryTitle: "Clear delivery, no surprises",
        freeDelivery: "Free zone",
        freeDeliveryDesc: "Delivery and assembly included within the 25 km zone.",
        routeDelivery: "Outside the zone",
        routeDeliveryDesc: "We quote the best option around our next route in your area.",
        urgentDelivery: "Specific or urgent day",
        urgentDeliveryDesc: "We confirm availability and any cost before you reserve.",
        openStorage: "See interior storage",
        closeStorage: "See closed bed",
        imageAlt: "Express large-capacity storage bed with mattress",
        footer: "Beds, mattresses and storage beds with personal service in Madrid.",
      };

  const includesMattress = purchaseType === "pack" || purchaseType === "mattress";
  const includesCanape = purchaseType === "pack" || purchaseType === "canape";
  const isExpress = availability === "express";
  const selectedCanape = availability === "express" ? "express" : "premium";
  const finishOptions = getAvailableFinishes(selectedCanape);
  const currentFinish = finishOptions.includes(finish as never) ? finish : "";
  const mattressOptions: MattressTier[] = availability === "express" ? ["express"] : ["essential", "comfort", "premium"];
  const activeMattressTier = mattressOptions.includes(mattressTier) ? mattressTier : mattressOptions[0];
  const displaySize = size === "Necesito otra medida" ? copy.customSize : size;
  const isCustomSize = size === "Necesito otra medida";
  const selectedPreview = selectedCanape === "express" ? EXPRESS_CANAPE_IMAGES[currentFinish] : SEPTEMBER_CANAPE_IMAGES[currentFinish];
  const canSendEnquiry = Boolean(size) && (!isExpress || Boolean(currentFinish));
  const expressPackPrice = isExpress && purchaseType === "pack" ? getExpressPackPrice(size) : undefined;

  function selectAvailability(next: Availability) {
    setAvailability(next);
    if (next === "express") setPurchaseType("pack");
    setMattressTier(next === "express" ? "express" : "essential");
    setFinish("");
  }

  function sendEnquiry() {
    if (!canSendEnquiry) {
      setSizeError(true);
      document.getElementById("size-step")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    window.open(
      buildWhatsAppEnquiry({
        purchaseType,
        availability,
        size,
        mattressTier: includesMattress ? activeMattressTier : undefined,
        canapeStyle: includesCanape ? selectedCanape : undefined,
        finish: includesCanape ? currentFinish : undefined,
        postcode,
        deliveryNeed,
      }, lang),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-foreground">
      <div className="bg-[#0a4178] text-xs font-semibold text-white sm:text-sm" role="region" aria-label={copy.rollingOfferLabel}>
        <span className="sr-only">{copy.rollingOffers.join(". ")}</span>
        <div className="offer-marquee" aria-hidden="true">
          <div className="offer-marquee-track">
            {[...copy.rollingOffers, ...copy.rollingOffers].map((offer, index) => (
              <span key={`${offer}-${index}`} className="offer-marquee-item">{offer}<span className="offer-marquee-separator">•</span></span>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="container flex h-[76px] items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center">
            <img src={t.logoUrl} alt={t.brandName} className="h-14 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-border bg-muted/50 p-0.5 text-xs font-bold">
              <button onClick={() => setLang("es")} className={`rounded-full px-3 py-1.5 ${lang === "es" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>ES</button>
              <button onClick={() => setLang("en")} className={`rounded-full px-3 py-1.5 ${lang === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>EN</button>
            </div>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button size="sm" className="gap-1.5 bg-[#25D366] text-white hover:bg-[#1ebe5d]"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_#f4ede0,_transparent_40%),linear-gradient(180deg,_#fffdf9,_#fcfbf8)]">
          <div className="container grid gap-10 py-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-16">
            <div className="order-2 md:order-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5" /> {copy.heroKicker}
              </div>
              <h1 className="max-w-xl font-serif text-4xl font-bold leading-[1.05] tracking-tight text-[#123b65] sm:text-5xl lg:text-6xl">{copy.heroTitle}</h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.heroText}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-medium text-foreground">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> {isSpanish ? "Pack Express en stock" : "Pack Express in stock"}</span>
                <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-emerald-600" /> {copy.heroFreeDelivery}</span>
              </div>
              <a href="#configurador" className="mt-8 inline-block">
                <Button size="lg" className="gap-2 bg-[#0a4178] px-6 text-white hover:bg-[#083762]">{copy.heroCta} <ChevronDown className="h-4 w-4" /></Button>
              </a>
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground"><span>{copy.deliveryFootnote}</span><br /><span>{copy.twoBedFootnote}</span></p>
            </div>
            <div className="order-1 overflow-hidden rounded-[2rem] border border-border/70 bg-white p-3 shadow-[0_24px_70px_-35px_rgba(10,65,120,0.55)] md:order-2">
              <img src={EXPRESS_CANAPE_CLOSED} alt={copy.imageAlt} className="aspect-[4/3] w-full rounded-[1.45rem] object-cover" />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
                <div>
                  <p className="font-serif text-lg font-bold text-[#123b65]">{isSpanish ? "Pack Express: cama + colchón" : "Pack Express: bed + mattress"}</p>
                  <p className="text-sm text-muted-foreground">{isSpanish ? "5 colores en stock" : "5 colours in stock"}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">{copy.stock}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="configurador" className="scroll-mt-24 py-12 md:py-16">
          <div className="container max-w-6xl">
            <div className="mb-9 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b77a14]">{isSpanish ? "Tu selección guiada" : "Your guided selection"}</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#123b65] sm:text-4xl">{isSpanish ? "Todo claro. Sin comparativas interminables." : "Everything clear. No endless comparisons."}</h2>
            </div>

            <div className="grid gap-7 lg:grid-cols-[1fr_340px] lg:items-start">
              <div className="space-y-8 rounded-[2rem] border border-border bg-white p-5 shadow-sm sm:p-8">
                <div hidden={isExpress}>
                  <h3 className="mb-3 font-serif text-2xl font-bold text-[#123b65]">{copy.productTitle}</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["pack", "canape", "mattress"] as PurchaseType[]).map((type) => (
                      <ChoiceCard
                        key={type}
                        active={purchaseType === type}
                        onClick={() => setPurchaseType(type)}
                        title={productTypeLabels[type][lang]}
                        description={type === "pack" ? (isSpanish ? "La solución completa." : "The complete solution.") : type === "canape" ? (isSpanish ? "Solo la base con almacenaje." : "Storage base only.") : (isSpanish ? "Solo tu nuevo colchón." : "Your new mattress only.")}
                        badge={type === "pack" ? (isSpanish ? "Recomendado" : "Recommended") : undefined}
                      />
                    ))}
                  </div>
                </div>

                <div hidden={isExpress}>
                  <h3 className="mb-3 font-serif text-2xl font-bold text-[#123b65]">{copy.timingTitle}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ChoiceCard active={availability === "express"} onClick={() => selectAvailability("express")} title={copy.timingExpress} description={copy.timingExpressDesc} badge={isSpanish ? "En stock" : "In stock"} />
                    <ChoiceCard active={availability === "september"} onClick={() => selectAvailability("september")} title={copy.timingSeptember} description={copy.timingSeptemberDesc} />
                  </div>
                </div>

                {!isExpress && includesCanape && (
                  <div>
                    <h3 className="mb-3 font-serif text-2xl font-bold text-[#123b65]">{isSpanish ? "Compara los dos canapés" : "Compare the two storage beds"}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ChoiceCard
                        active={false}
                        onClick={() => selectAvailability("express")}
                        title={canapeDetails.express[lang].name}
                        description={canapeDetails.express[lang].summary}
                        badge={canapeDetails.express[lang].availability}
                        image={EXPRESS_CANAPE_CLOSED}
                        imageAlt={isSpanish ? "Canapé Express de Gran Capacidad disponible ahora" : "Express Storage Bed available now"}
                      />
                      <ChoiceCard
                        active={availability === "september"}
                        onClick={() => selectAvailability("september")}
                        title={canapeDetails.premium[lang].name}
                        description={canapeDetails.premium[lang].summary}
                        badge={canapeDetails.premium[lang].availability}
                        image={SEPTEMBER_CANAPE_IMAGES.Blanco}
                        imageAlt={isSpanish ? "Canapé de Madera con Almacenaje disponible desde septiembre" : "Wood Storage Bed available from September"}
                      />
                    </div>
                  </div>
                )}

                <div id="size-step" className="scroll-mt-32">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <h3 className="font-serif text-2xl font-bold text-[#123b65]">{isExpress ? copy.expressSizeTitle : copy.sizeTitle}</h3>
                    {sizeError && <span className="text-xs font-semibold text-red-600">{copy.chooseSize}</span>}
                  </div>
                  <div className="relative max-w-md">
                    <Ruler className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select value={size} onChange={(event) => { setSize(event.target.value); setSizeError(false); }} className={`w-full appearance-none rounded-xl border bg-background py-3 pl-11 pr-10 text-sm font-medium outline-none transition focus:ring-2 focus:ring-primary/30 ${sizeError ? "border-red-400" : "border-border"}`}>
                      <option value="">{copy.sizePlaceholder}</option>
                      {STANDARD_SIZES.map((option) => {
                        const optionPrice = isExpress ? getExpressPackPrice(option) : undefined;
                        return <option key={option} value={option}>{option === "Necesito otra medida" ? copy.customSize : optionPrice ? `${option} — €${optionPrice}` : option}</option>;
                      })}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.035] p-5">
                  <h3 className="font-serif text-xl font-bold text-[#123b65]">{copy.standaloneTitle}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.standaloneText}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href={buildStandaloneWhatsAppEnquiry("canape", lang)} target="_blank" rel="noopener noreferrer"><Button type="button" variant="outline" className="border-[#25D366] bg-white text-[#126b35] hover:bg-emerald-50"><MessageCircle className="h-4 w-4" />{copy.standaloneCanape}</Button></a>
                    <a href={buildStandaloneWhatsAppEnquiry("mattress", lang)} target="_blank" rel="noopener noreferrer"><Button type="button" variant="outline" className="border-[#25D366] bg-white text-[#126b35] hover:bg-emerald-50"><MessageCircle className="h-4 w-4" />{copy.standaloneMattress}</Button></a>
                  </div>
                </div>

                {!isExpress && includesMattress && (
                  <div>
                    <h3 className="mb-3 font-serif text-2xl font-bold text-[#123b65]">{copy.mattressTitle}</h3>
                    <div className={`grid gap-3 ${mattressOptions.length === 1 ? "max-w-md" : "sm:grid-cols-3"}`}>
                      {mattressOptions.map((tier) => {
                        const detail = mattressTierDetails[tier][lang];
                        return <ChoiceCard key={tier} active={activeMattressTier === tier} onClick={() => setMattressTier(tier)} title={detail.name} description={detail.summary} badge={tier === "express" ? copy.expressIncluded : detail.badge} />;
                      })}
                    </div>
                  </div>
                )}

                {includesCanape && (
                  <>
                    <div className={isExpress ? "hidden" : undefined}>
                      <h3 className="mb-3 font-serif text-2xl font-bold text-[#123b65]">{copy.canapeTitle}</h3>
                      <div className="max-w-md rounded-2xl border-2 border-primary bg-primary/[0.06] p-5">
                        <span className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${availability === "express" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{canapeDetails[selectedCanape][lang].availability}</span>
                        <h4 className="font-serif text-xl font-bold text-[#123b65]">{canapeDetails[selectedCanape][lang].name}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{canapeDetails[selectedCanape][lang].summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {canapeDetails[selectedCanape][lang].features.map((feature) => <span key={feature} className="rounded-full border border-primary/15 bg-white px-2.5 py-1 text-xs font-medium text-[#123b65]">{feature}</span>)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-1 font-serif text-2xl font-bold text-[#123b65]">{isExpress ? copy.expressFinishTitle : copy.finishTitle}</h3>
                      <p className="mb-4 text-sm text-muted-foreground">{isExpress ? copy.expressFinishHint : copy.finishHint}</p>
                      <div className="flex flex-wrap gap-3">
                        {finishOptions.map((option) => (
                          <button key={option} type="button" onClick={() => setFinish(option)} className={`group flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${currentFinish === option ? "border-primary bg-primary/[0.06] text-primary" : "border-border bg-white text-foreground hover:border-primary/40"}`}>
                            <span className="h-5 w-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: colourTokens[option] ?? "#ddd" }} />
                            {option}
                          </button>
                        ))}
                      </div>
                      {size && currentFinish && selectedPreview && (
                        <figure className="mt-5 max-w-md overflow-hidden rounded-2xl border border-border bg-white">
                          <img src={selectedPreview} alt={isSpanish ? `${canapeDetails[selectedCanape][lang].name} en acabado ${currentFinish}` : `${canapeDetails[selectedCanape][lang].name} in ${currentFinish} finish`} className="aspect-[4/3] w-full object-cover" />
                          <figcaption className="px-4 py-3 text-sm font-semibold text-[#123b65]">{copy.previewTitle}: {currentFinish} · {displaySize}</figcaption>
                        </figure>
                      )}
                      {isExpress && (
                        <button type="button" onClick={() => selectAvailability("september")} className="mt-5 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
                          {copy.seeSeptember}
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <h3 className="mb-3 font-serif text-2xl font-bold text-[#123b65]">{copy.postcodeTitle}</h3>
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,240px)_1fr]">
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input value={postcode} onChange={(event) => setPostcode(event.target.value)} inputMode="numeric" maxLength={5} placeholder={copy.postcodePlaceholder} className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                      <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="delivery-need" checked={deliveryNeed === "flexible"} onChange={() => setDeliveryNeed("flexible")} className="accent-primary" />{copy.flexible}</label>
                      <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="delivery-need" checked={deliveryNeed === "specific"} onChange={() => setDeliveryNeed("specific")} className="accent-primary" />{copy.specific}</label>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950"><p className="font-bold">{copy.freeZone}</p><p className="mt-1 text-emerald-800">{copy.outsideZone}</p></div>
                </div>
              </div>

              <aside className="sticky top-24 overflow-hidden rounded-[2rem] border border-[#d8c39f] bg-[#fffaf0] shadow-[0_20px_45px_-35px_rgba(74,46,8,0.65)]">
                <div className="bg-[#0a4178] px-6 py-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">{copy.summaryTitle}</p>
                  <p className="mt-1 font-serif text-2xl font-bold">{purchaseType === "pack" ? (isSpanish ? "Pack Express" : "Express Pack") : productTypeLabels[purchaseType][lang]}</p>
                </div>
                <div className="space-y-4 p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4"><span className="text-muted-foreground">{isSpanish ? "Disponibilidad" : "Availability"}</span><span className={`font-bold ${availability === "express" ? "text-emerald-700" : "text-amber-700"}`}>{availability === "express" ? copy.stock : (isSpanish ? "Desde septiembre" : "From September")}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-muted-foreground">{isSpanish ? "Medida" : "Size"}</span><span className="text-right font-semibold text-foreground">{displaySize || "—"}</span></div>
                      {expressPackPrice && <div className="flex justify-between gap-4 rounded-xl bg-emerald-50 px-3 py-2"><span className="font-semibold text-emerald-950">{copy.expressPrice}</span><span className="text-right text-base font-bold text-emerald-800">€{expressPackPrice}</span></div>}
                      {includesMattress && <div className="flex justify-between gap-4"><span className="text-muted-foreground">{isSpanish ? "Colchón" : "Mattress"}</span><span className="text-right font-semibold text-foreground">{mattressTierDetails[activeMattressTier][lang].name}</span></div>}
                    {includesCanape && <div className="flex justify-between gap-4"><span className="text-muted-foreground">{isSpanish ? "Canapé" : "Storage bed"}</span><span className="text-right font-semibold text-foreground">{canapeDetails[selectedCanape][lang].name}</span></div>}
                    {includesCanape && <div className="flex justify-between gap-4"><span className="text-muted-foreground">{isSpanish ? "Color" : "Colour"}</span><span className="text-right font-semibold text-foreground">{currentFinish || "—"}</span></div>}
                  </div>
                  <div className="border-t border-[#e7dbc4] pt-4 text-xs leading-relaxed text-muted-foreground"><span className="font-bold text-foreground">{isSpanish ? "Precio y entrega:" : "Price and delivery:"}</span> {isSpanish ? "te confirmamos la mejor opción antes de reservar." : "we confirm the best option before you reserve."}</div>
                  <Button onClick={sendEnquiry} disabled={!canSendEnquiry} className="h-auto w-full gap-2 whitespace-normal bg-[#25D366] px-4 py-3 text-center text-sm font-bold leading-snug text-white hover:bg-[#1ebe5d] disabled:cursor-not-allowed disabled:bg-[#7dbd92]"><MessageCircle className="h-5 w-5 shrink-0" />{isCustomSize ? copy.customSend : copy.send}</Button>
                  {!canSendEnquiry && <p className="text-center text-xs font-medium text-muted-foreground">{isExpress ? copy.chooseExpressSelection : copy.chooseSize}</p>}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-white py-12">
          <div className="container max-w-6xl">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b77a14]">{isSpanish ? "Producto real" : "Real product"}</p><h2 className="mt-2 font-serif text-3xl font-bold text-[#123b65]">{isSpanish ? "Almacenaje que sí puedes ver." : "Storage you can actually see."}</h2></div><p className="max-w-md text-sm leading-relaxed text-muted-foreground">{isSpanish ? "Fotos del Canapé Express montado en un dormitorio real. El modelo de septiembre se mostrará con sus acabados verificados." : "Photos of the Express Storage Bed assembled in a real bedroom. The September model will be shown with its verified finishes."}</p></div>
            <div className="grid gap-5 md:grid-cols-2">
              <figure className="overflow-hidden rounded-[1.5rem] bg-muted"><img src={EXPRESS_CANAPE_CLOSED} alt={copy.imageAlt} className="aspect-[4/3] w-full object-cover" /><figcaption className="px-5 py-4 text-sm font-semibold text-foreground">{copy.closeStorage}</figcaption></figure>
              <figure className="overflow-hidden rounded-[1.5rem] bg-muted"><img src={EXPRESS_CANAPE_OPEN} alt={isSpanish ? "Canapé Express abierto mostrando almacenaje interior" : "Open Express Storage Bed showing its interior storage"} className="aspect-[4/3] w-full object-cover" /><figcaption className="px-5 py-4 text-sm font-semibold text-foreground">{copy.openStorage}</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container max-w-6xl">
            <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b77a14]">{copy.howTitle}</p><h2 className="mt-2 font-serif text-3xl font-bold text-[#123b65]">{copy.deliveryTitle}</h2></div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: PackageCheck, title: copy.freeDelivery, description: copy.freeDeliveryDesc, color: "bg-emerald-50 text-emerald-700" },
                { icon: Truck, title: copy.routeDelivery, description: copy.routeDeliveryDesc, color: "bg-amber-50 text-amber-700" },
                { icon: Clock3, title: copy.urgentDelivery, description: copy.urgentDeliveryDesc, color: "bg-blue-50 text-blue-700" },
              ].map(({ icon: Icon, title, description, color }) => <div key={title} className="rounded-2xl border border-border bg-white p-6"><span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><h3 className="font-serif text-xl font-bold text-[#123b65]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></div>)}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a4178] py-10 text-white">
        <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div><img src={t.logoUrl} alt={t.brandName} className="h-14 w-auto rounded-lg bg-white p-1 object-contain" /><p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{copy.footer}</p></div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"><Button className="gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5d]"><MessageCircle className="h-4 w-4" />WhatsApp</Button></a>
        </div>
      </footer>
    </div>
  );
}
