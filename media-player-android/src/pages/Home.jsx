// src/pages/Home.js
import { Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3} alignItems="center" justifyContent='center' sx={{pt:4}}>
      <Typography variant="h5" textAlign="center" fontWeight={600}>
        🎵 Vibe with Music
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/playlists')}>
        View Playlists
      </Button>
      <Button variant="outlined" size="large" onClick = {() => navigate('/queue')}>
        View Queue
      </Button>
   
    </Stack>
  );
}
