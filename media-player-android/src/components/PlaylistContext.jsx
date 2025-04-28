// PlaylistContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(() => {
  const stored = localStorage.getItem('mediaPlaylists');
    return stored ? Object.values(JSON.parse(stored)) : [];
  });

  const [songQueue, setSongQueue] = useState(() => {
    const stored = localStorage.getItem('mediaQueue');
    return stored ? Object.values(JSON.parse(stored)) : [];
  });

  const [currentPlayingInfo, setCurrentPlayingInfo] = useState({ playlistId: null, trackIndex: null });

  useEffect(() => {
    const playlistMap = Object.fromEntries(playlists.map(p => [p.id, p]));
    localStorage.setItem('mediaPlaylists', JSON.stringify(playlistMap));
    const queueMap = Object.fromEntries(songQueue.map(q => [q.id, q]));
    localStorage.setItem('mediaQueue', JSON.stringify(queueMap));
  }, [songQueue, playlists]);

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist.id;
  };
  const createQueue = (name) => {
    const newQueue = {
      id: Date.now().toString(),
      name,
      tracks: [],
    };
    setSongQueue(prev => [...prev, newQueue]);
    return newQueue.id;
  };
  const addTrackToQueue = async (newTracks) => {
    setSongQueue(prev =>
      prev.map(q =>
        q.id === 'queueId' ? { ...q, tracks: [...q.tracks, ...newTracks] } : q
      )
    );
  };
  const removeTrackFromQueue = async (trackName) => {
    setSongQueue(prev =>
      prev.map(q =>
        q.id === 'queueId' ? { ...q, tracks: q.tracks.filter(t => t.name !== trackName) } : q
      )
    );
  };
  const removeTrackFromPlaylist = async (playlistId, trackName) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId ? { ...p, tracks: p.tracks.filter(t => t.name !== trackName) } : p
      )
    );
  };


  const addTracksToPlaylist = async (playlistId, newTracks) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId ? { ...p, tracks: [...p.tracks, ...newTracks] } : p
      )
    );
  };

  const getPlaylistById = (id) => {
    return playlists.find(p => p.id === id);
  };

  return (
    <PlaylistContext.Provider
      value={{ playlists, createPlaylist, addTracksToPlaylist, getPlaylistById, currentPlayingInfo, setCurrentPlayingInfo, songQueue, createQueue, addTrackToQueue, removeTrackFromQueue, removeTrackFromPlaylist }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
