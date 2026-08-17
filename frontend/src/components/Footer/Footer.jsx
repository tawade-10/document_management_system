import React, { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer() {

    const authorityString =
        localStorage.getItem("authority") || "";

    const authorities =
        authorityString
            .split(",")
            .map(role =>
                role.trim().toUpperCase()
            );

    const isAdmin =
        authorities.includes("ADMIN");

    const isSuperUser =
        authorities.includes("SUPER_USER");

    const isUser =
        authorities.includes("USER");

    const isUserPortal =
        !isAdmin &&
        (isUser || isSuperUser);

    const [pageStatus, setPageStatus] = useState("PSV");

    const logButtonEvent = ({
        buttonNo,
        buttonName,
        request,
        response,
        status
    }) => {

        console.group(
            `${buttonNo} - ${buttonName}`
        );

        console.log("Request");
        console.log(request);

        console.log("Response");
        console.log(response);

        console.log("Status Code");
        console.log(status);

        console.groupEnd();
    };

    useEffect(() => {

        const handlePageStatusChange = event => {

            const status =
                event.detail?.status || "PSV";

            setPageStatus(status);
        };

        window.addEventListener(
            "pageStatusChanged",
            handlePageStatusChange
        );

        return () => {
            window.removeEventListener(
                "pageStatusChanged",
                handlePageStatusChange
            );
        };

    }, []);

    const getStatusLabel = status => {

        const statusMap = {
            PSV: "Saved",
            PPB: "Published",
            PSA: "Saved Archived",
            PPA: "Published Archived"
        };

        return statusMap[status] || status;
    };

    const getStatusClass = status => {

        const statusMap = {
            PSV: "saved-status",
            PPB: "published-status",
            PSA: "saved-archived-status",
            PPA: "published-archived-status"
        };

        return statusMap[status] || "default-status";
    };

    const dispatchPageAction = ({
        action,
        buttonNo,
        buttonName
    }) => {

        const request = {
            action: "Page Footer Button Click",
            pageAction: action,
            buttonNo,
            buttonName
        };

        const response = {
            message:
                `${buttonName} triggered successfully`
        };

        logButtonEvent({
            buttonNo,
            buttonName,
            request,
            response,
            status: 200
        });

        window.dispatchEvent(
            new CustomEvent(
                "footerPageAction",
                {
                    detail: {
                        action,
                        buttonNo,
                        buttonName
                    }
                }
            )
        );
    };

    return (

        <footer className="footer">

            <div className="footer-left">

                {isUserPortal && (

                    <div className="footer-status-section">

                        <span className="footer-status-label">
                            Page Status
                        </span>

                        <span
                            className={`footer-status-value ${getStatusClass(pageStatus)}`}
                        >
                            {getStatusLabel(pageStatus)}
                        </span>

                    </div>

                )}

            </div>

            <div className="footer-center">

                {isUserPortal && (

                    <>

                        <button
                            type="button"
                            className="footer-btn copy"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "copy",
                                    buttonNo: "FB45",
                                    buttonName:
                                        "Copy Page Details Button"
                                })
                            }
                        >
                            Copy Details
                        </button>

                        <button
                            type="button"
                            className="footer-btn attach"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "attach",
                                    buttonNo: "FB46",
                                    buttonName:
                                        "Attach File Button"
                                })
                            }
                        >
                            Attach File
                        </button>

                        <button
                            type="button"
                            className="footer-btn save"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "save",
                                    buttonNo: "FB40",
                                    buttonName:
                                        "Save Button"
                                })
                            }
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            className="footer-btn edit"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "edit",
                                    buttonNo: "FB41",
                                    buttonName:
                                        "Edit Button"
                                })
                            }
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            className="footer-btn publish"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "publish",
                                    buttonNo: "FB42",
                                    buttonName:
                                        "Publish MOM Button"
                                })
                            }
                        >
                            Publish
                        </button>

                        <button
                            type="button"
                            className="footer-btn archive"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "archive",
                                    buttonNo: "FB43",
                                    buttonName:
                                        "Archive Button"
                                })
                            }
                        >
                            Archive
                        </button>

                        <button
                            type="button"
                            className="footer-btn cancel"
                            onClick={() =>
                                dispatchPageAction({
                                    action: "cancel",
                                    buttonNo: "BB18",
                                    buttonName:
                                        "Cancel Button"
                                })
                            }
                        >
                            Cancel
                        </button>

                    </>

                )}

            </div>

            <div className="footer-right">

            </div>

        </footer>
    );
}