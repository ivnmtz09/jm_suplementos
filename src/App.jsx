// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import StorePage      from "@/pages/StorePage";
import Login          from "@/pages/Login";
import Dashboard      from "@/pages/Admin/Dashboard";       // legacy CRUD (kept)
import AdminDashboard from "@/pages/Admin/AdminDashboard";  // new full dashboard
import Inventario     from "@/pages/Staff/Inventario";      // staff view
import ProtectedRoute from "@/components/ProtectedRoute";

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
              <Inventario />
            </ProtectedRoute>
          }
        />

        {/* Admin — full metrics + user management */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Legacy /admin → redirect to dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <Navigate to="/admin/dashboard" replace />
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
