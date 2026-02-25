import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { FaHeart, FaComment, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

function PhotoGallery() {
  const [likes, setLikes] = useState({
    bf: 0,
    friends: 0,
    pets: 0,
    creative: 0
  });
  const [comments, setComments] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load likes and comments from Supabase
  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, []);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('gallery_likes')
        .select('*')
        .eq('id', 1)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors
      
      if (error) {
        console.error('Error fetching likes:', error);
        setError('Failed to load likes');
        return;
      }
      
      if (data) {
        setLikes({
          bf: data.bf || 0,
          friends: data.friends || 0,
          pets: data.pets || 0,
          creative: data.creative || 0
        });
      } else {
        // No data found, create initial record
        const { error: insertError } = await supabase
          .from('gallery_likes')
          .insert([{ id: 1, bf: 0, friends: 0, pets: 0, creative: 0 }]);
        
        if (insertError) {
          console.error('Error creating likes record:', insertError);
        }
      }
    } catch (err) {
      console.error('Error in fetchLikes:', err);
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }
      
      if (data) {
        // Group comments by category
        const grouped = {};
        data.forEach(comment => {
          if (!grouped[comment.category]) {
            grouped[comment.category] = [];
          }
          grouped[comment.category].push(comment);
        });
        setComments(grouped);
      }
    } catch (error) {
      console.error('Error in fetchComments:', error);
    }
  };

  const handleLike = async (category) => {
    try {
      // Get current like count
      const currentLikes = likes[category] || 0;
      const newCount = currentLikes + 1;
      
      // Update local state immediately (optimistic UI)
      setLikes(prev => ({
        ...prev,
        [category]: newCount
      }));
      
      // Update in Supabase
      const updateData = {
        id: 1,
        bf: category === 'bf' ? newCount : likes.bf,
        friends: category === 'friends' ? newCount : likes.friends,
        pets: category === 'pets' ? newCount : likes.pets,
        creative: category === 'creative' ? newCount : likes.creative,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('gallery_likes')
        .upsert(updateData, { onConflict: 'id' });
      
      if (error) {
        console.error('Error updating likes:', error);
        // Revert on error
        setLikes(prev => ({
          ...prev,
          [category]: currentLikes
        }));
        alert('Failed to update like. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !newComment.trim() || !selectedCategory) return;

    try {
      const comment = {
        category: selectedCategory,
        name: commentName,
        text: newComment,
        likes: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('gallery_comments')
        .insert([comment])
        .select();

      if (error) {
        console.error('Error inserting comment:', error);
        alert('Failed to post comment. Please try again.');
        return;
      }

      if (data && data[0]) {
        // Update local comments state
        const updatedComments = { ...comments };
        if (!updatedComments[selectedCategory]) {
          updatedComments[selectedCategory] = [];
        }
        updatedComments[selectedCategory].unshift(data[0]);
        setComments(updatedComments);
      }

      setNewComment('');
      setCommentName('');
    } catch (error) {
      console.error('Error in handleCommentSubmit:', error);
    }
  };

  const handleCommentLike = async (commentId, currentLikes) => {
    try {
      const { error } = await supabase
        .from('gallery_comments')
        .update({ likes: (currentLikes || 0) + 1 })
        .eq('id', commentId);
      
      if (error) {
        console.error('Error liking comment:', error);
        return;
      }
      
      // Refresh comments to show updated likes
      fetchComments();
    } catch (error) {
      console.error('Error in handleCommentLike:', error);
    }
  };

  // Carousel data with your photo paths
  const carousels = [
    {
      id: 'bf',
      title: 'King of My Heart',
      description: '"And all at once, you are the one I\'ve been waiting for..."',
      images: [
        '/images/bf1.jpg',
        '/images/bf2.jpg',
        '/images/bf3.jpg'
      ]
    },
    {
      id: 'friends',
      title: 'My Support System',
      description: '"From the friends who know my history to the ones just joining the narrative"',
      images: [
        '/images/friends1.jpg',
        '/images/friends2.jpg',
        '/images/friends3.jpg',
        '/images/friends4.jpg',
        '/images/friends5.jpg'
      ]
    },
    {
      id: 'pets',
      title: 'Furry Loves',
      description: '"Not a Demodog"',
      images: [
        '/images/pets1.jpg',
        '/images/pets2.jpg',
        '/images/pets3.jpg',
        '/images/pets4.jpg',
        '/images/pets5.jpg',
        '/images/pets6.jpg',
        '/images/pets7.jpg'
      ]
    },
    {
      id: 'creative',
      title: 'Creative Corner',
      description: '"I Can Make The Whole Place Shimmer"',
      images: Array.from({ length: 15 }, (_, i) => `/images/creative${i + 1}.jpg`)
    }
  ];

  const openCommentModal = (category) => {
    setSelectedCategory(category);
    setShowCommentModal(true);
  };

  if (loading) {
    return <div className="loading">Loading gallery... 🐝</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="photo-gallery-section">
      <h2 className="section-title">📸 Hobbies & Circle</h2>
      
      <div className="gallery-grid">
        {carousels.map((carousel) => (
          <div key={carousel.id} className="gallery-card">
            <h3>{carousel.title}</h3>
            
            <div className="carousel-container">
              <div id={`carousel-${carousel.id}`} className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {carousel.images.map((img, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img 
                        src={img} 
                        className="d-block w-100" 
                        alt={`${carousel.title} ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x600?text=Photo+Coming+Soon';
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${carousel.id}`} data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${carousel.id}`} data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>

            <p className="gallery-description">{carousel.description}</p>
            
            <div className="gallery-actions">
              <button 
                type="button"
                className="like-button-gallery"
                onClick={() => handleLike(carousel.id)}
              >
                <FaHeart className={likes[carousel.id] > 0 ? 'liked' : ''} />
                <span>{likes[carousel.id] || 0}</span>
              </button>
              
              <button 
                type="button"
                className="comment-button-gallery"
                onClick={() => openCommentModal(carousel.id)}
              >
                <FaComment />
                <span>{comments[carousel.id]?.length || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {showCommentModal && selectedCategory && (
        <div className="photo-modal" onClick={() => setShowCommentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCommentModal(false)}>
              <FaTimes />
            </button>
            
            <h3 style={{ padding: '20px', color: 'var(--text-primary)' }}>
              Comments for {carousels.find(c => c.id === selectedCategory)?.title}
            </h3>
            
            <form onSubmit={handleCommentSubmit} className="comment-form" style={{ margin: '0 20px 20px 20px' }}>
              <input
                type="text"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
              />
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows="3"
              />
              <button type="submit">Post Comment 🍯</button>
            </form>

            <div className="comments-list" style={{ padding: '0 20px 20px 20px' }}>
              {comments[selectedCategory]?.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-name">{comment.name}</span>
                    <span className="comment-time">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <button 
                    type="button"
                    className="comment-like"
                    onClick={() => handleCommentLike(comment.id, comment.likes)}
                  >
                    <FaHeart /> {comment.likes || 0}
                  </button>
                </div>
              ))}
              {(!comments[selectedCategory] || comments[selectedCategory].length === 0) && (
                <p className="no-comments">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PhotoGallery;