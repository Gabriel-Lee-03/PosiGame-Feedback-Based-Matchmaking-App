import {Snackbar, Button} from '@mui/material';

export default function SearchFailSnackBar({open, handleClose}) {
    return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message="The queue is very quiet today..."
    />
  );
}