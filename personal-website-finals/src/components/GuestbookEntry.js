import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import ReplySection from './ReplySection';
import { FaHeart, FaReply } from 'react-icons/fa';

function GuestbookEntry({ entry, onUpdate }) {
  const [showReplies, setShowReplies] = useState(false);
  const [liking, setLiking] = useState(false);
  const [error, setError] = useState('');

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (liking) return;
    
    setLiking(true);
    setError('');
    
    try {
      // Get current likes (ensure it's a number)
      const currentLikes = typeof entry.likes === 'number' ? entry.likes : 0;
      const newLikes = currentLikes + 1;
      
      console.log('Updating like:', { id: entry.id, currentLikes, newLikes }); // Debug log
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('guestbook_entries')
        .update({ likes: newLikes })
        .eq('id', entry.id)
        .select(); // Select to get the updated record
      
      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to update like. Please try again.');
        return;
      }
      
      console.log('Update successful:', data); // Debug log
      
      // Call onUpdate to refresh the list
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error in handleLike:', err);
      setError('An unexpected error occurred');
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="guestbook-entry">
      <div className="entry-header">
        <div className="entry-avatar">
          <span className="entry-icon">🍯</span>
        </div>
        <div className="entry-info">
          <span className="entry-name">{entry.name}</span>
          <span className="entry-time">
            {new Date(entry.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="entry-message">
        "{entry.message}"
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="entry-actions">
        <button 
          type="button"
          className={`like-button ${liking ? 'liking' : ''}`} 
          onClick={handleLike}
          disabled={liking}
        >
          <FaHeart className={entry.likes > 0 ? 'liked' : ''} /> 
          <span>{entry.likes || 0}</span>
        </button>
        <button 
          type="button"
          className="reply-button"
          onClick={() => setShowReplies(!showReplies)}
        >
          <FaReply /> Replies
        </button>
      </div>
      
      {showReplies && (
        <div className="replies-container">
          <ReplySection entryId={entry.id} />
        </div>
      )}
    </div>
  );
}

export default GuestbookEntry;