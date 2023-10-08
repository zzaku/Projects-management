import React, { useEffect, useState } from 'react'
import { ProjectCard } from '../../../components/projectCard/projectCard';
import { useFirebase } from '../../../components/context/firebaseContext';
import { ModalForm } from '../../../components/modal/modalForm/ModalForm';
import Grid from '@mui/material/Grid';
import "./DashBoardProject.css"

export const DashBoardProject = () => {

  const {currentUser, getProject} = useFirebase()
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <div className='title d-flex content-center'>
          <h1>DashBoard</h1>
      </div>
      <Grid className='grid-card-container' container spacing={2} sx={{ bgcolor: '#82c0cc', borderRadius: "10px", margin: "auto", marginTop: "2%", border: "2px solid #16697a", height: '75vh', width: '90%', opacity: "0.8", overflowY: "scroll"}}>
        {
          currentUser?.Projects?.map((elem, i) => { 
            return (
                <Grid key={i} item xs={3}>
                  <ProjectCard project={elem}/>
                </Grid>
              )
            })
          }
          <Grid item xs={2}>
            <div className="card-create-project d-flex" onClick={() => setOpen(true)}>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16697a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            </div>
          </Grid>
          <ModalForm open={open} setOpen={setOpen} />
      </Grid>
    </>
  )
}
