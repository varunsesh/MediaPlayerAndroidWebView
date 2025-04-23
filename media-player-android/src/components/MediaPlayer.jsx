// src/components/MediaPlayer.js
import React from 'react';
import ReactPlayer from 'react-player';
import { Box } from '@mui/material';

const MediaPlayer = ({ url }) => {
  return (
    <Box sx={{ width: '100%', aspectRatio: '16 / 9', mt: 2 }}>
      <ReactPlayer url={url} controls width="100%" height="100%" />
    </Box>
  );
};

export default MediaPlayer;
2