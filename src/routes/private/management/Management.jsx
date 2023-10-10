import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import ChatIcon from '@mui/icons-material/Chat';
import { ModalCollab } from '../../../components/modal/modalCollab/ModalCollab';
import { ModalTask } from '../../../components/modal/modalTask/ModalTask';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../../../components/context/firebaseContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import "./Management.css"

export const Management = () => {

  const [open, setOpen] = useState(false)
  const param = useParams();
  const {getProjectById, currentUser, setTasks} = useFirebase()
  const [myTasks, setMyTasks] = useState(currentUser?.currentProject?.tasks ? [...currentUser?.currentProject?.tasks] : []);
  const [tasksDone, setTasksDone] = useState(currentUser?.currentProject?.tasksDone ? [...currentUser?.currentProject?.tasksDone] : []);
  const [isDragging, setIsDragging] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [currentTask, setCurrentTask] = useState({title: "", description: "", id: ""})
  const owner = currentUser?.currentProject?.collaborators[0]?.owner[0]?.name.substring(0, 2).toUpperCase();

  useEffect(() => {
    getProjectById(param.idProject)
  }, [])

  const handleDrag = (e) => {
    e.dataTransfer.setData('Task', JSON.stringify({title: "Nom de tâche", description: "Description", id: myTasks.length}));
    setIsDragging(true);
  }

  const handleDrop = (e) => {
    const dataString  = e.dataTransfer.getData("Task");
    const data = JSON.parse(dataString);

    setIsDragging(false);
    setMyTasks(prev => [...prev, data])

    setTasks()
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleEditTask = (title, description, id) => {
    setCurrentTask({title, description, id})
    setOpenTask(true)
  }

  return (
    <Grid className='grid-card-container' container spacing={2} sx={{ bgcolor: '#ede7e3', borderRadius: "10px", margin: "auto", marginTop: "10px", border: "3px solid #16697a", height: '87vh', width: '98%', overflowY: "scroll"}}>
      <Grid item xs={12} sx={{display: "flex", width: "100%", height: "10%", justifyContent: "space-around"}}>
        <div className='title-container d-flex content-s-a item-center'>
          <div className='title-name d-flex item-center'>
            <h1>{currentUser?.currentProject?.projectName}</h1>
            <h3>Deadline : {new Date(currentUser?.currentProject?.deadline.seconds * 1000).toLocaleString('fr-FR')}</h3>
          </div>
          <div className='title-icon d-flex content-end item-center'>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 32 32">
              <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
            </svg>
          </div>
        </div>
        <div className='collab-container d-flex content-s-a item-center' onClick={() => setOpen(true)}>
          <div className='title-name d-flex item-center'>
            <h1>Collaborateurs</h1>
            <div className='profile-container d-flex content-center item-center'>
              <p>{owner}</p>
            </div>
            {
              currentUser?.currentProject?.collaborators[0]?.invited.map((invited, index) => {
                return (
                  <div key={index} className='profile-container d-flex content-center item-center'>
                    <p>{invited.name.substring(0, 2).toUpperCase()}</p>
                  </div>
                )
              })
            }
          </div>
          <div className='title-icon d-flex content-end item-center'>
            <ChatIcon sx={{width: "40px", height: "auto"}}/>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sx={{width: "100%", height: "90%", padding: "16px 16px"}}>
        <Grid container justifyContent="center" spacing={3} sx={{width: "100%", height: "100%", flexWrap: "nowrap", margin: 0, padding: 0}}>
          {[{title: "Outils"}, {title: "Tâches en cours"}, {title: "Tâches terminées"}].map((value, i) => (
            <Grid key={i} item sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "black"}}>
              <h2>{value.title}</h2>
              <Paper sx={{height: "100%", width: "100%"}}>
                <div onDrop={(e) => i === 1 && handleDrop(e)} onDragOver={(e) => handleDragOver(e)} className="page-content d-flex flex-column item-center">
                  {i === 0 && <div className={`task-tool d-flex content-s-a item-center ${isDragging ? 'dragging' : ''}`} style={{  boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }} draggable="true" onDragStart={(e) => handleDrag(e)}><h3>Ajouter une tâche</h3><AssignmentIcon /></div>}
                  {i === 1 && myTasks.sort((a, b) => a.id - b.id).map((task, index) => {
                    return (
                      <div key={index} className='task-tool d-flex content-s-a item-center' onDragStart={(e) => handleDrag(e)}><div className='task-content d-flex flex-column content-s-a' onClick={() => handleEditTask(task.title, task.description, task.id)}><h3 style={{marginLeft: "4%"}}>{task.title}</h3><h4>{task.description.length > 45 ? `${task.description.substring(0, 45)}...` : task.description}</h4></div><AssignmentIcon /></div>
                    )
                    })
                  }
                  {i === 2 && tasksDone.map((taskDone, index) => {
                    return (
                      <div key={index} className='task-tool d-flex content-s-a item-center' onDragStart={(e) => handleDrag(e)}><h3>{taskDone}</h3><AssignmentIcon /></div>
                    )
                  })
                }
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <ModalCollab open={open} setOpen={setOpen} />
      <ModalTask open={openTask} setOpen={setOpenTask} tasks={myTasks} setTasks={setMyTasks} defaultTitle={currentTask.title} defaultDescription={currentTask.description} defaultId={currentTask.id} />
    </Grid>
  )
}
