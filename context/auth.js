
"use client"
import React, { createContext, useContext, useState } from "react";
//=====================================================================
const AuthContext = createContext();
//=====================================================================
export function AuthProvider({ children }) {
  const [id, setId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [name, setName] = useState(null);
  const [guid, setGuid] = useState(null);

  const setAuthStates = (
    id,
    user_name,
    name,
    guid
  ) => {
    setId(id);
    setUserName(user_name);
    setName(name);
    setGuid(guid);
  };

  const logout = () => {
    setId(null);
    setUserName(null);
    setName(null);
    setGuid(null);
  };

  return (
    <AuthContext.Provider value={{
      setAuthStates,
      id,
      userName,
      name,
      guid,
      logout,
      setGuid
    }}>
      {children}
    </AuthContext.Provider>
  );
}
//=====================================================================
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}


//=====================================================================