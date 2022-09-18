import React from "react";

import { useSelector } from "react-redux";
import { Card, Progress } from "antd";

export default function AdminDash() {
  const schools = useSelector((state) => state.user.school);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",

        // backgroundColor: "red",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <Card
        // title={<h1 style={{ fontWeight: "bold" }}>Todays Attendance</h1>}
        bordered={true}
        style={{
          width: 400,
          marginTop: 50,
          borderWidth: 2,
        }}
      >
        <h1 style={{ fontWeight: "bold", marginBottom: 40 }}>
          Todays Attendance
        </h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <Progress type="circle" strokeColor={"gray"} percent={75} />
          </div>
          <div style={{ marginTop: 30, marginLeft: 19 }}>
            <h1 style={{ fontSize: 20 }}>7 Absent Students</h1>
            <h1 style={{ fontSize: 20 }}>2 Absent Teachers</h1>
          </div>
        </div>
        <h1 style={{ fontWeight: "bold", marginBottom: 40, marginTop: 40 }}>
          Average Attendance
        </h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Progress type="circle" percent={30} width={80} />
              <h1 className="text-center">Weekly</h1>
            </div>
            <div>
              <Progress type="circle" percent={70} width={80} />
              <h1 className="text-center">Monthly</h1>
            </div>
            <div>
              <Progress type="circle" percent={90} width={80} />
              <h1 className="text-center">Yearly</h1>
            </div>
          </div>
          {/* <div style={{ marginTop: 30, marginLeft: 19 }}>
            <h1 style={{ fontSize: 20 }}>7 Absent Students</h1>
            <h1 style={{ fontSize: 20 }}>2 Absent Teachers</h1>
          </div> */}
        </div>
      </Card>
      {/* <h1>School Information</h1>
      <img src={schools.logo} style={{ width: 100, height: 100 }} />
      <h1>{schools.name}</h1>
      <h1>{schools.email}</h1>
      <h1>{schools.website}</h1> */}
    </div>
  );
}
