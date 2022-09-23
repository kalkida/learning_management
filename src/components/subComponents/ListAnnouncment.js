import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function ListAnnouncment() {
  const [editorState, setEditorState] = useState();
  const onEditorStateChange = (e) => {
    setEditorState(e);
  };
  return (
    <div>
      <div className="flex flex-row justify-between -mt-10">
        <h1 className="text-4xl ">Announcment</h1>
        <select className="h-10 border-[#E7752B] ">
          <option value="1">Parents</option>
          <option value="2">Teacher</option>
        </select>
      </div>
      <div className="mt-10 border-[1px] bordre-[black]">
        <Editor
          editorState={editorState}
          style={{ padding: 10 }}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="p-2"
          onEditorStateChange={onEditorStateChange}
        />
        <button className="float-right px-3 border-[1px] border-[#E7752B]">
          Submit
        </button>
      </div>
    </div>
  );
}
