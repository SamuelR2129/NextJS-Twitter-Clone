import { SparklesIcon } from '@heroicons/react/24/outline';
import Input from './Input';
import Post from './Post';
import tw from 'tailwind-styled-components';
import { useEffect, useState } from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

export const FeedContainerDiv = tw.div`
  xl:ml-[370px] 
  border-l 
  border-r 
  xl:min-w-[576px] 
  sm:ml-[73px] 
  flex-grow 
  max-w-xl
`;

export const FeedHeaderDiv = tw.div`
  flex 
  items-center
  space-x-2
  py-2 
  px-3 
  sticky 
  top-0 
  z-50 
  bg-white 
  border-b 
  border-gray-200 
  items-center
`;

export const SparklesContainer = tw.div`
  hoverEffect 
  flex 
  items-center 
  justify-center 
  px-0 
  ml-auto 
  w-9 
  h-9
`;

const Feed = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, []);

  return (
    <FeedContainerDiv>
      <FeedHeaderDiv>
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <SparklesContainer>
          <SparklesIcon className="h-5" />
        </SparklesContainer>
      </FeedHeaderDiv>
      <Input />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post key={post.id} propPostId={post.id} post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </FeedContainerDiv>
  );
};

export default Feed;
