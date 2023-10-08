import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import projectCard from "../../assets/project3.png"
import { useFirebase } from '../context/firebaseContext';
import React from 'react'
import "./ProjectCard.css"

export const ProjectCard = ({project}) => {
    const deadline = new Date(project.deadline.seconds * 1000).toLocaleString("fr-FR")
    const {currentUser} = useFirebase()
    const navigate = useNavigate();

    const goToProjectManagement = () => {
        navigate(`/DashBoard/${currentUser.id}/Projet/${project.id}`);
    }

  return (
    <div className='card-project' onClick={goToProjectManagement}>
        <Card sx={{ width: "100%", height: "100%", borderRadius: "17px"}}>
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image={projectCard}
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {project.projectName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Deadline : {deadline}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </div>
  )
}