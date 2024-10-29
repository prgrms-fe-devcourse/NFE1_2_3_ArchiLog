import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "./firebase";

// const storageRef = ref(storage, '/image');

// const uploadUrl = (file: string) => {
//     uploadString(storageRef, file, 'base64').then((snapshot) => {
//         console.log('Uploaded a base64url string!');
//     });
// }

const uploadUrl = async (file: string): Promise<string> => {
    const storageRef = ref(storage, `/images/${Date.now()}`);
    const snapshot = await uploadString(storageRef, file, 'base64');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};


export default uploadUrl;