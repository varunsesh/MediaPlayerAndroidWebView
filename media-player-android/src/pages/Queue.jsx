// src/pages/Queue.jsx
import { Box, Typography, List, ListItem, ListItemText, Stack, Button, CardContent, CardActionArea } from '@mui/material';
import { usePlaylist } from '../components/PlaylistContext';
import MediaPlayerController from '../components/MediaPlayerController';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function Queue() {
  const { queue, currentQueueTrackIndex, clearQueue } = usePlaylist();

  return (
    <Box sx={
      { display: 'flex', flexDirection: 'column', overflow:'hidden', height: '100vh', justifyContent:"center",
        alignItems:"center"
       }
      }>
      {/* Header */}
      <Box sx={{ flexShrink: 0, pt: 2, mb:2 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Up Next
        </Typography>
      </Box>
      {/* Media Player Controller */}
      <MediaPlayerController isQueueActive={true} />
      {/* Scrollable queue list */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          pb: 12, // extra padding for Clear button
          mt: 4,
        }}
      >
        {queue.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            No songs in queue.
          </Typography>
        ) : (
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {queue.map((track, idx) => {
              const isCurrentlyPlaying = idx === currentQueueTrackIndex;
              return (
                <ListItem
                  key={idx}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backgroundColor: isCurrentlyPlaying ? 'primary.light' : 'background.paper',
                    boxShadow: 1,
                    width: '90%',
                    transition: 'background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      transform: 'scale(1.02)',
                      color: 'white',
                    },
                  }}
                >
                 <CardActionArea
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, // less gap
                      p: 0, // remove default padding
                      width: '100%' 
                    }}
                    onClick={() => {/* Optional: Play this track */}}
                  >
                      <PlayArrowIcon fontSize="small" />
                    <CardContent sx={{ flexGrow: 1, py: 0.5, '&:last-child': { pb: 0.5 } }}>
                      <Typography sx={{wordWrap:'break-word'}} variant="body2" fontWeight={600}>
                        {track.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </ListItem>
              );
            })}
          </List>
        )}

      {/* Clear Queue Button */}
      {queue.length > 0 && (
        <Box
          sx={{
            flexShrink: 0,
            pb: 2,
            pt: 1,
            backgroundColor: 'background.paper',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={clearQueue}
          >
            Clear Queue
          </Button>
        </Box>
      )}
      </Box>


    </Box>
  );
}
