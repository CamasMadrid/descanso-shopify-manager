import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MessageSquare, Sparkles, Send, CheckCircle2, Clock,
  Phone, Mail, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";

export default function Enquiries() {
  const utils = trpc.useUtils();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [generating, setGenerating] = useState<number | null>(null);

  const { data: enquiries, isLoading } = trpc.enquiries.list.useQuery();

  const generateReply = trpc.enquiries.generateAiReply.useMutation({
    onMutate: ({ id }) => setGenerating(id),
    onSuccess: (data, { id }) => {
      setReplies(r => ({ ...r, [id]: data.aiReply }));
      setGenerating(null);
    },
    onError: () => {
      setGenerating(null);
      toast.error("Error al generar respuesta. Inténtalo de nuevo.");
    }
  });

  const updateStatus = trpc.enquiries.updateStatus.useMutation({
    onSuccess: () => {
      utils.enquiries.list.invalidate();
      toast.success("Estado actualizado");
    }
  });

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    replied: "bg-emerald-100 text-emerald-700",
    closed: "bg-muted text-muted-foreground",
  };

  const statusLabels: Record<string, string> = {
    new: "Nueva",
    replied: "Respondida",
    closed: "Cerrada",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Consultas de clientes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestiona y responde las consultas recibidas
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => utils.enquiries.list.invalidate()} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : !enquiries || enquiries.length === 0 ? (
          <Card className="text-center py-16">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground">No hay consultas todavía</p>
            <p className="text-sm text-muted-foreground mt-1">Las consultas de clientes aparecerán aquí</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <Card key={e.id} className={`border transition-all ${e.status === "new" ? "border-blue-200 bg-blue-50/30" : "border-border"}`}>
                <CardContent className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{e.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[e.status] ?? statusColors.new}`}>
                          {statusLabels[e.status] ?? e.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        {e.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{e.email}</span>}
                        {e.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{e.phone}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(e.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {expanded === e.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Message preview */}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.message}</p>

                  {/* Expanded */}
                  {expanded === e.id && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      {/* Full message */}
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Mensaje completo</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{e.message}</p>
                      </div>

                      {/* AI Reply */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground">Respuesta</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => generateReply.mutate({ id: e.id })}
                            disabled={generating === e.id}
                          >
                            <Sparkles className="w-3 h-3" />
                            {generating === e.id ? "Generando..." : "Generar con IA"}
                          </Button>
                        </div>
                        <Textarea
                          value={replies[e.id] ?? e.ownerReply ?? e.aiDraftReply ?? ""}
                          onChange={ev => setReplies(r => ({ ...r, [e.id]: ev.target.value }))}
                          placeholder="Escribe o genera una respuesta..."
                          className="text-sm min-h-[100px]"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {e.phone && (
                          <a href={`https://wa.me/34${e.phone.replace(/\s/g, "")}?text=${encodeURIComponent(replies[e.id] ?? e.ownerReply ?? e.aiDraftReply ?? "")}`}
                             target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-1.5 h-8 text-xs">
                              <Send className="w-3 h-3" /> Responder por WhatsApp
                            </Button>
                          </a>
                        )}
                        {e.email && (
                          <a href={`mailto:${e.email}?subject=Re: Consulta Descanso Rápido Castilla&body=${encodeURIComponent(replies[e.id] ?? e.ownerReply ?? e.aiDraftReply ?? "")}`}>
                            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                              <Mail className="w-3 h-3" /> Responder por email
                            </Button>
                          </a>
                        )}
                        <div className="flex-1" />
                        {e.status !== "replied" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 h-8 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                            onClick={() => updateStatus.mutate({ id: e.id, status: "replied" })}
                          >
                            <CheckCircle2 className="w-3 h-3" /> Marcar respondida
                          </Button>
                        )}
                        {e.status !== "closed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5 h-8 text-xs text-muted-foreground"
                            onClick={() => updateStatus.mutate({ id: e.id, status: "closed" })}
                          >
                            Cerrar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
