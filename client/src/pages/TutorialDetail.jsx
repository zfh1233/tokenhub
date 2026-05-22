import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import TOCNav from '../components/tutorial/TOCNav';
import CommentSection from '../components/tutorial/CommentSection';
import useAuthStore from '../store/authStore';
import useTOC from '../hooks/useTOC';
import { tutorialAPI } from '../services/api';

const TutorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const contentRef = useRef(null);
  const { headings, scrollTo } = useTOC(contentRef);

  const [tutorial, setTutorial] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [{ data: tut }, { data: coms }] = await Promise.all([
          tutorialAPI.getOne(id),
          tutorialAPI.getComments(id),
        ]);
        setTutorial(tut);
        setComments(coms);
        setLiked(tut.likes?.some((l) => l._id === user?._id));
        setLikesCount(tut.likes?.length || 0);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const { data } = await tutorialAPI.toggleLike(id);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定删除此教程？')) return;
    await tutorialAPI.delete(id);
    navigate(-1);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!tutorial) return <div className="text-center py-20 text-gray-400">教程不存在</div>;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/agent/${tutorial.agent?._id}`} className="text-sm text-gray-400 hover:text-primary-500 mb-4 inline-block">← 返回列表</Link>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <article className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                {tutorial.agent && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: tutorial.agent.color + '15', color: tutorial.agent.color }}>
                    {tutorial.agent.icon} {tutorial.agent.name}
                  </span>
                )}
                {tutorial.tags?.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{tutorial.title}</h1>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-600">
                    {tutorial.author?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{tutorial.author?.username}</div>
                    <div className="text-xs text-gray-400">{new Date(tutorial.createdAt).toLocaleDateString('zh-CN')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={handleLike} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${liked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
                    ❤️ {likesCount}
                  </button>
                  {(user?._id === tutorial.author?._id || user?.role === 'admin') && (
                    <button onClick={handleDelete} className="text-xs text-gray-400 hover:text-red-500">删除</button>
                  )}
                </div>
              </div>

              <div ref={contentRef} className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-a:text-primary-500 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {tutorial.content}
                </ReactMarkdown>
              </div>

              {tutorial.attachments?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">附件</h3>
                  <div className="space-y-2">
                    {tutorial.attachments.map((att, i) => (
                      <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-500 hover:underline">
                        📎 {att.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <CommentSection tutorialId={id} comments={comments} />
            </article>
          </div>

          <TOCNav headings={headings} />
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;
