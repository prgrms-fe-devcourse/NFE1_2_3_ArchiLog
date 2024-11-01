import uploadUrl from "@/firebase/storage";

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.replace(/^data:image\/\w+;base64,/, '');
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const pasteImage = async (files: File[]): Promise<string[]> => {
  return Promise.all(
      files.map(async (file) => {
          const base64 = await toBase64(file);
          const imageUrl = await uploadUrl(base64);
          return `![](${imageUrl})`;
      })
  );
}

export const pasteImageUrl = async (files: File[]): Promise<string[]> => {
  return Promise.all(
      files.map(async (file) => {
          const base64 = await toBase64(file);
          const imageUrl = await uploadUrl(base64);
          return imageUrl;
      })
  );
};