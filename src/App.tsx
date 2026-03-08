import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/hooks/useTheme";
import { useColorTheme } from "@/hooks/useColorTheme";
import Landing from "./pages/Landing";
import TimerPage from "./pages/TimerPage";
import ProgressPage from "./pages/ProgressPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isDark, toggle } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <>
      <Navbar
        isDark={isDark}
        onToggleTheme={toggle}
        colorTheme={colorTheme}
        onColorThemeChange={setColorTheme}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
