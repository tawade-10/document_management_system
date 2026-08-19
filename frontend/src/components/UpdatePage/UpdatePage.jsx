import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { toast } from "react-toastify";

import "./UpdatePage.css";


const API_URL =
    "http://localhost:8080/api/pages";

const USERS_API_URL =
    "http://localhost:8080/api/search/users";

const ATTACHMENTS_API_URL =
    "http://localhost:8080/api/attachments";


export default function UpdatePage() {

    const navigate = useNavigate();
    const { pageId } = useParams();

    const editorRef = useRef(null);
    const participantRef = useRef(null);
    const fileInputRef = useRef(null);

    const token =
        localStorage.getItem("token");


    /* =========================================================
       PAGE DATA
    ========================================================= */

    const [title, setTitle] =
        useState("");

    const [participants, setParticipants] =
        useState([]);

    const [participantInput, setParticipantInput] =
        useState("");

    const [participantSuggestions, setParticipantSuggestions] =
        useState([]);

    const [showParticipantSuggestions, setShowParticipantSuggestions] =
        useState(false);

    const [searchingParticipants, setSearchingParticipants] =
        useState(false);

    const [pageContent, setPageContent] =
        useState("");

    const [pageStatus, setPageStatus] =
        useState("PSV");

    const [attachments, setAttachments] =
        useState([]);


    /* =========================================================
       EDIT MODE
    ========================================================= */

    const [editMode, setEditMode] =
        useState(false);


    /* =========================================================
       ORIGINAL DATA
    ========================================================= */

    const [originalPage, setOriginalPage] =
        useState({
            title: "",
            participants: [],
            pageContent: ""
        });


    /* =========================================================
       LOADING
    ========================================================= */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [publishing, setPublishing] =
        useState(false);

    const [archiving, setArchiving] =
        useState(false);

    const [uploadingAttachment, setUploadingAttachment] =
        useState(false);


    /* =========================================================
       STATUS HELPERS
    ========================================================= */

    const getStatusValue = status => {

        if (typeof status === "string") {
            return status;
        }

        if (status?.statusId) {
            return status.statusId;
        }

        if (status?.id) {
            return status.id;
        }

        return "PSV";
    };


    const getStatusLabel = status => {

        const statusMap = {
            PSV: "Saved",
            PPB: "Published",
            PSA: "Saved Archived",
            PPA: "Published Archived"
        };

        return (
            statusMap[status] ||
            status ||
            "Unknown"
        );
    };


    const isArchived =
        pageStatus === "PSA" ||
        pageStatus === "PPA";


    const isSaved =
        pageStatus === "PSV";


    const isPublished =
        pageStatus === "PPB";


    const isBusy =
        saving ||
        publishing ||
        archiving ||
        uploadingAttachment;


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
       EVENTS
    ========================================================= */

    const dispatchPageStatus = useCallback(
        status => {

            const normalizedStatus =
                getStatusValue(status);

            window.dispatchEvent(
                new CustomEvent(
                    "pageStatusChanged",
                    {
                        detail: {
                            pageId,
                            status: normalizedStatus
                        }
                    }
                )
            );
        },
        [pageId]
    );


    const dispatchPageTitle = useCallback(
        value => {

            window.dispatchEvent(
                new CustomEvent(
                    "pageTitleChanged",
                    {
                        detail: {
                            title: value || ""
                        }
                    }
                )
            );
        },
        []
    );


    const updateEditMode = useCallback(
        value => {

            const newValue =
                value === true;

            setEditMode(
                newValue
            );

            window.dispatchEvent(
                new CustomEvent(
                    "pageEditModeChanged",
                    {
                        detail: {
                            pageId,
                            editMode: newValue
                        }
                    }
                )
            );
        },
        [pageId]
    );


    const updateLocalPageStatus =
        useCallback(
            status => {

                const normalizedStatus =
                    getStatusValue(status);

                setPageStatus(
                    normalizedStatus
                );

                dispatchPageStatus(
                    normalizedStatus
                );

                if (normalizedStatus !== "PSV") {
                    updateEditMode(false);
                }
            },
            [
                dispatchPageStatus,
                updateEditMode
            ]
        );


    /* =========================================================
       FETCH PAGE
    ========================================================= */

    const fetchPage = useCallback(
        async () => {

            if (!token) {

                navigate("/");

                return;
            }

            const request = {
                method: "GET",
                url: `${API_URL}/${pageId}`
            };

            try {

                setLoading(true);

                updateEditMode(false);

                const response =
                    await axios.get(
                        `${API_URL}/${pageId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const page =
                    response.data || {};


                /* TITLE */

                const loadedTitle =
                    page.title || "";

                setTitle(
                    loadedTitle
                );


                /* CONTENT */

                const loadedContent =
                    page.pageContent || "";

                setPageContent(
                    loadedContent
                );


                /* STATUS */

                const loadedStatus =
                    getStatusValue(
                        page.status
                    );

                setPageStatus(
                    loadedStatus
                );

                dispatchPageStatus(
                    loadedStatus
                );


                /* PARTICIPANTS */

                const loadedParticipants =
                    Array.isArray(page.participants)
                        ? page.participants
                        : [];


                const normalizedParticipants =
                    loadedParticipants
                        .map(participant => {

                            if (
                                typeof participant === "string"
                            ) {
                                return participant.trim();
                            }

                            return String(
                                participant?.email || ""
                            ).trim();
                        })
                        .filter(Boolean);


                const uniqueParticipants = [
                    ...new Set(
                        normalizedParticipants
                    )
                ];


                setParticipants(
                    uniqueParticipants
                );


                /* ORIGINAL DATA */

                setOriginalPage({
                    title: loadedTitle,
                    participants: [
                        ...uniqueParticipants
                    ],
                    pageContent: loadedContent
                });


                /* ATTACHMENTS */

                setAttachments(
                    Array.isArray(page.attachments)
                        ? page.attachments
                        : []
                );


                /* HEADER */

                dispatchPageTitle(
                    loadedTitle
                );


                /* EDITOR */

                if (editorRef.current) {

                    editorRef.current.innerHTML =
                        loadedContent;
                }


                logButtonEvent({
                    buttonNo: "HB23",
                    buttonName:
                        "View Page Button",
                    request,
                    response:
                        response.data,
                    status:
                        response.status
                });

            } catch (error) {

                logButtonEvent({
                    buttonNo: "HB23",
                    buttonName:
                        "View Page Button",
                    request,
                    response:
                        error.response?.data ||
                        error.message,
                    status:
                        error.response?.status ||
                        500
                });


                if (
                    error.response?.status === 401
                ) {

                    toast.error(
                        "Session expired. Please login again."
                    );

                    localStorage.clear();

                    navigate("/");

                } else if (
                    error.response?.status === 403
                ) {

                    toast.error(
                        "You are not authorized to view this page."
                    );

                    navigate(-1);

                } else if (
                    error.response?.status === 404
                ) {

                    toast.error(
                        "Page not found."
                    );

                    navigate(-1);

                } else {

                    toast.error(
                        error.response?.data?.message ||
                        error.response?.data ||
                        "Unable to load page."
                    );
                }

            } finally {

                setLoading(false);
            }
        },
        [
            navigate,
            pageId,
            dispatchPageStatus,
            dispatchPageTitle,
            updateEditMode,
            token
        ]
    );


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        fetchPage();

        return () => {

            window.dispatchEvent(
                new CustomEvent(
                    "pageTitleChanged",
                    {
                        detail: {
                            title: ""
                        }
                    }
                )
            );

            window.dispatchEvent(
                new CustomEvent(
                    "pageStatusChanged",
                    {
                        detail: {
                            pageId,
                            status: "PSV"
                        }
                    }
                )
            );

            window.dispatchEvent(
                new CustomEvent(
                    "pageEditModeChanged",
                    {
                        detail: {
                            pageId,
                            editMode: false
                        }
                    }
                )
            );
        };

    }, [
        fetchPage,
        pageId
    ]);


    /* =========================================================
       HEADER TITLE CHANGE
    ========================================================= */

    useEffect(() => {

        const handleHeaderTitleChange =
            event => {

                if (!editMode) {
                    return;
                }

                if (!isSaved || isArchived) {
                    return;
                }

                setTitle(
                    event.detail?.title || ""
                );
            };


        window.addEventListener(
            "headerPageTitleChanged",
            handleHeaderTitleChange
        );


        return () => {

            window.removeEventListener(
                "headerPageTitleChanged",
                handleHeaderTitleChange
            );
        };

    }, [
        editMode,
        isSaved,
        isArchived
    ]);


    /* =========================================================
       HEADER EDITOR COMMANDS
    ========================================================= */

    useEffect(() => {

        const handleEditorCommand =
            event => {

                const {
                    command,
                    value
                } = event.detail || {};


                if (!editorRef.current) {
                    return;
                }


                if (
                    !editMode ||
                    !isSaved ||
                    isArchived
                ) {
                    return;
                }


                editorRef.current.focus();


                if (command === "bold") {

                    document.execCommand(
                        "bold",
                        false,
                        null
                    );

                } else if (command === "italic") {

                    document.execCommand(
                        "italic",
                        false,
                        null
                    );

                } else if (command === "underline") {

                    document.execCommand(
                        "underline",
                        false,
                        null
                    );

                } else if (command === "undo") {

                    document.execCommand(
                        "undo",
                        false,
                        null
                    );

                } else if (command === "redo") {

                    document.execCommand(
                        "redo",
                        false,
                        null
                    );

                } else if (command === "hiliteColor") {

                    document.execCommand(
                        "hiliteColor",
                        false,
                        value
                    );

                } else if (command === "foreColor") {

                    document.execCommand(
                        "foreColor",
                        false,
                        value
                    );

                } else if (command === "justifyLeft") {

                    document.execCommand(
                        "justifyLeft",
                        false,
                        null
                    );

                } else if (command === "justifyCenter") {

                    document.execCommand(
                        "justifyCenter",
                        false,
                        null
                    );

                } else if (command === "justifyRight") {

                    document.execCommand(
                        "justifyRight",
                        false,
                        null
                    );

                } else if (command === "justifyFull") {

                    document.execCommand(
                        "justifyFull",
                        false,
                        null
                    );

                } else if (
                    command === "insertUnorderedList"
                ) {

                    document.execCommand(
                        "insertUnorderedList",
                        false,
                        null
                    );

                } else if (
                    command === "insertOrderedList"
                ) {

                    document.execCommand(
                        "insertOrderedList",
                        false,
                        null
                    );

                } else if (
                    command === "strikeThrough"
                ) {

                    document.execCommand(
                        "strikeThrough",
                        false,
                        null
                    );

                } else if (
                    command === "removeFormat"
                ) {

                    document.execCommand(
                        "removeFormat",
                        false,
                        null
                    );

                } else if (
                    command === "fontName"
                ) {

                    document.execCommand(
                        "fontName",
                        false,
                        value
                    );

                } else if (
                    command === "fontSize"
                ) {

                    const sizeMap = {
                        "8": "1",
                        "9": "1",
                        "10": "2",
                        "11": "2",
                        "12": "3",
                        "14": "4",
                        "16": "5",
                        "18": "5",
                        "20": "6",
                        "24": "6",
                        "28": "7",
                        "32": "7"
                    };

                    document.execCommand(
                        "fontSize",
                        false,
                        sizeMap[value] || "3"
                    );
                }


                setPageContent(
                    editorRef.current.innerHTML
                );
            };


        window.addEventListener(
            "editorCommand",
            handleEditorCommand
        );


        return () => {

            window.removeEventListener(
                "editorCommand",
                handleEditorCommand
            );
        };

    }, [
        editMode,
        isSaved,
        isArchived
    ]);


    /* =========================================================
       CTRL + S
    ========================================================= */

    useEffect(() => {

        const handleKeyDown =
            event => {

                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === "s"
                ) {

                    event.preventDefault();

                    if (
                        editMode &&
                        !isBusy
                    ) {

                        handleSubmit();
                    }
                }
            };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [
        editMode,
        isBusy,
        title,
        participants,
        pageContent
    ]);


    /* =========================================================
       PARTICIPANT SEARCH
    ========================================================= */

    const fetchParticipantSuggestions =
        async keyword => {

            if (!keyword.trim()) {

                setParticipantSuggestions([]);

                setShowParticipantSuggestions(false);

                return;
            }


            try {

                setSearchingParticipants(true);


                const response =
                    await axios.get(
                        USERS_API_URL,
                        {
                            params: {
                                keyword:
                                    keyword.trim()
                            },
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const users =
                    Array.isArray(response.data)
                        ? response.data
                        : [];


                const selectedEmails =
                    participants.map(
                        participant =>
                            String(
                                participant
                            ).toLowerCase()
                    );


                const filteredUsers =
                    users.filter(user => {

                        const email =
                            String(
                                user.email || ""
                            ).toLowerCase();

                        return (
                            email &&
                            !selectedEmails.includes(
                                email
                            )
                        );
                    });


                setParticipantSuggestions(
                    filteredUsers
                );


                setShowParticipantSuggestions(
                    filteredUsers.length > 0
                );

            } catch (error) {

                console.log(
                    "Participant search response",
                    error.response?.data
                );

                setParticipantSuggestions([]);

                setShowParticipantSuggestions(false);

            } finally {

                setSearchingParticipants(false);
            }
        };


    /* =========================================================
       PARTICIPANT INPUT
    ========================================================= */

    const handleParticipantInput =
        event => {

            if (
                !editMode ||
                isArchived ||
                !isSaved
            ) {
                return;
            }


            const value =
                event.target.value;


            setParticipantInput(
                value
            );


            fetchParticipantSuggestions(
                value
            );
        };


    /* =========================================================
       SELECT PARTICIPANT
    ========================================================= */

    const handleParticipantSelect =
        user => {

            if (
                !user ||
                !editMode ||
                isArchived ||
                !isSaved
            ) {
                return;
            }


            const email =
                String(
                    user.email || ""
                ).trim();


            if (!email) {
                return;
            }


            const exists =
                participants.some(
                    participant =>
                        String(
                            participant
                        ).toLowerCase() ===
                        email.toLowerCase()
                );


            if (exists) {
                return;
            }


            setParticipants(
                previous => [
                    ...previous,
                    email
                ]
            );


            setParticipantInput("");

            setParticipantSuggestions([]);

            setShowParticipantSuggestions(false);
        };


    /* =========================================================
       REMOVE PARTICIPANT
    ========================================================= */

    const handleRemoveParticipant =
        index => {

            if (
                !editMode ||
                isArchived ||
                !isSaved
            ) {
                return;
            }


            setParticipants(
                previous =>
                    previous.filter(
                        (_, i) =>
                            i !== index
                    )
            );
        };


    /* =========================================================
       PARTICIPANT DISPLAY
    ========================================================= */

    const getParticipantName =
        participant => {

            if (
                typeof participant === "string"
            ) {
                return participant;
            }


            return (
                participant?.userName ||
                participant?.username ||
                participant?.name ||
                participant?.email ||
                "Participant"
            );
        };


    const getParticipantEmail =
        participant => {

            if (
                typeof participant === "string"
            ) {
                return participant;
            }


            return participant?.email || "";
        };


    /* =========================================================
       EDITOR INPUT
    ========================================================= */

    const handleEditorInput =
        event => {

            if (
                !editMode ||
                isArchived ||
                !isSaved
            ) {
                return;
            }


            setPageContent(
                event.currentTarget.innerHTML
            );
        };


    /* =========================================================
       VALIDATION
    ========================================================= */

    const validatePage = () => {

        const currentTitle =
            String(
                title || ""
            ).trim();


        const currentContent =
            editorRef.current?.innerHTML ||
            pageContent ||
            "";


        const currentText =
            editorRef.current?.innerText ||
            "";


        if (!currentTitle) {

            toast.error(
                "Please enter a page title."
            );

            return false;
        }


        if (!currentText.trim()) {

            toast.error(
                "Please enter MOM content."
            );

            return false;
        }


        if (
            !Array.isArray(participants) ||
            participants.length === 0
        ) {

            toast.error(
                "Please add at least one participant."
            );

            return false;
        }


        return true;
    };


    /* =========================================================
       REQUEST DATA
    ========================================================= */

    const getRequestData = () => {

        const currentContent =
            editorRef.current
                ? editorRef.current.innerHTML
                : pageContent;


        const currentTitle =
            String(
                title || ""
            ).trim();


        const currentParticipants =
            participants
                .map(
                    participant =>
                        String(
                            participant || ""
                        ).trim()
                )
                .filter(Boolean);


        return {
            title:
                currentTitle,

            participants:
                currentParticipants,

            pageContent:
                currentContent || ""
        };
    };


    /* =========================================================
       SAVE
    ========================================================= */

    const handleSubmit = async () => {

        if (isBusy) {
            return;
        }


        if (!editMode) {

            toast.info(
                "Click Edit before saving the page."
            );

            return;
        }


        if (!isSaved) {

            toast.info(
                "Only saved pages can be edited."
            );

            return;
        }


        if (!token) {

            toast.error(
                "Session expired. Please login again."
            );

            navigate("/");

            return;
        }


        if (!validatePage()) {
            return;
        }


        const requestData =
            getRequestData();


        const request = {
            method: "PUT",
            url:
                `${API_URL}/updateDetails/${pageId}`,
            data:
                requestData
        };


        try {

            setSaving(true);


            const response =
                await axios.put(
                    `${API_URL}/updateDetails/${pageId}`,
                    requestData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const responseData =
                response.data || {};


            const savedTitle =
                responseData.title ??
                requestData.title;


            const savedParticipants =
                Array.isArray(
                    responseData.participants
                )
                    ? responseData.participants
                        .map(participant =>
                            typeof participant === "string"
                                ? participant
                                : participant?.email
                        )
                        .filter(Boolean)
                    : requestData.participants;


            const savedContent =
                responseData.pageContent ??
                requestData.pageContent;


            setTitle(
                savedTitle
            );


            setParticipants(
                savedParticipants
            );


            setPageContent(
                savedContent
            );


            if (editorRef.current) {

                editorRef.current.innerHTML =
                    savedContent;
            }


            setOriginalPage({
                title:
                    savedTitle,

                participants:
                    [
                        ...savedParticipants
                    ],

                pageContent:
                    savedContent
            });


            /*
             * Backend normally keeps the page PSV.
             * If the backend returns a status,
             * use that status.
             */

            if (responseData.status) {

                const returnedStatus =
                    getStatusValue(
                        responseData.status
                    );

                setPageStatus(
                    returnedStatus
                );

                dispatchPageStatus(
                    returnedStatus
                );
            }


            dispatchPageTitle(
                savedTitle
            );


            /*
             * IMPORTANT:
             *
             * Stay on the page after Save.
             *
             * Editing ends.
             * Edit button becomes available again.
             */

            updateEditMode(false);


            logButtonEvent({
                buttonNo: "HB24",
                buttonName:
                    "Update Page Button",
                request,
                response:
                    responseData,
                status:
                    response.status
            });


            toast.success(
                "Page saved successfully."
            );

        } catch (error) {

            logButtonEvent({
                buttonNo: "HB24",
                buttonName:
                    "Update Page Button",
                request,
                response:
                    error.response?.data ||
                    error.message,
                status:
                    error.response?.status ||
                    500
            });


            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                navigate("/");

            } else if (
                error.response?.status === 403
            ) {

                toast.error(
                    "You are not authorized to update this page."
                );

            } else if (
                error.response?.status === 404
            ) {

                toast.error(
                    "Page not found."
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to save page changes."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    /* =========================================================
       CANCEL EDIT
    ========================================================= */

    const handleCancelEdit = () => {

        if (!editMode) {
            navigate(-1);
            return;
        }


        setTitle(
            originalPage.title
        );


        setParticipants([
            ...originalPage.participants
        ]);


        setPageContent(
            originalPage.pageContent
        );


        if (editorRef.current) {

            editorRef.current.innerHTML =
                originalPage.pageContent;
        }


        setParticipantInput("");

        setParticipantSuggestions([]);

        setShowParticipantSuggestions(false);


        updateEditMode(false);


        dispatchPageTitle(
            originalPage.title
        );


        toast.info(
            "Edit cancelled."
        );
    };


    /* =========================================================
       PUBLISH
    ========================================================= */

    const handlePublish = async () => {

        if (isBusy) {
            return;
        }


        if (!token) {

            navigate("/");

            return;
        }


        if (!isSaved) {

            toast.info(
                "Only saved pages can be published."
            );

            return;
        }


        /*
         * Do not publish while editing.
         * User must Save first.
         */

        if (editMode) {

            toast.info(
                "Please save your changes before publishing."
            );

            return;
        }


        if (!validatePage()) {
            return;
        }


        const requestData =
            getRequestData();


        const request = {
            method: "PUT",
            url:
                `${API_URL}/publish/${pageId}`,
            data:
                requestData
        };


        try {

            setPublishing(true);


            const response =
                await axios.put(
                    `${API_URL}/publish/${pageId}`,
                    requestData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const responseData =
                response.data || {};


            const returnedStatus =
                getStatusValue(
                    responseData.status
                );


            updateLocalPageStatus(
                returnedStatus === "PSV"
                    ? "PPB"
                    : returnedStatus
            );


            if (responseData.title) {

                setTitle(
                    responseData.title
                );

                dispatchPageTitle(
                    responseData.title
                );
            }


            if (
                Array.isArray(
                    responseData.participants
                )
            ) {

                const updatedParticipants =
                    responseData.participants
                        .map(participant =>
                            typeof participant === "string"
                                ? participant
                                : participant?.email
                        )
                        .filter(Boolean);


                setParticipants(
                    updatedParticipants
                );
            }


            updateEditMode(false);


            logButtonEvent({
                buttonNo: "FB42",
                buttonName:
                    "Publish MOM Button",
                request,
                response:
                    responseData,
                status:
                    response.status
            });


            toast.success(
                "MOM published and mailed to all participants."
            );

        } catch (error) {

            logButtonEvent({
                buttonNo: "FB42",
                buttonName:
                    "Publish MOM Button",
                request,
                response:
                    error.response?.data ||
                    error.message,
                status:
                    error.response?.status ||
                    500
            });


            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                navigate("/");

            } else if (
                error.response?.status === 403
            ) {

                toast.error(
                    "You are not authorized to publish this page."
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to publish page."
                );
            }

        } finally {

            setPublishing(false);
        }
    };


    /* =========================================================
       ARCHIVE
    ========================================================= */

    const handleArchive = async () => {

        if (isBusy) {
            return;
        }


        if (!token) {

            navigate("/");

            return;
        }


        if (isArchived) {

            toast.info(
                "This page is already archived."
            );

            return;
        }


        if (editMode) {

            toast.info(
                "Please save or cancel your changes before archiving."
            );

            return;
        }


        const request = {
            method: "PUT",
            url:
                `${API_URL}/archive/${pageId}`
        };


        try {

            setArchiving(true);


            const response =
                await axios.put(
                    `${API_URL}/archive/${pageId}`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const returnedStatus =
                getStatusValue(
                    response.data?.status
                );


            updateLocalPageStatus(
                returnedStatus
            );


            updateEditMode(false);


            logButtonEvent({
                buttonNo: "FB43",
                buttonName:
                    "Archive Button",
                request,
                response:
                    response.data,
                status:
                    response.status
            });


            toast.success(
                "Page archived successfully."
            );

        } catch (error) {

            logButtonEvent({
                buttonNo: "FB43",
                buttonName:
                    "Archive Button",
                request,
                response:
                    error.response?.data ||
                    error.message,
                status:
                    error.response?.status ||
                    500
            });


            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to archive page."
            );

        } finally {

            setArchiving(false);
        }
    };


    /* =========================================================
       UNARCHIVE
    ========================================================= */

    const handleUnarchive = async () => {

        if (isBusy) {
            return;
        }


        if (!token) {

            navigate("/");

            return;
        }


        if (!isArchived) {

            toast.info(
                "This page is not archived."
            );

            return;
        }


        const request = {
            method: "PUT",
            url:
                `${API_URL}/archive/${pageId}`
        };


        try {

            setArchiving(true);


            const response =
                await axios.put(
                    `${API_URL}/archive/${pageId}`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const returnedStatus =
                getStatusValue(
                    response.data?.status
                );


            updateLocalPageStatus(
                returnedStatus
            );


            updateEditMode(false);


            logButtonEvent({
                buttonNo: "FB44",
                buttonName:
                    "Unarchive Button",
                request,
                response:
                    response.data,
                status:
                    response.status
            });


            toast.success(
                "Page unarchived successfully."
            );

        } catch (error) {

            logButtonEvent({
                buttonNo: "FB44",
                buttonName:
                    "Unarchive Button",
                request,
                response:
                    error.response?.data ||
                    error.message,
                status:
                    error.response?.status ||
                    500
            });


            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to unarchive page."
            );

        } finally {

            setArchiving(false);
        }
    };


    /* =========================================================
       COPY
    ========================================================= */

    const handleCopyDetails = async () => {

        const contentText =
            editorRef.current?.innerText ||
            "";


        const details = [
            `Title: ${title.trim()}`,
            `Status: ${getStatusLabel(pageStatus)}`,
            `Participants:`,
            ...participants.map(
                participant =>
                    `- ${participant}`
            ),
            "",
            "MOM Content:",
            contentText.trim()
        ].join("\n");


        try {

            await navigator.clipboard.writeText(
                details
            );


            logButtonEvent({
                buttonNo: "FB45",
                buttonName:
                    "Copy Page Details Button",
                request: {
                    action:
                        "Copy Page Details",
                    pageId,
                    title,
                    participants,
                    status:
                        pageStatus
                },
                response: {
                    message:
                        "Page details copied successfully"
                },
                status: 200
            });


            toast.success(
                "Page details copied successfully."
            );

        } catch (error) {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                details;


            document.body.appendChild(
                textarea
            );


            textarea.select();


            document.execCommand(
                "copy"
            );


            document.body.removeChild(
                textarea
            );


            toast.success(
                "Page details copied successfully."
            );
        }
    };


    /* =========================================================
       ATTACHMENT BUTTON
    ========================================================= */

    const handleAttachClick = () => {

        if (isBusy) {
            return;
        }


        if (!editMode) {

            toast.info(
                "Click Edit before adding attachments."
            );

            return;
        }


        if (isArchived) {

            toast.info(
                "Archived pages cannot have attachments added."
            );

            return;
        }


        if (!isSaved) {

            toast.info(
                "Only saved pages can have attachments added."
            );

            return;
        }


        fileInputRef.current?.click();
    };


    /* =========================================================
       FILE UPLOAD
    ========================================================= */

    const handleFileChange =
        async event => {

            const files =
                Array.from(
                    event.target.files || []
                );


            if (!files.length) {
                return;
            }


            if (
                !editMode ||
                !isSaved ||
                isArchived
            ) {

                toast.info(
                    "Attachments can only be added while editing a saved page."
                );

                return;
            }


            if (!token) {

                navigate("/");

                return;
            }


            try {

                setUploadingAttachment(true);


                for (const file of files) {

                    const formData =
                        new FormData();


                    formData.append(
                        "file",
                        file
                    );


                    const request = {
                        method: "POST",
                        url:
                            `${ATTACHMENTS_API_URL}/${pageId}`,
                        fileName:
                            file.name,
                        fileType:
                            file.type,
                        fileSize:
                            file.size
                    };


                    try {

                        const response =
                            await axios.post(
                                `${ATTACHMENTS_API_URL}/${pageId}`,
                                formData,
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                }
                            );


                        setAttachments(
                            previous => [
                                ...previous,
                                response.data
                            ]
                        );


                        logButtonEvent({
                            buttonNo: "FB46",
                            buttonName:
                                "Attach File Button",
                            request,
                            response:
                                response.data,
                            status:
                                response.status
                        });

                    } catch (error) {

                        logButtonEvent({
                            buttonNo: "FB46",
                            buttonName:
                                "Attach File Button",
                            request,
                            response:
                                error.response?.data ||
                                error.message,
                            status:
                                error.response?.status ||
                                500
                        });


                        toast.error(
                            `Unable to upload ${file.name}.`
                        );
                    }
                }


                toast.success(
                    "Attachment upload completed."
                );

            } finally {

                setUploadingAttachment(false);


                if (fileInputRef.current) {

                    fileInputRef.current.value =
                        "";
                }
            }
        };


    /* =========================================================
       FOOTER ACTIONS
    ========================================================= */

    useEffect(() => {

        const handleFooterAction =
            event => {

                const action =
                    event.detail?.action;


                switch (action) {

                    case "edit":

                        if (
                            isSaved &&
                            !isArchived &&
                            !editMode &&
                            !isBusy
                        ) {

                            updateEditMode(true);

                            setTimeout(() => {

                                editorRef.current?.focus();

                            }, 50);
                        }

                        break;


                    case "save":

                        if (
                            isSaved &&
                            editMode &&
                            !isBusy
                        ) {

                            handleSubmit();
                        }

                        break;


                    case "publish":

                        if (
                            isSaved &&
                            !editMode &&
                            !isBusy
                        ) {

                            handlePublish();
                        }

                        break;


                    case "archive":

                        if (
                            !isArchived &&
                            !editMode &&
                            !isBusy
                        ) {

                            handleArchive();
                        }

                        break;


                    case "unarchive":

                        if (
                            isArchived &&
                            !isBusy
                        ) {

                            handleUnarchive();
                        }

                        break;


                    case "copy":

                        if (!isBusy) {

                            handleCopyDetails();
                        }

                        break;


                    case "attach":

                        if (!isBusy) {

                            handleAttachClick();
                        }

                        break;


                    case "cancel":

                        if (editMode) {

                            handleCancelEdit();

                        } else {

                            navigate(-1);
                        }

                        break;


                    case "back":

                        if (!isBusy) {

                            navigate(-1);
                        }

                        break;


                    default:
                        break;
                }
            };


        window.addEventListener(
            "footerPageAction",
            handleFooterAction
        );


        return () => {

            window.removeEventListener(
                "footerPageAction",
                handleFooterAction
            );
        };

    }, [
        pageStatus,
        editMode,
        isArchived,
        isSaved,
        isBusy,
        title,
        participants,
        pageContent,
        originalPage,
        updateEditMode
    ]);


    /* =========================================================
       BACK
    ========================================================= */

    const handleBack = () => {

        if (isBusy) {
            return;
        }

        navigate(-1);
    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <div className="update-page-container">

                <div className="update-page-loading">
                    Loading document...
                </div>

            </div>
        );
    }


    /* =========================================================
       UI
    ========================================================= */

    return (

        <div className="update-page-container">

            {/* HIDDEN FILE INPUT */}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{
                    display: "none"
                }}
            />


            <div className="update-page-scroll">

                <div className="update-page">


                    {/* =================================================
                       PARTICIPANTS
                    ================================================= */}

                    <div
                        ref={participantRef}
                        className="update-page-participants-section"
                    >

                        <div className="update-page-participants-label">
                            Participants
                        </div>


                        <div className="update-page-participants-box">

                            {participants.map(
                                (participant, index) => (

                                    <div
                                        className="update-page-participant-chip"
                                        key={`${participant}-${index}`}
                                    >

                                        <div className="update-page-participant-chip-info">

                                            <span className="update-page-participant-name">

                                                {
                                                    getParticipantName(
                                                        participant
                                                    )
                                                }

                                            </span>


                                            <span className="update-page-participant-email">

                                                {
                                                    getParticipantEmail(
                                                        participant
                                                    )
                                                }

                                            </span>

                                        </div>


                                        <button
                                            type="button"
                                            className="update-page-participant-remove"
                                            onClick={() =>
                                                handleRemoveParticipant(
                                                    index
                                                )
                                            }
                                            disabled={
                                                !editMode ||
                                                isBusy ||
                                                isArchived ||
                                                !isSaved
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>
                                )
                            )}


                            {/* INPUT */}

                            <div className="update-page-participant-input-wrapper">

                                <input
                                    type="text"
                                    value={
                                        participantInput
                                    }
                                    onChange={
                                        handleParticipantInput
                                    }
                                    onFocus={() => {

                                        if (
                                            editMode &&
                                            isSaved &&
                                            participantSuggestions.length > 0
                                        ) {

                                            setShowParticipantSuggestions(
                                                true
                                            );
                                        }
                                    }}
                                    placeholder={
                                        participants.length === 0
                                            ? "Add participants..."
                                            : "Add another participant..."
                                    }
                                    disabled={
                                        !editMode ||
                                        isBusy ||
                                        isArchived ||
                                        !isSaved
                                    }
                                />


                                {searchingParticipants && (

                                    <div className="update-page-participant-searching">
                                        Searching...
                                    </div>
                                )}


                                {showParticipantSuggestions &&
                                    participantSuggestions.length > 0 && (

                                        <div className="update-page-participant-suggestions">

                                            {participantSuggestions.map(
                                                user => (

                                                    <button
                                                        type="button"
                                                        className="update-page-participant-suggestion"
                                                        key={
                                                            user.userId ||
                                                            user.id ||
                                                            user.email
                                                        }
                                                        onMouseDown={
                                                            event => {

                                                                event.preventDefault();

                                                                handleParticipantSelect(
                                                                    user
                                                                );
                                                            }
                                                        }
                                                    >

                                                        <div className="update-page-participant-avatar">

                                                            {String(
                                                                user.userName ||
                                                                user.username ||
                                                                user.name ||
                                                                user.email ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>


                                                        <div className="update-page-participant-suggestion-info">

                                                            <span>

                                                                {
                                                                    user.userName ||
                                                                    user.username ||
                                                                    user.name ||
                                                                    user.email
                                                                }

                                                            </span>


                                                            <small>

                                                                {
                                                                    user.email
                                                                }

                                                            </small>

                                                        </div>

                                                    </button>
                                                )
                                            )}

                                        </div>
                                    )}

                            </div>

                        </div>


                        <div className="update-page-participants-help">

                            Select users who should receive this published MOM by email.

                        </div>

                    </div>


                    {/* =================================================
                       MOM EDITOR
                    ================================================= */}

                    <div
                        ref={editorRef}
                        className="update-page-editor"
                        contentEditable={
                            editMode &&
                            !isBusy &&
                            !isArchived &&
                            isSaved
                        }
                        suppressContentEditableWarning
                        onInput={
                            handleEditorInput
                        }
                    />


                    {/* =================================================
                       ATTACHMENTS
                    ================================================= */}

                    {attachments.length > 0 && (

                        <div className="update-page-attachments">

                            <div className="update-page-attachments-title">
                                Attachments
                            </div>


                            {attachments.map(
                                (attachment, index) => (

                                    <div
                                        className="update-page-attachment-item"
                                        key={
                                            attachment.attachmentId ||
                                            attachment.id ||
                                            index
                                        }
                                    >

                                        <span>
                                            {
                                                attachment.fileName ||
                                                attachment.name ||
                                                "Attachment"
                                            }
                                        </span>


                                        <span>

                                            {
                                                attachment.fileSize
                                                    ? `${Math.ceil(
                                                        attachment.fileSize / 1024
                                                    )} KB`
                                                    : ""
                                            }

                                        </span>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>
            </div>


            {/* =========================================================
               LOADING OVERLAY
            ========================================================= */}

            {isBusy && (

                <div className="update-page-saving">

                    {publishing
                        ? "Publishing and sending email..."
                        : archiving
                            ? "Updating page status..."
                            : uploadingAttachment
                                ? "Uploading attachment..."
                                : "Saving page changes..."}

                </div>
            )}


            {/* =========================================================
               BOTTOM ACTION BAR
            ========================================================= */}

            <div className="update-page-action-bar">

                <button
                    type="button"
                    className="update-page-action-button update-page-back-button"
                    onClick={handleBack}
                    disabled={isBusy}
                >
                    Back
                </button>


                <div className="update-page-action-right">

                    <button
                        type="button"
                        className="update-page-action-button update-page-save-button"
                        onClick={handleSubmit}
                        disabled={
                            !editMode ||
                            !isSaved ||
                            isBusy
                        }
                    >
                        {saving
                            ? "Saving..."
                            : "Save"}
                    </button>


                    <button
                        type="button"
                        className="update-page-action-button update-page-publish-button"
                        onClick={handlePublish}
                        disabled={
                            !isSaved ||
                            editMode ||
                            isBusy
                        }
                    >
                        {publishing
                            ? "Publishing..."
                            : "Publish"}
                    </button>

                </div>

            </div>

        </div>
    );
}