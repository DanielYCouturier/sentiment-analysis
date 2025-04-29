import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const [queryResult, setQueryResult] = useState([]);
    const [queryParams, setQueryParams] = useState(null)
    const [query, setQuery] = useState(null)
    const [viewState, setViewState] = useState("CONTENT");
    const [corrections, setCorrections] = useState({});

    useEffect(() => {
        if (query) {
            fetchData();
        }
    }, [query, queryParams]);
    useEffect(() => {
        if (queryResult) {
            const urls = queryResult
                .filter(obj => obj.sentiment === undefined)
                .map(obj => obj.source_url);
            const batch = urls.slice(0, 10)
            if (batch.length > 0) {
                fetchSentiments(batch)
            }
        }
    }, [queryResult])
    const fetchData = () => {
        console.log("Fetching data with params:")
        console.log("Query: " + query)
        console.log("Params:" + queryParams)

        const requestBody = {
            ...queryParams,
            query: query
        };
        fetch('http://backend.sentanalysis.us/getData', {
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
                
                const keyword = queryParams?.keyword?.toLowerCase();
            
                const filtered = keyword
                    ? result.filter(item =>
                          item.content_body?.toLowerCase().includes(keyword)
                      )
                    : result;
            
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                setQueryResult(filtered);
            })
            .catch(error => {
                console.error(error);
                alert("Error reaching server, please try again later.")
            });
    };
    const fetchSentiments = async (urls) => {
        try {
            const apiUrl =
                queryParams?.model === 'CHATGPT'
                    ? 'http://backend.sentanalysis.us/classifyGPT'
                    : queryParams?.model === 'GEMINI'
                        ? 'http://backend.sentanalysis.us/classifyGemini'
                        : queryParams?.model === 'USER'
                            ? 'http://backend.sentanalysis.us/classifyUser'
                            : 'http://backend.sentanalysis.us/classifyData';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ urls: urls })
            });
            if (!response.ok) {
                throw new Error("Invalid POST request");
            }
            const sentimentData = await response.json();
            console.log('Received sentiment data:', sentimentData);

            setQueryResult(prevResult =>
                prevResult
                    ? prevResult.map(obj =>
                        sentimentData[obj.source_url] !== undefined
                            ? { ...obj, sentiment: sentimentData[obj.source_url] }
                            : obj
                    )
                    : []
            );
        } catch (error) {
            console.error(error);
        };


    };

    return (
        <AppContext.Provider value={{ queryResult, setQueryResult, queryParams, setQueryParams, viewState, setViewState, query, setQuery, fetchData, corrections, setCorrections }}>
            {children}
        </AppContext.Provider>
    );
}
