import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TopBar.module.css";
import { useAppContext } from '../AppContext';
import { useEffect } from "react";

function TopBar() {
    const { query, setQuery, viewState, setViewState } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
        if (location.pathname === "/home") {
            setViewState("CONTENT");
        } else if (location.pathname === "/trends") {
            setViewState("GRAPH");
        }
    }, [location.pathname, setViewState]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('searchTerm');
        setQuery(searchTerm);
    };

    const handleViewStateChange = (e) => {
        const newView = e.target.value;
        setViewState(newView);

        if (newView === 'CONTENT') {
            navigate("/home");
        } else if (newView === 'GRAPH') {
            navigate("/trends");
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
                <option value="CONTENT">Home</option>
                <option value="GRAPH">Trends</option>
            </select>

            <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
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
        </div>
    );
}

export default TopBar;
