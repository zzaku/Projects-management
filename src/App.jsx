
import { FirebaseProvider } from './components/context/firebaseContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashBoardProject } from './routes/private/dashBoardProject/DashBoardProject';
import { Profile } from './components/profile/profile';
import NavBar from './components/navBar/NavBar';
import Home from './routes/public/home/Home';
import {Management} from './routes/private/management/Management';
import { ProtectedRoute } from './routes/ProtectedRoute';
import './App.css'


function App() {

  return (
      <div>
        <FirebaseProvider>
          <Router>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/Profile" element={<Profile />}></Route>
              <Route path="/DashBoard/:id" element={
                <ProtectedRoute>
                  <DashBoardProject />
                </ProtectedRoute>}>
              </Route>
              <Route path="/DashBoard/:id/Projet/:id" element={
                <ProtectedRoute>
                  <Management />
                </ProtectedRoute>}>
              </Route>
            </Routes>
          </Router>
        </FirebaseProvider>
      </div>
  )
}

export default App;
