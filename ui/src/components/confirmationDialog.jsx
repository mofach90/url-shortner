import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Slide,
} from "@mui/material";
import { forwardRef } from "react";

// Smooth slide-up animation
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmColor = "error",
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      transition={Transition}
      keepMounted
      onClose={loading ? undefined : onCancel} // prevent closing while loading
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {loading ? "Deleting..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
