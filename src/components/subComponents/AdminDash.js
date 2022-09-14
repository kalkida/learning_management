import React from "react";

import { useSelector } from "react-redux";

export default function AdminDash() {
  const schools = useSelector((state) => state.user.school);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        // backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>School Information</h1>
      <img src={schools.logo} style={{ width: 100, height: 100 }} />
      <h1>{schools.name}</h1>
      <h1>{schools.email}</h1>
      <h1>{schools.website}</h1>
    </div>
  );
}
