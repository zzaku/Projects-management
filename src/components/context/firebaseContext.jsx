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
  const userAccount = sessionStorage.user;
  const [currentUserID, setCurrentUserID] = useState(userAccount ? JSON.parse(userAccount) : {apiKey: "", appName: "", createdAt: "", email: "", emailVerified: null, isAnonymous: null, lastLoginAt: "", providerData: [], stsTokenManager: {}, uid: ""})
  
  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(currentUserID));
  }, [currentUserID]);
  ///////////////////////////////////////////////////////////
  
  ////////local storage currentUserID
  const userAccountInfos = sessionStorage.userInfos;
  const [currentUser, setCurrentUser] = useState(userAccountInfos ? JSON.parse(userAccountInfos) : null)
  
  useEffect(() => {
    sessionStorage.setItem("userInfos", JSON.stringify(currentUser));
  }, [currentUser]);
  ///////////////////////////////////////////////////////////
  
//////////INSERTION DES DONNEES UTILISATEUR DANS LA BASE DE DONNEE ET RECUPERATION DES DONNEES//////
/**/
/**/   const userInfosRef = currentUserID && query(collection(db, "Users"), where("mail", "==", currentUserID.email)) 
/**/   const userPreferencesRef = currentUserID && currentUser && currentUser[0] && currentUser[0].id && collection(db, "Users", currentUser[0].id, "Preferences")
/**/   const userResumeRef = currentUserID && currentUser && currentUser[0] && currentUser[0].id && collection(db, "Users", currentUser[0].id, "Resume")
/**/   const userRoomRef = currentUserID && currentUser && currentUser[0] && currentUser[0].id && collection(db, "Users", currentUser[0].id, "Room")
/**/
/**/   const addInfosUser = async (uid, infos) => {
/**/        if(uid){
/**/            await setDoc(doc(db, "Users", uid), infos)
/**/            await getUser()
/**/          }
/**/     }
/**/
/**/      const getUser = async () => {
/**/               if(userInfosRef){
/**/                  const data = await getDocs(userInfosRef);
/**/                  setCurrentUser(data.docs.map(doc => ({...doc.data(), id: doc.id})))
/**/               }
/**/        }
/**/
/**/   const setInfo = async (data, idUser) => {
/**/          const userSetBio = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", idUser)
/**/          await updateDoc(userSetBio, data)
/**/          getUser()
/**/     }
/**/
/**/   const setDisplayInfosUser = async (data, idUser) => {
/**/          const userSetDisplaying = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", idUser)
/**/          await updateDoc(userSetDisplaying, data)
/**/          getUser()
/**/     }
/**/
/**/   const setAvatarPath = async (data, idUser) => {
/**/          const userSetAvatarPath = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", idUser)
/**/          await updateDoc(userSetAvatarPath, data)
/**/          getUser()
/**/     }
/**/
/**/   const uploadAvatar = async (avatar, path_avatar, uuid) => {   
/**/          const avatarRef = ref(storage, `avatars/${path_avatar + uuid}`)
/**/          await uploadString(avatarRef, avatar, 'data_url')
/**/          getUser()
/**/     }
/**/
/**/   const getBackImage = async (path_avatar1, path_avatar2, uuid) => {
/**/          const storage = getStorage();
/**/          const getUrl = getDownloadURL(ref(storage,`avatars/${path_avatar2 + uuid}`)).then(url => url)
/**/          getUser()
/**/          return getUrl
/**/     }
/**/
/**/    useEffect(() => {
/**/              return () => {
  
/**/                getUser();
/**/             }
/**/
/**/    }, [currentUserID])
/////////////////////////////////////////////////////////////////////////////////////////////////



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
/**/                setCurrentUserID(user)
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
      }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    )
}


