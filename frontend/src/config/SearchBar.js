import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
    const inputRef = useRef(null);

    const handleIconClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="search-bar">
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="search-icon"
                onClick={handleIconClick}
            />
            <input
                ref={inputRef}
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;