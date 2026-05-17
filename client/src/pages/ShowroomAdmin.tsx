import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CalendarDays, MapPin, Clock, Phone, Mail,
  CheckCircle2, XCircle, RefreshCw, MessageCircle
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  { value: "confirmed", label: "Confirmada", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "Realizada", color: "bg-emerald-100 text-emerald-700" },
  { value: "cancelled", label: "Cancelada", color: "bg-red-100 text-red-700" },
];

export default function ShowroomAdmin() {
  const utils = trpc.useUtils();
  const [filter, setFilter] = useState<string>("all");

  const { data: bookings, isLoading } = trpc.showroom.list.useQuery();

  const updateStatus = trpc.showroom.updateStatus.useMutation({
    onSuccess: () => {
      utils.showroom.list.invalidate();
      toast.success("Estado actualizado");
    },
    onError: () => toast.error("Error al actualizar el estado"),
  });

  const filtered = filter === "all" ? bookings : bookings?.filter(b => b.status === filter);

  const counts = {
    all: bookings?.length ?? 0,
    pending: bookings?.filter(b => b.status === "pending").length ?? 0,
    confirmed: bookings?.filter(b => b.status === "confirmed").length ?? 0,
    completed: bookings?.filter(b => b.status === "completed").length ?? 0,
    cancelled: bookings?.filter(b => b.status === "cancelled").length ?? 0,
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Visitas a domicilio</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestiona las solicitudes de showroom móvil
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => utils.showroom.list.invalidate()} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Todas" },
            { key: "pending", label: "Pendientes" },
            { key: "confirmed", label: "Confirmadas" },
            { key: "completed", label: "Realizadas" },
            { key: "cancelled", label: "Canceladas" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-70">
                {counts[key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <Card className="text-center py-16">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground">No hay visitas en esta categoría</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => {
              const statusInfo = STATUS_OPTIONS.find(s => s.value === b.status) ?? STATUS_OPTIONS[0];
              return (
                <Card key={b.id} className={`border ${b.status === "pending" ? "border-amber-200 bg-amber-50/20" : "border-border"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Name + status */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-semibold text-foreground">{b.name}</span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> {b.district}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3" /> {b.preferredDate}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {b.preferredTime}
                          </span>
                          {b.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3" /> {b.phone}
                            </span>
                          )}
                          {b.email && (
                            <span className="flex items-center gap-1.5 sm:col-span-2">
                              <Mail className="w-3 h-3" /> {b.email}
                            </span>
                          )}
                        </div>

                        {b.notes && (
                          <div className="mt-2 text-xs bg-muted/40 rounded p-2 text-muted-foreground">
                            <span className="font-medium">Notas: </span>{b.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        {b.phone && (
                          <a href={`https://wa.me/34${b.phone.replace(/\s/g, "")}?text=${encodeURIComponent(`Hola ${b.name}, te confirmo la visita para el ${b.preferredDate} entre las ${b.preferredTime}. ¡Hasta pronto! — Descanso Rápido Castilla`)}`}
                             target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-1.5 h-8 text-xs w-full">
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </Button>
                          </a>
                        )}
                        <Select
                          value={b.status}
                          onValueChange={(v) => updateStatus.mutate({ id: b.id, status: v as any })}
                        >
                          <SelectTrigger className="h-8 text-xs w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map(s => (
                              <SelectItem key={s.value} value={s.value} className="text-xs">
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
