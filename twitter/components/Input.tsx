import { FaceSmileIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import { ChangeEvent, MutableRefObject, useRef, useState } from 'react';
import { db, storage } from '../firebase';

const Input = (): JSX.Element => {
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef() as MutableRefObject<HTMLInputElement>;

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, 'posts'), {
      id: session?.user.uid,
      text: input,
      userImage: session?.user.image,
      timestamp: serverTimestamp(),
      name: session?.user.name,
      username: session?.user.username
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, 'data_url').then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL
        });
      });
    }

    setInput('');
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (event: ChangeEvent) => {
    const reader = new FileReader();
    const target = event.target as HTMLInputElement;
    const fileList: FileList | null = target.files;

    if (fileList && fileList[0]) {
      reader.readAsDataURL(fileList[0]);
    }

    reader.onload = (readerEvent) => {
      if (!readerEvent.target || !readerEvent.target.result) {
        console.error(
          `addImageToPost readerEvent is not valid - ${readerEvent.target}`
        );
      } else {
        const result: string = readerEvent.target.result as string;
        setSelectedFile(result);
      }
    };
  };

  const userImage =
    session?.user.image ||
    'https://img.freepik.com/free-icon/user_318-804790.jpg?w=2000';

  return (
    <>
      {session && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <img
            src={userImage}
            referrerPolicy="no-referrer"
            alt="user-image"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows={2}
                placeholder="Whats happening"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            {selectedFile && (
              <div className="relative">
                <XMarkIcon
                  onClick={() => setSelectedFile(null)}
                  className="h-10 text-black absolute cursor-pointer shadow-md border border-white p-1 shadow-white rounded-full"
                />
                <img
                  src={selectedFile}
                  className={`${loading && 'animate-pulse'}`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className="flex">
                    <div onClick={() => filePickerRef.current.click()}>
                      <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={(event) => addImageToPost(event)}
                      />
                    </div>
                    <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    onClick={() => sendPost()}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Input;
