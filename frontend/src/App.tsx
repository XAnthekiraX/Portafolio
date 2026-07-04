import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/public/Home";
import { LoginPage } from "./pages/admin/LoginPage";
import { Dashboard } from "./pages/admin/Dashboard";
import { Profile } from "./pages/admin/Profile";
import { Skills } from "./pages/admin/Skills";
import { CV } from "./pages/admin/CV";
import { Education } from "./pages/admin/Education";
import { Technologies } from "./pages/admin/Technologies";
import { Projects } from "./pages/admin/Projects";
import { Services } from "./pages/admin/Services";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="skills" element={<Skills />} />
              <Route path="cv" element={<CV />} />
              <Route path="education" element={<Education />} />
              <Route path="technologies" element={<Technologies />} />
              <Route path="projects" element={<Projects />} />
              <Route path="services" element={<Services />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
