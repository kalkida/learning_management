import React from "react";
import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Laba() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-end  align-middle w-[100vw]">
      <img
        src={require("../../assets/Vector1.png")}
        style={{
          width: 400,
          height: 300,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <img
        src={require("../../assets/data.png")}
        style={{
          width: 400,
          height: 300,
          position: "absolute",
          bottom: 0,
          zIndex: 1,
        }}
      />
      <img
        src={require("../../assets/Vector.png")}
        style={{
          width: 400,
          height: 300,
          position: "absolute",
          bottom: 0,
        }}
      />
      <img
        src={require("../../assets/logo1.png")}
        style={{
          width: 120,
          height: 60,
          position: "absolute",
          left: "45%",
          top: "20%",
        }}
      />
      <h1
        style={{
          position: "absolute",

          left: "46.5%",
          top: "40%",
          fontSize: 22,
        }}
      >
        Sign In as
      </h1>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          left: "43%",
          top: "50%",
          fontSize: 22,
        }}
      >
        <div className="flex flex-col">
          <Avatar
            size={90}
            style={{
              fontSize: 80,
              backgroundColor: "white",
              marginRight: 20,
              borderColor: "black",
              borderWidth: 1,
            }}
          />
          <Button
            onClick={() => navigate("/login")}
            className="border-[#E7752B] hover:border-[#E7752B] hover:bg-[#E7752B] hover:text-white active:border-[#E7752B] "
            style={{ width: 79, marginLeft: 5, marginTop: 20 }}
          >
            Admin
          </Button>
        </div>
        <div className="flex flex-col">
          <Avatar
            size={90}
            style={{
              fontSize: 80,
              backgroundColor: "white",
              marginRight: 20,
              borderColor: "black",
              borderWidth: 1,
            }}
          />
          <Button
            onClick={() => navigate("/login")}
            className="border-[#E7752B] hover:border-[#E7752B] hover:bg-[#E7752B] hover:text-white active:border-[#E7752B] open:border-[#E7752B] hover: "
            style={{ width: 79, marginLeft: 5, marginTop: 20 }}
          >
            Teacher
          </Button>
        </div>
      </div>
    </div>
  );
}
