import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '@mui/material';
import {Box} from '@mui/material';
import { useFirebase } from '../../context/firebaseContext';
import Button from '@mui/material/Button';
import "./ModalInvite.css"

export const ModalInvite = ({open, setOpen}) => {

    const {joinProject, getProjectById, currentUser, setNeedToConnect} = useFirebase()
    const param = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({})
    const [inviteContent, setInviteContent] = useState("")
    const [allowed, setAllowed] = useState(true)

    useEffect(() => {
        getProjectById(param.idProject)
        .then((val) => setProject({projectName: val.projectName, deadline: new Date(val.deadline.seconds * 1000).toLocaleString('fr-FR')}));
    }, [])

    const handleJoinProject = () => {
        setInviteContent("");

        joinProject(param.id, param.idProject)
        .then((val) => {
            console.log(val);
            if(val?.authorize){
                navigate(`/DashBoard/${currentUser.id}/Projet/${param.idProject}`)
            } else if(!val.authorize && val.needToLogIn){
                setNeedToConnect(true);
                return;
            } else {
                setAllowed(false)
                setTimeout(() => setOpen(false), 3000);
            }
            setInviteContent(val.content)
        });
    }

    const handleDismiss = () => {
        setOpen(false);
        navigate(`/`);
    }

    const style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "550px",
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
            <Box sx={{ ...style }}>
                <h1 id="child-modal-title">Invitation</h1>
                {

                }
                <div className='d-flex flex-column content-s-a item-center'>
                    {
                        allowed ? (
                            <>
                                <h3>Voulez-vous rejoindre le projet : {project.projectName} ? </h3>
                                <h4>Deadline : {project?.deadline} </h4>
                                <div className='btn-container d-flex content-s-a item-center'>
                                    <Button variant='contained' onClick={handleDismiss}>Décliner</Button>
                                    <Button variant='contained' onClick={handleJoinProject}>Accepter</Button>
                                </div>
                            </>
                        )
                        :
                            <h3>{inviteContent}</h3>
                    }
                </div>
            </Box>
        </Modal>
  )
}