import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ReservarVisita from "./pages/ReservarVisita";
import ProductDetail from "./pages/ProductDetail";
import { lazy, Suspense } from "react";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
    Cargando...
  </div>
);

// Admin pages — lazy loaded
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Enquiries = lazy(() => import("./pages/Enquiries"));
const ShowroomAdmin = lazy(() => import("./pages/ShowroomAdmin"));

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      {/* ── Public storefront ── */}
      <Route path="/" component={Home} />
      <Route path="/reservar-visita" component={ReservarVisita} />
      <Route path="/producto/:id" component={ProductDetail} />

      {/* ── Admin panel ── */}
      {/* The DashboardLayout nav uses paths without /admin prefix */}
      <Route path="/dashboard">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/enquiries">
        {() => <AdminRoute component={Enquiries} />}
      </Route>
      <Route path="/showroom">
        {() => <AdminRoute component={ShowroomAdmin} />}
      </Route>

      {/* Legacy /admin route → redirect to /dashboard */}
      <Route path="/admin">
        {() => <AdminRoute component={Dashboard} />}
      </Route>

      {/* Placeholder admin routes (coming soon) */}
      <Route path="/products">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/collections">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/content">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/shopify-connect">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/upsell">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/delivery">
        {() => <AdminRoute component={Dashboard} />}
      </Route>
      <Route path="/channels">
        {() => <AdminRoute component={Dashboard} />}
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
