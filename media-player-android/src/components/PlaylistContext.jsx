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
    console.log('Playlist map:', playlistMap);
    localStorage.setItem('mediaPlaylists', JSON.stringify(playlistMap));
    console.log('Playlists updated:', playlists);
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

  const addTracksToPlaylist = (playlistId, files) => {
    console.log('Adding tracks to playlist:', playlistId, files);
    const newTracks = Array.from(files).map(file => ({
      name: file.name,
    }));

    setPlaylists(prev => {
      const updated = prev.map(p =>
        p.id.toString() === playlistId ? { ...p, tracks: [...p.tracks, ...newTracks] } : p
      );
      console.log('Updating playlists:', updated);
      return updated;
    });
  };

  const getPlaylistById = (id) => {
    console.log('Getting playlist by ID:', id);
    const found = playlists.find(p => p.id.toString() === id);
    console.log('Found playlist:', found);
    return found;
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
