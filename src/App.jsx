import { useState } from 'react'
import VideoFeed from './components/VideoFeed'
import SavedVideos from './components/SavedVideos'

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function App() {
  const [videos, setVideos] = useState([]);
  const [favUpdateTrigger, setFavUpdateTrigger] = useState(0);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter only videos
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    // Shuffle the files randomly
    const shuffledFiles = shuffleArray(videoFiles);
    
    // Create local object URLs for each file
    const videoObjects = shuffledFiles.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    setVideos(videoObjects);
  };

  if (videos.length > 0) {
    return (
      <div className="horizontal-pager">
        <div className="pager-page">
          <VideoFeed videos={videos} onFavUpdate={() => setFavUpdateTrigger(p => p + 1)} />
        </div>
        <div className="pager-page">
          <SavedVideos videos={videos} favUpdateTrigger={favUpdateTrigger} />
        </div>
      </div>
    );
  }

  return (
    <div className="landing-container">
      <h1 className="landing-title">Local Reels</h1>
      <p className="landing-subtitle">
        Experience your local videos in a cinematic, infinite-scroll format. 
        Everything stays on your device.
      </p>
      
      <div className="load-btn-wrapper">
        <button className="load-btn">Load Gallery</button>
        <input 
          type="file" 
          accept="video/*" 
          multiple 
          className="file-input"
          onChange={handleFileSelect}
          title="Select videos"
        />
      </div>
    </div>
  )
}

export default App
