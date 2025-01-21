import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/core.css'; // Updated CSS import
import '../styles/icon-font.min.css'; // Updated CSS import
import '../styles/style.css'; // Updated CSS import
import logo from '../images/deskapp-logo.svg'; // Updated image import
import photo1 from '../images/photo1.jpg'; // Updated image import
import '../styles/dropdown-style.css';  // Import the new CSS for dropdown and layout

const Base = ({ children }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false); // To manage dropdown visibility
    const username = localStorage.getItem('username'); // Get username from localStorage

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };

    // Close the dropdown if clicked outside
    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    // Event listener to detect clicks outside the dropdown
    React.useEffect(() => {
        // Function to handle outside click
        const handleClickOutside = (event) => {
            if (event.target.closest('.dropdown') === null) {
                closeDropdown();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>DeskApp - React Dashboard</title>
                <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>

            <header className="header">
                <div className="header-left">
                    <div className="menu-icon dw dw-menu"></div>
                    <div className="search-toggle-icon dw dw-search2"></div>
                    <div className="header-search">
                        <form>
                            <input type="text" className="form-control" placeholder="Search Here" />
                        </form>
                    </div>
                </div>

                <div className="header-right">
                    {username ? (
                        <div className="user-info-dropdown">
                            <div className="dropdown">
                                <span
                                    className="dropdown-toggle user-name"
                                    onClick={toggleDropdown} // Toggle dropdown on click
                                >
                                    <span className="user-icon">
                                        <img src={photo1} alt="" />
                                    </span>
                                    <span>{username}</span> {/* Display the username */}
                                </span>

                                {/* Dropdown menu, conditionally rendered based on state */}
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item">
                                            <i className="dw dw-user1"></i> PROFILE
                                        </Link>
                                        <Link to='/' className="dropdown-item">
                                            <i className="dw dw-logout"></i> Log Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="user-info-dropdown">
                            <Link to="/login" className="dropdown-toggle">
                                <span className="user-name">Login</span>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <div className="left-side-bar">
                <div className="brand-logo">
                    <Link to="/">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>
                <div className="menu-block">
                    <ul>
                        <li>
                            <Link to="/dashboard">Inventory Data</Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <Link to="/dash">Summary of Data</Link> {/* Link to the /dash route */}
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <Link to="/add-inventory-data">Add Inventory Data</Link>
                        </li>
                    </ul>
                    

                </div>
            </div>

            <div className="main-content">
                <div className="pd-ltr-20">{children}</div>
            </div>
        </div>
    );
};

export default Base;
