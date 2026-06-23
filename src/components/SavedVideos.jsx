import React, { useEffect, useState } from 'react';
import VideoFeed from './VideoFeed';

function SavedVideos({ videos, favUpdateTrigger }) {
  const [savedVideos, setSavedVideos] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('local_reels_favs') || '[]');
      const filtered = videos.filter(v => favs.includes(v.name));
      setSavedVideos(filtered);
    } catch (e) {}
  }, [videos, favUpdateTrigger]);

  if (playingIndex !== null) {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', height: '100svh', zIndex: 100, background: '#000' }}>
        <button 
          onClick={() => setPlayingIndex(null)}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 101, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🔙 Back
        </button>
        <VideoFeed 
          videos={savedVideos} 
          onFavUpdate={() => {}} 
          initialIndex={playingIndex}
        />
      </div>
    );
  }

  return (
    <div className="saved-container">
      <h2 className="saved-header">Saved Videos</h2>
      <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>
        Swipe left to go back to the feed.
      </p>
      {savedVideos.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>❤️</div>
          <p style={{ color: '#888' }}>No saved videos yet.<br/>Swipe back and double-tap to save!</p>
        </div>
      ) : (
        <div className="saved-grid">
          {savedVideos.map((video, idx) => (
            <div key={idx} className="saved-item" onClick={() => setPlayingIndex(idx)} style={{ cursor: 'pointer' }}>
              {video.name.substring(0, 25)}{video.name.length > 25 ? '...' : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedVideos;
