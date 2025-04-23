// ShufflePlayer.jsx
import React from 'react';
import { IconButton, Box } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious, VolumeUp, VolumeDown } from '@mui/icons-material';

const ShufflePlayer = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onVolumeUp,
  onVolumeDown,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 200,
        height: 200,
        borderRadius: '50%',
        border: '4px solid #888',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Center play/pause */}
      <IconButton
        onClick={onPlayPause}
        sx={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#eee',
          boxShadow: 'inset 0 0 5px #ccc',
        }}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>

      {/* Previous */}
      <IconButton
        onClick={onPrev}
        sx={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <SkipPrevious />
      </IconButton>

      {/* Next */}
      <IconButton
        onClick={onNext}
        sx={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <SkipNext />
      </IconButton>

      {/* Volume Up */}
      <IconButton
        onClick={onVolumeUp}
        sx={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <VolumeUp />
      </IconButton>

      {/* Volume Down */}
      <IconButton
        onClick={onVolumeDown}
        sx={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <VolumeDown />
      </IconButton>
    </Box>
  );
};

export default ShufflePlayer;
