import { useParams } from 'react-router-dom';
import {
  Typography,
  List,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Box,
  IconButton,
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
    <Box sx={{ pb: 24, ml: 2, mr: 2, pt: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        {playlistObj?.name || 'Unnamed Playlist'}
      </Typography>

      <Stack spacing={3} alignItems="center">
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <MediaPlayerController />
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {playlist.map((track, idx) => {
            const isCurrentlyPlaying = id === currentPlayingInfo.playlistId && idx === currentPlayingInfo.trackIndex;
            return (
              <Card
                key={idx}
                variant="outlined"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  backgroundColor: isCurrentlyPlaying ? 'primary.light' : 'background.paper',
                  transition: 'transform 0.2s, background-color 0.2s',
                  '&:hover': {
                    backgroundColor: isCurrentlyPlaying ? 'primary.main' : 'primary.light',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardActionArea
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  onClick={() => {/* you can hook to skip to track here */}}
                >
                  {/* <IconButton color="primary">
                    <PlayArrowIcon />
                  </IconButton> */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {track.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </List>
      </Stack>
    </Box>
  );
}
