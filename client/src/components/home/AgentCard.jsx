import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AgentCard = ({ agent }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/agent/${agent._id}`)}
      className="group relative bg-white rounded-xl border border-gray-100 p-6 cursor-pointer transition-colors hover:border-primary-200"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: agent.color + '15' }}
      >
        {agent.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{agent.description}</p>
      <span
        className="inline-block mt-3 text-xs px-2.5 py-1 rounded-full font-medium"
        style={{ backgroundColor: agent.color + '15', color: agent.color }}
      >
        {agent.category}
      </span>

      <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full flex items-center justify-center bg-white/90 rounded-xl transition-all duration-300 overflow-hidden">
        <p className="text-sm text-gray-600 px-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {agent.description}
        </p>
      </div>
    </motion.div>
  );
};

export default AgentCard;
