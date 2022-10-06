import React from "react";
import Liner from "../graph/Liner";
import BarGraph from "../graph/BarGraph";
import { useSelector } from "react-redux";
import { Card, Progress } from "antd";

export default function AdminDash() {
  const schools = useSelector((state) => state.user.school);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        justifyContent: "space-between",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="bg-[#F2F4F7] border-[#98A2B3] w-[84%] flex-row flex-1 absolute top-0 h-[8vh] border-[1px] rounded-lg">
        <h1 className="text-lg p-5 text-[#344054] font-bold">{schools.name}</h1>
      </div>
      <div className="flex w-[100%] flex-row overflow-hidden justify-between">
        <Card
          bordered={true}
          style={{
            width: "35%",
            height: 300,
            marginTop: 50,
            borderWidth: 2,
            marginRight: 10,
          }}
        >
          <h1 style={{ fontWeight: "bold", marginBottom: 10 }}>
            Todays Attendance
          </h1>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <Progress
                type="circle"
                strokeColor={"gray"}
                percent={75}
                width={70}
              />
            </div>
            <div style={{ marginTop: 10, marginLeft: 19 }}>
              <h1 style={{ fontSize: 14 }}>7 Absent Students</h1>
              <h1 style={{ fontSize: 14 }}>2 Absent Teachers</h1>
            </div>
          </div>
          <h1 style={{ fontWeight: "bold", marginBottom: 40, marginTop: 30 }}>
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
                <Progress type="circle" percent={30} width={40} />
                <h1 className="text-center">Weekly</h1>
              </div>
              <div>
                <Progress type="circle" percent={70} width={40} />
                <h1 className="text-center">Monthly</h1>
              </div>
              <div>
                <Progress type="circle" percent={90} width={40} />
                <h1 className="text-center">Yearly</h1>
              </div>
            </div>
          </div>
        </Card>
        <Card
          bordered={true}
          style={{
            width: "35%",
            height: 300,
            marginRight: 10,

            marginTop: 50,
            borderWidth: 2,
          }}
        >
          <Liner />
        </Card>
        <Card
          bordered={true}
          style={{
            width: "35%",
            height: 300,
            marginTop: 50,
            borderWidth: 2,
          }}
        >
          <Liner />
        </Card>
      </div>
      <Card
        bordered={true}
        style={{
          width: "53%",
          marginTop: "20%",
          borderWidth: 2,
          position: "absolute",
          bottom: -70,
          right: 50,
        }}
      >
        <BarGraph />
      </Card>
    </div>
  );
}
