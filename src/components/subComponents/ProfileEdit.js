import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Input, DatePicker, message, Tabs, Table } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { userAction } from "../../redux/user";

import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faPen } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-number-input";

export default function ProfileEdit() {
  const school = useSelector((state) => state.user.school);

  var data = "";
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(userAction.logout());
  };
  return (
    <div>
      <div className="bg-[#F9FAFB] min-h-[100vh] p-2 -mt-14">
        <div className="mb-6 items-center">
          <h1 className="text-[1.5rem] font-jakarta text-[#344054]">
            {" "}
            Admin Profile
          </h1>
          <div className="float-right -mt-14">
            <Button
              onClick={() => navigation("/profile-edit")}
              className=" !border-[#E7752B] hover:!text-[#E7752B] !rounded-[8px] !text-[#E7752B] mr-5"
              icon={<FontAwesomeIcon className="pr-2" icon={faCheck} />}
              // onClick={async () => await handleUpdate()}
            >
              Done
            </Button>
            <Button
              className=" !bg-[#E7752B] hover:!text-[white] !rounded-[8px] !text-[white]"
              onClick={async () => await logout()}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className=" ">
          <div className="flex flex-col">
            <div className="flex flex-col  justify-center">
              <div className="rounded-full border-[0px]  border-[#E7752B] ">
                <img
                  className="w-[10vw] h-[17vh] border-[2px] rounded-full"
                  src={school?.logo ? school.logo : "img-5.jpg"}
                  alt="profile"
                />
              </div>
              <div className="flex flex-row w-[15vw] justify-between mt-10">
                <button className="border-[2px] border-[#E7752B] text-[12px] rounded-lg bg-[#E7752B] text-white">
                  <input
                    className="p-1 w-[10vw]"
                    type="file"
                    id="browse"
                    name="files"
                    style={{ display: "none" }}
                    // onChange={handleFile}
                    accept="/image/*"
                  />
                  <input type="hidden" id="filename" readonly="true" />
                  <input
                    type="button"
                    className="p-1 w-[7vw]"
                    value="Change Photo"
                    id="fakeBrowse"
                    // onClick={HandleBrowseClick}
                  />
                </button>
                <button
                  className="border-[2px] p-1 w-[7vw] border-[#E7752B] text-[12px] rounded-lg text-[#E7752B]"
                  // onClick={onRemove}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="ml-0 w-[100%] pt-10">
              <Input
                className="!border-[2px] border-[#EAECF0] !rounded-lg"
                defaultValue={school.principle}
              />

              <h2 className="text-left text-[#98A2B3]">Principal </h2>
              <Input
                className="!border-[2px] border-[#EAECF0] !rounded-lg"
                defaultValue={school.name}
              />
              {/* <h1 className="text-xl text-[#344054]">{school.name}</h1> */}
              <h2 className="text-[#98A2B3] text-[14px]">School Name</h2>
              <br />
              <Input
                className="!border-[2px] border-[#EAECF0] !rounded-lg"
                defaultValue={school.email}
              />
              <h2 className="text-[#98A2B3] text-[14px]">Email</h2>
              <br />
              <Input
                className="!border-[2px] border-[#EAECF0] !rounded-lg"
                defaultValue={school.location}
              />

              <h2 className="text-[#98A2B3] text-[14px]">Location</h2>
              <div className="flex flex-row">
                <div className="w-[90%] mr-3">
                  <Input
                    className="!border-[2px] border-[#EAECF0] !rounded-lg"
                    type="password"
                    defaultValue={school.location}
                  />
                  <h2 className="text-[#98A2B3] text-[14px]">Password</h2>
                </div>
                <Button className="!border-[#E7752B]  !text-[#E7752B] !rounded-lg">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}