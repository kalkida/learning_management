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
              icon={<FontAwesomeIcon className="pr-2" icon={faPen} />}
              // onClick={async () => await handleUpdate()}
            >
              Edit
            </Button>
            <Button
              className=" !bg-[#E7752B] hover:!text-[white] !rounded-[8px] !text-[white]"
              onClick={async () => await logout()}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="p-6 ">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="rounded-full  border-[#E7752B] bg-[white]">
                <img
                  className="w-[10vw] border-[2px] rounded-full"
                  src={data.avater ? data.avater : "img-5.jpg"}
                  alt="profile"
                />
              </div>
              <h1 className="text-center mt-10 text-xl text-[#344054] ">
                Janet Doe
              </h1>
              <h2 className="text-center text-[#98A2B3]">Principal </h2>
            </div>
            <div className="ml-40">
              <h1 className="text-xl text-[#344054]">Radical School</h1>
              <h2 className="text-[#98A2B3] text-[14px]">School Name</h2>
              <br />
              <h1 className="text-xl text-[#344054]">
                radicalschool@gmail.com
              </h1>
              <h2 className="text-[#98A2B3] text-[14px]">Email</h2>
              <br />
              <h1 className="text-xl text-[#344054]">Location</h1>
              <h2 className="text-[#98A2B3] text-[14px]">Location</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
