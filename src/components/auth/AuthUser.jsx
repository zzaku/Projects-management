import { useState } from "react";
import { SignUp } from "./signUp/signUp";
import { SignIn } from "./signIn/signIn";
import { useFirebase } from "../context/firebaseContext";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import "./AuthUser.css"

export const AuthUser = () => {
  const [register, setRegister] = useState(false);
  const {currentUserId, needToConnect, setNeedToConnect} = useFirebase();

  const handleClose = () => setNeedToConnect(false);

  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 460,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  padding: 0
};

  return currentUserId ? (
    setNeedToConnect(false)
  ) : (
      <Modal
        open={needToConnect}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!register ? (
            <SignIn setRegister={setRegister} />
          ) : (
            <SignUp setRegister={setRegister} />
          )}
        </Box>
    </Modal>
  );
}
