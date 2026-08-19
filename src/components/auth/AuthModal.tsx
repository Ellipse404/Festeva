import React from 'react';
import { useApp } from '../../hooks/useApp';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { AuthForm } from './AuthForm';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useApp();

  if (!isAuthModalOpen) return null;

  return (
    <Dialog
      open={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        },
      }}
    >
      <IconButton
        onClick={() => setIsAuthModalOpen(false)}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: 2, py: 3 }}>
        <AuthForm isModal onSuccess={() => setIsAuthModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
