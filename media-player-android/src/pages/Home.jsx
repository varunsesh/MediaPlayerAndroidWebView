// src/pages/Home.js
import { Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3} alignItems="stretch" sx={{ml:10, pt: 4 }}>
      <Typography variant="h5" textAlign="center" fontWeight={600}>
        🎵 Media Player
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/playlists')}>
        View Playlists
      </Button>
      <Button variant="outlined" size="large">
        Add to Queue
      </Button>
      <Button variant="text" size="large">
        Currently Playing
      </Button>
    </Stack>
  );
}
