import React from "react";
import "./Footer.css";

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-left">
                <span>Centralized MOM Management System</span>
            </div>
            <div className="footer-center">
                <span>Version 1.0.0</span>
            </div>
            <div className="footer-right">
                <span>© {currentYear}</span>
            </div>
        </footer>
    );
}