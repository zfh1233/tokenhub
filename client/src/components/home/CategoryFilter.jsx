const CATEGORIES = ['全部', '对话', '编程', '绘画', '写作', '搜索', '音乐', '视频'];

const CategoryFilter = ({ active, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => onChange(cat === '全部' ? '' : cat)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          (cat === '全部' && !active) || cat === active
            ? 'bg-primary-500 text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-500'
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
