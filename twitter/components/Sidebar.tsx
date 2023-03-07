import Image from 'next/image';
import SidebarMenuItem from './SidebarMenuItem';
import { EllipsisHorizontalIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useSession, signIn } from 'next-auth/react';
import {
  BellIcon,
  BookmarkIcon,
  ClipboardIcon,
  HashtagIcon,
  InboxIcon,
  ListBulletIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import tw from 'tailwind-styled-components';

const SidebarContainerDiv = tw.div`
  hidden  
  sm:flex 
  flex-col 
  p-2 
  xl:items-start
  fixed
  h-full
  xl:ml-24
`;

const TweetButtonDiv = tw.button`
  bg-blue-400 
  text-white 
  rounded-full 
  w-56 
  h-12 
  font-bold 
  shadow-md 
  hover:brightness-95 
  text-lg 
  hidden 
  xl:flex
  items-center
  justify-center
`;

const UserIconLinkContainerDiv = tw.div`
  hoverEffect
  text-gray-700 
  flex 
  items-center 
  justify-center 
  xl:justify-start 
  mt-auto
`;

const Sidebar = () => {
  const { data: session } = useSession();
  return (
    <SidebarContainerDiv>
      <div className="hoverEffect p-0 hover:bg-blue-100">
        <Image
          src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
          alt="twitter-logo"
          width="50"
          height="50"
        />
      </div>
      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        {session && (
          <>
            <SidebarMenuItem text="Notification" Icon={BellIcon} />
            <SidebarMenuItem text="Messages" Icon={InboxIcon} />
            <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} />
            <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
            <SidebarMenuItem text="Profile" Icon={UserIcon} />
            <SidebarMenuItem text="More" Icon={ListBulletIcon} />
          </>
        )}
      </div>
      {session ? (
        <>
          <TweetButtonDiv>Tweet</TweetButtonDiv>
          <UserIconLinkContainerDiv>
            <img
              src="https://img.freepik.com/free-icon/user_318-804790.jpg?w=2000"
              alt="user-image"
              className="h-10 w-10 rounded-full"
            />
            <div className="leading-5 hidden xl:inline">
              <h4 className="font-bold">{session.user.name}</h4>
              <p className="text-gray-500">@{session.user.username}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
          </UserIconLinkContainerDiv>
        </>
      ) : (
        <>
          <TweetButtonDiv onClick={() => signIn()}>Sign In</TweetButtonDiv>
        </>
      )}
    </SidebarContainerDiv>
  );
};

export default Sidebar;
