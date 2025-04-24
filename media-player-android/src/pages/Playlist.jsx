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
import { usePlaylist } from '../components/PlaylistContext';

export default function Playlist() {
  const navigate = useNavigate();
  const { playlists, createPlaylist } = usePlaylist();

  const handleCreate = () => {
    const newId = createPlaylist('Unnamed');
    navigate(`/playlists/${newId}`);
  };

  return (
    <Stack spacing={3} sx={{ ml: 10, pt: 2 }}>
      <Box>
        <Typography variant="h6" fontWeight={600}>
          Your Playlists
        </Typography>
        <List disablePadding>
          {playlists.map((playlist) => (
            <ListItem key={playlist.id} disableGutters>
              <ListItemButton onClick={() => navigate(`/playlists/${playlist.id}`)}>
                <ListItemText primary={playlist.name || 'Unnamed'} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Button variant="contained" fullWidth onClick={handleCreate}>
          + Create New Playlist
        </Button>
      </Box>
    </Stack>
  );
}
