import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const UserContext = createContext()

function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    isLogin: false,
    userInfo: {}
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        const unsub = onSnapshot(doc(db, "User Data", user.uid), (doc) => {
          setUser({
            isLogin: true,
            userInfo: doc.data()
          });
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
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}


export default UserContextProvider