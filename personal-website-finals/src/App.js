import React, { useState, useEffect } from 'react';
import Profile from './components/Profile';
import PhotoGallery from './components/PhotoGallery';
import GuestbookForm from './components/GuestbookForm';
import GuestbookEntry from './components/GuestbookEntry';
import ThemeToggle from './components/ThemeToggle';
import { supabase } from './utils/supabase';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme + '-theme';
    
    fetchEntries();
  }, []);

  useEffect(() => {
    document.body.className = theme + '-theme';
  }, [theme]);

  const fetchEntries = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      console.log('Fetched entries:', data); // Debug log
      setEntries(data || []);
    }
  } catch (error) {
    console.error('Error in fetchEntries:', error);
  } finally {
    setLoading(false);
  }
};

  const handleNewEntry = (newEntry) => {
    setEntries([newEntry, ...entries]);
  };

  return (
    <div className={`App ${theme}-theme`}>
      <ThemeToggle theme={theme} setTheme={setTheme} />
      
      <header className="pooh-header">
        <h1>🏡 Welcome to My Hundred Acre Wood 🍯</h1>
        <p>A little corner of the internet inspired by Pooh and friends!</p>
      </header>

      <Profile />
      <PhotoGallery />

      <main>
        <section className="guestbook-section">
          <h2>📖 Sign My Guestbook</h2>
          <GuestbookForm onNewEntry={handleNewEntry} />
          
          <div className="entries-list">
            <h3>Messages from Friends 🐝</h3>
            {loading ? (
              <p className="loading">Loading messages...</p>
            ) : entries.length === 0 ? (
              <p className="no-messages">
                No messages yet. Be the first to leave a message for Pooh! 🐻
              </p>
            ) : (
              entries.map(entry => (
                <GuestbookEntry 
                  key={entry.id} 
                  entry={entry} 
                  onUpdate={fetchEntries}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>Made with love, honey, and a little help from my friends 🐝</p>
        <p>© 2026 - A Hundred Acre Wood Adventure</p>
        <div className="footer-emoji">
          <span>🐻</span>
          <span>🍯</span>
          <span>🐷</span>
          <span>🐰</span>
          <span>🦉</span>
        </div>
      </footer>
    </div>
  );
}

export default App;