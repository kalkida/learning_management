import React, { useEffect, useState, useRef } from "react";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import ReactReadMoreReadLess from "react-read-more-read-less";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Modal } from "antd";
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
  const [deletData, setDeletData] = useState({});
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);

  const showModal = (id) => {
    setDeletData(id);

    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleDelete(deletData.key);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModals = (id) => {
    // setDeletData(id);

    setIsModalOpens(true);
  };

  const handleOks = () => {
    // handleDelete(deletData.key);
    uploadData();
    setIsModalOpens(false);
  };

  const handleCancels = () => {
    setIsModalOpens(false);
  };

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
        // setShowPost(false);
        setEditorState("");
        setAnmounceData("");
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
        setEditorState("");
        setShowPost(true);
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
              <h1 className="text-lg font-bold text-[#344054]">To:</h1>
              <Select
                bordered={false}
                defaultValue="Select Audiance"
                onChange={(e) => onSelect(e)}
                className="w-[20vh] border-[#EAECF0] hover:border-[#EAECF0] !rounded-[6px] border-[2px]"
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
              <h1 className="text-lg font-bold font-jakarta text-[#344054]">
                Header
              </h1>
              <input
                placeholder="Please update student’s progress using laba "
                onChange={onChange}
                type="text"
                className="mt-2 font-jakarta border-[0px] bg-[#FCFCFD] h-10 outline-none border-[#E7752B] rounded-sm hover:border-[#E7752B] focus:border-[#E7752B] active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
              />
            </div>
            <h1 className="text-lg font-bold font-jakarta text-[#344054]">
              Main Text
            </h1>

            <Editor
              editorState={editorState}
              style={{ padding: 10 }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="p-2 h-[auto] border-b-[#D0D5DD] border-b-[2px] bg-[#FCFCFD]"
              onEditorStateChange={onEditorStateChange}
              onChange={onEditorChange}
            />
            <div className="flex flex-row justify-end">
              {anounceData.title != "" ? (
                <button
                  onClick={() => showModals()}
                  className="float-right px-3 w-20  rounded-md py-1 text-[white] bg-[#E7752B] mt-4 font-jakarta right-0"
                >
                  Post{"  "}
                  <Icon name="checkmark-outline" size="small" />
                </button>
              ) : (
                <button
                  disabled
                  className="float-right px-3 w-20  rounded-md py-1 text-[white] bg-[#E7752B] mt-4 font-jakarta right-0"
                >
                  Post{"  "}
                  <Icon name="checkmark-outline" size="small" />
                </button>
              )}
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
                className="w-[20vh] border-[#EAECF0] hover:border-[#EAECF0] !rounded-[6px]"
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
                placeholder="Please update student’s progress using laba"
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
      <div className="mb-10 bg-[#FFFFFF] border-[1px] rounded-md">
        <h1 className="text-2xl text-[#344054] font-[500] font-jakarta leading-10 mt-6 pl-[24px]">
          Latest Announcements
        </h1>
        <div className="px-8">
          {announcment.map((item, index) => (
            <div key={index} className="mt-0 flex flex-col mb-4">
              <h1 className="text-lg mb-2 font-bold font-jakarta capitalize text-[#344054]   ">
                {item.title}
              </h1>
              <ReactReadMoreReadLess
                charLimit={200}
                readMoreText={"Show more ▼"}
                readLessText={"Show less ▲"}
                readMoreClassName="text-[#E7752B]"
                readLessClassName="text-[#E7752B]"
              >
                {item.body}
              </ReactReadMoreReadLess>
              <div
                style={{
                  float: "right",
                  width: "50%%",
                  display: "flex",
                  marginTop: 0,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={{ marginRight: 10 }}
                  onClick={() => openEdit(item)}
                >
                  <Icon
                    fill="#E7752B"
                    name="edit-outline"
                    size="large"
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
                    }} // small, medium, large, xlarge
                  />
                </button>
                <button onClick={() => showModal(item)}>
                  <Icon
                    fill="#E7752B"
                    name="trash-2-outline"
                    size="large"
                    animation={{
                      type: "pulse", // zoom, pulse, shake, flip
                      hover: true,
                      infinite: false,
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

      <Modal
        title={<h1 className="text-[#1D2939] text-[30px]">Remove Post</h1>}
        open={isModalOpen}
        onOk={handleOk}
        okText="Remove Permanently"
        okType="danger"
        onCancel={handleCancel}
      >
        <h1 className="text-[#344054] text-[24px]">{deletData.title}</h1>
        <p className="text-[#667085] text-justify">{deletData.body}</p>
      </Modal>

      <Modal
        title={<h1 className="text-[#1D2939] text-[30px]">Confirm Post</h1>}
        open={isModalOpens}
        onOk={handleOks}
        okText="Post"
        okType="primary"
        onCancel={handleCancels}
      >
        <h1 className="text-[#344054] text-[24px]">{anounceData?.title}</h1>
        {/* <p className="text-[#667085] text-justify">{editData}</p> */}
        <Editor
          editorState={editorState}
          defaultContentState={"hkshdkdghdhgkj"}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          disabled={true}
          editorClassName="p-2 h-[auto]"
          onEditorStateChange={onEditorStateChange}
          onChange={onEditorEdit}
        />
        {/* <div
          className="preview"
          style={{
            fontFamily: "Plus Jackarta Sans",
            fontSize: 16,
            fontWeight: "500",
            color: "#667085",
          }}
          dangerouslySetInnerHTML={createMarkup(editData)}
        ></div> */}
      </Modal>
    </div>
  );
}
