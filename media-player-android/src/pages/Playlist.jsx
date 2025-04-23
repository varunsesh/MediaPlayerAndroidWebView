// src/pages/Playlist.jsx
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Button,
  Box,
} from '@mui/material';

const mockPlaylists = [
  { id: '1', name: 'Chill Vibes' },
  { id: '2', name: 'Workout Mix' },
];

export default function Playlist() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3} sx={{ml:10, pt: 2 }}>
      <Box centered>
      <Typography variant="h6" fontWeight={600}>
        Your Playlists
      </Typography>
      <List disablePadding>
        {mockPlaylists.map((playlist) => (
          <ListItem key={playlist.id} disableGutters>
            <ListItemButton onClick={() => navigate(`/playlists/${playlist.id}`)}>
              <ListItemText primary={playlist.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
        <Button variant="contained" fullWidth>
          + Create New Playlist
        </Button>
      </Box>
    </Stack>
  );
}
