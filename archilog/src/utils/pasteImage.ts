import type { SetStateAction } from 'react';
import insertToTextArea from './insertToTextArea';

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const pasteImage = async (dataTransfer: DataTransfer, setValue: (value: SetStateAction<string>) => void) => {
  const files: File[] = [];
  for (let index = 0; index < dataTransfer.items.length; index += 1) {
    const file = dataTransfer.files.item(index);
    if (file) {
      files.push(file);
    }
  }

  await Promise.all(
    files.map(async (file) => {
      const base64 = await toBase64(file);
      const insertedMarkdown = `![](${base64})`;
      setValue(prev => (prev ? `${prev}\n${insertedMarkdown}` : insertedMarkdown));
      insertToTextArea(insertedMarkdown)
    }),
  );
};

export default pasteImage;