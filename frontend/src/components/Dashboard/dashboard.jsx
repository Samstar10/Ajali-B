import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarBurst } from "@fortawesome/free-solid-svg-icons";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ setIsAuthenticated }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const location = useLocation();

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isAdmin = payload.id
            setIsAdmin(isAdmin)
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
                        {isAdmin ? (
                            <div className={location.pathname === '/dashboard/dash' ? "active-div" : "divac1"}>
                                <NavLink to='dash'><FontAwesomeIcon className="icon" icon={faBusinessTime} />Dashboard</NavLink>
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