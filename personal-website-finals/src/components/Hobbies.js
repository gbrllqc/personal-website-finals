import React from 'react';
import { FaHeart } from 'react-icons/fa';

function Hobbies() {
  return (
    <section className="hobbies-section">
      <h2 className="section-title">✨ My World ✨</h2>
      
      <div className="lyrics-showcase">
        <div className="lyric-card">
          <i className="fas fa-heart lyric-icon"></i>
          <p className="lyric-text">"And all at once, you are the one I've been waiting for..."</p>
        </div>
        <div className="lyric-card">
          <i className="fas fa-users lyric-icon"></i>
          <p className="lyric-text">"From the friends who know my history to the ones just joining the narrative"</p>
        </div>
        <div className="lyric-card">
          <i className="fas fa-dog lyric-icon"></i>
          <p className="lyric-text">"Not a Demodog"</p>
        </div>
        <div className="lyric-card">
          <i className="fas fa-paint-brush lyric-icon"></i>
          <p className="lyric-text">"I Can Make The Whole Place Shimmer"</p>
        </div>
      </div>
    </section>
  );
}

export default Hobbies;