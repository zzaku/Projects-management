import React from "react";
import { styled } from '@mui/material/styles';
//import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useFirebase } from "../components/context/firebaseContext";
import { AuthUser } from "../components/auth/AuthUser";
import NavBar from "../components/navBar/NavBar";

export default function Home() {

    
    const {needToConnect} = useFirebase()

    return(
        <div>
            <div>
                {needToConnect && <AuthUser />}
                <h1>Bienvenue !</h1>
            </div>
            <NavBar></NavBar>
            <h1>Projekto</h1>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card sx={{ maxWidth: 400 }}>
                        <CardActionArea>
                            <CardMedia component="img" height="140" image="/static/images/cards/contemplative-reptile.jpg" alt="green iguana"/>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Bienvenue sur Projekto
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Regroupez votre équipe et commencez donc à vous organniser <br />
                                    Nous vous permettrons de mettre à l'écris votre organnisation et votre planning ce qui vous permettre de toujours garder le cap
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ maxWidth: 500 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img" height="140" image="/static/images/cards/contemplative-reptile.jpg" alt="green iguana"/>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Déterminez :
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <ul>
                                        <li>Vos outils de développement</li>
                                        <li>Vos Différentes étapes</li>
                                        <li>Les paliers a atteindre</li>
                                        <li>Les tâches à accomplir et leur responsables respectif</li>
                                    </ul>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid container item justifyContent="center" direction="row" alignItems="center">
                    <div>
                        <Typography variant="body2" color="text.secondary">
                            Votre organnisation concrétise vos idées ! 
                        </Typography>
                            <br />
                        <Button variant="outlined" size="medium">Démarrer un Projet</Button>
                    </div>
                        
                   
                </Grid>
            </Grid>
        </div>
    );
}