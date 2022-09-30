import React, { useEffect, useState, useRef } from "react";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import DOMPurify from "dompurify";
import {
  FilterOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
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
  deleteDoc,
  doc, setDoc
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
  const [editData, setEditData] = useState({});
  const [showEdit, setShowEdit] = useState(false);
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
    await addDoc(collection(firestoreDb, "announcment"), anounceData).then(response => {
      getBlog();
      message.success("Announce Poseted")
      setShowPost(false)
    }).catch(error =>
      message.error("Something is wrong, Try Again")
    )
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

  const onEditorEdit = (e) => {
    setEditData({ ...editData, body: e.blocks[0].text })
  }

  const onEdit = (e) => {
    setEditData({ ...editData, title: e.target.value })
    // datas.current = e;
  };

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
    setDoc(doc(firestoreDb, "announcment", editData.key), editData, { merge: true })
      .then((response) => {
        setShowEdit(false)
        message.success("Data is updated successfuly");
        getBlog();
      })
      .catch((error) => {
        message.error("Data is not updated");
        console.log(error);
      });
  }

  const openEdit = (data) => {
    setShowEdit(false);
    setEditData(data);
    setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(`<p>${data.body}</p>`))));
    setTimeout(() => {
      setShowEdit(true);
    }, 100);
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
              className="h-9 border-[#E7752B] outline-none border-[2px] rounded-lg bg-transparent text-[#E7752B] w-[5rem]"
              onChange={(e) => onSelect(e)}
              placeholder="Filter"
            >
              <option selected hidden>Filter</option>
              <option key={1} value="all">For All</option>
              <option key={2} value="1">Parents</option>
              <option key={3} value="2">Teacher</option>
            </select>
          </div>
          <div className="flex flex-col">
            <input
              onChange={onChange}
              type="text"
              className="mt-10 border-[2px] border-[lightgray] hover:border-[#E7752B] focus:border-[#E7752B] active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
              placeholder="Header"
            />
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
      {showEdit ?
        <div>
          <div className="flex flex-row justify-between -mt-14">
            <h1 className="text-4xl ">Edit Announcment</h1>
            <select
              title="Filter"
              className="h-9 border-[#E7752B] outline-none border-[2px] rounded-lg bg-transparent text-[#E7752B] w-[5rem]"
              onChange={(e) => onSelect(e)}
              placeholder="Filter"
            >
              <option selected hidden>Filter</option>
              <option key={1} value="all">For All</option>
              <option key={2} value="1">Parents</option>
              <option key={3} value="2">Teacher</option>
            </select>
          </div>
          <div className="flex flex-col">
            <input
              onChange={onEdit}
              type="text"
              className="mt-10 border-[2px] border-[lightgray] hover:border-[#E7752B] focus:border-[#E7752B] active:border-[#E7752B] w-[35vw] mb-4 px-2 py-1 "
              placeholder="Header"
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
        : null}
      <div>
        <h1 className="text-4xl my-10 bg-[#f0e5da]">Latest Announcements</h1>
        <div>
          {announcment.map((item, index) => (
            <div key={index} className="mt-10">
              <h1 className="text-lg mb-2 font-bold">{item.title}</h1>

              <div
                className="preview"
                dangerouslySetInnerHTML={createMarkup(item.body)}
              >
              </div>
              <div style={{ float: 'right' }}>
                <button onClick={() => openEdit(item)}><EditOutlined style={{ color: "#E7752B", marginRight: 5, fontSize: 22 }} /></button>
                <button onClick={() => handleDelete(item.key)}><DeleteOutlined style={{ color: "#E7752B", fontSize: 22 }} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-4xl my-10 bg-[#f0e5da]">Archived Announcements</h1>
        <div>
          {archivedAnnoumnet.map((item, index) => (
            <div key={index} className="mt-10">
              <h1 className="text-lg mb-2 font-bold">{item.title}</h1>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
