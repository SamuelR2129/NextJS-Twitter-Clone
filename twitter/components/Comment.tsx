import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  QueryDocumentSnapshot,
  setDoc
} from 'firebase/firestore';
import { CommentTypes } from '../types/types';
import Moment from 'react-moment';
import { db } from '../firebase';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState, postIdState } from '../atom/modalAtom';

type PostPropTypes = {
  commentId: string;
  originalPostId: string;
  postComments: QueryDocumentSnapshot<DocumentData>;
};

const Comment = ({
  postComments,
  commentId,
  originalPostId
}: PostPropTypes): JSX.Element => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);

  useEffect(() => {
    return onSnapshot(
      collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  if (!postComments) return <div></div>;

  const { comment, image, userImg, name, username, timestamp, userId } =
    postComments?.data() as CommentTypes;

  const likeComment = async () => {
    if (hasLiked && session) {
      await deleteDoc(
        doc(
          db,
          'posts',
          originalPostId,
          'comments',
          commentId,
          'likes',
          session?.user.uid
        )
      );
    } else if (session) {
      await setDoc(
        doc(
          db,
          'posts',
          originalPostId,
          'comments',
          commentId,
          'likes',
          session?.user.uid
        ),
        {
          username: session.user.username
        }
      );
    }
  };

  const deleteComment = async () => {
    if (window.confirm('Are you sure you want to delete this comment')) {
      deleteDoc(doc(db, 'posts', originalPostId, 'comments', commentId));
    }
  };

  if (!comment) return <div></div>;
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
      <img
        className="h-11 w-11 rounded-full mr-4 "
        src={userImg}
        alt="user-img"
        referrerPolicy="no-referrer"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[16px] sm:text-[16px] hover:underline">
              {name}
            </h4>
            <span className="text-sm sm:text-[15px]">@{username} - </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment format="DD/MM/YYYY HH:mm">{timestamp?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalIcon className="h-10 w-10 hoverEffect hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2 ">
          {comment}
        </p>
        <div className="flex justify-between text-gray-500 p-2 ">
          <div className="flex items-center select-none">
            <ChatBubbleLeftIcon
              onClick={() => {
                setPostId(originalPostId);
                setOpen(!open);
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>

          {session?.user.uid === userId && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-500 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartFilled
                onClick={() => likeComment()}
                className="h-9 w-9 hoverEffect p-2 text-red-500 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={() => likeComment()}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-500 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span className={`${hasLiked && 'text-red-600'} text-sm`}>
                {likes.length}
              </span>
            )}
          </div>

          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
};

export default Comment;
