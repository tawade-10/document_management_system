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
       BUTTON LOGGING
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
       PAGE STATUS EVENT
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


                /*
                 * Page can only be edited while it is
                 * in Saved (PSV) status.
                 *
                 * Once published or archived,
                 * editing is automatically disabled.
                 */

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
       RESET WHEN LEAVING VIEW PAGE
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
       FOOTER ACTION DISPATCH
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
                `${buttonName} triggered successfully`,

            action,

            buttonNo,

            buttonName
        };


        /*
         * Universal console logging
         */

        logButtonEvent({
            buttonNo,
            buttonName,
            request,
            response,
            status: 200
        });


        /*
         * Notify the View Page component
         * about the Footer action.
         */

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


                        {/* =================================================
                           FB68 - COPY PAGE DETAILS
                        ================================================= */}

                        <button
                            type="button"
                            className="footer-btn copy"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "copy",

                                    buttonNo:
                                        "FB68",

                                    buttonName:
                                        "Copy Page Details Button"

                                })
                            }
                        >
                            Copy Details
                        </button>


                        {/* =================================================
                           FB69 - ATTACH FILE
                        ================================================= */}

                        <button
                            type="button"
                            className="footer-btn attach"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "attach",

                                    buttonNo:
                                        "FB69",

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


                        {/* =================================================
                           FB70 - SAVE
                        ================================================= */}

                        <button
                            type="button"
                            className="footer-btn save"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "save",

                                    buttonNo:
                                        "FB70",

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


                        {/* =================================================
                           FB71 - EDIT
                        ================================================= */}

                        <button
                            type="button"
                            className="footer-btn edit"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "edit",

                                    buttonNo:
                                        "FB71",

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


                        {/* =================================================
                           FB72 - PUBLISH MOM
                        ================================================= */}

                        <button
                            type="button"
                            className="footer-btn publish"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "publish",

                                    buttonNo:
                                        "FB72",

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


                        {/* =================================================
                           FB73 - ARCHIVE
                        ================================================= */}

                        <button
                            type="button"
                            className="footer-btn archive"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "archive",

                                    buttonNo:
                                        "FB73",

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
                        <button
                            type="button"
                            className="footer-btn unarchive"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "unarchive",

                                    buttonNo:
                                        "FB74",

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
                        <button
                            type="button"
                            className="footer-btn cancel"
                            onClick={() =>
                                dispatchPageAction({

                                    action:
                                        "cancel",

                                    buttonNo:
                                        "FB75",

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