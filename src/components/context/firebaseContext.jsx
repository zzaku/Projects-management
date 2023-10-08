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
  
  ////////local storage currentUserID
  const userAccountInfos = localStorage.userInfos;
  const [currentUser, setCurrentUser] = useState(userAccountInfos ? JSON.parse(userAccountInfos) : null)
  
  useEffect(() => {
    localStorage.setItem("userInfos", JSON.stringify(currentUser));
  }, [currentUser]);
  ///////////////////////////////////////////////////////////
  
//////////INSERTION DES DONNEES UTILISATEUR DANS LA BASE DE DONNEE ET RECUPERATION DES DONNEES//////
/**/ 
/**/   const userProjectRef = currentUserID && currentUser && currentUser[0] && currentUser[0].id && collection(db, "Users", currentUser[0].id, "Projects")
/**/
/////////////////////////////////////////////////////////////////////////////////////////////////


/**/   const addInfosUser = async (uid, infos) => {
/**/        if(uid){
/**/            await setDoc(doc(db, "Users", uid), infos);
/**/          }
/**/     }

/**/   const getUser = async (mail) => {
/**/         const userInfosRef = currentUserID && query(collection(db, "Users"), where("mail", "==", mail))

/**/         if(userInfosRef){
/**/             const data = await getDocs(userInfosRef);
/**/             setCurrentUser(data.docs.map(doc => ({...doc.data(), id: doc.id})))
/**/          }
/**/     }

/**/   const addProject = async (data) => {
/**/        let response = "";

/**/        await addDoc(userProjectRef, data).then((res) => {
/**/            response = res;
/**/            getProject();
/**/        })
/**/         return response.id;
/**/     }

/**/   const getProject = async () => {
/**/          if(userProjectRef){
/**/              const datas = await getDocs(userProjectRef);
/**/              setCurrentUser({...currentUser, Projects: datas.docs.map(doc => ({...doc.data(), id: doc.id}))})
/**/              return datas.docs.map(doc => ({...doc.data()}))
/**/          } else {
/**/              setCurrentUser(null)
/**/          }
/**/      }

//////SIGNUP, LOGIN AND LOGOUT//////////////////////////////////////////////////////////////////
/**/    const signup = async (auth, email, password) => {
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
/**/          const deleteCurrentUserPref = collection(db, "Users", idUser, "Preferences")
/**/          const deleteCurrentUserResume = collection(db, "Users", idUser, "Resume")
/**/
/**/
/**/          await onSnapshot(deleteCurrentUserPref, async (elem) => {
  /**/               elem.docs.map( async (document) => {
    /**/                  const deleteUserPreferences = doc(db, "Users", idUser, "Preferences", document._key.path.segments.at(-1))
    /**/                  await deleteDoc(deleteUserPreferences);
    /**/               })
    /**/           })
    /**/
    /**/          await onSnapshot(deleteCurrentUserResume, async (elem) => {
      /**/               elem.docs.map( async (document) => {
        /**/                  const deleteCurrentResume = doc(db, "Users", idUser, "Resume", document._key.path.segments.at(-1))
        /**/                  await deleteDoc(deleteCurrentResume);
        /**/               })
        /**/           })
        /**/
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
/**/         return onAuthStateChanged(auth, user => {
/**/                setCurrentUserID(user);
/**/                getUser(user?.email);
/**/                getProject();
/**/        })
/**/    }, [])
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
      }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    )
}