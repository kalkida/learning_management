import React from "react";
import Navigation from "./Navigation";
import { useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";
import AdminDash from "./subComponents/AdminDash";
import ParentDash from "./subComponents/ParentDash";
import TeacherDash from "./subComponents/TeacherDash";
const RoleCheck = ({ children, role }) => {
  const userData = useSelector((state) => state.user.value);
  const user = useSelector((state) => state.user.profile);
  const loading = useSelector((state) => state.user.loading);
  // const userHasRequiredRole = user && user.includes(user.role) ? true : false;
  console.log("role", role, user);

  if (loading) {
    return <p className="container">Checking user type..</p>;
  }
  if (userData == null) {
    return <Navigate to="/login" />;
  }
  if (user.role[role] == true) {
    return children;
  }
};
export default function Dashboard() {
  return (
    <div>
      <Navigation />
    </div>
  );
}
