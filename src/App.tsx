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
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutReturn from "./pages/CheckoutReturn";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/legal/MentionsLegales";
import PolitiqueConfidentialite from "./pages/legal/PolitiqueConfidentialite";
import CGV from "./pages/legal/CGV";
import CGU from "./pages/legal/CGU";
import PolitiqueCookies from "./pages/legal/PolitiqueCookies";
import CookieBanner from "./components/legal/CookieBanner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAutoTranslate } from "./hooks/useAutoTranslate";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isCheckout = location.pathname.startsWith("/checkout");
  const isGateway = location.pathname === "/";

  if (isAdmin) {
    return (
      <Routes location={location}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    );
  }

  if (isCheckout) {
    return (
      <Routes location={location}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/confirmation" element={<CheckoutReturn />} />
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
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/politique-cookies" element={<PolitiqueCookies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const AppShell = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isCheckout = location.pathname.startsWith("/checkout");
  const isGateway = location.pathname === "/";
  const hideChrome = isAdmin || isCheckout || isGateway;
  useAutoTranslate();

  return (
    <>
      {!hideChrome && <CustomCursor />}
      {!hideChrome && <Header />}
      <main className={hideChrome ? "" : "min-h-screen"}>
        <AnimatedRoutes />
      </main>
      {!hideChrome && <Footer />}
      {!isAdmin && !isCheckout && <CookieBanner />}
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
  const handleLoaded = useCallback(() => {
    // Remove any hash to prevent browser auto-scrolling to #contact etc.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Force again after a tick (some browsers defer scroll restoration)
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      (window as any).__loaderDone = true;
      window.dispatchEvent(new Event("loader-complete"));
    });
    setLoaded(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LanguageProvider>
            {!loaded && <RouteAwareLoader onComplete={handleLoaded} />}
            <AppShell />
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
