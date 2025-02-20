import styles from "./TopBar.module.css";
import { useAppContext } from '../AppContext';

function TopBar() {
    const { query, setQuery } = useAppContext(); 

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('searchTerm');
        setQuery(searchTerm);
    };

    return (
        <div className={styles.bar}>
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
