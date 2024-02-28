import { useLocation, Link } from "react-router-dom";
import './lognav.css';
import { useState } from "react";


const LogNav = ({ children }) => {
    const location = useLocation();
    const [auth, setIsAuth] = useState(!!localStorage.getItem('access_token'))
    return (
        <div className="main__container">
            {children}
            <div className="main__container-links">
                {!auth && location.pathname === "/Login" ? (
                    <h5>Not a member yet? <Link to={"/signup"} style={{WebkitTextFillColor: "black", fontStyle: "italic", fontWeight: "450"}}>Register!</Link></h5>
                ) : (
                    <h5>Already have an account? <Link to={"/Login"} style={{WebkitTextFillColor: "black", fontStyle: "italic", fontWeight: "450"}}>Login here!</Link></h5>
                )}
            </div>
        </div>
    )
}

export default LogNav;