// App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, Container, BottomNavigation, BottomNavigationAction, Box, createTheme, ThemeProvider, } from '@mui/material';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import PlaylistDetail from './pages/PlaylistDetail';
import Queue from './pages/Queue';
import SwipeRouter from './components/Swiperouter';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HomeIcon from '@mui/icons-material/Home';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { PlaylistProvider } from './components/PlaylistContext'; 


const bottomNavBarTheme = createTheme({
  palette: {
    background: {
      default: '#fdf6e3', // warm pastel color, like cream or soft yellow
      paper: '#fffaf0',   // card surfaces, lighter pastel
    },
    // Optionally tweak primary/secondary
    primary: {
      main: '#add8e6', // warm orange
    },
    secondary: {
      main: '#81c784', // soft green
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});

const overAllTheme =  createTheme({
  palette: {
    background: {
      default: '##90d5ff', 
      paper: '##90d5ff',   
    },
    // Optionally tweak primary/secondary
    primary: {
      main: '#add8e6', // warm orange
    },
    secondary: {
      main: '#81c784', // soft green
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});





function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.startsWith('/playlists/') ? '/playlists' : location.pathname;

  return (
    <ThemeProvider theme={bottomNavBarTheme}>
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
    </ThemeProvider>
  );
}

function AppLayout() {
  return (
    <SwipeRouter>
      <ThemeProvider theme={overAllTheme}>
      <Container maxWidth="xs" disableGutters sx={{ paddingBottom: 8, paddingX: 2, paddingTop: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlist />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/queue" element={<Queue />} />
    
        </Routes>
      </Container>
      <NavigationBar />
      </ThemeProvider>
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
