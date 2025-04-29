import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box, Button, Slider, Typography } from '@mui/material';
import ShufflePlayer from './ShufflePlayer';
import { useParams } from 'react-router-dom';
import { usePlaylist } from './PlaylistContext';
import { saveFile, getFile } from '../utils/indexedDbHelper';

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
    playPrevInQueue
  } = usePlaylist();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistData, setPlaylistData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const updatedPlaylist = getPlaylistById(id);
    setPlaylistData(updatedPlaylist);
  }, [getPlaylistById, id]);

  useEffect(() => {
    const loadTrackUrl = async () => {
      let track = null;

      if (isQueueActive && currentQueueTrack) {
        track = currentQueueTrack;
        
      } else if (playlistData?.tracks?.length > 0) {
        track = playlistData.tracks[currentTrackIndex];
      }

      if (track) {
        if(!isQueueActive){
          const file = await getFile(track.name);
          if (file instanceof Blob) {
            const url = URL.createObjectURL(file);
            setTimeout(() => {
              setCurrentUrl(url);
            }, 50); // 50ms delay
          } else {
            setCurrentUrl(null);
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


    // Save paused position to localStorage
    useEffect(() => {
      if (!isPlaying && currentTrack) {
        localStorage.setItem(`pausedPosition_${currentTrack.name}`, currentTime);
      }
    }, [isPlaying, currentTime, currentTrack]);

      // Resume from last paused position
  useEffect(() => {
    if (currentTrack && playerRef.current) {
      const saved = localStorage.getItem(`pausedPosition_${currentTrack.name}`);
      if (saved) {
        playerRef.current.seekTo(parseFloat(saved), 'seconds');
        setCurrentTime(parseFloat(saved));
      }
    }
  }, [currentTrack]);

  const togglePlayPause = () => setIsPlaying(prev => !prev);
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
    <Box sx={{ mt: 2 }}>
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
        onClick={() => fileInputRef.current?.click()}
      >
        Add Media Files
      </Button>

      {currentUrl && (
        <Box sx={{ mt: 5 }}>
          <ReactPlayer
            ref={playerRef}
            url={currentUrl}
            playing={isPlaying}
            volume={volume}
            controls={false}
            onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            onDuration={(d) => setDuration(d)}
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
            <Box sx={{ mt: 2 }}>
            <Slider
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              disabled={!duration}
            />
            <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MediaPlayerController;
