import React, { useEffect, useState } from "react";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import Welcome from "../Auth/Welcome"
import { doc, getDoc } from "firebase/firestore";
import TeacherDash from "../components/subComponents/TeacherDash";
import ParentDash from "../components/subComponents/ParentDash";
import AdminDash from "../components/subComponents/AdminDash";
import { firestoreDb } from "../firebase";

import Dashboard from "../components/Dashboard";
import LandingPage from "../components/LandingPage";
import Layout from "../components/Layout";
const PrivateScreen = ({ children, role }) => {
  const userData = useSelector((state) => state.user.value);
  const user = useSelector((state) => state.user.value);
  const loading = useSelector((state) => state.user.profile);
  const location = useLocation();
  const users = JSON.parse(user);
  return users ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateScreen />}>
          <Route path="/*" element={<Layout />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}
