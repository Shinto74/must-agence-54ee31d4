import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import InitialLoader from "@/components/shared/InitialLoader";
import PageTransition from "@/components/shared/PageTransition";
import GatewayPage from "./pages/GatewayPage";
import Artiste from "./pages/Artiste";
import Entreprise from "./pages/Entreprise";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isGateway = location.pathname === "/";

  if (isAdmin) {
    return (
      <Routes location={location}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    );
  }

  if (isGateway) {
    return (
      <Routes location={location}>
        <Route path="/" element={<GatewayPage />} />
      </Routes>
    );
  }

  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/artiste" element={<Artiste />} />
        <Route path="/entreprise" element={<Entreprise />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const AppShell = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isGateway = location.pathname === "/";

  return (
    <>
      {!isAdmin && !isGateway && <CustomCursor />}
      {!isAdmin && !isGateway && <Header />}
      <main className={isAdmin ? "" : isGateway ? "" : "min-h-screen"}>
        <AnimatedRoutes />
      </main>
      {!isAdmin && !isGateway && <Footer />}
    </>
  );
};

const RouteAwareLoader = ({ onComplete }: { onComplete: () => void }) => {
  const location = useLocation();
  const isEntreprise = location.pathname === "/entreprise";
  return <InitialLoader onComplete={onComplete} theme={isEntreprise ? "gold" : "neon"} />;
};

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!loaded && <RouteAwareLoader onComplete={handleLoaded} />}
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
