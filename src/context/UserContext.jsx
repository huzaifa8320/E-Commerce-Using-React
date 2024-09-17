import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";

export const UserContext = createContext()

function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    isLogin: false,
    userInfo: {}
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser({
          isLogin: true,
          userInfo: user
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