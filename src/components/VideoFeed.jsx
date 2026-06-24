import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';

function VideoFeed({ videos, onFavUpdate, initialIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && initialIndex > 0) {
      const child = containerRef.current.children[initialIndex];
      if (child) {
        child.scrollIntoView({ behavior: 'instant' });
      }
    }
  }, [initialIndex]);

  const watchedCount = activeIndex + 1;
  const isAlarmMode = watchedCount > 10; // Change to alarm mode after 10 reels

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Views Counter (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        background: isAlarmMode ? 'rgba(255, 0, 0, 0.15)' : 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: isAlarmMode ? '#ff2c55' : 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: '900',
        fontSize: '0.9rem',
        border: `1px solid ${isAlarmMode ? 'rgba(255, 44, 85, 0.5)' : 'var(--glass-border)'}`,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: isAlarmMode ? '0 0 15px rgba(255,44,85,0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
        animation: isAlarmMode ? 'pulseAlarm 0.8s infinite alternate' : 'none'
      }}>
        <span style={{ fontSize: '1.1rem', animation: isAlarmMode ? 'shakeAlarm 0.5s infinite' : 'none' }}>
          {isAlarmMode ? '🚨' : '👁️'}
        </span> 
        {watchedCount} / {videos.length}
      </div>

      <div className="reels-container" ref={containerRef}>
        {videos.map((video, index) => {
          // Virtualization: only render actual video logic if it's near the active index
          const isNearActive = Math.abs(index - activeIndex) <= 2;
          
          return (
            <VideoPlayer 
              key={video.id} 
              video={video} 
              index={index}
              isNearActive={isNearActive}
              onActive={(idx) => setActiveIndex(idx)}
              onFavUpdate={onFavUpdate}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VideoFeed;
