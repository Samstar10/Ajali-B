import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import './Login.css';
import LogNav from "../LogNav/lognav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const Login = ({authenticated, setIsAuthenticated}) => {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [fontDisplay, setFontDisplay] = useState(true)
    const [fontDisplay2, setFontDisplay2] = useState(true)

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFontDisplay(true)
        setFontDisplay2(true)

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error("Error while validating user");
            }

            const data = await response.json();
            setUserName("");
            setPassword("");
            const access = data.access_token;
            localStorage.setItem("access_token", access);
            setIsAuthenticated(true)

            navigate("/dashboard/myreports")
        } catch (error) {
            console.error("login failed", error.message)
        }
    };

    return (
        <LogNav>
            <form className="loginform" onSubmit={handleSubmit}>
                <div className="loginform__text">
                    <h1>Login</h1>
                    <h3>Please enter your email and password</h3>
                </div>
                <div className="emaildiv">
                    <input
                        type="username"
                        className="emailinput"
                        id="email"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(event) => {
                            setUserName(event.target.value);
                            setFontDisplay(false);
                        }}
                    />
                {fontDisplay && (
                    <FontAwesomeIcon className="fauser" icon={faUser} />
                )}
                </div>
                <div className="passwordiv">
                    <input
                        type="password"
                        className="passwordinput"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setFontDisplay2(false);
                        }}
                    />
                    {fontDisplay2 && (
                        <FontAwesomeIcon className="falock" icon={faLock} />
                    )}
                    <div className="linkdiv">
                        <Link to={"/ResetPassword"} style={{ WebkitTextFillColor: "#fff" }}>Forgot Password?</Link>
                    </div>
                </div>
                <button className="loginbutton" type="submit">Login</button>
            </form>
        </LogNav>
    )
}

export default Login;