import React from "react";
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/Login")
    }

    const handleSignUp = () => {
        navigate("/signup")
    }
    return (
        <div className="maindiv">
            <div className="div1">
                <h1></h1>
                <button onClick={handleLogin}>Sign in</button>
            </div>
            <div className="div2">
                <div className="title">
                    <h1>AJALI</h1>
                </div>
                <div className="textp">
                    <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>
                <div className="buttondiv"><button onClick={handleSignUp}>Sign up</button></div>
            </div>
        </div>
    )
}

export default Home;