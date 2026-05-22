import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { tutorialAPI } from '../../services/api';

const CommentSection = ({ tutorialId, comments: initialComments }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState(initialComments || []);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await tutorialAPI.addComment(tutorialId, { content });
      setComments([data, ...comments]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    try {
      await tutorialAPI.deleteComment(tutorialId, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">评论 ({comments.length})</h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的评论..."
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? '发送中...' : '发送评论'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-600">
                  {comment.author?.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{comment.author?.username}</span>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
              {(user?._id === comment.author?._id || user?.role === 'admin') && (
                <button onClick={() => handleDelete(comment._id)} className="text-xs text-gray-400 hover:text-red-500">删除</button>
              )}
            </div>
            <p className="text-sm text-gray-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
