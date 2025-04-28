import { useParams } from 'react-router-dom';
import {
  Typography,
  List,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Box,
  IconButton, Grid
} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { usePlaylist } from '../components/PlaylistContext';
import MediaPlayerController from '../components/MediaPlayerController';
import { useEffect, useState } from 'react';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { getPlaylistById, currentPlayingInfo } = usePlaylist();
  const playlistObj = getPlaylistById(id);
  const playlist = playlistObj?.tracks || [];

  useEffect(() => {
    console.log('getPlaylistById', playlistObj);
    console.log('Current Playing info ', currentPlayingInfo);
  }, [currentPlayingInfo]);

  return (
    <Box sx={{alignItems:'center', display: 'flex', flexDirection: 'column', overflow:'hidden', height: '100vh', ml: 2, mr: 2 }}>
      {/* Header and Controller */}
      <Box sx={{  flexShrink: 0, pt: 2, mb:5 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          {playlistObj?.name || 'Unnamed Playlist'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt:5, mb: 2 }}>
          <MediaPlayerController  />
        </Box>
      </Box>

      {/* Scrollable Songs */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          ml:3,
          pb: 10, // extra padding for safe bottom
          scrollbarWidth:'none', 
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          
        }}
      >
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding:0,  alignItems: 'center'}}>
          {playlist.map((track, idx) => {
            const isCurrentlyPlaying = id === currentPlayingInfo.playlistId && idx === currentPlayingInfo.trackIndex;
            return (
              <Card
           key={idx}
           variant="outlined"
           sx={{
             display: 'flex',
             width: '90%',
             alignItems: 'center',
             borderRadius: 2,
             px: 1.5, // Reduced horizontal padding
             py: 0.5, // Reduced vertical padding
             backgroundColor: isCurrentlyPlaying ? 'primary.light' : 'background.paper',
             transition: 'transform 0.2s, background-color 0.2s',
             minHeight: 56, // ✨ Makes it tighter (you can tweak this)
             '&:hover': {
               backgroundColor: isCurrentlyPlaying ? 'primary.main' : 'primary.light',
               transform: 'scale(1.02)',
          },
        }}
      >
  <CardActionArea
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, // less gap
      p: 0, // remove default padding
      width: '100%' 
    }}
    onClick={() => {/* Optional: Play this track */}}
  >
    <IconButton color="primary" size="small">
      <PlayArrowIcon fontSize="small" />
    </IconButton>
    <CardContent sx={{ flexGrow: 1, py: 0.5, '&:last-child': { pb: 0.5 } }}>
      <Typography variant="body2" fontWeight={600} noWrap>
        {track.name}
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>

            );
          })}
        </List>
      </Box>
    </Box>
  );
}
