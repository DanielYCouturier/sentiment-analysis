import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TopBar.module.css";
import { useAppContext } from '../AppContext';
import { useEffect } from "react";
function TopBar() {
    const { query, setQuery, viewState, setViewState, fetchData } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/search") {
            setViewState("CONTENT");
        } else if (location.pathname === "/trends") {
            setViewState("GRAPH");
        } else if (location.pathname === "/home") {
            setViewState("DOCS");
        }

    }, [location.pathname, setViewState]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('searchTerm');
        setQuery(searchTerm);
        if(searchTerm==query){
            fetchData()
        }
    };

    const handleViewStateChange = (e) => {
        const newView = e.target.value;
        setViewState(newView);

        if (newView === 'CONTENT') {
            navigate("/search");
        } else if (newView === 'GRAPH') {
            navigate("/trends");
        } else if (newView === 'DOCS') {
            navigate("/home");
        }
    };

    return (
        <div className={styles.bar}>
            <select
                id="dropdown"
                name="dropdown"
                value={viewState}
                onChange={handleViewStateChange}
                className={styles.navDropdown}
            >
                <option value="DOCS">Home</option>
                <option value="CONTENT">Search</option>
                <option value="GRAPH">Trends</option>
            </select>

            {
                location.pathname === "/home"
                    ? <h2>Sentiment Analysis for Software Feedback</h2>
                    : <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Search..."
                            className={styles.searchInput}
                            defaultValue={query || ""}
                        />
                        <button
                            type="submit"
                            className={styles.searchButton}
                        >
                            <img
                                src="https://www.freeiconspng.com/uploads/search-icon-png-21.png"
                                alt="search"
                            />
                        </button>
                    </form>
            }
        </div>
    );
}

export default TopBar;
