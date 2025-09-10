import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Role-based Dashboard Pages
import CitizenDashboard from "./pages/dashboards/CitizenDashboard";
import AshaWorkerDashboard from "./pages/dashboards/AshaWorkerDashboard";
import CoordinatorDashboard from "./pages/dashboards/CoordinatorDashboard";
import Alerts from "./pages/healthcoordinator/Alerts";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import WaterSection from "./components/healthcoordinatorcomponents/WaterSection";
import DoctorCommunicationPage from "./pages/doctor/Communication";

// Feature Pages
import ReportsPage from "./pages/ReportsPage";
import AlertsPage from "./pages/AlertsPage";
import CommunicationPage from "./pages/CommunicationPage";
import ResourcesPage from "./pages/ResourcesPage";
import TestingPage from "./pages/TestingPage";
import InventoryPage from "./pages/InventoryPage";
import PatientsPage from "./pages/PatientsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <RoleProvider>
            <div className="min-h-screen bg-background">
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Protected Routes with Layout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    {/* Dashboard Routes */}
                    <Route path="/citizen" element={<CitizenDashboard />} />
                    <Route path="/asha" element={<AshaWorkerDashboard />} />
                    <Route path="/coordinator" element={<Alerts />} />
                    <Route path="/coordinator/dashboard" element={<Alerts />} />
                    <Route path="/coordinator/water" element={<WaterSection />} />
                    <Route path="/doctor" element={<DoctorDashboard />} />
                    
                    {/* Shared Feature Routes */}
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                    <Route path="/communication" element={<CommunicationPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/testing" element={<TestingPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </RoleProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
