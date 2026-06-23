import React, { useRef, useEffect, useState } from 'react';

function VideoPlayer({ video, index, isNearActive, onActive, onFavUpdate }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [isLiked, setIsLiked] = useState(false);
  
  const lastClickTime = useRef(0);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('local_reels_favs') || '[]');
      if (favs.includes(video.name)) {
        setIsLiked(true);
      }
    } catch (e) {}
  }, [video.name]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onActive(index);
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(e => setIsPlaying(false));
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [index, onActive, isNearActive]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if(videoEl.duration) {
        setProgress((videoEl.currentTime / videoEl.duration) * 100);
      }
    };
    
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isNearActive]);

  const handleVideoClick = (e) => {
    if (e.target.closest('.overlay-right') || e.target.closest('.overlay-left')) return;
    
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime.current;
    
    if (timeDiff < 300) {
      handleDoubleTap();
      lastClickTime.current = 0;
    } else {
      lastClickTime.current = currentTime;
      setTimeout(() => {
        if (lastClickTime.current === currentTime) {
          togglePlayPause();
        }
      }, 300);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      setShowPlayPause(true);
      setTimeout(() => setShowPlayPause(false), 1000);
    }
  };

  const toggleFavorite = () => {
    const newState = !isLiked;
    setIsLiked(newState);
    try {
      let favs = JSON.parse(localStorage.getItem('local_reels_favs') || '[]');
      if (newState) {
        if (!favs.includes(video.name)) favs.push(video.name);
      } else {
        favs = favs.filter(name => name !== video.name);
      }
      localStorage.setItem('local_reels_favs', JSON.stringify(favs));
      if (onFavUpdate) onFavUpdate();
    } catch (e) {}
  };

  const handleDoubleTap = () => {
    if (!isLiked) toggleFavorite();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  return (
    <div className="video-item" ref={containerRef} onClick={handleVideoClick}>
      
      {isNearActive ? (
        <video
          ref={videoRef}
          src={video.url}
          className="video-element"
          loop
          playsInline
          muted={false}
        />
      ) : (
        <div className="video-element" style={{ background: '#000' }} />
      )}
      
      <div className={`play-pause-indicator ${showPlayPause ? 'show' : ''}`}>
        {isPlaying ? '▶' : '❚❚'}
      </div>

      <div className={`heart-anim ${showHeart ? 'active' : ''}`}>❤️</div>

      <div className="gradient-overlay"></div>

      <div className="overlay-ui">
        <div className="overlay-left glass-panel">
          <div className="video-title">@{video.name.split('.')[0].substring(0, 20)}</div>
          <div className="video-desc">Local video playing seamlessly ✨</div>
        </div>
        
        <div className="overlay-right">
          <button className={`glass-btn action-btn ${isLiked ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}>
            {isLiked ? '❤️' : '🤍'}
            <span className="action-text">Save</span>
          </button>

          <div className={`record-container ${isPlaying ? '' : 'paused'}`}>
            <div className="record-inner"></div>
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default React.memo(VideoPlayer, (prevProps, nextProps) => {
  return prevProps.video.id === nextProps.video.id &&
         prevProps.index === nextProps.index &&
         prevProps.isNearActive === nextProps.isNearActive;
});
