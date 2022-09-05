import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
        overflow: "hidden",
        justifyContent: "space-between",
        paddingLeft: 20,
        marginRight: 200,
        height: 100,
        backgroundColor: "gray",
      }}
    >
      <div>
        <h1 style={{ color: "white" }}>LandingPage</h1>
      </div>
      <div
        style={{
          display: "flex",
          width: "10%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginRight: 50,
        }}
      >
        <Link style={{ color: "white" }} to="/login">
          Login
        </Link>
        <Link style={{ color: "white" }} to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
