import React,{useEffect,useState} from "react";
import {useLocation} from "react-router-dom";
import "./Footer.css";

export default function Footer(){

    const location=useLocation();

    const authorityString=
        localStorage.getItem("authority")||"";

    const authorities=
        authorityString
            .split(",")
            .map(role=>
                role.trim().toUpperCase()
            );

    const isAdmin=
        authorities.includes("ADMIN");

    const isSuperUser=
        authorities.includes("SUPER_USER");

    const isUser=
        authorities.includes("USER");

    const isUserPortal=
        !isAdmin&&
        (isUser||isSuperUser);

    const isPageOpened=
        /^\/user-homepage\/view-page\/[^/]+$/.test(
            location.pathname
        );

    const [pageStatus,setPageStatus]=
        useState("PSV");

    const [editMode,setEditMode]=
        useState(false);

    const logButtonEvent=({
        buttonNo,
        buttonName,
        request,
        response,
        status
    })=>{

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

    useEffect(()=>{

        const handlePageStatusChange=event=>{

            const status=
                event.detail?.status||"PSV";

            setPageStatus(status);

            if(
                status!=="PSV"
            ){

                setEditMode(false);
            }
        };

        window.addEventListener(
            "pageStatusChanged",
            handlePageStatusChange
        );

        return()=>{

            window.removeEventListener(
                "pageStatusChanged",
                handlePageStatusChange
            );
        };

    },[]);

    useEffect(()=>{

        const handleEditModeChange=event=>{

            setEditMode(
                event.detail?.editMode===true
            );
        };

        window.addEventListener(
            "pageEditModeChanged",
            handleEditModeChange
        );

        return()=>{

            window.removeEventListener(
                "pageEditModeChanged",
                handleEditModeChange
            );
        };

    },[]);

    useEffect(()=>{

        if(!isPageOpened){

            setPageStatus("PSV");
            setEditMode(false);
        }

    },[isPageOpened]);

    const getStatusLabel=status=>{

        const statusMap={
            PSV:"Saved",
            PPB:"Published",
            PSA:"Saved Archived",
            PPA:"Published Archived"
        };

        return statusMap[status]||status;
    };

    const getStatusClass=status=>{

        const statusMap={
            PSV:"saved-status",
            PPB:"published-status",
            PSA:"saved-archived-status",
            PPA:"published-archived-status"
        };

        return statusMap[status]||"default-status";
    };

    const isArchived=
        pageStatus==="PSA"||
        pageStatus==="PPA";

    const isSaved=
        pageStatus==="PSV";

    const dispatchPageAction=({
        action,
        buttonNo,
        buttonName
    })=>{

        const request={
            action:"Page Footer Button Click",
            pageAction:action,
            buttonNo,
            buttonName,
            pageStatus,
            editMode
        };

        const response={
            message:
                `${buttonName} triggered successfully`
        };

        logButtonEvent({
            buttonNo,
            buttonName,
            request,
            response,
            status:200
        });

        window.dispatchEvent(
            new CustomEvent(
                "footerPageAction",
                {
                    detail:{
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

    return(

        <footer className="footer">

            <div className="footer-left">

                {isUserPortal&&isPageOpened&&(

                    <div className="footer-status-section">

                        <span className="footer-status-label">
                            Page Status
                        </span>

                        <span
                            className={
                                `footer-status-value ${getStatusClass(pageStatus)}`
                            }
                        >
                            {getStatusLabel(pageStatus)}
                        </span>

                    </div>

                )}

            </div>

            <div className="footer-center">

                {isUserPortal&&isPageOpened&&(

                    <>

                        <button
                            type="button"
                            className="footer-btn copy"
                            onClick={()=>
                                dispatchPageAction({
                                    action:"copy",
                                    buttonNo:"FB45",
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
                            onClick={()=>
                                dispatchPageAction({
                                    action:"attach",
                                    buttonNo:"FB46",
                                    buttonName:
                                        "Attach File Button"
                                })
                            }
                            disabled={
                                !isSaved||
                                !editMode
                            }
                        >
                            Attach File
                        </button>

                        <button
                            type="button"
                            className="footer-btn save"
                            onClick={()=>
                                dispatchPageAction({
                                    action:"save",
                                    buttonNo:"FB40",
                                    buttonName:
                                        "Save Button"
                                })
                            }
                            disabled={
                                !isSaved||
                                !editMode
                            }
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            className="footer-btn edit"
                            onClick={()=>
                                dispatchPageAction({
                                    action:"edit",
                                    buttonNo:"FB41",
                                    buttonName:
                                        "Edit Button"
                                })
                            }
                            disabled={
                                !isSaved||
                                editMode
                            }
                        >
                            {editMode
                                ? "Editing"
                                : "Edit"}
                        </button>

                        <button
                            type="button"
                            className="footer-btn publish"
                            onClick={()=>
                                dispatchPageAction({
                                    action:"publish",
                                    buttonNo:"FB42",
                                    buttonName:
                                        "Publish MOM Button"
                                })
                            }
                            disabled={
                                !isSaved
                            }
                        >
                            Publish
                        </button>

                        {isArchived?(

                            <button
                                type="button"
                                className="footer-btn unarchive"
                                onClick={()=>
                                    dispatchPageAction({
                                        action:"unarchive",
                                        buttonNo:"FB44",
                                        buttonName:
                                            "Unarchive Button"
                                    })
                                }
                            >
                                Unarchive
                            </button>

                        ):(

                            <button
                                type="button"
                                className="footer-btn archive"
                                onClick={()=>
                                    dispatchPageAction({
                                        action:"archive",
                                        buttonNo:"FB43",
                                        buttonName:
                                            "Archive Button"
                                    })
                                }
                            >
                                Archive
                            </button>

                        )}

                        <button
                            type="button"
                            className="footer-btn cancel"
                            onClick={()=>
                                dispatchPageAction({
                                    action:"cancel",
                                    buttonNo:"BB18",
                                    buttonName:
                                        editMode
                                            ? "Cancel Edit Button"
                                            : "Cancel Button"
                                })
                            }
                        >
                            {editMode
                                ? "Cancel Edit"
                                : "Cancel"}
                        </button>

                    </>

                )}

            </div>

            <div className="footer-right">

            </div>

        </footer>
    );
}