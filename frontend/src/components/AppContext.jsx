import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const [queryResult, setQueryResult] = useState(null);
    const [queryParams, setQueryParams] = useState(null)
    const [query, setQuery] = useState(null)
    const [viewState, setViewState] = useState("CONTENT");
    useEffect(() => {
        if (query) {
            fetchData();
        }
    }, [query, queryParams]);
    const fetchData = () => {
        console.log("Fetching data with params:")
        console.log("Query: " + query)
        console.log("Params:" + queryParams)

        const requestBody = {
            ...queryParams,
            query: query 
        };
        fetch('http://localhost:5000/getData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Invalid POST request");
                }
                return response.json();
            })
            .then(result => {
                console.log('Received JSON from server:', result);
                setQueryResult(result);
            })
            .catch(error => {
                console.error(error);
                alert("Error reaching server, please try again later.")
            });
    };
    return (
        <AppContext.Provider value={{ queryResult, queryParams, setQueryParams, viewState, setViewState, query, setQuery }}>
            {children}
        </AppContext.Provider>
    );
}
