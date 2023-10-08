import React from 'react'
import { useParams } from 'react-router-dom';
import { Modal } from '@mui/material';
import {Box} from '@mui/material';
import Button from '@mui/material/Button';
import "./ModalCollab.css"

export const ModalCollab = ({open, setOpen}) => {

    const projectId = useParams();

    const style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "75%",
        height: "200px",
        color: 'black',
        bgcolor: '#E1E1E1',
        border: '2px solid #16697a',
        borderRadius: '20px',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };
    
  return (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={{ ...style, textAlign: "center" }}>
                <h1 id="child-modal-title">Invitez des collaborateurs</h1>
                <div className='d-flex item-center'>
                    <h3>Envoyez ce lien à vos collaborateurs : </h3>
                    <span>http://127.0.0.1:5173/invite/{projectId.id}/{projectId.idProject}</span>
                </div>
                <div className='d-flex content-s-a item-center'>
                    <Button variant='contained' onClick={() => setOpen(false)}>Annuler</Button>
                </div>
            </Box>
        </Modal>
  )
}