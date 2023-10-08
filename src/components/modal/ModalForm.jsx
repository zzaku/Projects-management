import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import "./modalForm.css";
import { useFirebase } from '../context/firebaseContext';

export const ModalForm = ({open, setOpen}) => {
    const [projectValue, setProjectValue] = useState({projectName: "", deadline: ""});
    const {addProject, currentUser} = useFirebase();
    const navigate = useNavigate();

    const style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "360px",
        height: "400px",
        color: 'black',
        bgcolor: '#E1E1E1',
        border: '2px solid #16697a',
        borderRadius: '20px',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };
    
    const handleSubmit = () => {
        addProject(projectValue).then((id) => navigate(`/DashBoard/${currentUser[0].id}/Projet/${id}`));
    }

  return (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={{ ...style }}>
                <h2 id="child-modal-title">Création d'une gestion de projet</h2>
                <TextField onChange={(e) => setProjectValue({...projectValue, projectName: e.target.value})} required id="outlined-required" label="Required" defaultValue="Hello World"/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                            label="Controlled picker"
                            value={projectValue}
                            onChange={(e) => setProjectValue({...projectValue, deadline: e.$d})}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <div className='d-flex content-s-a item-center'>
                        <Button variant='outained' onClick={() => setOpen(false)}>Annuler</Button>
                        <Button disabled={!projectValue.deadline || !projectValue.projectName} variant='contained' onClick={() => handleSubmit()}>C'est parti !</Button>
                    </div>
            </Box>
        </Modal>
  )
}
