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
/**/   const getPref = async () => {
/**/          if(userPreferencesRef){
/**/              const datas = await getDocs(userPreferencesRef);
/**/              setCurrentUser({...currentUser, Preferences: datas.docs.map(doc => ({...doc.data(), id: doc.id}))})
/**/          } else {
/**/              setCurrentUser(null)
/**/          }
/**/      }
/**/
/**/   const addPreferences = async (data) => {
/**/          await addDoc(userPreferencesRef, data)
/**/          getPref()
/**/     }
/**/
/**/   const setPreferences = async (data, idPref) => {
/**/          const userSetPreferencesRef = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", currentUser[0].id, "Preferences", idPref)
/**/          await updateDoc(userSetPreferencesRef, data)
/**/          await onSnapshot(userSetPreferencesRef, async (doc) => {
/**/              if(doc.data()){
/**/                  if(doc.data().favorite === false && doc.data().to_watch_later === false){
/**/                      await deleteDoc(userSetPreferencesRef);
/**/                           getPref()
/**/                  }
/**/              }
/**/          });
/**/          getPref()
/**/
/**/     }
/**/ 
/**/   const getResume = async () => {
/**/          if(userResumeRef){
/**/              const datas = await getDocs(userResumeRef);
/**/              setCurrentUser({...currentUser, Resume: datas.docs.map(doc => ({...doc.data(), id: doc.id}))})
/**/          } else {
/**/              setCurrentUser(null)
/**/          }
/**/      }
/**/
/**/   const addResume = async (data) => {
/**/          await addDoc(userResumeRef, data)
/**/          await getResume()
/**/     }
/**/
/**/   const setResume = async (data, idResume) => {
/**/          const userSetResume = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", currentUser[0].id, "Resume", idResume)
/**/          await updateDoc(userSetResume, data)
/**/          getResume()
/**/     }
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
/**/   const uploadBackground = async (avatar, path_avatar, uuid) => {   
/**/          const avatarRef = ref(storage, `background/${path_avatar + uuid}`)
/**/          await uploadString(avatarRef, avatar, 'data_url')
/**/          getUser()
/**/     }
/**/
/**/   const getBackBackground = async (path_avatar1, path_avatar2, uuid) => {
/**/          const storage = getStorage();
/**/          const getUrl = getDownloadURL(ref(storage,`background/${path_avatar2 + uuid}`)).then(url => url)
/**/          getUser()
/**/          return getUrl
/**/     }
/**/
/**/   const setBackgroundPath = async (data, idUser) => {
/**/          const userSetBackgroundPath = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", idUser)
/**/          await updateDoc(userSetBackgroundPath, data)
/**/          getUser()
/**/     }
/**/ 
/**/   const getRoom = async () => {
/**/          if(userRoomRef){
/**/              const datas = await getDocs(userRoomRef);
/**/              setCurrentUser({...currentUser, Room: datas.docs.map(doc => ({...doc.data(), id: doc.id}))})
/**/              return datas.docs.map(doc => ({...doc.data()}))
/**/          } else {
/**/              setCurrentUser(null)
/**/          }
/**/      }
/**/
/**/   const addRoom = async (data, idRoom, currentId) => {
            let allowed = {}
/**/          await getRoom()
/**/          .then(async (res) => {
/**/            if(res.length > 0){
                allowed = {isAllowed: false}
                } else {
                await setDoc(doc(db, "Users", currentId, "Room", idRoom), data)
                allowed = {isAllowed: true}
                }
/**/         })
          return allowed
/**/     }
/**/
/**/   const setInRoom = async (idUser) => {
/**/          const userSetInRoom = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", idUser)
/**/          await updateDoc(userSetInRoom, {in_room: true})
/**/          await getRoom()
/**/     }
/**/
/**/   const setNotInRoom = async (idUser) => {
/**/          const userSetInRoom = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", idUser)
/**/          await updateDoc(userSetInRoom, {in_room: deleteField()})
/**/          await getRoom()
/**/     }
/**/
/**/   const removeRoom = async (idRoom) => {
/**/          const userSetPreferencesRef = currentUserID && currentUser && currentUser[0] && currentUser[0].id && doc(db, "Users", currentUser[0].id, "Room", idRoom)
/**/          await deleteDoc(userSetPreferencesRef);
/**/          await getRoom()
/**/     }
/**/    
/**/   const uploadVodLive = async (url, roomId, position, vodName) => {   
/**/          const blobRef = ref(storage, `vod_live/${roomId}/${position}/${vodName}`)
/**/          const upload =  await uploadBytes(blobRef, url)
/**/          return upload
/**/     }
/**/
/**/   const getBackVodLive = async (roomId, position, vodName) => {
/**/          const storage = getStorage();
/**/          const getUrl = getDownloadURL(ref(storage,`vod_live/${roomId}/${position}/${vodName}`)).then(url => url)
/**/          return getUrl
/**/     }
/**/
/**/   const getBackVodLiveFromGuest = async (vodPath, titleName, topPosition) => {
/**/          const storage = getStorage();
/**/          const getUrl = await getDownloadURL(ref(storage, vodPath)).then(url => url)
/**/          let vod_payload = {url: getUrl, title: titleName, position: topPosition}
/**/          return vod_payload
/**/     }
/**/
/**/   const getBackLengthOfLive = async (roomId) => {
/**/          const storage = getStorage();
/**/          const getUrl = await list(ref(storage,`vod_live/${roomId}`)).then(res => res.prefixes)
/**/          return getUrl
/**/     }
/**/
/**/   const getBackVodLiveFromGuestArray = async (roomId, position) => {
/**/          const storage = getStorage();
/**/          const getUrl = await listAll(ref(storage,`vod_live/${roomId}/${position}`)).then(res => res)
/**/          return getUrl
/**/     }
/**/
/**/   const removeVod = async (roomId, position, vodName) => {
/**/          const delVodRef = ref(storage, `vod_live/${roomId}/${position}/${vodName}`)
/**/          const deleteVod = deleteObject(delVodRef).then(url => url)
/**/          return deleteVod
/**/     }
/**/
/**/   const getUserInRoom = async (roomId) => {
/**/          const q = query(collection(db, "Users"), where("in_room", "==", true)); 
/**/          const getUserInRoom = await getDocs(q);
/**/          let count = 0
/**/          for (const doc of getUserInRoom.docs) {
/**/             const userInRoom = currentUserID && query(collection(db, "Users", doc.id, "Room"), where(documentId(), "==", roomId)) 
/**/             let UserInRoom = await getDocs(userInRoom);
/**/             if(UserInRoom.docs.length > 0){
/**/               count += 1
/**/               }
/**/            }
/**/          return count
/**/     }
/**/
/**/   const getHostLive = async (currentUser) => {
/**/          return currentUser
/**/     }
/**/
/**/    useEffect(() => {
/**/        
/**/              getUser();
/**/              getPref();
/**/              getResume();
/**/              getRoom();
/**/
/**/              return () => {
/**/                getUser();
/**/                getPref();
/**/                getResume();
/**/                getRoom();
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
/**/                if(user){
/**/                    setCurrentUserID(user)
/**/                    getPref()
/**/                    getResume()
/**/
/**/                    return () => {
/**/                      setCurrentUserID(user)
/**/                      getPref()
/**/                      getResume()
/**/                     }
/**/                } else {
/**/                     setCurrentUserID(null)
/**/                     setCurrentUser(null)
/**/
/**/                     return () => {
/**/                       setCurrentUserID(user)
/**/                       getPref()
/**/                       getResume()
/**/                     }
/**/                }
/**/        })
/**/
/**/    }, [])
/////////////////////////////////////////////////////////////////////////////////////////////

    const value = {
        currentUserID,
        setCurrentUserID,
        currentUser,
        setCurrentUser,
        signup,
        signin,
        signout,
        addInfosUser,
        addPreferences,
        setPreferences,
        getPref,
        getResume,
        addResume,
        setResume,
        setInfo,
        updateMail,
        updatePass,
        deleteAccount,
        setDisplayInfosUser,
        uploadAvatar,
        getBackImage,
        setAvatarPath,
        reauthenticateAccount,
        uploadBackground,
        getBackBackground,
        setBackgroundPath,
        addRoom,
        removeRoom,
        getRoom,
        uploadVodLive,
        getBackVodLive,
        getHostLive,
        removeVod,
        getBackVodLiveFromGuest,
        getBackLengthOfLive,
        getBackVodLiveFromGuestArray,
        getUserInRoom,
        setInRoom,
        setNotInRoom,
      }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    )
}


