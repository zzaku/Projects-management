import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Modal } from '@mui/material';
import {Box} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "./ModalTask.css"
import { useFirebase } from '../../context/firebaseContext';

export const ModalTask = ({open, setOpen, tasks, setTasks, defaultTitle, defaultDescription, defaultId}) => {

    const projectId = useParams();
    const [taskValue, setTaskValue] = useState({title: "", description: ""});
    const {} = useFirebase()

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

    const handleSave = () => {
        let task = tasks.filter(task => task.id !== defaultId);
        setTasks([...task, {...taskValue, id: defaultId}]);
        setOpen(false);
    }
    
  return (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={{ ...style, textAlign: "center" }}>
                <h1 id="child-modal-title">Modifiez votre tâche</h1>
                <div className='d-flex item-center'>
                    <TextField onChange={(e) => setTaskValue({...taskValue, title: e.target.value})} required id="outlined-required" label="Required" defaultValue={defaultTitle}/>
                    <TextField onChange={(e) => setTaskValue({...taskValue, description: e.target.value})} required id="outlined-required" label="Required" defaultValue={defaultDescription}/>
                </div>
                <div className='d-flex content-s-a item-center'>
                    <Button variant='contained' onClick={() => setOpen(false)}>Annuler</Button>
                    <Button variant='contained' onClick={handleSave}>Enregistrer</Button>
                </div>
            </Box>
        </Modal>
  )
}