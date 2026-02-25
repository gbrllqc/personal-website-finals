import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

function GuestbookForm({ onNewEntry }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .insert([
          { name, message, likes: 0 }
        ])
        .select();

      if (error) throw error;

      // Add new entry to the list
      onNewEntry(data[0]);
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Oops! Could not add your message. Please try again! 🐝');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guestbook-form-container">
      <h2>Leave a Message in the Honey Pot! 🍯</h2>
      <form onSubmit={handleSubmit} className="guestbook-form">
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Winnie the Pooh"
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Your Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something sweet..."
            rows="4"
            disabled={loading}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Sending... 🐝' : 'Send Message 🍯'}
        </button>
      </form>
    </div>
  );
}

export default GuestbookForm;