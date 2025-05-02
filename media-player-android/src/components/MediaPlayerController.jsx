import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box, Button, Slider, Typography, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ShufflePlayer from './ShufflePlayer';
import { useParams } from 'react-router-dom';
import { usePlaylist } from './PlaylistContext';
import { saveFile, getFile } from '../utils/indexedDbHelper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const dialogTheme = createTheme({
  palette: {
    background: {
      paper: '#fff9e6', // pure white for the dialog only
    },
  },
});

const MediaPlayerController = ({isQueueActive}) => {
  const playerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const {
    getPlaylistById,
    addTracksToPlaylist,
    setCurrentPlayingInfo,
    queue,
    currentQueueTrack,
    playNextInQueue,
    addTracksToQueue,
    playPrevInQueue, 
    currentPlayingInfo
  } = usePlaylist();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistData, setPlaylistData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState('');

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const updatedPlaylist = getPlaylistById(id);
    setPlaylistData(updatedPlaylist);
  }, [getPlaylistById, id]);

  //Deletion edge case
  useEffect(() => {
    if (!isQueueActive && playlistData?.tracks?.length > 0) {
      const current = playlistData.tracks[currentTrackIndex];
      if (!current) {
        const safeIndex = Math.min(currentTrackIndex, playlistData.tracks.length - 1);
        setCurrentTrackIndex(safeIndex);
      }
    }
  }, [playlistData, currentTrackIndex, isQueueActive]);

  useEffect(() => {
    const loadTrackUrl = async () => {
      let track = null;

      if (isQueueActive && currentQueueTrack) {
        track = currentQueueTrack;
        setCurrentTrack(track);
        
      } else if (playlistData?.tracks?.length > 0) {
        track = playlistData.tracks[currentTrackIndex];
        setCurrentTrack(track);
      }

      let url = null;
      if (track) {
        if(!isQueueActive){
          if(inputMode === 'url'){
            url = track.url;
          }
          else{
            const file = await getFile(track.name);
            if (file instanceof Blob) {
              url = URL.createObjectURL(file);
              setTimeout(() => {
                setCurrentUrl(url);
              }, 50); // 50ms delay
            } else {
              setCurrentUrl(null);
            }
          }
        }
        else{
          setCurrentUrl(track.url);
        }
        
      } else {
        setCurrentUrl(null);
      }
    };

    loadTrackUrl();
  }, [playlistData, currentTrackIndex, queue, currentQueueTrack, isQueueActive]);
  
  

  useEffect(() => {
    if (id && !isQueueActive) {
      setCurrentPlayingInfo({ playlistId: id, trackIndex: currentTrackIndex });
    }
  }, [id, currentTrackIndex, isQueueActive, setCurrentPlayingInfo]);

  const closeDialog = () => {
      setDialogOpen(false);
      setInputMode('file');
      setUrlInput('');
  };

  // Resume from last paused position
  useEffect(() => {
    if (currentTrack && playerRef.current) {
      const saved = localStorage.getItem(`pausedPosition_${currentTrack.name}`);
      if (saved) {
        setTimeout(() => {
          playerRef.current.seekTo(parseFloat(saved), 'seconds');
          setCurrentTime(parseFloat(saved));
        }, 100); // Delay to ensure player is mounted
      }
    }
  }, [currentTrack]);

  
      
  useEffect(() => {
    if (!isQueueActive && id === currentPlayingInfo.playlistId) {
      setCurrentTrackIndex(currentPlayingInfo.trackIndex || 0);
      setIsPlaying(true); // Start playing the selected track
    }
  }, [currentPlayingInfo, id, isQueueActive]);
  
  useEffect(() => {
    if (isQueueActive && currentPlayingInfo.playlistId === 'queue') {
      // Ensure queue index is updated and playing
      setIsPlaying(true);
    }
  }, [currentPlayingInfo, isQueueActive]);

  const togglePlayPause = () => {
      if (isPlaying && currentTrack) {
        // Save position *only when user is pausing*
        localStorage.setItem(`pausedPosition_${currentTrack.name}`, currentTime);
      }
     
    setIsPlaying(prev => !prev);
  }

  useEffect(() => {
    setCurrentTrackIndex(0);
    setCurrentTrack(null);
    setCurrentUrl(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  
    return () => {
      // Stop playback explicitly
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
    };
  }, [id]);


  const handleVolumeUp = () => setVolume(v => Math.min(1, v + 0.1));
  const handleVolumeDown = () => setVolume(v => Math.max(0, v - 0.1));

  const handleNext = () => {
    if (isQueueActive) {
      playNextInQueue();
    } else if (playlistData?.tracks?.length) {
      setCurrentTrackIndex((prev) => (prev + 1) % playlistData.tracks.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!isQueueActive && playlistData?.tracks?.length) {
      setCurrentTrackIndex((prev) =>
        prev === 0 ? playlistData.tracks.length - 1 : prev - 1
      );
      setIsPlaying(true);
    }
    else if(isQueueActive){
      playPrevInQueue();
    }
    // No previous in queue mode
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    if (isQueueActive || !id) {
      // If in Queue mode, add directly to queue
      const newTracks = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      
      addTracksToQueue(newTracks);

    } else {
      // Playlist mode
      const refreshed = getPlaylistById(id);
      const existingTrackNames = new Set(refreshed?.tracks?.map(t => t.name));
      const newTracks = [];
  
      for (const file of files) {
        if (!existingTrackNames.has(file.name)) {
          await saveFile(file.name, file); // Save to IndexedDB
          newTracks.push({ name: file.name });
        }
      }
  
      if (newTracks.length > 0) {
        await addTracksToPlaylist(id, newTracks);
        const updated = getPlaylistById(id);
        setPlaylistData(updated);
      }
    }
  
    event.target.value = null; // Reset file input
  };

  const handleSeek = (e, value) => {
    const seekTo = (value / 100) * duration;
    playerRef.current?.seekTo(seekTo, 'seconds');
    setCurrentTime(seekTo);
  };

  return (
    <Box sx={{ mt: 0 }}>
      <input
        type="file"
        accept="audio/*,video/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onClick={() => setDialogOpen(true)}
      >
        Add Media
      </Button>

      {currentUrl && (
        <Box sx={{ mt: 1 }}>
          <ReactPlayer
            key={currentUrl}
            ref={playerRef}
            url={currentUrl}
            playing={isPlaying}
            volume={volume}
            controls={false}
            onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            onDuration={(d) => setDuration(d)}
            onEnded={handleNext} 
            onError={() => {
              alert('This media could not be played (maybe a protected URL like YouTube Premium?)');
            }}
            
            width="100%"
            height="auto"
            style={{ display: 'none' }}
          />
          <ShufflePlayer
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            onVolumeUp={handleVolumeUp}
            onVolumeDown={handleVolumeDown}
          />
            {/* Progress Bar + Time Display */}
            <Box sx={{ mt: 0 }}>
            <Slider
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              disabled={!duration}
            />
            <Typography variant="body2" textAlign="center" sx={{ mt: 0 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>
        </Box>
      )}
      <ThemeProvider theme={dialogTheme}>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Media</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant={inputMode === 'file' ? 'contained' : 'outlined'}
              onClick={() => setInputMode('file')}
            >
              Local File
            </Button>
            <Button
              variant={inputMode === 'url' ? 'contained' : 'outlined'}
              onClick={() => setInputMode('url')}
            >
              URL
            </Button>
          </Box>

          {inputMode === 'url' ? (
            <TextField
              autoFocus
              fullWidth
              label="Media URL"
              variant="outlined"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          ) : (
            <Button variant="outlined" fullWidth onClick={() => fileInputRef.current?.click()}>
              Choose Files
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          {inputMode === 'url' && (
            <Button
              variant="contained"
              onClick={() => {
                if (!urlInput.trim()) return;
                const track = { name: `URL: ${urlInput}`, url: urlInput.trim() };
              
                if (isQueueActive || !id) {
                  addTracksToQueue([track]);
                } else {
                  addTracksToPlaylist(id, [track]);
                  const updated = getPlaylistById(id);
                  setPlaylistData(updated);
                }
              
                setUrlInput('');
                setDialogOpen(false);
              }}
            >
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ThemeProvider>
    </Box>
  );
};

export default MediaPlayerController;
