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
import DeleteIcon from '@mui/icons-material/Delete';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { getPlaylistById, currentPlayingInfo, setCurrentPlayingInfo, removeTrackFromPlaylist } = usePlaylist();
  const playlistObj = getPlaylistById(id);
  const playlist = playlistObj?.tracks || [];

  useEffect(() => {
    console.log('getPlaylistById', playlistObj);
    console.log('Current Playing info ', currentPlayingInfo);
  }, [currentPlayingInfo]);

  return (
    <Box sx={{alignItems:'center', display: 'flex', flexDirection: 'column', overflow:'hidden', height: '100vh', justifyContent:'center',
     }}>
      {/* Header and Controller */}
      <Box sx={{  flexShrink: 0, pt: 2, mb:0 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          {playlistObj?.name || 'Unnamed Playlist'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt:0, mb: 1 }}>
          <MediaPlayerController isQueueActive={false} />
        </Box>
      </Box>

      {/* Scrollable Songs */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
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
   <PlayArrowIcon fontSize="small" />
  <CardActionArea
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, // less gap
      p: 0, // remove default padding
      width: '80%' 
    }}
    onClick={
      () => {
        console.log(idx, id);
        setCurrentPlayingInfo({ playlistId: id, trackIndex: idx });
    }
  }
  >
    <CardContent sx={{ flexGrow: 1, py: 0.5, '&:last-child': { pb: 0.5 } }}>
      <Typography sx={{wordWrap:'break-word'}} variant="body2" fontWeight={600}>
        {track.name}
      </Typography>
    </CardContent>
  </CardActionArea>
  <IconButton onClick={() => removeTrackFromPlaylist(id, track.name)}>
      <DeleteIcon />
    </IconButton>

</Card>


            );
          })}
        </List>

      </Box>
    </Box>
  );
}
