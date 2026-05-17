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

const AREAS = [
  "Fuenlabrada", "Leganés", "Getafe", "Móstoles", "Alcorcón",
  "Parla", "Humanes", "Griñón", "Arroyomolinos", "Otra zona"
];

const TIME_SLOTS = [
  "09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00",
  "16:00 - 18:00", "18:00 - 20:00"
];

export default function ReservarVisita() {
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">¡Solicitud recibida!</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Hemos recibido tu solicitud de visita. Nuestro equipo se pondrá en contacto contigo en las próximas horas para confirmar la cita.
          </p>
          <div className="bg-muted/40 rounded-xl p-4 mb-6 text-sm text-muted-foreground">
            También puedes contactarnos directamente por WhatsApp para confirmar más rápido.
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio
              </Button>
            </Link>
            <a href="https://wa.me/34711204284?text=Hola,%20acabo%20de%20solicitar%20una%20visita%20a%20domicilio" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2">
                <MessageCircle className="w-4 h-4" /> Confirmar por WhatsApp
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
        <div className="container flex items-center h-16 gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
          </Link>
          <div className="font-serif font-semibold text-foreground">Reservar visita a domicilio</div>
        </div>
      </header>

      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Left: info */}
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              El showroom viene a ti
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nuestro equipo se desplaza a tu domicilio con muestras de materiales para que puedas ver y tocar los productos antes de decidir. Sin compromiso de compra.
            </p>
            <div className="space-y-4">
              {[
                { icon: Clock, title: "Visita en 24-48h", desc: "Confirmamos cita en el mismo día" },
                { icon: MapPin, title: "Zona sur Madrid", desc: "Fuenlabrada, Leganés, Getafe, Móstoles y más" },
                { icon: Phone, title: "Asesoramiento experto", desc: "Te ayudamos a elegir el colchón y base perfectos" },
                { icon: CheckCircle, title: "Sin compromiso", desc: "La visita es gratuita y sin obligación de compra" },
              ].map(({ icon: Icon, title, desc }) => (
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
              <CardTitle className="font-serif text-xl">Solicitar visita gratuita</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
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
                  <Label>Zona *</Label>
                  <Select onValueChange={v => setForm(f => ({ ...f, district: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona tu zona" />
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
                    <Label htmlFor="date">Fecha preferida *</Label>
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
                    <Label>Hora preferida *</Label>
                    <Select onValueChange={v => setForm(f => ({ ...f, preferredTime: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Horario" />
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
                  <Label htmlFor="notes">¿Qué te interesa? (opcional)</Label>
                  <Input
                    id="notes"
                    placeholder="Ej: canapé 150cm, colchón para dos personas..."
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
                  {createBooking.isPending ? "Enviando..." : "Solicitar visita gratuita"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Te confirmaremos la cita por teléfono o WhatsApp en las próximas horas.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
