import React from "react";
import { styled } from '@mui/material/styles';
//import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useNavigate } from "react-router-dom";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useFirebase } from "../../../components/context/firebaseContext";
import { AuthUser } from "../../../components/auth/AuthUser";
import imageProject from "../../../assets/project.png"
import imageProject2 from "../../../assets/project2.png"
import "./Home.css"

export default function Home() {

    
    const {needToConnect, setNeedToConnect, currentUser, currentUserID} = useFirebase();
    const navigate = useNavigate();
    
    const goToDashBoard = () => {
        if(currentUserID){
            navigate(`/DashBoard/${currentUser[0].id}`);
        } else {
            setNeedToConnect(true);
        }
    }

    return(
        <div className="presentation-contaier d-flex flex-column item-center">
            {needToConnect && <AuthUser />}
            <div className="title">
                <h1>Projekto</h1>
            </div>
            <Grid container spacing={5} style={{display: "flex", justifyContent: "space-around", marginTop: "2%"}}>
                <Grid item xs={5}>
                    <Card sx={{ maxWidth: "100%", height: 500 }}>
                        <CardActionArea>
                            <CardMedia component="img" height="390" image={imageProject} alt="green iguana"/>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Bienvenue sur Projekto
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Regroupez votre équipe et commencez donc à vous organniser <br />
                                    Mettez à l'écris votre organnisation et votre planning afin de toujours garder le cap
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ maxWidth: "100%", height: 500 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img" height="370" image={imageProject2} alt="green iguana"/>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Déterminez :
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    - Vos outils de développement
                                    - Vos Différentes étapes<br/>
                                    - Les paliers a atteindre<br/>
                                    - Les tâches à accomplir et leur responsables respectif
                                    
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid container item justifyContent="center" direction="row" alignItems="center">
                    <div>
                        <Typography variant="body2" color="#E1E1E1">
                            Votre organnisation concrétise vos idées ! 
                        </Typography>
                            <br />
                        <Button variant="outlined" size="medium" onClick={goToDashBoard}>Démarrer un Projet</Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}