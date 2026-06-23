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

  return (
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
  );
}

export default VideoFeed;
