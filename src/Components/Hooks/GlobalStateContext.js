import React, { createContext, useState } from "react";

// Create the context
export const GlobalStateContext = createContext();

// Create the provider component
export const GlobalStateProvider = ({ children }) => {
  const [visible, setVisible] = useState(null); // Your global state value
  const [docId, setDocId] = useState("");
  const [shift, setShift] = useState(true);
  const [background, setBackground] = useState(
    "https://images.hdqwalls.com/download/iron-man-the-avengers-yy-1920x1080.jpg"
  );

  return (
    <GlobalStateContext.Provider
      value={{
        background,
        setBackground,
        docId,
        setDocId,
        visible,
        setVisible,
        shift,
        setShift,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
