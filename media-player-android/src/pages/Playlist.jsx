import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { usePlaylist } from '../components/PlaylistContext';

export default function Playlist() {
  const navigate = useNavigate();
  const { playlists, createPlaylist } = usePlaylist();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreate = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewPlaylistName("");
  };

  const handleDialogConfirm = () => {
    if (newPlaylistName.trim()) {
      const newId = createPlaylist(newPlaylistName.trim());
      navigate(`/playlists/${newId}`);
    }
    handleDialogClose();
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

      {/* Dialog for entering playlist name */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
