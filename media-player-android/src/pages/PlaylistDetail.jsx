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
import { useState } from 'react';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { getPlaylistById } = usePlaylist();
  const playlistObj = getPlaylistById(id);
  const playlist = playlistObj?.tracks || [];

  // Track current playing index here
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  const handlePlayTrack = (index) => {
    console.log('Play clicked track:', playlist[index]?.name);
    setCurrentTrackIndex(index);
    // Later: inform MediaPlayerController if needed
  };

  return (
    <Box sx={{ pb: 24, ml: 2, mr: 2, pt: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        {playlistObj?.name || 'Unnamed Playlist'}
      </Typography>

      <Stack spacing={3} alignItems="center">
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <MediaPlayerController externalCurrentIndex={currentTrackIndex} />
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {playlist.map((track, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                px: 2,
                py: 1,
                backgroundColor: currentTrackIndex === idx ? 'primary.light' : 'background.paper',
                transition: 'transform 0.2s, background-color 0.2s',
                '&:hover': {
                  backgroundColor: currentTrackIndex === idx ? 'primary.main' : 'primary.light',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardActionArea
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                onClick={() => handlePlayTrack(idx)}
              >
                <IconButton color="primary">
                  <PlayArrowIcon />
                </IconButton>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {track.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </List>
      </Stack>
    </Box>
  );
}
