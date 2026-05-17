import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck, Clock, MapPin, Phone, Star, ChevronRight,
  Shield, CreditCard, Smartphone, Banknote, Package,
  CheckCircle, ArrowRight, MessageCircle
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/hero-48h-delivery-nwmBqks655ZGdDDfya8dbh.webp";
const LIFESTYLE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/lifestyle-bedroom-h6krn835mojxD4zXBGoKPq.webp";

const CANAPE_EXCELLENT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-excellent-clean-NSFixs2vvWmm2KZbrrBBqL.webp";
const CANAPE_PREMIUM = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-premium-clean-YxWsDqQ8xVoZArqPweodcg.webp";
const CANAPE_ARTICULADO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/canape-articulado-clean-eHwfxaXXiMCRYiXe3s7YjH.webp";
const COLCHON_HYBRID = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-hybrid-hr-clean-967DAKq2PKQgB5zAs3fLUg.webp";
const COLCHON_MEMORY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/colchon-new-memory-hr-clean-mC9twP9Jw4fHPT9PjuVUvr.webp";
const BASE_LUCY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663668909283/NteP5R75gry86mQCEyPh6j/base-lucy-clean-jXtnAsBSxs6PHZnBuQTXMB.webp";

const WHATSAPP_NUMBER = "34600000000"; // placeholder — update with real number

const products = [
  {
    id: "canape-excellent",
    name: "Canapé Excellent",
    subtitle: "Madera con almacenaje",
    image: CANAPE_EXCELLENT,
    badge: "Más vendido",
    badgeColor: "bg-amber-100 text-amber-800",
    description: "Canapé abatible de madera con 28 cm de almacenaje interior. Disponible en 4 colores.",
    sizes: ["90cm", "105cm", "135cm", "150cm"],
    price: "Desde 249€",
    category: "canapes",
  },
  {
    id: "canape-premium",
    name: "Canapé Premium",
    subtitle: "Polipiel tapizado",
    image: CANAPE_PREMIUM,
    badge: "Premium",
    badgeColor: "bg-slate-100 text-slate-700",
    description: "Canapé abatible tapizado en polipiel con 30 cm de almacenaje. Acabado elegante.",
    sizes: ["90cm", "135cm", "150cm"],
    price: "Desde 329€",
    category: "canapes",
  },
  {
    id: "canape-articulado",
    name: "Canapé Articulado",
    subtitle: "Motorizado con láminas",
    image: CANAPE_ARTICULADO,
    badge: "Top gama",
    badgeColor: "bg-blue-100 text-blue-800",
    description: "Canapé articulado motorizado con somier de láminas integrado. Confort máximo.",
    sizes: ["90cm", "105cm", "135cm", "150cm"],
    price: "Desde 499€",
    category: "canapes",
  },
  {
    id: "colchon-memory",
    name: "Colchón New Memory HR",
    subtitle: "Viscoelástico · 21 cm",
    image: COLCHON_MEMORY,
    badge: "Económico",
    badgeColor: "bg-green-100 text-green-800",
    description: "Colchón de espuma viscoelástica y HR de alta resistencia. Ideal para uso diario.",
    sizes: ["90cm", "105cm", "135cm", "150cm", "160cm", "180cm"],
    price: "Desde 149€",
    category: "colchones",
  },
  {
    id: "colchon-hybrid",
    name: "Colchón Hybrid HR",
    subtitle: "Muelles + Visco Aloe · 31 cm",
    image: COLCHON_HYBRID,
    badge: "Premium",
    badgeColor: "bg-slate-100 text-slate-700",
    description: "Muelles ensacados con capa de viscoelástica con aloe vera. Alta resistencia para mayor peso.",
    sizes: ["90cm", "105cm", "135cm", "150cm", "160cm", "180cm"],
    price: "Desde 299€",
    category: "colchones",
  },
  {
    id: "base-lucy",
    name: "Base Tapizada Lucy",
    subtitle: "Tela 3D transpirable",
    image: BASE_LUCY,
    badge: "Nuevo",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Base tapizada en tela 3D gris con aireadores laterales. Estructura tubular 40×30mm.",
    sizes: ["80cm", "90cm", "105cm", "135cm", "150cm"],
    price: "Desde 129€",
    category: "bases",
  },
];

