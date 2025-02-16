import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const [queryResult, setQueryResult] = useState(null);
    const [viewState, setViewState] = useState("CONTENT");

    return (
        <AppContext.Provider value={{ queryResult, setQueryResult, viewState, setViewState }}>
            {children}
        </AppContext.Provider>
    );
}
