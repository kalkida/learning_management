import React, { useEffect, useState, useRef } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
// import {
//   FirestoreTextEditor,
//   FirestoreTextEditorProvider,
// } from "firestore-text-editor";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  query,
  collection,
  getDocs,
  setDocs,
  where,
  addDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../firebase";
import { useSelector } from "react-redux";
import { message } from "antd";
export default function ListAnnouncment() {
  const [announcment, setAnnouncment] = useState([]);
  const [archivedAnnoumnet, setArchivedAnnouncement] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const data = useSelector((state) => state.user.profile.school);
  const [editorState, setEditorState] = useState();
  const [anounceData, setAnmounceData] = useState({
    title: "",
    body: '',
    target: {
      toAll: true,
      toParents: false,
      toTeachers: false
    },
    school: data,
    archived: false,
  })
  const datas = useRef("");

  const uploadData = async (datar) => {
    console.log(anounceData);
    await addDoc(collection(firestoreDb, "announcment"), anounceData).then(response => {
      getBlog();
      message.success("Announce Poseted")
      setShowPost(false)
    }).catch(error =>
      message.error("Something is wrong, Try Again")
    )
    // getBlog();
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
    setAnmounceData({ ...anounceData, title: e.target.value })
    // datas.current = e;
  };

  useEffect(() => {
    getBlog();
  }, []);

  const onEditorStateChange = (e) => {
    setEditorState(e);
  };

  const onEditorChange = (e) => {
    setAnmounceData({ ...anounceData, body: e.blocks[0].text })
  }

  const onSelect = (e) => {
    const value = e.target.value
    switch (value) {
      case "all":
        setAnmounceData({
          ...anounceData, target: {
            toAll: true,
            toParents: false,
            toTeachers: false
          }
        })
        break;
      case "1":
        setAnmounceData({
          ...anounceData, target: {
            toAll: false,
            toParents: true,
            toTeachers: false
          }
        })
        break;
      case "2":
        setAnmounceData({
          ...anounceData, target: {
            toAll: false,
            toParents: false,
            toTeachers: true
          }
        })
        break;
      default:
        setAnmounceData({
          ...anounceData, target: {
            toAll: true,
            toParents: false,
            toTeachers: false
          }
        })
        break;
    }
  }

  return (
    <div>
      {!showPost ?
        <button
          onClick={() => setShowPost(true)}
          className="float-right px-3 w-25 mt-[-3rem] rounded-md py-2 text-[white] bg-[#E7752B]  right-0"
        >
          Add Post
        </button>
        : null}
      {showPost ?
        <div>
          <div className="flex flex-row justify-between -mt-14">
            <h1 className="text-4xl ">Post Announcment</h1>
            <select
              title="Filter"
              className="h-10 border-[#E7752B] outline-none border-[2px] rounded-lg"
              onChange={(e) => onSelect(e)}
              placeholder="Filter"
            >
              <option key={1} value="all">For All</option>
              <option key={2} value="1">Parents</option>
              <option key={3} value="2">Teacher</option>
            </select>
          </div>
          <div className="] flex flex-col">
            <input
              onChange={onChange}
              type="text"
              className="mt-10 border-[2px] border-[#E7752B] w-[10vw] mb-4 px-2 py-1"
              placeholder="Title"
            ></input>
            {/* <textarea className="w-[100%] h-40 border-[#E7752B] border-[2px]"></textarea> */}
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
        : null}
      <div>
        <h1 className="text-4xl my-10">Latest announcements</h1>
        <div>
          {announcment.map((item, index) => (
            <div key={index} className="mt-10">
              <h1 className="text-lg mb-2 font-bold">{item.title}</h1>
              <div
                className="preview"
                dangerouslySetInnerHTML={createMarkup(item.body)}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-4xl my-10">Archived announcements</h1>
        <div>
          {archivedAnnoumnet.map((item, index) => (
            <div key={index} className="mt-10">
              <h1 className="text-lg">{item.title}</h1>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
