export type PostTypes = {
  id: string;
  name: string;
  username: string;
  userImage?: string;
  image: string;
  text: string;
  timestamp: any;
};

export type CommentTypes = {
  name: string;
  username: string;
  image: string;
  timestamp: any;
  userImg: string;
  comment: string;
  userId: string;
};

export type ArticlesTypes = {
  source: {
    id?: number;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

export type NewsResultsTypes = {
  status: string;
  totalResults: number;
  articles: ArticlesTypes[];
};

export type RandomUserResultTypes = {
  results: RandomUserTypes[] | [];
};

export type RandomUserTypes = {
  name: {
    title: string;
    first: string;
    last: string;
  };
  login: {
    username: string;
  };
  picture: {
    thumbnail: string;
  };
};
