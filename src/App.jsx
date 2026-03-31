// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import StorePage      from "@/pages/StorePage";
import Login          from "@/pages/Login";
import Dashboard      from "@/pages/Admin/Dashboard";       // legacy CRUD (kept)
import AdminDashboard from "@/pages/Admin/AdminDashboard";  // new full dashboard
import Inventario     from "@/pages/Staff/Inventario";      // staff view
import DashboardLayout  from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuthStore from "@/store/authStore";

const RoleBasedRedirect = () => {
  const { role } = useAuthStore();
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "staff") return <Navigate to="/staff/inventario" replace />;
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0A0A0F",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#0066FF", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"      element={<StorePage />} />
        <Route path="/login" element={<Login />} />

        {/* Staff — inventory management */}
        <Route
          path="/staff/inventario"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Inventario />} />
        </Route>

        {/* Admin — full metrics + user management */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Legacy /admin → check role and redirect properly */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <RoleBasedRedirect />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<StorePage />} />
      </Routes>
    </>
  );
}

export default App;
