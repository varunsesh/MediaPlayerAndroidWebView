// src/pages/PlaylistDetail.jsx
import { useParams } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  Box
} from '@mui/material';
import MediaPlayerController from '../components/MediaPlayerController';
import { usePlaylist } from '../components/PlaylistContext';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { getPlaylistById } = usePlaylist();
  const playlist = getPlaylistById(id)?.tracks;
  console.log('Playlist:', playlist);


  return (
    <Box sx={{ pb: 24, ml: 10, pt: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        {playlist?.name}
      </Typography>

      <Stack spacing={3} sx={{ pt: 2 }}>
        <MediaPlayerController />
        <List>
          {playlist?.map((track, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={track.name} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
}
