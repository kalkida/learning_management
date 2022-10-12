import React, { useEffect, useState, useRef } from "react";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../firebase";
import { useSelector } from "react-redux";
import { message, Select } from "antd";
import Icon from "react-eva-icons";

const { Option } = Select;
export default function ListAnnouncment() {
  const [announcment, setAnnouncment] = useState([]);
  const [archivedAnnoumnet, setArchivedAnnouncement] = useState([]);
  const [showPost, setShowPost] = useState(true);
  const data = useSelector((state) => state.user.profile.school);
  const [editorState, setEditorState] = useState("");
  const [editData, setEditData] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [anounceData, setAnmounceData] = useState({
    title: "",
    body: "",
    target: {
      toAll: true,
      toParents: false,
      toTeachers: false,
    },
    school: data,
    archived: false,
  });

  const shownewPost = () => {
    setEditorState("");

    setShowPost(true);
    setShowEdit(false);
  };
  const uploadData = async (datar) => {
    await addDoc(collection(firestoreDb, "announcment"), anounceData)
      .then((response) => {
        getBlog();
        message.success("Announcement successfully added");
        setShowPost(false);
      })
      .catch((error) => message.error("Something is wrong, Try Again"));
  };

  const getBlog = async () => {
    const q = query(
      collection(firestoreDb, "announcment"),
      where("school", "==", data)
    );
    var temporary = [];
    var temporary1 = [];
    const snap = await getDocs(q);

    snap.forEach((doc) => {
      var data = doc.data();
      data.key = doc.id;
      if (!data.archived) {
        temporary.push(data);
      } else {
        temporary1.push(data);
      }
    });
    setArchivedAnnouncement(temporary1);
    setAnnouncment(temporary);
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const onChange = (e) => {
    setAnmounceData({ ...anounceData, title: e.target.value });
    // datas.current = e;
  };

  useEffect(() => {
    getBlog();
  }, []);

  const onEditorStateChange = (e) => {
    setEditorState(e);
  };

  const onEditorChange = (e) => {
    setAnmounceData({ ...anounceData, body: e.blocks[0].text });
  };

  const onEditorEdit = (e) => {
    setEditData({ ...editData, body: e.blocks[0].text });
  };

  const onEdit = (e) => {
    setEditData({ ...editData, title: e.target.value });
    // datas.current = e;
  };

  const onSelect = (e) => {
    console.log(e);
    const value = e;
    switch (value) {
      case "all":
        setAnmounceData({
          ...anounceData,
          target: {
            toAll: true,
            toParents: false,
            toTeachers: false,
          },
        });
        break;
      case 1:
        setAnmounceData({
          ...anounceData,
          target: {
            toAll: false,
            toParents: true,
            toTeachers: false,
          },
        });
        break;
      case 2:
        setAnmounceData({
          ...anounceData,
          target: {
            toAll: false,
            toParents: false,
            toTeachers: true,
          },
        });
        break;
      default:
        setAnmounceData({
          ...anounceData,
          target: {
            toAll: true,
            toParents: false,
            toTeachers: false,
          },
        });
        break;
    }
  };

  const handleDelete = (id) => {
    deleteDoc(doc(firestoreDb, "announcment", id))
      .then((response) => {
        message.success("Data is Deleted successfuly");
        getBlog();
      })
      .catch((error) => {
        message.error("Data is not Deleted, Try Again");
        console.log(error);
      });
  };

  const EditData = () => {
    setDoc(doc(firestoreDb, "announcment", editData.key), editData, {
      merge: true,
    })
      .then((response) => {
        setShowEdit(false);
        message.success("Data is updated successfuly");
        getBlog();
      })
      .catch((error) => {
        message.error("Data is not updated");
        console.log(error);
      });
  };

  const openEdit = (data) => {
    setShowEdit(true);
    setShowPost(false);
    setEditData(data);
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(`<p>${data.body}</p>`)
        )
      )
    );
    setTimeout(() => {
      setShowEdit(true);
    }, 100);
  };
  return (
    <div className="flex flex-col bg-[#F9FAFB] h-[auto] lg:h-[auto]  mt-0 py-6 ">
      {showPost ? (
        <div className="bg-[white] mb-10">
          <div className="flex flex-row justify-between -mt-20 mb-5">
            <h1 className="text-2xl font-[600] font-jakarta text-[#344054] ">
              Post Announcment
            </h1>
          </div>
          <div className="flex flex-col p-6  border-[1px] bg-[#FFFFFF] rounded-md">
            <div className="flex flex-row justify-between w-[15vw] mt-5 mb-5">
              <h1 className="text-lg font-bold">To:</h1>
              <Select
                defaultValue="Select Audiance"
                onChange={(e) => onSelect(e)}
                className="w-[20vh] border-[#EAECF0] hover:border-[#EAECF0]"
              >
                <Option key={1} value={"all"}>
                  All
                </Option>
                <Option key={1} value={1}>
                  Parents
                </Option>
                <Option key={2} value={2}>
                  Teachers
                </Option>
              </Select>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold font-jakarta">Header</h1>
              <input
                onChange={onChange}
                type="text"
                className="mt-2 font-jakarta border-[0px] bg-[#FCFCFD] h-10 outline-none border-[#E7752B] rounded-sm hover:border-[#E7752B] focus:border-[#E7752B] active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
              />
            </div>
            <Editor
              editorState={editorState}
              style={{ padding: 10 }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="p-2 h-[auto]"
              onEditorStateChange={onEditorStateChange}
              onChange={onEditorChange}
            />
            <div className="flex flex-row justify-end">
              <button
                onClick={() => uploadData()}
                className="float-right px-3 w-20  rounded-md py-1 text-[white] bg-[#E7752B] mt-4 font-jakarta right-0"
              >
                Post{"  "}<Icon name="checkmark-outline" size="small" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showEdit ? (
        <div className="bg-[white] mb-10 -mt-10  ">
          <div className="flex flex-row justify-between -mt-14">
            <h1 className="text-2xl font-jakarta font-bold text-[#344054] ">
              Edit Announcment
            </h1>
          </div>
          <div className="flex flex-col p-6 border-[1px] bg-[white] mt-4 rounded-md">
            <div className="flex flex-row justify-between w-[15vw] mt-5 mb-5">
              <h1 className="text-lg font-bold">To:</h1>
              <Select
                defaultValue="Select Audiance"
                onChange={(e) => onSelect(e)}
                className="w-[20vh] border-[#EAECF0] hover:border-[#EAECF0]"
              >
                <Option key={1} value={1}>
                  Parents
                </Option>
                <Option key={2} value={2}>
                  Teachers
                </Option>
              </Select>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold font-jakarta">Header</h1>
              <input
                onChange={onEdit}
                type="text"
                className="mt-2 border-[0px] bg-[#FCFCFD] h-10 outline-none border-[#E7752B] rounded-sm hover:border-[#E7752B] focus:border-[#E7752B] font-jakarta active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
                defaultValue={editData.title}
              />
            </div>

            <Editor
              editorState={editorState}
              defaultContentState={"hkshdkdghdhgkj"}
              style={{ padding: 10 }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="p-2 h-[auto]"
              onEditorStateChange={onEditorStateChange}
              onChange={onEditorEdit}
            />
            <div className="flex flex-row justify-end">
              <button
                onClick={() => shownewPost()}
                className="float-right px-3 w-30 mr-2 font-jakarta  rounded-md py-2 text-[white] bg-[#E7752B] mt-4 right-0"
              >
                Add Post
              </button>
              <button
                onClick={() => EditData()}
                className="float-right px-3 w-20 font-jakarta rounded-md py-2 text-[white] bg-[#E7752B] mt-4 right-0"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mb-10">
        <h1 className="text-2xl text-[#344054] font-bold font-jakarta leading-10 mb-5">
          Latest Announcements
        </h1>
        <div className="p-6 bg-[#FFFFFF] border-[1px] rounded-md">
          {announcment.map((item, index) => (
            <div key={index} className="mt-0 flex flex-col mb-4">
              <h1 className="text-lg mb-2 font-bold font-jakarta capitalize text-[#344054]  ">
                {item.title}
              </h1>

              <div
                className="preview"
                style={{
                  fontFamily: "Plus Jackarta Sans",
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#667085",
                }}
                dangerouslySetInnerHTML={createMarkup(item.body)}
              ></div>
              <div
                style={{
                  float: "right",
                  width: 100,
                  display: "flex",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <button onClick={() => openEdit(item)}>
                  <EditOutlined
                    className="shadow-lg"
                    style={{
                      color: "#E7752B",
                      marginRight: 5,
                      fontSize: 22,
                      borderWidth: 1,
                      borderColor: "#E7752B",
                      padding: 3,
                    }}
                  />
                </button>
                <button onClick={() => handleDelete(item.key)}>
                  <DeleteOutlined
                    className="shadow-lg"
                    style={{
                      color: "#E7752B",
                      marginRight: 5,
                      fontSize: 22,
                      borderWidth: 1,
                      borderColor: "#E7752B",
                      padding: 3,
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h1 className="text-2xl font-bold  font-jakarta leading-10 mb-5 text-[#344054]">
          Archived Announcements
        </h1>
        <div className="bg-[#FFFFFF] p-6 border-[1px] rounded-md">
          {archivedAnnoumnet.map((item, index) => (
            <div key={index} className="mt-0">
              <h1 className="text-lg mb-2 font-bold  font-jakarta text-[#344054]">
                {item.title}
              </h1>
              <p
                style={{
                  fontFamily: "Plus Jackarta Sans",
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#667085",
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
