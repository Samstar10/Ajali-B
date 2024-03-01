import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarBurst } from "@fortawesome/free-solid-svg-icons";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ setIsAuthenticated }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const [toggleMenu, setToggleMenu] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role
            role === "admin" ? setIsAdmin(true) : setIsAdmin(false)
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false)
        navigate('/')
    }


    return (
        <div>
            <div className="dashboard__container">
                <div className="dashboard__container-nav">
                    <nav>
                        <h1>AJALI</h1>
                        <div id="aj">
                        {isAdmin ? (
                            <div className={location.pathname === '/dashboard/dash' ? "active-div" : "divac1"}>
                                <NavLink to='dash'><FontAwesomeIcon className="icon" icon={faBusinessTime} />User Reports</NavLink>
                            </div>
                        ) : (<div></div>)}
                        <div className={location.pathname === '/dashboard/reportaccident' ? "active-div" : "divac2"}>
                            <NavLink to='reportaccident'><FontAwesomeIcon className="icon" icon={faCarBurst} />Report Accident</NavLink>
                        </div>
                        <div className={location.pathname === '/dashboard/myreports' ? "active-div" : "divac3"}>
                            <NavLink to='myreports'><FontAwesomeIcon className="icon" icon={faFileSignature} />My Reports</NavLink>
                        </div>
                        <div id="div0">
                            <p>Have any problems with using the app? Feel free to reach out to us using the link below.</p>
                            <button>
                                <NavLink to='contact'>Contact us</NavLink>
                            </button>
                        </div>
                        <div className="signout">
                            <button onClick={handleLogout}>Sign Out</button>
                        </div>
                        </div>
                        <div id="mobile__menu">
                            {toggleMenu
                                ? <FontAwesomeIcon className="xmark" icon={faXmark} color="#fff" size={33} onClick={() => setToggleMenu(false)} />
                                : <FontAwesomeIcon className="barmark" icon={faBars} color="#fff" size={33} onClick={() => setToggleMenu(true)} />}
                            {toggleMenu && (
                                <div id="dropdown__menu-container">
                                        <div>
                                            <NavLink to='reportaccident'>Report Accident</NavLink>
                                        </div>
                                        <div>
                                            <NavLink to='myreports'>My Reports</NavLink>
                                        </div>
                                        <div className="signout">
                                            <button onClick={handleLogout}>Sign Out</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
                <main className="dashboard__container-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Dashboard;