import React, {
    useEffect,
    useState
} from "react";

import {
    useLocation
} from "react-router-dom";

import "./Footer.css";


export default function Footer() {

    const location =
        useLocation();


    /* =========================================================
       AUTHORITY
    ========================================================= */

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


    /* =========================================================
       PAGE ROUTE
    ========================================================= */

    const isPageOpened =
        /^\/user-homepage\/view-page\/[^/]+$/
            .test(location.pathname);


    /* =========================================================
       PAGE STATE
    ========================================================= */

    const [pageStatus, setPageStatus] =
        useState("PSV");


    const [editMode, setEditMode] =
        useState(false);


    /* =========================================================
       LOGGING
    ========================================================= */

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

        console.log(
            "Request",
            request
        );

        console.log(
            "Response",
            response
        );

        console.log(
            "Status Code",
            status
        );

        console.groupEnd();
    };


    /* =========================================================
       STATUS EVENT
    ========================================================= */

    useEffect(() => {

        const handlePageStatusChange =
            event => {

                const status =
                    event.detail?.status ||
                    "PSV";


                setPageStatus(
                    status
                );


                if (status !== "PSV") {

                    setEditMode(false);

                    window.dispatchEvent(
                        new CustomEvent(
                            "pageEditModeChanged",
                            {
                                detail: {
                                    editMode: false
                                }
                            }
                        )
                    );
                }
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


    /* =========================================================
       EDIT MODE EVENT
    ========================================================= */

    useEffect(() => {

        const handleEditModeChange =
            event => {

                const newEditMode =
                    event.detail?.editMode === true;

                setEditMode(
                    newEditMode
                );
            };


        window.addEventListener(
            "pageEditModeChanged",
            handleEditModeChange
        );


        return () => {

            window.removeEventListener(
                "pageEditModeChanged",
                handleEditModeChange
            );
        };

    }, []);


    /* =========================================================
       RESET WHEN LEAVING PAGE
    ========================================================= */

    useEffect(() => {

        if (!isPageOpened) {

            setPageStatus(
                "PSV"
            );

            setEditMode(
                false
            );
        }

    }, [isPageOpened]);


    /* =========================================================
       STATUS LABEL
    ========================================================= */

    const getStatusLabel =
        status => {

            const statusMap = {

                PSV:
                    "Saved",

                PPB:
                    "Published",

                PSA:
                    "Saved Archived",

                PPA:
                    "Published Archived"
            };


            return (
                statusMap[status] ||
                status ||
                "Unknown"
            );
        };


    /* =========================================================
       STATUS CLASS
    ========================================================= */

    const getStatusClass =
        status => {

            const statusMap = {

                PSV:
                    "saved-status",

                PPB:
                    "published-status",

                PSA:
                    "saved-archived-status",

                PPA:
                    "published-archived-status"
            };


            return (
                statusMap[status] ||
                "default-status"
            );
        };


    /* =========================================================
       STATUS FLAGS
    ========================================================= */

    const isArchived =
        pageStatus === "PSA" ||
        pageStatus === "PPA";


    const isSaved =
        pageStatus === "PSV";


    const isPublished =
        pageStatus === "PPB";


    /* =========================================================
       ACTION DISPATCH
    ========================================================= */

    const dispatchPageAction = ({
        action,
        buttonNo,
        buttonName
    }) => {

        const request = {

            action:
                "Page Footer Button Click",

            pageAction:
                action,

            buttonNo,

            buttonName,

            pageStatus,

            editMode
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
                        buttonName,
                        pageStatus,
                        editMode
                    }
                }
            )
        );
    };


    /* =========================================================
       UI
    ========================================================= */

    return (

        <footer className="footer">


            {/* =====================================================
               LEFT
            ===================================================== */}

            <div className="footer-left">

                {isUserPortal &&
                    isPageOpened && (

                    <div className="footer-status-section">

                        <span className="footer-status-label">
                            Page Status
                        </span>


                        <span
                            className={
                                `footer-status-value ${getStatusClass(
                                    pageStatus
                                )}`
                            }
                        >
                            {
                                getStatusLabel(
                                    pageStatus
                                )
                            }
                        </span>

                    </div>
                )}

            </div>


            {/* =====================================================
               CENTER
            ===================================================== */}

            <div className="footer-center">

                {isUserPortal &&
                    isPageOpened && (

                    <>

                        {/* COPY */}

                        <button
                            type="button"
                            className="footer-btn copy"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "copy",

                                    buttonNo:
                                        "FB45",

                                    buttonName:
                                        "Copy Page Details Button"
                                })
                            }
                        >
                            Copy Details
                        </button>


                        {/* ATTACH */}

                        <button
                            type="button"
                            className="footer-btn attach"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "attach",

                                    buttonNo:
                                        "FB46",

                                    buttonName:
                                        "Attach File Button"
                                })
                            }
                            disabled={
                                !isSaved ||
                                !editMode ||
                                isArchived
                            }
                        >
                            Attach File
                        </button>


                        {/* SAVE */}

                        <button
                            type="button"
                            className="footer-btn save"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "save",

                                    buttonNo:
                                        "FB40",

                                    buttonName:
                                        "Save Button"
                                })
                            }
                            disabled={
                                !isSaved ||
                                !editMode
                            }
                        >
                            Save
                        </button>


                        {/* EDIT */}

                        <button
                            type="button"
                            className="footer-btn edit"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "edit",

                                    buttonNo:
                                        "FB41",

                                    buttonName:
                                        "Edit Button"
                                })
                            }
                            disabled={
                                !isSaved ||
                                editMode
                            }
                        >
                            {
                                editMode
                                    ? "Editing"
                                    : "Edit"
                            }
                        </button>


                        {/* PUBLISH */}

                        <button
                            type="button"
                            className="footer-btn publish"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "publish",

                                    buttonNo:
                                        "FB42",

                                    buttonName:
                                        "Publish MOM Button"
                                })
                            }
                            disabled={
                                !isSaved ||
                                editMode
                            }
                        >
                            {
                                isPublished
                                    ? "Published"
                                    : "Publish"
                            }
                        </button>


                        {/* ARCHIVE */}

                        <button
                            type="button"
                            className="footer-btn archive"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "archive",

                                    buttonNo:
                                        "FB43",

                                    buttonName:
                                        "Archive Button"
                                })
                            }
                            disabled={
                                isArchived ||
                                editMode
                            }
                        >
                            Archive
                        </button>


                        {/* UNARCHIVE */}

                        <button
                            type="button"
                            className="footer-btn unarchive"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "unarchive",

                                    buttonNo:
                                        "FB44",

                                    buttonName:
                                        "Unarchive Button"
                                })
                            }
                            disabled={
                                !isArchived ||
                                editMode
                            }
                        >
                            Unarchive
                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"
                            className="footer-btn cancel"
                            onClick={() =>
                                dispatchPageAction({
                                    action:
                                        "cancel",

                                    buttonNo:
                                        "BB18",

                                    buttonName:
                                        editMode
                                            ? "Cancel Edit Button"
                                            : "Cancel Button"
                                })
                            }
                        >
                            {
                                editMode
                                    ? "Cancel Edit"
                                    : "Cancel"
                            }
                        </button>

                    </>
                )}

            </div>

            <div className="footer-right">

            </div>

        </footer>
    );
}