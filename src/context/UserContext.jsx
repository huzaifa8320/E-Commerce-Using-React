import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const UserContext = createContext()

function UserContextProvider({ children }) {
  const [updateTrigger, setUpdateTrigger] = useState(false); // New state to trigger useEffect

  const [user, setUser] = useState({
    isLogin: false,
    userInfo: {}
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user_real) => {
      if (user_real) {

        setUser({
          isLogin: true,
          userInfo: user_real
        });

      }
      else {
        setUser({
          isLogin: false,
          userInfo: {}
        })
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [updateTrigger ,auth]);


  return (
    <UserContext.Provider value={{ user, setUser , updateTrigger , setUpdateTrigger}}>
      {children}
    </UserContext.Provider>
  )
}


export default UserContextProvider