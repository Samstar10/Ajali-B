import React, { useState } from "react";
import './ResetPassword.css';
import LogNav from "../LogNav/lognav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match")
            return;
        }

        try {
            const response = await fetch('/signup', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: newPassword,
                }),
            });
            if (!response.ok) {
                throw new Error('Error while updating password')
            }
            const data = await response.json()
            console.log(data)
            setError("")
            navigate('/Login')
        }
        catch (error) {
            console.error("Update failed", error.message)
        }
    };

    return (
        <LogNav>
            <form className="resetform" onSubmit={handleResetPassword}>
                <div className="resetformdiv1">
                    <div className="resetform__text">
                    <h1>Reset Your Password</h1>
                    <h5>Please enter your email and new Password</h5>
                    </div>
                    <input
                        type="email"
                        className="emailinput"
                        id="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <FontAwesomeIcon className="fause" icon={faUser} />
                </div>
                <div className="resetformdiv2">
                    <input
                        type="password"
                        className="passwordinput"
                        id="newpassword"
                        placeholder="Password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <FontAwesomeIcon className="faloc" icon={faLock} />
                </div>
                <div className="resetformdiv3">
                    <input
                        type="password"
                        className="confirmnewpasswordinput"
                        id="confirmnewpassword"
                        placeholder="Confirm-password"
                        value={confirmNewPassword}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                    />
                    <FontAwesomeIcon className="faloc1" icon={faLock} />
                </div>
                {error && (<div style={{color: "red"}}>{error}</div>)}
                <button className="resetbtn" type="submit" style={{cursor: "pointer"}}>Submit</button>
            </form>
        </LogNav>
    )    
}

export default ResetPassword;