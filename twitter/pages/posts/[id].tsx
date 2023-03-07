import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Widgets from '../../components/Widgets';
import { NewsResultsTypes, RandomUserResultTypes } from '../../types/types';
import CommentModal from '../../components/CommentModal';
import { FeedContainerDiv, FeedHeaderDiv } from '../../components/Feed';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Post from '../../components/Post';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase';
import Comment from '../../components/Comment';
import { AnimatePresence, motion } from 'framer-motion';

type IndexPropTypes = {
  newsResults: NewsResultsTypes;
  randomUsersResults: RandomUserResultTypes;
};

export default function PostPage({
  newsResults,
  randomUsersResults
}: IndexPropTypes) {
  const router = useRouter();
  const id = router.query.id as string;
  const [post, setPost] = useState<DocumentSnapshot<DocumentData>>();
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  //get post data
  useEffect(
    () => onSnapshot(doc(db, 'posts', id), (snapshot) => setPost(snapshot)),
    [db, id]
  );

  //gets comments of post
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'posts', id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);

  return (
    <>
      <Head>
        <title>Post Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen mx-auto">
        <Sidebar />
        <FeedContainerDiv>
          <FeedHeaderDiv>
            <div className="hoverEffect" onClick={() => router.push('/')}>
              <ArrowLeftIcon className="h-5 " />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              Tweet
            </h2>
          </FeedHeaderDiv>
          <Post propPostId={id} post={post} />
          <AnimatePresence>
            {comments.length > 0 &&
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Comment
                    key={comment.id}
                    commentId={comment.id}
                    originalPostId={id}
                    postComments={comment}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </FeedContainerDiv>

        <Widgets
          newsResults={newsResults.articles}
          randomUsers={randomUsersResults.results}
        />
        <CommentModal />
      </main>
    </>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(
    'https://saurav.tech/NewsAPI/top-headlines/category/business/us.json'
  );
  const newsResults: NewsResultsTypes = await res.json();

  if (newsResults!) {
    console.error(
      `There was an issue finding new results for tech - ${newsResults}`
    );
  }

  let randomUsersResults: RandomUserResultTypes = { results: [] };

  try {
    const res = await fetch(
      'https://randomuser.me/api/?results=30&inc=name,login,picture'
    );

    randomUsersResults = await res.json();
  } catch (e) {
    randomUsersResults = { results: [] };
  }
  return {
    props: {
      newsResults,
      randomUsersResults
    }
  };
};