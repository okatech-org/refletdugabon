import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Moyens from "./pages/Moyens";
import Cooperative from "./pages/Cooperative";

import Culture from "./pages/Culture";
import Presidente from "./pages/Presidente";
import Projets from "./pages/Projets";
import Boutique from "./pages/Boutique";
import Galerie from "./pages/Galerie";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/moyens" element={<Moyens />} />
          <Route path="/cooperative" element={<Cooperative />} />
          
          <Route path="/culture" element={<Culture />} />
          <Route path="/presidente" element={<Presidente />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
