import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { FaGithub, FaLinkedin, FaInstagram, FaCamera } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    setProfile(data);
  };

  const socialLinks = {
    github: "https://github.com/gbrllqc",
    linkedin: "https://www.linkedin.com/in/gabrielle-c-7b7916326/",
    instagram: "https://www.instagram.com/gbrll.qrnclb/"
  };

  // Profile photos with your actual photos
const profilePhotos = [
  { id: 1, url: "/images/me1.jpg", caption: "Just me! 🐻" },
  { id: 2, url: "/images/me3.jpg", caption: "Another day in the Hundred Acre Wood 🌲" },
  { id: 3, url: "/images/me2.jpg", caption: "Feeling sweet! 🍯" },
  { id: 4, url: "/images/me4.jpg", caption: "Me at school 🐯" },
  { id: 5, url: "/images/menpooh.jpg", caption: "Me and Pooh! 🐻🍯" },
];

  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="profile-section">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar" onClick={() => setShowPhotoModal(true)}>
            <span className="avatar-emoji">🐻</span>
            <div className="camera-icon">
              <FaCamera />
            </div>
          </div>
          <div className="honey-drip"></div>
        </div>
        
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <p className="profile-bio">{profile.bio}</p>
          
          <div className="profile-social">
            <a 
              href={socialLinks.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
            >
              <FaGithub /> GitHub
            </a>
            <a 
              href={socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <FaInstagram /> Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Profile Photos Modal */}
      {showPhotoModal && (
        <div className="photo-modal" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-content profile-photos-modal" onClick={e => e.stopPropagation()}>
            <h3>My Photo Gallery 📸</h3>
            <div className="profile-photos-grid">
              {profilePhotos.map(photo => (
                <div key={photo.id} className="profile-photo-card">
                  <img src={photo.url} alt={photo.caption} />
                  <p>{photo.caption}</p>
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={() => setShowPhotoModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;