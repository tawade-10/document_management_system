import React from "react";
import "./Footer.css";

export default function Footer() {

    const authorityString = localStorage.getItem("authority") || "";

    const authorities = authorityString
        .split(",")
        .map(role => role.trim().toUpperCase());

    const isAdmin = authorities.includes("ADMIN");
    const isSuperUser = authorities.includes("SUPER_USER");
    const isUser = authorities.includes("USER");

    const isUserPortal = !isAdmin && (isUser || isSuperUser);

    return (

        <footer className="footer">

            <div className="footer-left">

                {isUserPortal && (
                    <>
                        <button className="footer-btn status">
                            Page Status
                        </button>

                        <button className="footer-btn copy">
                            Copy Details
                        </button>

                        <button className="footer-btn attach">
                            Attach File
                        </button>
                    </>
                )}

            </div>

            <div className="footer-center">

                {isAdmin && (
                    <>
                        <button className="footer-btn save">
                            Save User
                        </button>

                        <button className="footer-btn activate">
                            Activate
                        </button>

                        <button className="footer-btn deactivate">
                            Deactivate
                        </button>

                        <button className="footer-btn cancel">
                            Cancel
                        </button>
                    </>
                )}

                {isUserPortal && (
                    <>
                        <button className="footer-btn save">
                            Save
                        </button>

                        <button className="footer-btn edit">
                            Edit
                        </button>

                        <button className="footer-btn publish">
                            Publish
                        </button>

                        <button className="footer-btn archive">
                            Archive
                        </button>

                        <button className="footer-btn cancel">
                            Cancel
                        </button>
                    </>
                )}
            </div>
            <div className="footer-right">
                <span className="footer-version">
                    Version 1.0.0
                </span>
            </div>
        </footer>
    );
}