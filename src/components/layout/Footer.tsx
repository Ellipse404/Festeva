import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedinIcon,
  GitHub as GithubIcon,
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 3,
        mt: 6,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(9, 13, 22, 0.9)' : 'rgba(241, 245, 249, 0.9)',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <SparklesIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Festeva
          </Typography>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Festeva Inc. All rights reserved.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="inherit">
            <TwitterIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <InstagramIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <FacebookIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <LinkedinIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit">
            <GithubIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};
