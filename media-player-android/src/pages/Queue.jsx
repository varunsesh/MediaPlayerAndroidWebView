// src/pages/Queue.jsx
import React, { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import ReactPlayer from 'react-player';

const mockQueue = [
  {
    title: 'Sample Video 1',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: 'Sample Video 2',
    url: 'https://www.w3schools.com/html/movie.mp4',
  },
];

export default function Queue() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = mockQueue[currentIndex];

  return (
    <Box sx={{ pb: 24 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Queue
      </Typography>

      <List dense>
        {mockQueue.map((item, idx) => (
          <React.Fragment key={idx}>
            <ListItem disablePadding>
              <ListItemButton selected={idx === currentIndex} onClick={() => setCurrentIndex(idx)}>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Floating Media Player */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 56 + 16, // 56px nav + 16px spacing
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          Now Playing: {currentMedia.title}
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 360, aspectRatio: '16 / 9' }}>
          <ReactPlayer url={currentMedia.url} controls width="100%" height="100%" />
        </Box>
      </Box>
    </Box>
  );
}
