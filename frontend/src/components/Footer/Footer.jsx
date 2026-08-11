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

    const logButtonEvent = ({
        buttonNo,
        buttonName,
        request,
        response,
        status
    }) => {
        console.group(`${buttonNo} - ${buttonName}`);

        console.log("Request");
        console.log(request);

        console.log("Response");
        console.log(response);

        console.log("Status Code");
        console.log(status);

        console.groupEnd();
    };

    const handleButtonClick = ({
        buttonNo,
        buttonName
    }) => {
        logButtonEvent({
            buttonNo,
            buttonName,
            request: {
                action: "Button Click",
                buttonNo,
                buttonName
            },
            response: {
                message: `${buttonName} clicked successfully`
            },
            status: 200
        });
    };

    return (
        <footer className="footer">
            <div className="footer-left">
                {isUserPortal && (
                    <>
                        <button
                            className="footer-btn status"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB44",
                                    buttonName: "Page Status Tab"
                                })
                            }
                        >
                            Page Status
                        </button>
                        <button
                            className="footer-btn copy"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB45",
                                    buttonName: "Copy Page Details Button"
                                })
                            }
                        >
                            Copy Details
                        </button>
                        <button
                            className="footer-btn attach"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB46",
                                    buttonName: "Attach File Button"
                                })
                            }
                        >
                            Attach File
                        </button>
                    </>
                )}
            </div>
            <div className="footer-center">
                {isUserPortal && (
                    <>
                        <button
                            className="footer-btn save"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB40",
                                    buttonName: "Save Button"
                                })
                            }
                        >
                            Save
                        </button>
                        <button
                            className="footer-btn edit"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB41",
                                    buttonName: "Edit Button"
                                })
                            }
                        >
                            Edit
                        </button>
                        <button
                            className="footer-btn publish"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB42",
                                    buttonName: "Publish MOM Button"
                                })
                            }
                        >
                            Publish
                        </button>
                        <button
                            className="footer-btn archive"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "FB43",
                                    buttonName: "Archive Button"
                                })
                            }
                        >
                            Archive
                        </button>
                        <button
                            className="footer-btn cancel"
                            onClick={() =>
                                handleButtonClick({
                                    buttonNo: "BB18",
                                    buttonName: "Cancel Button"
                                })
                            }
                        >
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