import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import pasteImage from '../utils/pasteImage';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import React from 'react'
import { editAbout } from "../firebase/users";

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
    ssr: false,
});

export type EditorProps = MDEditorProps;

const Editor = () => {
  const [value, setValue] = useState<string>("**Hello world!!!**");

  const handleChange = useCallback((newValue?: string) => {
    setValue(newValue || "");
  }, []);

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    event.preventDefault();
    pasteImage(event.clipboardData, setValue);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    pasteImage(event.dataTransfer, setValue);
  }, []);

  const handleContent = () => {
    editAbout(process.env.USER_ID || '', value);
  }

  return (
    <div className="block">
        <div className="w-full">
            <button className="float-right bg-customYellow"
            onClick={handleContent}>저장</button>
        </div>
        <MDEditor className="w-full"
            value={value}
            onChange={handleChange}
            height={600}
            onPaste={handlePaste}
            onDrop={handleDrop}
        />
    </div>
  );
};

export default Editor;
