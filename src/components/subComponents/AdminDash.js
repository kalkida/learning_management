import React, { useState, useEffect } from "react";
import Dashboard from "../Navigation";

import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDb } from "../../firebase";

export default function AdminDash() {
  const uid = useSelector((state) => state.user.profile);
  const [schools, setSchools] = useState({});
  const getSchool = async () => {
    const docRef = doc(firestoreDb, "schools", uid.school);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      var datas = docSnap.data();
      setSchools(datas);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  useEffect(() => {
    getSchool();
  }, []);
  return (
    <>
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
    </>
  );
}
