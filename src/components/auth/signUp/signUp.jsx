import { useNavigate } from "react-router";
import { useState } from "react";
import { auth } from "../../Firebase/Firebase";
import { useFirebase } from "../../context/firebaseContext";
import MuiAlert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import "../style/Login.css";

export const SignUp = ({ setRegister, pathLocation, mobile }) => {
  const [user, setUser] = useState({});
  const [inscription, setInscription] = useState({});
  const [error, setError] = useState("");
  const { signup, addInfosUser, setNeedToConnect } = useFirebase();
  const navigate = useNavigate();
  const patternMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;

  function onChangeUser(e) {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  async function submitSignUp(e) {
    e.preventDefault();
    setError("");
    setInscription({ content: "", error: false });
    
    let isValid = true;
    if (user.username && user.username.length < 5) {
      setError("Le nom d'utilisateur doit comporter au moins 5 caractères.");
      isValid = false;
    }
    
    if (user.mail && !patternMail.test(user.mail)) {
      setError("Veuillez entrer une adresse e-mail valide.");
      isValid = false;
    }
    
    if (user.password && (user.password.length < 8 || !/[A-Z]/.test(user.password) || !/[0-9]/.test(user.password) || !/[a-z]/.test(user.password) || !/[!@#$%^&*]/.test(user.password))) {
      setError("Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule et un caractère spécial.");
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    try {
      const res = await signup(auth, user.mail, user.password)

      setError("");
      
      if(res.user.uid){
        setInscription({ content: "Inscription reussis !", error: false });

        addInfosUser(res.user.uid,
          {
            mail: user.mail.toLowerCase(),
            username: user.username,
          });

        setTimeout(() => {
          setNeedToConnect(false)
          navigate(`/DashBoard/${res.user.uid}`);
        }, 1000) 
      }
    } catch (error) {
      const errorMessage = error.message;
          setInscription({ content: errorMessage === "Firebase: Error (auth/email-already-in-use)." ? "Adresse mail déja utilisé !" : "failed to create an account", error: true });
        }
      }

  return (
    <div className="signin-container d-flex content-center item-center">
      <form className="form">
          <h3 id="heading">Connexion</h3>
          {error && <MuiAlert severity="error">{error}</MuiAlert>}
          {inscription.content && <MuiAlert severity={!inscription.error ? "success" : "error"}>{inscription.content}</MuiAlert>}
          <div className="field">
          <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
          </svg>
            <input placeholder="Email" name="mail" onChange={onChangeUser} className="input-field" type="text" autoComplete="true" />
          </div>
          <div className="field">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8,0 C3.58,0 0,3.58 0,8 C0,11.12 2.36,13.62 5.5,14.73 C5.96,14.84 6.02,15.16 5.73,15.42 C4.8,16.24 3.2,16.24 2.27,15.42 C1.98,15.16 2.04,14.84 2.5,14.73 C5.64,13.62 8,11.12 8,8 C8,5.79 6.21,4 4,4 C3.31,4 2.67,4.2 2.1,4.58 C2.02,4.63 1.93,4.64 1.85,4.71 C1.08,5.29 0.67,6.21 0.85,7.15 C0.94,7.62 1.31,8 1.79,8 L6.21,8 C6.69,8 7.06,7.62 7.15,7.15 C7.33,6.21 6.92,5.29 6.15,4.71 C6.07,4.64 5.98,4.63 5.9,4.58 C5.33,4.2 4.69,4 4,4 C1.79,4 0,5.79 0,8 C0,11.58 3.58,15.16 8,15.16 C12.42,15.16 16,11.58 16,8 C16,3.58 12.42,0 8,0 Z M8,14.16 C4.59,14.16 2,11.57 2,8 C2,5.23 4.23,3 7,3 C9.77,3 12,5.23 12,8 C12,11.57 9.41,14.16 6,14.16 C5.89,14.16 5.79,14.15 5.69,14.14 C5.07,13.82 4.6,13.28 4.26,12.66 C4.17,12.51 4.03,12.39 3.86,12.39 C3.69,12.39 3.55,12.5 3.46,12.65 C3.12,13.28 2.65,13.82 2.03,14.14 C1.93,14.15 1.82,14.16 1.71,14.16 C0.85,14.16 0.16,13.47 0.16,12.61 C0.16,12.5 0.27,12.39 0.42,12.31 C1.39,11.65 2.62,11.65 3.59,12.31 C3.73,12.39 3.84,12.5 3.84,12.61 C3.84,13.47 4.53,14.16 5.39,14.16 C7.26,14.16 8,13.03 8,11.03 L8,14.16 Z"/>
          </svg>
            <input placeholder="UserName" name="username" onChange={onChangeUser} className="input-field" type="text" autoComplete="true" />
          </div>
          <div className="field">
          <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
          </svg>
            <input placeholder="Password" name="password" onChange={onChangeUser} className="input-field" type="password" autoComplete="true" />
          </div>
          <div className="btn">
          <Button variant="outained" onClick={submitSignUp}>S'inscrire</Button>
          <Button variant="outained" onClick={() => setRegister(false)}>Tu as déjà un compte ?</Button>
          </div>
      </form>
    </div>
  );
}