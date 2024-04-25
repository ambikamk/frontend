import React, { useState } from "react"; // Import React
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "../components/LoadingIndicator";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Uncommented loading state
    const navigate = useNavigate();

    const route = "/api/user/register/";
    const method = "register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, email, password });
            console.log(res.data); 
            
            // Log the response data
            // Display a success message or handle the response accordingly
            
            alert("Registration successful");
            navigate("/login");
            
            // Navigate to login page after successful registration
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again."); 
            
            // Display an error message
        } finally {
            setLoading(false); 
            // Set loading to false after request completion
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Signup</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                Signup
            </button>
            <a href="/">cancel</a>

        </form>
    );
}

export default Register;
