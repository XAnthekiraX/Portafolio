import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastContainer } from "./components/ui/ToastContainer";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/public/Home";
import { LoginPage } from "./pages/admin/LoginPage";

const Dashboard = lazy(() => import("./pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })));
const Profile = lazy(() => import("./pages/admin/Profile").then((m) => ({ default: m.Profile })));
const Skills = lazy(() => import("./pages/admin/Skills").then((m) => ({ default: m.Skills })));
const CV = lazy(() => import("./pages/admin/CV").then((m) => ({ default: m.CV })));
const Education = lazy(() => import("./pages/admin/Education").then((m) => ({ default: m.Education })));
const Technologies = lazy(() => import("./pages/admin/Technologies").then((m) => ({ default: m.Technologies })));
const Projects = lazy(() => import("./pages/admin/Projects").then((m) => ({ default: m.Projects })));
const Services = lazy(() => import("./pages/admin/Services").then((m) => ({ default: m.Services })));

function AdminPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-700 border-t-primary" />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ToastContainer />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Suspense fallback={<AdminPageFallback />}><Dashboard /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<AdminPageFallback />}><Profile /></Suspense>} />
              <Route path="skills" element={<Suspense fallback={<AdminPageFallback />}><Skills /></Suspense>} />
              <Route path="cv" element={<Suspense fallback={<AdminPageFallback />}><CV /></Suspense>} />
              <Route path="education" element={<Suspense fallback={<AdminPageFallback />}><Education /></Suspense>} />
              <Route path="technologies" element={<Suspense fallback={<AdminPageFallback />}><Technologies /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<AdminPageFallback />}><Projects /></Suspense>} />
              <Route path="services" element={<Suspense fallback={<AdminPageFallback />}><Services /></Suspense>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}
