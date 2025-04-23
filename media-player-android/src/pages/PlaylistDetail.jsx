// src/pages/PlaylistDetail.jsx
import { useParams } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,Box
} from '@mui/material';
import MediaPlayerController from '../components/MediaPlayer';


const mockSongs = {
  '1': ['Lo-fi Track 1', 'Lo-fi Track 2', 'Lo-fi Track 3'],
  '2': ['Pump-up Track 1', 'Pump-up Track 2'],
};

export default function PlaylistDetail() {
  const { id } = useParams();
  const playlistName = id === '1' ? 'Chill Vibes' : 'Workout Mix';
  const songs = mockSongs[id] || [];

  return (
    <Box sx={{pb: 24, ml:10, pt: 2 }}> 
    <Typography variant="h6" fontWeight={600}>
        {playlistName}
      </Typography>  
   
    <Stack spacing={3} sx={{pt: 2}}>
      <MediaPlayerController />
      <List>
        {songs.map((song, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={song} />
          </ListItem>
        ))}
      </List>
    </Stack>
    </Box>
  );
}
