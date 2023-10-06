
import { useState } from 'react'
import { FirebaseProvider } from './components/context/firebaseContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashBoardProject } from './components/dashBoardProject/DashBoardProject';
import { Profile } from './components/profile/profile';
import './App.css'
import Home from './route/Home';

function App() {

  return (
      <div>
        <FirebaseProvider>
          <Router>
            <Routes>
              <Route path="/Profile" element={<Profile />}></Route>
              <Route path="/DashBoard/:id" element={<DashBoardProject />}></Route>
              <Route path="/Home" element={<Home/>} />
            </Routes>
          </Router>
        </FirebaseProvider>
      </div>
  )
}

export default App;
