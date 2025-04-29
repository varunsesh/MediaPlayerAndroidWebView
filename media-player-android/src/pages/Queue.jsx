// src/pages/Queue.jsx
import { Box, Typography, List, ListItem, ListItemText, Stack, Button } from '@mui/material';
import { usePlaylist } from '../components/PlaylistContext';
import MediaPlayerController from '../components/MediaPlayerController';

export default function Queue() {
  const { queue, currentQueueTrackIndex, clearQueue } = usePlaylist();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow:'hidden', height: '100vh', ml: 9, mr: 2 }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0, pt: 2, mb:2 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Up Next
        </Typography>
      </Box>
      {/* Media Player Controller */}
      <MediaPlayerController />
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
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    transition: 'background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      transform: 'scale(1.02)',
                      color: 'white',
                    },
                  }}
                >
                  <ListItemText
                    primary={track.name}
                    primaryTypographyProps={{ fontWeight: isCurrentlyPlaying ? 700 : 500 }}
                  />
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
