import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RANK_STYLES = {
  1: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  2: 'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
  3: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
};

const TutorialCard = ({ tutorial, rank }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
  >
    <Link to={`/tutorial/${tutorial._id}`}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {rank && rank <= 3 && (
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${RANK_STYLES[rank] || 'bg-gray-100 text-gray-500'}`}>
              {rank}
            </span>
          )}
          {rank && rank > 3 && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
              {rank}
            </span>
          )}
          {tutorial.agent && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: tutorial.agent.color + '15', color: tutorial.agent.color }}
            >
              {tutorial.agent.icon} {tutorial.agent.name}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{tutorial.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{tutorial.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            {tutorial.author?.avatar ? (
              <img src={tutorial.author.avatar} alt="" className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-medium text-primary-600">
                {tutorial.author?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <span>{tutorial.author?.username}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-0.5">❤️ {tutorial.likesCount ?? tutorial.likes?.length ?? 0}</span>
            <span>{new Date(tutorial.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default TutorialCard;
