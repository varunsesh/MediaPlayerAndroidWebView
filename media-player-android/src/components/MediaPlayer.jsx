// MediaPlayerController.jsx
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box } from '@mui/material';
import ShufflePlayer from './ShufflePlayer';

const MediaPlayerController = ({ url }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8); // range: 0 to 1

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleVolumeUp = () => {
    setVolume(v => Math.min(1, v + 0.1));
  };

  const handleVolumeDown = () => {
    setVolume(v => Math.max(0, v - 0.1));
  };

  // Placeholder stubs for next/prev
  const handleNext = () => console.log('Next track');
  const handlePrev = () => console.log('Previous track');

  return (
    <Box>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={volume}
        controls={false}
        width="100%"
        height="auto"
        style={{ display: 'none' }} // hidden actual player
      />

      <ShufflePlayer
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onVolumeUp={handleVolumeUp}
        onVolumeDown={handleVolumeDown}
      />
    </Box>
  );
};

export default MediaPlayerController;
