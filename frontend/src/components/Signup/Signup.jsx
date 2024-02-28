import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import './Signup.css';
import LogNav from "../LogNav/lognav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const navigate = useNavigate()

  const handleSubmit = async (event) => {
      event.preventDefault();

      try {
          const response = await fetch("/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  username: username,
                  email: email,
                  password: password,
              }),
          });

          if (!response.ok) {
              throw new Error("Error while registering user");
          }

          const data = await response.json();
          console.log(data)
          setUserName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigate("/Login")
      } catch (error) {
          console.error("Signup failed", error.message)
      }
  }; 


    return (
        <LogNav>
            <form className="forms" onSubmit={handleSubmit}>
            <div className="forms__text">
                <h1>Register</h1>
                <h3>Please enter your Username, Email and Password</h3>
            </div>
            <div className="user1div">
                <input
                  type="username"
                  className="userinputs"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUserName(event.target.value)}
                />
                <FontAwesomeIcon className="user1" icon={faUser} />
                </div>                
                <div className="user2div">
                <input
                  type="email"
                  className="emailinput"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <FontAwesomeIcon className="user2" icon={faUser} />
                </div>
                <div className="lock1div">
                <input
                  type="password"
                  className="passwordinput"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <FontAwesomeIcon className="lock1" icon={faLock} />
                </div>
                <div className="lock2div">
                <input
                  type="password"
                  className="confirmpasswordinput"
                  id="confirmpassword"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <FontAwesomeIcon className="lock2" icon={faLock} />
                </div>
                <button className="loginbtn" type="submit">Register</button>
            </form>
        </LogNav>
    )
}

export default Signup;    
