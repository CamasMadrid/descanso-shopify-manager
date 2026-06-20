import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageSquare,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: shopifyStatus, isLoading: loadingShopify } =
    trpc.shopify.status.useQuery();
  const { data: enquiries, isLoading: loadingEnquiries } =
    trpc.enquiries.list.useQuery();
  const { data: bookings, isLoading: loadingBookings } =
    trpc.showroom.list.useQuery();
  const { data: products, isLoading: loadingProducts } =
    trpc.shopify.products.useQuery(undefined, {
      enabled: shopifyStatus?.connected === true,
    });

  const newEnquiries = enquiries?.filter((e) => e.status === "new") ?? [];
  const pendingBookings =
    bookings?.filter((b) => b.status === "pending") ?? [];
  const confirmedBookings =
    bookings?.filter((b) => b.status === "confirmed") ?? [];

  const stats = [
    {
      label: "Consultas nuevas",
      value: loadingEnquiries ? null : newEnquiries.length,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      action: () => setLocation("/enquiries"),
      urgent: newEnquiries.length > 0,
    },
    {
      label: "Visitas pendientes",
      value: loadingBookings ? null : pendingBookings.length,
      icon: CalendarDays,
      color: "text-amber-600",
      bg: "bg-amber-50",
      action: () => setLocation("/showroom"),
      urgent: pendingBookings.length > 0,
    },
    {
      label: "Visitas confirmadas",
      value: loadingBookings ? null : confirmedBookings.length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      action: () => setLocation("/showroom"),
      urgent: false,
    },
    {
      label: "Productos en tienda",
      value: loadingProducts ? null : (products?.length ?? 0),
      icon: BedDouble,
      color: "text-primary",
      bg: "bg-primary/8",
      action: () => setLocation("/products"),
      urgent: false,
    },
  ];

  const quickActions = [
    {
      icon: MessageSquare,
      label: "Ver consultas",
      description: "Responder mensajes de clientes",
      path: "/enquiries",
    },
    {
      icon: CalendarDays,
      label: "Gestionar visitas",
      description: "Tienda móvil y showroom",
      path: "/showroom",
    },
    {
      icon: BedDouble,
      label: "Editar productos",
      description: "Camas y colchones",
      path: "/products",
    },
    {
      icon: Truck,
      label: "Banners entrega",
      description: "Entrega en 48 horas",
      path: "/delivery",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Panel General
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Bienvenido al panel de administración de Camas Madrid
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </Button>
        </div>

        {/* Shopify Connection Status */}
        <Card
          className={`border ${
            shopifyStatus?.connected
              ? "border-emerald-200 bg-emerald-50/50"
              : "border-amber-200 bg-amber-50/50"
          }`}
        >
          <CardContent className="flex items-center justify-between py-4 px-5">
            <div className="flex items-center gap-3">
              {loadingShopify ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : shopifyStatus?.connected ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
              )}
              <div>
                {loadingShopify ? (
                  <Skeleton className="h-4 w-48" />
                ) : shopifyStatus?.connected ? (
                  <>
                    <p className="text-sm font-medium text-emerald-800">
                      Shopify conectado
                    </p>
                    <p className="text-xs text-emerald-600">
                      {shopifyStatus.shop?.name ?? "descanso-rapido-castilla.myshopify.com"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-amber-800">
                      Shopify no conectado
                    </p>
                    <p className="text-xs text-amber-600">
                      Conecta tu tienda para gestionar productos
                    </p>
                  </>
                )}
              </div>
            </div>
            {!loadingShopify && !shopifyStatus?.connected && (
              <Button
                size="sm"
                onClick={() => setLocation("/shopify-connect")}
                className="gap-2"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Conectar
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className={`cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${
                stat.urgent ? "ring-1 ring-primary/30" : ""
              }`}
              onClick={stat.action}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  {stat.urgent && stat.value !== null && stat.value > 0 && (
                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                      {stat.value}
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  {stat.value === null ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two columns: Quick Actions + Recent Enquiries */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Acciones rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pb-4">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  onClick={() => setLocation(action.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Enquiries */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Consultas recientes
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setLocation("/enquiries")}
              >
                Ver todas
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pb-4">
              {loadingEnquiries ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : enquiries && enquiries.length > 0 ? (
                <div className="space-y-1">
                  {enquiries.slice(0, 5).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => setLocation("/enquiries")}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          e.status === "new"
                            ? "bg-blue-500"
                            : e.status === "replied"
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/40"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{e.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {e.subject || e.message.slice(0, 50)}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                          e.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : e.status === "replied"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {e.status === "new"
                          ? "Nueva"
                          : e.status === "replied"
                          ? "Respondida"
                          : "Cerrada"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay consultas todavía
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Próximas visitas de tienda móvil
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setLocation("/showroom")}
            >
              Ver todas
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pb-4">
            {loadingBookings ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : bookings && bookings.filter((b) => b.status !== "cancelled" && b.status !== "completed").length > 0 ? (
              <div className="space-y-2">
                {bookings
                  .filter((b) => b.status !== "cancelled" && b.status !== "completed")
                  .slice(0, 4)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 px-3 py-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors cursor-pointer"
                      onClick={() => setLocation("/showroom")}
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                        <CalendarDays className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.district} · {b.preferredDate} · {b.preferredTime}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {b.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay visitas programadas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
