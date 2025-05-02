// src/pages/Home.js
import { Button, Typography, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    backgroundImage: "url('assets/icon_app.jpg')", // replace this path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    ml:4,
    px: 2 // optional padding for mobile
  }}
>
  <Stack spacing={3} alignItems="center" justifyContent="center">
    <Typography variant="h5" textAlign="center" fontWeight={600} >
      🎵 Vibe with Music
    </Typography>
    <Button variant="contained" size="large" onClick={() => navigate('/playlists')}>
      View Playlists
    </Button>
    <Button variant="outlined" size="large" onClick={() => navigate('/queue')}>
      View Queue
    </Button>
  </Stack>
</Box>

  
  );
}
