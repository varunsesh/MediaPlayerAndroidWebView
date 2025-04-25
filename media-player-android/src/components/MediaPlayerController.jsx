import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box, Button } from '@mui/material';
import ShufflePlayer from './ShufflePlayer';
import { useParams } from 'react-router-dom';
import { usePlaylist } from './PlaylistContext';
import { saveFile, getFile } from '../utils/indexedDbHelper';

const MediaPlayerController = () => {
  const playerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const { getPlaylistById, addTracksToPlaylist } = usePlaylist();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistData, setPlaylistData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    const updatedPlaylist = getPlaylistById(id);
    setPlaylistData(updatedPlaylist);
  }, [getPlaylistById, id]);

  useEffect(() => {
    const loadTrackUrl = async () => {
      if (playlistData?.tracks?.length > 0) {
        const track = playlistData.tracks[currentTrackIndex];
        const file = await getFile(track.name);
        console.log('File:', file);
        if (file instanceof Blob) {
          const url = URL.createObjectURL(file);
          setCurrentUrl(url);
        }
      }
    };
    loadTrackUrl();
  }, [playlistData, currentTrackIndex]);

  console.log('Current URL:', currentUrl);
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
  
    if (!files.length) return;
    
    const refreshed = getPlaylistById(id);
    const existingTrackNames = new Set(refreshed?.tracks?.map(t => t.name));
  
    const newTracks = [];
  
    for (const file of files) {
      if (!existingTrackNames.has(file.name)) {
        const url = URL.createObjectURL(file);
        setCurrentUrl(url); // set current URL to the new file
        await saveFile(file.name, file); // only save if not already saved
        newTracks.push({ name: file.name, url }); // push new track
      }
    }
  
    if (newTracks.length > 0) {
      await addTracksToPlaylist(id, newTracks);
      const updated = getPlaylistById(id);
      setPlaylistData(updated);
    }
  
    event.target.value = null; // reset input field
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
      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onClick={() => fileInputRef.current?.click()}
      >
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
