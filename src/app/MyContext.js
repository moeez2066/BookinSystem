"use client";
import { createContext, useContext, useState } from "react";

// Create a context
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // State for tracking sign-in status
  const [userName, setUserName] = useState("");

  return (
    <MyContext.Provider
      value={{ isSignedIn, setIsSignedIn, userName, setUserName }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook for consuming the context
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
