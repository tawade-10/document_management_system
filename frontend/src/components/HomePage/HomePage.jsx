import React from "react";
import "./HomePage.css";

export default function HomePage() {
    const API_URL = "http://localhost:8080/api/auth";
    return (
        <div className="home-container">
            <div className="home-card">
                <h1>Home Page</h1>
                <p>Welcome to the User Dashboard.</p>
            </div>
        </div>
    );
}
