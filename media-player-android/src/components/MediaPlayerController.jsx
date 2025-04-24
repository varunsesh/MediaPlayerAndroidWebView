import React, { useRef, useState } from 'react';
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
  const [sessionFileMap, setSessionFileMap] = useState({});
  const fileInputRef = useRef(null);

  const playlistData = getPlaylistById(id);
  const currentTrack = playlistData?.tracks?.[currentTrackIndex];
  const currentUrl = currentTrack ? sessionFileMap[currentTrack.name]?.url : null;

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

  const handleFileChange = (e) => {
    
    const files = Array.from(e.target.files);
    if (!id || files.length === 0) return;

    // Store temporary URLs
    const fileMapEntries = Object.fromEntries(
      files.map(file => [file.name, { file, url: URL.createObjectURL(file) }])
    );
    setSessionFileMap(prev => ({ ...prev, ...fileMapEntries }));

    // Update the playlist in context
    addTracksToPlaylist(id, files);
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        multiple
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

      {playlistData?.tracks?.length > 0 && currentUrl && (
        <>
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
        </>
      )}
    </Box>
  );
};

export default MediaPlayerController;
