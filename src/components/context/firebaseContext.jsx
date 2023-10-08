import { useContext, createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { db, auth } from "../Firebase/Firebase";
import { collection, getDocs, addDoc, query, where, updateDoc, doc, onSnapshot, deleteDoc, setDoc, deleteField, documentId } from "firebase/firestore";
import { storage } from "../Firebase/Firebase";
import { ref, uploadBytes, getStorage, getDownloadURL, uploadString, deleteObject, listAll, list } from "firebase/storage";

const FirebaseContext = createContext()

export const useFirebase = () => {
    return useContext(FirebaseContext)
}

export const FirebaseProvider = ({children}) => {
    
  const [needToConnect, setNeedToConnect] = useState(false);
  
  ////////local storage currentUserID
  const userAccount = localStorage.user;
  const [currentUserID, setCurrentUserID] = useState(userAccount ? JSON.parse(userAccount) : {apiKey: "", appName: "", createdAt: "", email: "", emailVerified: null, isAnonymous: null, lastLoginAt: "", providerData: [], stsTokenManager: {}, uid: ""})
  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUserID));
  }, [currentUserID]);
  ///////////////////////////////////////////////////////////
  
  ////////local storage currentUser
  const userAccountInfos = localStorage.userInfos;
  const [currentUser, setCurrentUser] = useState(userAccountInfos ? JSON.parse(userAccountInfos) : null)
  
  useEffect(() => {
    localStorage.setItem("userInfos", JSON.stringify(currentUser));
  }, [currentUser]);
  ///////////////////////////////////////////////////////////
  
//////////INSERTION DES DONNEES DE PROJETS UTILISATEUR DANS LA BASE DE DONNEE ET RECUPERATION DES DONNEES//////
/**/ 
/**/   const userProjectRef = currentUserID && currentUser && currentUser && currentUser.id && collection(db, "Users", currentUser.id, "Projects")
/**/
/////////////////////////////////////////////////////////////////////////////////////////////////


/**/   const addInfosUser = async (uid, infos) => {
/**/        if(uid){
/**/            await setDoc(doc(db, "Users", uid), infos);
/**/          }
/**/     }

/**/   const getUser = async (mail) => {
/**/         const userInfosRef = mail && query(collection(db, "Users"), where("mail", "==", mail))
/**/         if(userInfosRef){
/**/             const data = await getDocs(userInfosRef);
/**/             const userDatas = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
/**/             const updatedUser = { ...currentUser, ...userDatas[0] };

/**/             setCurrentUser(updatedUser)
/**/             return data
/**/          }
/**/     }

/**/   const addProject = async (data) => {
/**/        let response = "";

/**/        await addDoc(userProjectRef, data).then((res) => {
/**/            response = res;
/**/            getProject(currentUser.id);
/**/        })
/**/         return response.id;
/**/     }

/**/   const getProject = async (userId) => {
/**/          const userProjectRef = userId && collection(db, "Users", userId, "Projects")
/**/          if(userProjectRef){
/**/              const datas = await getDocs(userProjectRef);
/**/              const userDatas = datas.docs.map(doc => ({ ...doc.data(), id: doc.id }))
/**/              setCurrentUser(prev => ({ ...prev, Projects: userDatas }))
/**/              return datas.docs.map(doc => ({ ...doc.data() }))
/**/          } else {
/**/              setCurrentUser(null)
/**/          }
/**/      }

/**/   const getProjectById = async (id, idProject) => {
/**/          const userProjectByIdRef = currentUserID && query(collection(db, "Users", id, "Projects"), where(documentId(), "==", idProject))
/**/          if(userProjectByIdRef){
/**/              const datas = await getDocs(userProjectByIdRef);
/**/              return datas.docs.map(doc => ({...doc.data()}))
/**/          }
/**/      }

/**/   const addTasks = async (idProject, data) => {
/**/        let response = "";

/**/        const userProjectTaskRef = collection(db, "Users", currentUser.id, "Projects", idProject, "tasks");
/**/        await addDoc(userProjectTaskRef, data).then((res) => {
/**/            response = res;
/**/            getTasks(idProject, currentUser.id);
/**/        })
/**/         return response.id;
/**/     }


/**/   const getTasks = async (idProject, userId) => {
/**/          const userProjectRef = userId && collection(db, "Users", userId, "Projects", idProject, "tasks")
/**/          if(userProjectRef){
/**/              const datas = await getDocs(userProjectRef);
/**/              const userDatas = datas.docs.map(doc => ({ ...doc.data(), id: doc.id }))
/**/              setCurrentUser(prev => ({ ...prev, Projects: [prev.Projects, userDatas] }))
/**/              return datas.docs.map(doc => ({ ...doc.data() }))
/**/          } else {
/**/              setCurrentUser(null)
/**/          }
/**/      }

