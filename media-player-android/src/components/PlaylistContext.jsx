// PlaylistContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
    const stored = localStorage.getItem('mediaPlaylists');
    return stored ? Object.values(JSON.parse(stored)) : [];
  });

  useEffect(() => {
    const playlistMap = Object.fromEntries(playlists.map(p => [p.id, p]));
    localStorage.setItem('mediaPlaylists', JSON.stringify(playlistMap));
  }, [playlists]);

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  const addTracksToPlaylist = async (playlistId, newTracks) => {
    try {
      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlistId ? { ...p, tracks: [...p.tracks, ...newTracks] } : p
        )
      );
    } catch (err) {
      console.error('File selection cancelled or failed', err);
    }
  };

  const getPlaylistById = (id) => {
    return playlists.find(p => p.id === id);
  };

  return (
    <PlaylistContext.Provider
      value={{ playlists, createPlaylist, addTracksToPlaylist, getPlaylistById }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
