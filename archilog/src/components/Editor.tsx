import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import  { pasteImage } from '../utils/uploadImage';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import React from 'react';
import { editAbout, getUserInfo } from "../firebase/users";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useRouter } from 'next/router';
import { auth } from "@/firebase/firebase";
import { useState } from 'react';
import { useAuth } from '@/app/contexts/hook/useAuth';

const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
    ssr: false,
});

const Editor = () => {
    const currentUser = auth.currentUser;
    const [value, setValue] = useState<string>("");
    const router = useRouter();

    const { darkMode } = useDarkMode();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserInfo(currentUser?.displayName || '');
                if (user) {
                    const resume = user.resume || "";
                    setValue(resume);
                } else {
                    console.error("로그인된 사용자가 없습니다.");
                }
            } catch (error) {
                console.error("사용자 정보를 불러오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = useCallback((newValue?: string) => {
        if (newValue !== value) {
            setValue(newValue || "");
        }
    }, [value]);

    const handlePaste = useCallback(async (event: React.ClipboardEvent) => {
        event.preventDefault();
        const files: File[] = Array.from(event.clipboardData.files);
        const imgUrl = await pasteImage(files);
        setValue((prev) => `${prev}\n${imgUrl.join('\n')}`);
    }, []);

    const handleDrop = useCallback(async (event: React.DragEvent) => {
        event.preventDefault();
        const files: File[] = Array.from(event.dataTransfer.files);
        const imgUrl = await pasteImage(files);
        setValue((prev) => `${prev}\n${imgUrl.join('\n')}`);
    }, []);

    const handleContent = async () => {
        await editAbout(value);
        router.push(`/${currentUser?.displayName}`);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-color-mode', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <div className="block h-full" data-color-mode={darkMode ? "dark" : "light"} >
            <MDEditor className="w-full h-4/5"
                value={value}
                onChange={handleChange}
                onPaste={handlePaste}
                height={700}
                onDrop={handleDrop}
            />
             <div className="w-full">
                <button className="float-right bg-customYellow px-6 py-1 rounded-md my-4 mx-2" onClick={handleContent}>저장</button>
            </div>
        </div>
    );
};

export default Editor;
