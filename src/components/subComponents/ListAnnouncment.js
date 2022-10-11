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
import { message } from "antd";

export default function ListAnnouncment() {
  const [announcment, setAnnouncment] = useState([]);
  const [archivedAnnoumnet, setArchivedAnnouncement] = useState([]);
  const [showPost, setShowPost] = useState(false);
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
        message.success(
          `Announce Poseted for
          ${announcment.target.toParents ? "parents" : "teachers"}`
        );
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
    const value = e.target.value;
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
      case "1":
        setAnmounceData({
          ...anounceData,
          target: {
            toAll: false,
            toParents: true,
            toTeachers: false,
          },
        });
        break;
      case "2":
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
    <div className="flex flex-col bg-[#E8E8E8] h-[auto] lg:h-[auto]  -mt-20 p-10 ">
      <div className="flex flex-row justify-end mb-2">
        <select
          title="Filter"
          className="h-9 border-[#E7752B] outline-none border-[1px] md:border-[2px] rounded-sm mr-4 bg-transparent text-[#E7752B] md:w-[5rem] z-0"
          onChange={(e) => onSelect(e)}
          placeholder="Filter"
        >
          <option selected hidden>
            Filter
          </option>
          <option key={1} value="all">
            For All
          </option>
          <option key={2} value="1">
            Parents
          </option>
          <option key={3} value="2">
            Teacher
          </option>
        </select>
        <button
          onClick={() => shownewPost()}
          className="p-1 border-[1px] md:border-[2px] text-xs md:text-sm md:px-3 md:w-25 rounded-sm py-1 hover:text-[white]  border-[#E7752B] text-[#E7752B] z-0"
        >
          Add Post
        </button>
      </div>

      {showPost ? (
        <div>
          <div className="flex flex-row justify-between -mt-14">
            <h1 className="text-3xl font-bold font-sans ">Post Announcment</h1>
          </div>
          <div className="flex flex-col">
            <input
              onChange={onChange}
              type="text"
              className="mt-10 border-[2px] border-[#E7752B] rounded-sm hover:border-[#E7752B] focus:border-[#E7752B] active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
              placeholder="Header"
            />
            <Editor
              editorState={editorState}
              style={{ padding: 10 }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="p-2 h-80"
              onEditorStateChange={onEditorStateChange}
              onChange={onEditorChange}
            />
            <div className="flex flex-row justify-end">
              <button
                onClick={() => uploadData()}
                className="float-right px-3 w-20  rounded-md py-2 text-[white] bg-[#E7752B] mt-4 right-0"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showEdit ? (
        <div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between -mt-14">
              <h1 className="text-4xl ">Edit Announcment</h1>
            </div>
            <input
              onChange={onEdit}
              type="text"
              className="mt-10 border-[2px] border-[#E7752B] rounded-sm hover:border-[#E7752B] focus:border-[#E7752B] active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
              placeholder="Title Of Post"
              defaultValue={editData.title}
            />
            <Editor
              editorState={editorState}
              defaultContentState={"hkshdkdghdhgkj"}
              style={{ padding: 10 }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="p-2 h-80"
              onEditorStateChange={onEditorStateChange}
              onChange={onEditorEdit}
            />
            <div className="flex flex-row justify-end">
              <button
                onClick={() => EditData()}
                className="float-right px-3 w-20  rounded-md py-2 text-[white] bg-[#E7752B] mt-4 right-0"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div>
        <h1 className="text-3xl font-bold font-serif leading-10">
          Latest Announcements
        </h1>
        <div>
          {announcment.map((item, index) => (
            <div key={index} className="mt-10">
              <h1 className="text-lg mb-2 font-bold font-serif capitalize underline underline-offset-8 decoration-[#E7752B] ">
                {item.title}
              </h1>

              <div
               // className="preview"
                className="Preview text-base mb-2 font-medium font-serif"
               // style={{ fontFamily:'Plus Jackarta Sans' , fontSize:16, fontWeight:'500'}}
                dangerouslySetInnerHTML={createMarkup(item.body)}
              ></div>
              <div
                style={{
                  float: "right",
                  width: 100,
                  display: "flex",
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
      <div>
        <h1 className="text-3xl font-bold font-serif leading-10">
          Archived Announcements
        </h1>
        <div>
          {archivedAnnoumnet.map((item, index) => (
            <div key={index} className="mt-10">
              <h1 className="text-lg mb-2 font-bold font-serif">{item.title}</h1>
              <p  className="text-base mb-2 font-medium font-serif">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
