import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import pasteImage from '../utils/pasteImage';

// MDEditor를 동적으로 import하여 서버 사이드 렌더링을 방지
const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

type EditorProps = {
  handleImage: (blob: File, callback: typeof Function) => Promise<() => void>;
};

const Editor = ({ handleImage }: EditorProps) => {
  const [value, setValue] = useState<string>("**Hello world!!!**");
  
  const handleChange = useCallback((newValue?: string) => {
    setValue(newValue || "");
  }, []);

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault(); // 기본 동작 방지 (예: 텍스트 붙여넣기)
    await pasteImage(event.clipboardData, setValue);
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault(); // 기본 동작 방지 (예: 파일 열기)
    await pasteImage(event.dataTransfer, setValue);
  };

  return (
    <div>
      <MDEditor
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
