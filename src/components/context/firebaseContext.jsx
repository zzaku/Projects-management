import { useContext, createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { db, auth } from "../Firebase/Firebase";
import { collection, getDocs, getDoc, addDoc, query, where, updateDoc, doc, onSnapshot, deleteDoc, setDoc, deleteField, documentId, arrayUnion } from "firebase/firestore";
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
  const [currentUserID, setCurrentUserID] = useState(userAccount ? JSON.parse(userAccount) : {})
  
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
/**/             onProject()
/**/             return data
/**/          }
/**/     }

/**/   const addProject = async (data) => {
/**/        let response = "";

/**/        await addDoc(userProjectRef, data).then(async (res) => {
/**/            response = res;
/**/            await getProject(currentUser.id);
/**/            await getProjectById(response.id);
/**/        })
/**/         return response.id;
/**/     }
        
        const onProject = () => {
/**/      const q = collection(db, "Users", currentUser.id, "Projects");
/**/      const q2 = collection(db, "Projects");

/**/      onSnapshot(q, (snapshot) => {
/**/        snapshot.docChanges().forEach( async (change) => {
/**/          if (change.type === "added") {
/**/              const projectDoc = doc(db, "Projects", change.doc.id);
/**/              const projectSnapshot = await getDoc(projectDoc);
/**/              const projectData = projectSnapshot.data();
/**/              const collaborators = projectData?.collaborators || [{owner: [], invited: []}];

/**/              if (!collaborators[0]?.owner[0]?.id) {
/**/                collaborators[0]?.owner?.push({id: currentUser.id, name: currentUser.username})
/**/              } else if (collaborators[0]?.owner[0]?.id !== currentUser?.id && !collaborators[0]?.invited?.some(invited => invited.id === currentUser.id)){
/**/                collaborators[0]?.invited?.push({id: currentUser.id, name: currentUser.username});
/**/              }

/**/              await setDoc(doc(db, "Projects", change.doc.id), {...change.doc.data(), collaborators: collaborators});
/**/              await setDoc(doc(db, "Users", currentUser.id, "Projects", change.doc.id), {...change.doc.data(), collaborators: collaborators});
/**/          }
/**/          if (change.type === "modified") {
/**/              const data = change.doc.data()
/**/              const owner = data?.collaborators[0]?.owner[0];
/**/              if(owner){
/**/                  const invited = data.collaborators[0].invited.filter(collaborator => collaborator.id !== currentUser.id);

/**/                  await setDoc(doc(db, "Projects", change.doc.id), {...data});

/**/                  if(owner.id !== currentUser.id) {
/**/                      await setDoc(doc(db, "Users", currentUser.id, "Projects", change.doc.id), {...data});  
/**/                  }

/**/                  invited.forEach(async (collaborator) => {
/**/                      await setDoc(doc(db, "Users", collaborator.id, "Projects", change.doc.id), {...data});
/**/                  })
/**/              }
/**/          }
/**/          if (change.type === "removed") {
/**/          }
/**/        });
/**/      });
/**/    }

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

/**/   const getProjectById = async (idProject) => {
/**/          const userProjectByIdRef = doc(db, "Projects", idProject);

/**/          if(userProjectByIdRef){
/**/              const datas = await getDoc(userProjectByIdRef);

/**/              setCurrentUser(prev => ({ ...prev, currentProject: datas.data() }));

/**/              return datas.data();
/**/          }
/**/      }

/**/   const setTasks = async (idProject, data) => {
/**/        const userProjectTaskRef = doc(db, "Users", currentUser.id, "Projects", idProject);

/**/        try{
/**/                await updateDoc(userProjectTaskRef, {tasks : data});

/**/                const datas = await getProjectById(idProject);

/**/                setCurrentUser(prev => ({ ...prev, currentProject: datas }));
/**/        } catch(err) {
/**/            throw err;
/**/        }
/**/    }

///////////à revoire !!
/**/   const joinProject = async (id, idProject) => {
/**/          let response = {};
/**/          const userProjectByIdRef = currentUserID && query(collection(db, "Users", currentUser?.id, "Projects"), where(documentId(), "==", idProject))     

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
/**/                const data = await getProjectById(idProject)

/**/                if(data){
/**/                  const projectData = data;
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

/**/    useEffect(() => {
/**/
/**/    }, [currentUser])
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
        joinProject,
        setTasks
      }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    )
}