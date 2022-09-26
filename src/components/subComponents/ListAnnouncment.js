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
export default function ListAnnouncment() {
  const [announcment, setAnnouncment] = useState([]);
  const [archivedAnnoumnet, setArchivedAnnouncement] = useState([]);
  const data = useSelector((state) => state.user.profile.school);
  const [editorState, setEditorState] = useState();
  const datas = useRef("");

  const uploadData = async (datar) => {
    console.log(datas.current);
    const docRef = await addDoc(collection(firestoreDb, "announcment"), {
      body: JSON.stringify(datas.current),
      target: {
        toAll: true,
        toParents: false,
        toTeachers: false,
      },
      school: data,
      archived: false,
    });
    getBlog();
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
    datas.current = e;
  };
  useEffect(() => {
    getBlog();
  }, []);
  const onEditorStateChange = (e) => {
    setEditorState(e);
  };
  return (
    <div>
      <div className="flex flex-row justify-between -mt-14">
        <h1 className="text-4xl ">Post Announcment</h1>
        <select
          title="Filter"
          className="h-10 border-[#E7752B] outline-none border-[2px] rounded-lg"
        >
          <option value="all">Filter</option>
          <option value="1">Parents</option>
          <option value="2">Teacher</option>
        </select>
      </div>
      <div className="] flex flex-col">
        <input
          onChange={(e) => onChange(e)}
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
      <div>
        <h1 className="text-4xl my-10">Latest announcements</h1>
        <div>
          {announcment.map((item, index) => (
            <div className="mt-10">
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
            <div className="mt-10">
              <h1 className="text-lg">{item.title}</h1>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
