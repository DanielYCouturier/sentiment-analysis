import React, { createContext, useState, useContext } from 'react';

const QueryResultContext = createContext();

export function QueryResultProvider({ children }) {
    const [result, setResult] = useState(null);

    return (
        <QueryResultContext.Provider value={{ result, setResult }}>
            {children}
        </QueryResultContext.Provider>
    );
}

export function useQueryResult() {
    return useContext(QueryResultContext);
}