// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, Container, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import PlaylistDetail from './pages/PlaylistDetail';
import Queue from './pages/Queue';
import SwipeRouter from './components/Swiperouter';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HomeIcon from '@mui/icons-material/Home';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { PlaylistProvider } from './components/PlaylistContext'; 

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.startsWith('/playlists/') ? '/playlists' : location.pathname;

  return (
    <BottomNavigation
      value={path}
      onChange={(event, newValue) => navigate(newValue)}
      showLabels
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}
    >
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction label="Playlists" value="/playlists" icon={<PlaylistPlayIcon />} />
      <BottomNavigationAction label="Queue" value="/queue" icon={<QueueMusicIcon />} />
    </BottomNavigation>
  );
}

function AppLayout() {
  return (
    <SwipeRouter>
      <Container maxWidth="xs" disableGutters sx={{ paddingBottom: 8, paddingX: 2, paddingTop: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlist />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/queue" element={<Queue />} />
        </Routes>
      </Container>
      <NavigationBar />
    </SwipeRouter>
  );
}

function App() {
  return (
    <PlaylistProvider>
    <Router>
      <CssBaseline />
      <AppLayout />
    </Router>
    </PlaylistProvider>
  );
}

export default App;
