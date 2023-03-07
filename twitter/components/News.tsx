import { ArticlesTypes } from '../types/types';

type NewsPropTypes = {
  article: ArticlesTypes;
};

const News = ({ article }: NewsPropTypes) => {
  return (
    <a href={article.url} target="_blank">
      <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-200">
        <div className="space-y-0.5">
          <h6 className="text-sm font-bold ">{article.title}</h6>
          <p className="text-xs font-medium text-gray-500">
            {article.source.name}
          </p>
        </div>
        <img
          className="rounded-xl "
          width="70px"
          src={article.urlToImage}
          alt="news images"
        />
      </div>
    </a>
  );
};

export default News;
