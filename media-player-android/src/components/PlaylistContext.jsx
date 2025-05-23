// PlaylistContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    const stored = localStorage.getItem('mediaPlaylists');
    return stored ? Object.values(JSON.parse(stored)) : [];
  });

  const [queue, setQueue] = useState([]); // In-memory queue
  const [currentQueueTrackIndex, setCurrentQueueTrackIndex] = useState(0);

  const [currentPlayingInfo, setCurrentPlayingInfo] = useState({
    playlistId: null,
    trackIndex: null,
  });

  useEffect(() => {
    const playlistMap = Object.fromEntries(playlists.map(p => [p.id, p]));
    localStorage.setItem('mediaPlaylists', JSON.stringify(playlistMap));
  }, [playlists]);

  // Create a new playlist
  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  // Add tracks to a playlist
  const addTracksToPlaylist = async (playlistId, newTracks) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, tracks: [...p.tracks, ...newTracks] }
          : p
      )
    );
  };

  // Fetch a playlist by ID
  const getPlaylistById = (id) => {
    return playlists.find(p => p.id === id);
  };

// Add tracks to queue (not persistently saved)
const addTracksToQueue = (tracks) => {
  setQueue(prev => [...prev, ...tracks]);  // <-- Fix spreading
  if (tracks.length > 0 && queue.length === 0) {
    setCurrentPlayingInfo({ playlistId: 'queue', trackIndex: 0 });
  }
};

// Play next track in queue
const playNextInQueue = () => {
  setCurrentQueueTrackIndex(prev => (prev + 1 < queue.length ? prev + 1 : 0));
  setCurrentPlayingInfo({ playlistId: 'queue', trackIndex: (currentQueueTrackIndex + 1) % queue.length });
};

const playPrevInQueue = ()=>{
  setCurrentQueueTrackIndex(prev => (prev - 1 >= 0 ? prev - 1 : queue.length - 1));
  setCurrentPlayingInfo({ playlistId: 'queue', trackIndex: (currentQueueTrackIndex - 1 + queue.length) % queue.length });
}

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueTrackIndex(0);
  };

  // Remove a track from a playlist
  const removeTrackFromPlaylist = async (playlistId, trackName) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter(t => t.name !== trackName) }
          : p
      )
    );
  };
  //Remove a track from queue
  const removeTrackFromQueue = (trackName) => {
    setQueue(prev => prev.filter(t => t.name !== trackName));
  };

  const currentQueueTrack = queue[currentQueueTrackIndex] || null;

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        addTracksToPlaylist,
        getPlaylistById,
        currentPlayingInfo,
        setCurrentPlayingInfo,
        queue,
        addTracksToQueue,
        playNextInQueue,
        playPrevInQueue,
        removeTrackFromPlaylist,
        removeTrackFromQueue,
        clearQueue,
        currentQueueTrack,
        currentQueueTrackIndex,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
