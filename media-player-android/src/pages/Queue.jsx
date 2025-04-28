import { useParams } from 'react-router-dom';
import PlayListDetail from './PlayListDetail';
import { usePlaylist } from '../components/PlaylistContext';
import { useEffect } from 'react';


export default function Queue() {

  const { id } = useParams();
  const { songQueue, createQueue, addTrackToQueue, removeTrackFromQueue, } = usePlaylist();

  return (
    <PlayListDetail isQueue={true} id={id} />
  );



}