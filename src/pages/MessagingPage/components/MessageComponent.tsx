import { Box, Button, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect, useRef } from 'react';

import { useUserContext } from '../../../contexts/userContext';
import AvatarComponent from '../../../components/AvatarComponent';
import MessageBubble from './MessageBubble';

export interface MessageComponentProps {
  message: {
    id: string;
    conversationId: number;
    authorId: number;
    content: string;
    date: string;
    deleted: boolean;
  };
  style?: object;
}

function MessageComponent({ message }: MessageComponentProps) {
  const user = useUserContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const isAuthorMessage = user.id === message.authorId;


  const boxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowButton(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const handleClick = async () => {
    setShowButton(true);
  };

  const handleModifyClick = () => {
    console.log('Le bouton "Modifier" a été cliqué !');
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteClick = async () => {
    console.log('Le bouton "Supprimer" a été cliqué !');

    handleOpenSnackbar();

    try {
      const response = await fetch(`/api/me/messages/${message.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Le message ${message.id} a été supprimé avec succès !`);
      } else {
        console.error(
          'Erreur lors de la suppression du message (else):',
          response.status
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message (catch):', error);
    }
  };

  return (
    <Box
      ref={boxRef}
      sx={{
        display: 'flex',
        gap: '.5em',
        padding: '0.5em 0em',
        alignSelf: isAuthorMessage ? 'flex-end' : 'flex-start',
      }}
    >
      <Snackbar
        open={openSnackbar}
        message="Voulez-vous vraiment supprimer ce message ?"
        action={
          <>
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            Annuler
          </Button>
          <Button color="secondary" size="small" onClick={handleDeleteClick}>
            Supprimer
          </Button>
          </>
        }
      ></Snackbar>

      {!isAuthorMessage && (
        <AvatarComponent src="https://mui.com/static/images/avatar/3.jpg" />
      )}
      <MessageBubble
        message={message}
        onClick={() => {
          if (isAuthorMessage) handleClick();
        }}
        style={{ cursor: isAuthorMessage ? 'pointer' : 'default' }}
      />

      {showButton && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '.5em',
          }}
        >
          <Button
            onClick={handleModifyClick}
            variant="text"
            sx={{
              minWidth: 0,
              padding: 0,
            }}
          >
            <EditIcon />
          </Button>
          <Button
            onClick={handleOpenSnackbar}
            variant="text"
            sx={{
              minWidth: 0,
              padding: 0,
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MessageComponent;

