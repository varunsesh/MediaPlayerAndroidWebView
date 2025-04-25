//MediaPlayerController.jsx
import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box, Button } from '@mui/material';
import ShufflePlayer from './ShufflePlayer';
import { useParams } from 'react-router-dom';
import { usePlaylist } from './PlaylistContext';

const MediaPlayerController = () => {
  const playerRef = useRef(null);
  const { id } = useParams();
  const { getPlaylistById, addTracksToPlaylist } = usePlaylist();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistData, setPlaylistData] = useState(null);

  const fileInputRef = useRef(null);
  // Fetch the playlist again when it changes
  useEffect(() => {
    const updatedPlaylist = getPlaylistById(id);
    setPlaylistData(updatedPlaylist);
  }, [getPlaylistById, id]);

  const currentTrack = playlistData?.tracks?.[currentTrackIndex];
  const currentUrl = currentTrack?.url;

  console.log('Playing URL:', currentUrl);

  const togglePlayPause = () => setIsPlaying(prev => !prev);
  const handleVolumeUp = () => setVolume(v => Math.min(1, v + 0.1));
  const handleVolumeDown = () => setVolume(v => Math.max(0, v - 0.1));
  const handleNext = () => {
    if (!playlistData?.tracks?.length) return;
    setCurrentTrackIndex((prev) => (prev + 1) % playlistData.tracks.length);
    setIsPlaying(true);
  };
  const handlePrev = () => {
    if (!playlistData?.tracks?.length) return;
    setCurrentTrackIndex((prev) =>
      prev === 0 ? playlistData.tracks.length - 1 : prev - 1
    );
    setIsPlaying(true);
  };


  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newTracks = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    addTracksToPlaylist(id, newTracks);
    const refreshed = getPlaylistById(id);
    setPlaylistData(refreshed);
    event.target.value = null; // Reset the input value
  };

  return (
    <Box>
      <input
        type="file"
        accept="audio/*,video/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => fileInputRef.current?.click()}>
        Add Media Files
      </Button>

      {playlistData?.tracks?.length > 0 && currentUrl && (
        <Box>
          <ReactPlayer
            ref={playerRef}
            url={currentUrl}
            playing={isPlaying}
            volume={volume}
            controls={false}
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
        </Box>
      )}
    </Box>
  );
};

export default MediaPlayerController;
