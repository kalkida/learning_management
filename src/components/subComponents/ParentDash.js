import React from "react";
import Dashboard from "../Navigation";
import { firebaseAuth } from "../../firebase";

export default function ParentDash() {
  const user = firebaseAuth.currentUser
  console.log("user is  " + user.phoneNumber);
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "green",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ParentDash
      </div>
    </>
  );
}
