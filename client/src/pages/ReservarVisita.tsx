import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ArrowLeft, MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLang } from "@/contexts/LanguageContext";

const AREAS = [
  "Fuenlabrada", "Leganés", "Getafe", "Móstoles", "Alcorcón",
  "Parla", "Humanes", "Griñón", "Arroyomolinos",
  "Alcalá de Henares", "Torrejón de Ardoz", "Pozuelo de Alarcón",
  "Majadahonda", "Rivas-Vaciamadrid", "Valdemoro", "Pinto",
  "Arganda del Rey", "San Sebastián de los Reyes", "Alcobendas",
  "Boadilla del Monte", "Las Rozas", "Madrid capital", "Otra zona"
];

const TIME_SLOTS = [
  "09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00",
  "16:00 - 18:00", "18:00 - 20:00"
];

export default function ReservarVisita() {
  const { lang, setLang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", district: "",
    preferredDate: "", preferredTime: "", notes: ""
  });

  const createBooking = trpc.showroom.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error("Error al enviar la solicitud. Por favor inténtalo de nuevo.");
      console.error(err);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.district || !form.preferredDate || !form.preferredTime) {
      toast.error("Por favor rellena todos los campos obligatorios.");
      return;
    }
    createBooking.mutate({
      name: form.name,
      email: form.email ? form.email : undefined,
      phone: form.phone,
      district: form.district,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      notes: form.notes || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
            {lang === "es" ? "¡Solicitud recibida!" : "Request received!"}
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {lang === "es"
              ? "Hemos recibido tu solicitud de visita. Nuestro equipo se pondrá en contacto contigo en las próximas horas para confirmar la cita."
              : "We have received your visit request. Our team will contact you within the next few hours to confirm the appointment."}
          </p>
          <div className="bg-muted/40 rounded-xl p-4 mb-6 text-sm text-muted-foreground">
            {lang === "es"
              ? "También puedes contactarnos directamente por WhatsApp para confirmar más rápido."
              : "You can also contact us directly on WhatsApp to confirm faster."}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> {lang === "es" ? "Volver al inicio" : "Back to home"}
              </Button>
            </Link>
            <a href="https://wa.me/34711204284?text=Hola,%20acabo%20de%20solicitar%20una%20visita%20a%20domicilio" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2">
                <MessageCircle className="w-4 h-4" /> {lang === "es" ? "Confirmar por WhatsApp" : "Confirm on WhatsApp"}
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> {lang === "es" ? "Volver" : "Back"}
              </Button>
            </Link>
            <div className="font-serif font-semibold text-foreground">
              {lang === "es" ? "Reservar visita a domicilio" : "Book a home visit"}
            </div>
          </div>
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
        </div>
      </header>

      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Left: info */}
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              {lang === "es" ? "La cama viene a ti" : "The bed comes to you"}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {lang === "es"
                ? "Llegamos a tu domicilio con un canapé montado y una selección de colchones reales para que te tumbas y los pruebes tú mismo. Sin compromiso de compra."
                : "We arrive at your home with a fully assembled storage bed and a selection of real mattresses for you to lie on and try out properly. No purchase commitment."}
            </p>
            <div className="space-y-4">
              {(lang === "es" ? [
                { icon: Clock, title: "Visita en 24-48h", desc: "Confirmamos cita en el mismo día" },
                { icon: MapPin, title: "Comunidad de Madrid", desc: "Toda la región de Madrid" },
                { icon: Phone, title: "Asesoramiento experto", desc: "Te ayudamos a elegir el colchón y base perfectos" },
                { icon: CheckCircle, title: "Sin compromiso", desc: "La visita es gratuita y sin obligación de compra" },
              ] : [
                { icon: Clock, title: "Visit within 24-48h", desc: "We confirm the appointment on the same day" },
                { icon: MapPin, title: "Community of Madrid", desc: "Across the entire Madrid region" },
                { icon: Phone, title: "Expert advice", desc: "We help you choose the perfect mattress and base" },
                { icon: CheckCircle, title: "No commitment", desc: "The visit is free with no obligation to buy" },
              ]).map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{title}</div>
                    <div className="text-muted-foreground text-sm">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl">{lang === "es" ? "Solicitar visita gratuita" : "Request a free home visit"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">{lang === "es" ? "Nombre *" : "Name *"}</Label>
                    <Input
                      id="name"
                      placeholder={lang === "es" ? "Tu nombre" : "Your name"}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{lang === "es" ? "Teléfono *" : "Phone *"}</Label>
                    <Input
                      id="phone"
                      placeholder="600 000 000"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>{lang === "es" ? "Zona *" : "Area *"}</Label>
                  <Select onValueChange={v => setForm(f => ({ ...f, district: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={lang === "es" ? "Selecciona tu zona" : "Select your area"} />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">{lang === "es" ? "Fecha preferida *" : "Preferred date *"}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.preferredDate}
                      onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                      className="mt-1"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label>{lang === "es" ? "Hora preferida *" : "Preferred time *"}</Label>
                    <Select onValueChange={v => setForm(f => ({ ...f, preferredTime: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={lang === "es" ? "Horario" : "Time slot"} />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">{lang === "es" ? "¿Qué te interesa? (opcional)" : "What are you interested in? (optional)"}</Label>
                  <Input
                    id="notes"
                    placeholder={lang === "es" ? "Ej: canapé 150cm, colchón para dos personas..." : "E.g. storage bed 150cm, mattress for two people..."}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (lang === "es" ? "Enviando..." : "Sending...") : (lang === "es" ? "Solicitar visita gratuita" : "Request free home visit")}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {lang === "es" ? "Te confirmaremos la cita por teléfono o WhatsApp en las próximas horas." : "We will confirm your appointment by phone or WhatsApp within the next few hours."}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