///////////à revoire !!
/**/   const joinProject = async (id, idProject) => {
/**/          let response = {};
/**/          const userProjectByIdRef = currentUserID && query(collection(db, "Users", currentUser.id, "Projects"), where(documentId(), "==", idProject))     

/**/          if(!currentUserID){
/**/            response = {needToLogIn: true, content: "Vous devez vous connecter avant de rejoindre vos collaborateurs.", authorize: false}
/**/            return response;
/**/          }

/**/          if(id === currentUser.id){
/**/            response = {needToLogIn: false, content: "Vous ne pouvez pas rejoindre votre propre projet.", authorize: false, owner: true}
/**/            return response;
/**/          }

/**/          if(userProjectByIdRef){
/**/              const datas = await getDocs(userProjectByIdRef);

/**/              if(datas.docs.length < 1){
/**/                const data = await getProjectById(id, idProject)

/**/                if(data){
/**/                  const projectData = data[0];
/**/                  const projectRef = doc(db, "Users", currentUser.id, "Projects", idProject)

/**/                  await setDoc(projectRef, projectData);
/**/                  await getProject(currentUser.id)

/**/                  response = { needToLogIn: false, content: "Opération réusi.", authorize: true, data: projectRef }
/**/                  return response;
/**/                }
/**/              } else {
/**/                response = {needToLogIn: false, content: "Vous avez déjà rejoins ce projet.", authorize: false, owner: false}
/**/                return response; 
/**/              }
/**/          }
/**/      }

//////SIGNUP, LOGIN AND LOGOUT//////////////////////////////////////////////////////////////////
/**/        const signup = async (auth, email, password) => {
/**/      
/**/        const fetchSignup = await createUserWithEmailAndPassword(auth, email, password)
/**/            return fetchSignup
/**/        }
/**/
/**/        const signin = async (auth, email, password) => {
/**/            const fetchSignin = await signInWithEmailAndPassword(auth, email, password)
/**/            return fetchSignin
/**/        }
/**/
/**/        const signout = async () => {
/**/          const fetchSignout = await signOut(auth)
/**/          return fetchSignout
/**/        }
/**/
/**/        const updateMail = async (email) => {
/**/         await updateEmail(auth.currentUser, email)
/**/        }
/**/
/**/        const updatePass = async (newPassword) => {
/**/         await updatePassword(auth.currentUser, newPassword)
/**/        }
/**/
/**/        const deleteAccount = async (idUser) => {
/**/
/**/          const deleteCurrentUser = doc(db, "Users", idUser)
/**/          const deleteCurrentUserProjects = collection(db, "Users", idUser, "Projects")
/**/
/**/
/**/          await onSnapshot(deleteCurrentUserProjects, async (elem) => {
/**/               elem.docs.map( async (document) => {
/**/                  const deleteUserPreferences = doc(db, "Users", idUser, "Projects", document._key.path.segments.at(-1))
/**/                  await deleteDoc(deleteUserPreferences);
/**/               })
/**/           })

/**/          await deleteDoc(deleteCurrentUser)
/**/          await deleteUser(auth.currentUser)
/**/        }
/**/
/**/        const reauthenticateAccount = async (userProvidedPassword) => {
/**/
/**/          const credential = EmailAuthProvider.credential(auth.currentUser.email, userProvidedPassword)
/**/
/**/          await reauthenticateWithCredential(auth.currentUser, credential)
/**/        }
/**/
/**/    useEffect(() => {
/**/
/**/         const unsubscribe = onAuthStateChanged(auth, user => {
/**/                setCurrentUserID(user);

/**/                if (user) {
/**/                  getUser(user?.email);
/**/                  getProject(user?.uid);
/**/                } else {
/**/                  setCurrentUser(null);
/**/                }
/**/         })

/**/         return () => unsubscribe
/**/    }, [currentUserID])
/////////////////////////////////////////////////////////////////////////////////////////////

    const value = {
        needToConnect,
        setNeedToConnect,
        currentUserID,
        setCurrentUserID,
        currentUser,
        setCurrentUser,
        signup,
        signin,
        signout,
        addInfosUser,
        addProject,
        getProject,
        getProjectById,
        joinProject
      }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    )
}