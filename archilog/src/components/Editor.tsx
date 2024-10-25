// import { MDEditorProps } from "@uiw/react-md-editor";
// import dynamic from "next/dynamic";
// import { useState, useCallback } from "react";
// import pasteImage from '../utils/pasteImage';

// const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
//   ssr: false,
// });

// const Editor = () => {
//   const [value, setValue] = useState<string>("**Hello world!!!**");

//   const handleChange = useCallback((newValue?: string) => {
//     setValue(newValue || "");
//   }, []);

//   const handlePaste = useCallback((event: React.ClipboardEvent) => {
//     event.preventDefault();
//     pasteImage(event.clipboardData, setValue);
//   }, []);

//   const handleDrop = useCallback((event: React.DragEvent) => {
//     event.preventDefault();
//     pasteImage(event.dataTransfer, setValue);
//   }, []);

//   return (
//     <div>
//       <MDEditor
//         value={value}
//         onChange={handleChange}
//         height={600}
//         onPaste={handlePaste}
//         onDrop={handleDrop}
//       />
//     </div>
//   );
// };

// export default Editor;
