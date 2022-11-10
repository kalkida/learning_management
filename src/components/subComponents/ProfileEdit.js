import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createParentwhithStudent, fetchClass } from "../modals/funcs";

import { userAction } from "../../redux/user";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  where,
  query,
  getDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faPen } from "@fortawesome/free-solid-svg-icons";

export default function ProfileEdit() {
  const school = useSelector((state) => state.user.school);
  const uid = useSelector((state) => state.user.profile.school);
  const [file, setFile] = useState("");
  const [allPhone, setAllPhone] = useState([]);
  const [input, setInputs] = useState([0]);
  const [phone, setPhones] = useState("");
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [loadingbutton, setLoadingButton] = useState(false);

  const [loading, setLoading] = useState(false);

  const [classData, setClassData] = useState([]);
  const schoolData = useSelector((state) => state.user.school);
  var [newUser, setNewUser] = useState({
    principle: schoolData.principle,
    name: schoolData.name,
    logo: schoolData.logo,
    email: schoolData.email,
    location: schoolData.location,
    phone_number: schoolData.phone_number,
  });

  const valueRef = useRef();

  const onRemove = () => {
    setFile("");
  };
  var data = "";
  const navigation = useNavigate();
  const dispatch = useDispatch();

  function handleFile(event) {
    var fileinput = document.getElementById("browse");
    var textinput = document.getElementById("filename");
    textinput.value = fileinput.value;
    setFile(event.target.files[0]);
  }
  async function handleUpload() {
    if (!file) {
      setDoc(doc(firestoreDb, "schools", uid), newUser)
        .then((_) => {
          message.success("Updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            valueRef.current = url;
            if (valueRef.current != null) {
              setLoading(true);
              newUser.avater = valueRef.current;
              if (newUser.avater !== null) {
                setDoc(doc(firestoreDb, "schools", uid), {
                  ...newUser,
                  logo: valueRef.current,
                })
                  .then((reponse) =>
                    message.success("Student Added Successfuly")
                  )
                  .catch((error) => {
                    message.error("Student is not added, Try Again");
                  });
                setLoading(false);
              }
            }
          });
        }
      );
    }
  }
  function HandleBrowseClick() {
    var fileinput = document.getElementById("browse");
    fileinput.click();
  }
  const changePrinciples = (e) => {
    setNewUser({ ...newUser, principle: e.target.value });
  };

  const changeName = (e) => {
    setNewUser({ ...newUser, name: e.target.value });
  };

  const changeLocation = (e) => {
    setNewUser({ ...newUser, location: e.target.value });
  };
  const changeEmail = (e) => {
    setNewUser({ ...newUser, email: e.target.value });
  };

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
              onClick={() => handleUpload()}
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
              <div className="w-[167px] h-[170px] rounded-full border-[1px]  border-[#E7752B] ">
                <img
                  className="w-[167px] h-[167px] border-[2px] rounded-full"
                  src={file ? URL.createObjectURL(file) : "img-5.jpg"}
                  alt="profile"
                />
              </div>
              <div className="flex flex-row w-[15vw] justify-between mt-10">
                <button className="border-[2px] border-[#E7752B] text-[12px] rounded-lg bg-[#E7752B] text-white">
                  <input
                    className="p-1 w-[10vw] cursor-pointer"
                    type="file"
                    id="browse"
                    name="files"
                    style={{ display: "none" }}
                    onChange={handleFile}
                    accept="/image/*"
                  />
                  <input type="hidden" id="filename" readonly="true" />
                  <input
                    type="button"
                    className="p-1 w-[7vw] cursor-pointer"
                    value="Change Photo"
                    id="fakeBrowse"
                    onClick={HandleBrowseClick}
                  />
                </button>
                <button
                  className="border-[2px] p-1 w-[7vw] border-[#E7752B] text-[12px] rounded-lg text-[#E7752B]"
                  onClick={onRemove}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="ml-0 w-[100%] pt-10">
              <Input
                onChange={(e) => changePrinciples(e)}
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
                onChange={(e) => changeName(e)}
              />
              <h2 className="text-[#98A2B3] text-[14px]">Email</h2>
              <br />
              <Input
                className="!border-[2px] border-[#EAECF0] !rounded-lg"
                defaultValue={school.location}
                onChange={(e) => changeEmail(e)}
              />

              <h2 className="text-[#98A2B3] text-[14px]">Location</h2>
              <div className="flex flex-row">
                <div className="w-[90%] mr-3">
                  <Input
                    className="!border-[2px] border-[#EAECF0] !rounded-lg"
                    type="password"
                    defaultValue={school.location}
                    onChange={(e) => changeLocation(e)}
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