const paymentMethods = [
  { icon: Banknote, label: "Efectivo", desc: "Pago al recibir" },
  { icon: Smartphone, label: "Bizum", desc: "Transferencia instantánea" },
  { icon: CreditCard, label: "Tarjeta", desc: "Visa / Mastercard" },
  { icon: Package, label: "Contrareembolso", desc: "Paga en la entrega" },
];

const testimonials = [
  { name: "María G.", location: "Fuenlabrada", stars: 5, text: "Pedí el canapé el lunes y lo tenía el miércoles. El chico fue muy amable y lo subió él solo. Muy recomendable." },
  { name: "Carlos R.", location: "Leganés", stars: 5, text: "Vinieron a casa a enseñarme los colchones sin compromiso. Al final compré el Hybrid HR y estoy encantado con la calidad." },
  { name: "Ana M.", location: "Getafe", stars: 5, text: "Precio muy competitivo y entrega rapidísima. El colchón es exactamente lo que buscaba. Repetiré seguro." },
];

const areas = ["Fuenlabrada", "Leganés", "Getafe", "Móstoles", "Alcorcón", "Parla", "Humanes", "Griñón", "Arroyomolinos"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"all" | "canapes" | "colchones" | "bases">("all");

  const filtered = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top delivery bar ── */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium tracking-wide">
        🚚 Entrega en 48 horas · Fuenlabrada y alrededores · Pago al recibir disponible
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
              <div className="text-xs text-muted-foreground leading-tight">Castilla · Madrid</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#productos" className="text-muted-foreground hover:text-foreground transition-colors">Productos</a>
            <a href="#showroom" className="text-muted-foreground hover:text-foreground transition-colors">Showroom Móvil</a>
            <a href="#entrega" className="text-muted-foreground hover:text-foreground transition-colors">Entrega</a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20información%20sobre%20vuestros%20productos`}
               target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-1.5">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
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
              ⚡ Entrega en 48 horas garantizada
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Tu cama nueva,<br />
              <span className="text-primary">en dos días.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-md leading-relaxed">
              Canapés, colchones y bases tapizadas de calidad. Entregamos con nuestras propias furgonetas en Fuenlabrada y toda la zona sur de Madrid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#productos">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
                  Ver productos <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="#showroom">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5">
                  <MapPin className="w-4 h-4" />
                  Showroom en tu casa
                </Button>
              </a>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-600" /> Sin intermediarios</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-600" /> Pago al recibir</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-600" /> Montaje incluido</span>
            </div>
          </div>
          {/* Right: image */}
          <div className="relative hidden md:block">
            <img src={HERO_IMG} alt="Entrega de colchón en Madrid" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/10" />
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">48h de entrega</div>
                <div className="text-xs text-muted-foreground">Zona sur Madrid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USP strip ── */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Entrega 48h", desc: "Con nuestras furgonetas" },
            { icon: MapPin, title: "Zona sur Madrid", desc: "Fuenlabrada y alrededores" },
            { icon: Shield, title: "Sin riesgos", desc: "Paga al recibir" },
            { icon: Phone, title: "Asesoramiento", desc: "Te llamamos y visitamos" },
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Nuestros productos</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Selección de canapés, colchones y bases tapizadas de calidad al mejor precio.</p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { key: "all", label: "Todos" },
              { key: "canapes", label: "Canapés" },
              { key: "colchones", label: "Colchones" },
              { key: "bases", label: "Bases" },
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
                </div>
                <CardContent className="p-5">
                  <div className="mb-1">
                    <h3 className="font-serif font-semibold text-lg text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 mb-3 leading-relaxed">{product.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.sizes.slice(0, 4).map(s => (
                      <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{s}</span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">+{product.sizes.length - 4}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary text-lg">{product.price}</span>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(product.name)}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                        Pedir <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upsell prompt */}
          <div className="mt-10 bg-accent/50 rounded-2xl p-6 text-center border border-border">
            <p className="text-foreground font-medium mb-1">💡 ¿Comprando canapé y colchón juntos?</p>
            <p className="text-muted-foreground text-sm">Consigue un <strong>descuento especial</strong> al pedir los dos. Escríbenos por WhatsApp y te hacemos precio.</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20pedir%20canapé%20y%20colchón%20juntos`}
               target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary gap-1.5">
                <MessageCircle className="w-4 h-4" /> Consultar precio conjunto
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
                🚐 Servicio exclusivo
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                El showroom viene a ti
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                No hace falta que vengas a ninguna tienda. Nuestro equipo se desplaza a tu domicilio con muestras de colchones y materiales para que puedas ver y tocar los productos antes de decidir.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Sin compromiso de compra",
                  "Asesoramiento personalizado en casa",
                  "Medimos y comprobamos el espacio",
                  "Entrega en 48h tras el pedido",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/reservar-visita">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <MapPin className="w-4 h-4" />
                  Reservar visita gratuita
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img src={LIFESTYLE_IMG} alt="Dormitorio acogedor" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
              {/* Coverage badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 max-w-[200px]">
                <div className="text-xs font-semibold text-foreground mb-2">Zonas de cobertura</div>
                <div className="flex flex-wrap gap-1">
                  {areas.slice(0, 5).map(a => (
                    <span key={a} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{a}</span>
                  ))}
                  <span className="text-xs text-muted-foreground">y más...</span>
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Entrega rápida y sin complicaciones</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Desde nuestro almacén en Fuenlabrada hasta tu puerta en 48 horas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", icon: MessageCircle, title: "Pide por WhatsApp", desc: "Escríbenos o llámanos. Te confirmamos disponibilidad y precio en minutos." },
              { step: "2", icon: Truck, title: "Preparamos tu pedido", desc: "Recogemos del almacén y preparamos la entrega para las próximas 48 horas." },
              { step: "3", icon: CheckCircle, title: "Entregamos en tu casa", desc: "Nuestro equipo lleva el producto, lo sube y lo coloca donde necesites." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs font-bold text-muted-foreground mb-2 tracking-widest">PASO {step}</div>
                <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment methods ── */}
      <section className="py-12 bg-primary/5">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Formas de pago</h2>
            <p className="text-muted-foreground text-sm">Flexibilidad total — tú eliges cómo pagar</p>
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
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Lo que dicen nuestros clientes</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-muted-foreground text-sm">5.0 · Más de 50 clientes satisfechos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 border border-border">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.location}</div>
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
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">¿Listo para dormir mejor?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
            Escríbenos ahora y te ayudamos a elegir. Entrega en 48 horas en toda la zona sur de Madrid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20información%20sobre%20vuestros%20productos`}
               target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </Button>
            </a>
            <Link href="/reservar-visita">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                <MapPin className="w-5 h-5" />
                Reservar visita a domicilio
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
                Especialistas en canapés, colchones y bases tapizadas. Entrega en 48 horas en el sur de Madrid.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-3 text-sm tracking-wide uppercase text-background/50">Zona de entrega</div>
              <div className="flex flex-wrap gap-2">
                {areas.map(a => (
                  <span key={a} className="text-xs bg-background/10 text-background/80 px-2 py-1 rounded">{a}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3 text-sm tracking-wide uppercase text-background/50">Contacto</div>
              <div className="space-y-2 text-sm text-background/70">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Fuenlabrada, Madrid</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-center text-xs text-background/40">
            © 2025 Descanso Rápido Castilla · Todos los derechos reservados
          </div>
        </div>
      </footer>

      {/* ── WhatsApp floating button ── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20información%20sobre%20vuestros%20productos`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
