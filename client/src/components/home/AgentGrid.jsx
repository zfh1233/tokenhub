import AgentCard from './AgentCard';

const AgentGrid = ({ agents }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {agents.map((agent) => (
      <AgentCard key={agent._id} agent={agent} />
    ))}
  </div>
);

export default AgentGrid;
