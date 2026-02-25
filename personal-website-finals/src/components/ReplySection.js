import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { FaHeart, FaReply } from 'react-icons/fa';

function ReplySection({ entryId }) {
  const [replies, setReplies] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState({ name: '', reply: '' });
  const [loading, setLoading] = useState(false);

  const fetchReplies = useCallback(async () => {
    const { data } = await supabase
      .from('guestbook_replies')
      .select('*')
      .eq('entry_id', entryId)
      .order('created_at', { ascending: true });
    
    setReplies(data || []);
  }, [entryId]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const handleLike = async (replyId, currentLikes) => {
    await supabase
      .from('guestbook_replies')
      .update({ likes: currentLikes + 1 })
      .eq('id', replyId);
    
    fetchReplies();
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.name.trim() || !newReply.reply.trim()) return;

    setLoading(true);
    try {
      await supabase
        .from('guestbook_replies')
        .insert([{
          entry_id: entryId,
          name: newReply.name,
          reply: newReply.reply
        }]);
      
      setNewReply({ name: '', reply: '' });
      setShowReplyForm(false);
      fetchReplies();
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reply-section">
      <button 
        className="reply-toggle"
        onClick={() => setShowReplyForm(!showReplyForm)}
      >
        <FaReply /> Reply ({replies.length})
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input
            type="text"
            placeholder="Your name"
            value={newReply.name}
            onChange={(e) => setNewReply({...newReply, name: e.target.value})}
            disabled={loading}
            required
          />
          <textarea
            placeholder="Your reply..."
            value={newReply.reply}
            onChange={(e) => setNewReply({...newReply, reply: e.target.value})}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Post Reply 🍯'}
          </button>
        </form>
      )}

      <div className="replies-list">
        {replies.map(reply => (
          <div key={reply.id} className="reply-item">
            <div className="reply-header">
              <span className="reply-name">{reply.name}</span>
              <span className="reply-time">
                {new Date(reply.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="reply-text">{reply.reply}</p>
            <button 
              className="like-button"
              onClick={() => handleLike(reply.id, reply.likes)}
            >
              <FaHeart /> {reply.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReplySection;