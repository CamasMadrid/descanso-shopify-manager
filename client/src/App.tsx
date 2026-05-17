import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ReservarVisita from "./pages/ReservarVisita";
import { lazy, Suspense } from "react";

// Admin pages — lazy loaded
const Dashboard = lazy(() => import("./pages/Dashboard"));

function Router() {
  return (
    <Switch>
      {/* Public storefront */}
      <Route path="/" component={Home} />
      <Route path="/reservar-visita" component={ReservarVisita} />

      {/* Admin */}
      <Route path="/admin">
        {() => (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando...</div>}>
            <Dashboard />
          </Suspense>
        )}
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
