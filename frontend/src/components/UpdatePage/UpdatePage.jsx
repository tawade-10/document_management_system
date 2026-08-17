import React,{useEffect,useRef,useState} from "react";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import "./UpdatePage.css";

const API_URL="http://localhost:8080/api/pages";
const USERS_API_URL="http://localhost:8080/api/search/users";
const ATTACHMENTS_API_URL="http://localhost:8080/api/attachments";

export default function UpdatePage(){

    const navigate=useNavigate();
    const {pageId}=useParams();

    const editorRef=useRef(null);
    const participantRef=useRef(null);
    const fileInputRef=useRef(null);

    const [title,setTitle]=useState("");
    const [participants,setParticipants]=useState([]);
    const [participantInput,setParticipantInput]=useState("");
    const [participantSuggestions,setParticipantSuggestions]=useState([]);
    const [showParticipantSuggestions,setShowParticipantSuggestions]=useState(false);
    const [searchingParticipants,setSearchingParticipants]=useState(false);

    const [pageContent,setPageContent]=useState("");
    const [pageStatus,setPageStatus]=useState("PSV");
    const [attachments,setAttachments]=useState([]);

    const [loading,setLoading]=useState(true);
    const [saving,setSaving]=useState(false);
    const [publishing,setPublishing]=useState(false);
    const [uploadingAttachment,setUploadingAttachment]=useState(false);

    const token=localStorage.getItem("token");

    const logButtonEvent=({
        buttonNo,
        buttonName,
        request,
        response,
        status
    })=>{
        console.group(`${buttonNo} - ${buttonName}`);
        console.log("Request");
        console.log(request);
        console.log("Response");
        console.log(response);
        console.log("Status Code");
        console.log(status);
        console.groupEnd();
    };

    const dispatchPageTitle=(value)=>{
        window.dispatchEvent(
            new CustomEvent("pageTitleChanged",{
                detail:{
                    title:value||""
                }
            })
        );
    };

    const dispatchPageStatus=(status)=>{
        window.dispatchEvent(
            new CustomEvent("pageStatusChanged",{
                detail:{
                    status:status||"PSV"
                }
            })
        );
    };

    useEffect(()=>{
        fetchPage();

        return()=>{
            dispatchPageTitle("");
            dispatchPageStatus("PSV");
        };
    },[pageId]);

    useEffect(()=>{

        const handleKeyDown=(event)=>{

            if(
                (event.ctrlKey||event.metaKey)&&
                event.key.toLowerCase()==="s"
            ){

                event.preventDefault();

                if(!saving&&!publishing){
                    handleSubmit();
                }
            }
        };

        document.addEventListener("keydown",handleKeyDown);

        return()=>{
            document.removeEventListener("keydown",handleKeyDown);
        };

    },[
        title,
        pageContent,
        participants,
        saving,
        publishing
    ]);

    useEffect(()=>{

        const handleEditorCommand=(event)=>{

            const {command,value}=event.detail||{};

            if(!editorRef.current){
                return;
            }

            editorRef.current.focus();

            if(command==="bold"){

                document.execCommand("bold",false,null);

            }else if(command==="undo"){

                document.execCommand("undo",false,null);

            }else if(command==="redo"){

                document.execCommand("redo",false,null);

            }else if(command==="italic"){

                document.execCommand("italic",false,null);

            }else if(command==="underline"){

                document.execCommand("underline",false,null);

            }else if(command==="hiliteColor"){

                document.execCommand(
                    "hiliteColor",
                    false,
                    value
                );

            }else if(command==="foreColor"){

                document.execCommand(
                    "foreColor",
                    false,
                    value
                );

            }else if(command==="justifyLeft"){

                document.execCommand(
                    "justifyLeft",
                    false,
                    null
                );

            }else if(command==="justifyCenter"){

                document.execCommand(
                    "justifyCenter",
                    false,
                    null
                );

            }else if(command==="justifyRight"){

                document.execCommand(
                    "justifyRight",
                    false,
                    null
                );

            }else if(command==="insertUnorderedList"){

                document.execCommand(
                    "insertUnorderedList",
                    false,
                    null
                );

            }else if(command==="insertOrderedList"){

                document.execCommand(
                    "insertOrderedList",
                    false,
                    null
                );

            }else if(command==="strikeThrough"){

                document.execCommand(
                    "strikeThrough",
                    false,
                    null
                );

            }else if(command==="removeFormat"){

                document.execCommand(
                    "removeFormat",
                    false,
                    null
                );

            }else if(command==="justifyFull"){

                document.execCommand(
                    "justifyFull",
                    false,
                    null
                );

            }else if(command==="fontName"){

                document.execCommand(
                    "fontName",
                    false,
                    value
                );

            }else if(command==="fontSize"){

                const sizeMap={
                    "8":"1",
                    "9":"1",
                    "10":"2",
                    "11":"2",
                    "12":"3",
                    "14":"4",
                    "16":"5",
                    "18":"5",
                    "20":"6",
                    "24":"6",
                    "28":"7",
                    "32":"7"
                };

                document.execCommand(
                    "fontSize",
                    false,
                    sizeMap[value]||"3"
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

        return()=>{
            window.removeEventListener(
                "editorCommand",
                handleEditorCommand
            );
        };

    },[]);

    useEffect(()=>{

        const handleHeaderTitleChange=(event)=>{

            const newTitle=
                event.detail?.title||"";

            setTitle(newTitle);
        };

        window.addEventListener(
            "headerPageTitleChanged",
            handleHeaderTitleChange
        );

        return()=>{
            window.removeEventListener(
                "headerPageTitleChanged",
                handleHeaderTitleChange
            );
        };

    },[]);

    useEffect(()=>{

        const handleFooterAction=(event)=>{

            const action=
                event.detail?.action;

            if(action==="save"){

                handleSubmit();

            }else if(action==="publish"){

                handlePublish();

            }else if(action==="copy"){

                handleCopyDetails();

            }else if(action==="attach"){

                handleAttachClick();

            }else if(action==="edit"){

                if(editorRef.current){
                    editorRef.current.focus();
                }

            }else if(action==="cancel"){

                navigate(-1);

            }else if(action==="back"){

                navigate(-1);

            }else if(action==="status"){

                toast.info(
                    `Current page status: ${getStatusLabel(pageStatus)}`
                );
            }
        };

        window.addEventListener(
            "footerPageAction",
            handleFooterAction
        );

        return()=>{
            window.removeEventListener(
                "footerPageAction",
                handleFooterAction
            );
        };

    },[
        title,
        pageContent,
        participants,
        saving,
        publishing,
        pageStatus,
        attachments
    ]);

    const fetchPage=async()=>{

        if(!token){

            navigate("/");

            return;
        }

        const request={
            method:"GET",
            url:`${API_URL}/${pageId}`
        };

        try{

            setLoading(true);

            const response=await axios.get(
                `${API_URL}/${pageId}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            const page=response.data;

            const loadedTitle=
                page.title||"";

            setTitle(loadedTitle);

            setPageContent(
                page.pageContent||""
            );

            const loadedStatus=
                page.status||"PSV";

            setPageStatus(
                loadedStatus
            );

            dispatchPageStatus(
                loadedStatus
            );

            const loadedParticipants=
                Array.isArray(page.participants)
                    ? page.participants
                    : [];

            const normalizedParticipants=
                loadedParticipants
                    .map(participant=>{

                        if(typeof participant==="string"){
                            return participant.trim();
                        }

                        return String(
                            participant?.email||""
                        ).trim();

                    })
                    .filter(Boolean);

            setParticipants(
                [...new Set(normalizedParticipants)]
            );

            if(Array.isArray(page.attachments)){
                setAttachments(
                    page.attachments
                );
            }

            dispatchPageTitle(
                loadedTitle
            );

            if(editorRef.current){

                editorRef.current.innerHTML=
                    page.pageContent||"";
            }

            logButtonEvent({
                buttonNo:"HB23",
                buttonName:"View Page Button",
                request,
                response:response.data,
                status:response.status
            });

        }catch(error){

            logButtonEvent({
                buttonNo:"HB23",
                buttonName:"View Page Button",
                request,
                response:
                    error.response?.data||
                    error.message,
                status:
                    error.response?.status||
                    500
            });

            if(error.response?.status===401){

                toast.error(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                navigate("/");

            }else if(error.response?.status===403){

                toast.error(
                    "You are not authorized to view this page."
                );

                navigate(-1);

            }else if(error.response?.status===404){

                toast.error(
                    "Page not found."
                );

                navigate(-1);

            }else{

                toast.error(
                    error.response?.data?.message||
                    error.response?.data||
                    "Unable to load page."
                );
            }

        }finally{

            setLoading(false);
        }
    };

    const fetchParticipantSuggestions=async(keyword)=>{

        if(!keyword.trim()){

            setParticipantSuggestions([]);
            setShowParticipantSuggestions(false);

            return;
        }

        try{

            setSearchingParticipants(true);

            const response=await axios.get(
                USERS_API_URL,
                {
                    params:{
                        keyword:keyword.trim()
                    },
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            const users=
                Array.isArray(response.data)
                    ? response.data
                    : [];

            const selectedEmails=
                participants.map(
                    participant=>
                        String(
                            participant||""
                        ).toLowerCase()
                );

            const filteredUsers=
                users.filter(user=>{

                    const email=
                        String(
                            user.email||""
                        ).toLowerCase();

                    return(
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
                filteredUsers.length>0
            );

        }catch(error){

            console.log(
                "Participant search response",
                error.response?.data
            );

            setParticipantSuggestions([]);
            setShowParticipantSuggestions(false);

        }finally{

            setSearchingParticipants(false);
        }
    };

    const handleParticipantInput=(event)=>{

        const value=
            event.target.value;

        setParticipantInput(
            value
        );

        fetchParticipantSuggestions(
            value
        );
    };

    const handleParticipantSelect=(user)=>{

        if(!user){
            return;
        }

        const email=
            String(
                user.email||""
            ).trim();

        if(!email){
            return;
        }

        const alreadySelected=
            participants.some(
                participant=>
                    String(
                        participant||""
                    ).toLowerCase()===
                    email.toLowerCase()
            );

        if(alreadySelected){
            return;
        }

        setParticipants(prev=>[
            ...prev,
            email
        ]);

        setParticipantInput("");
        setParticipantSuggestions([]);
        setShowParticipantSuggestions(false);
    };

    const handleRemoveParticipant=(index)=>{

        setParticipants(prev=>
            prev.filter(
                (_,participantIndex)=>
                    participantIndex!==index
            )
        );
    };

    const getParticipantName=(participant)=>{

        if(typeof participant==="string"){
            return participant;
        }

        return(
            participant?.userName||
            participant?.username||
            participant?.name||
            participant?.email||
            "Participant"
        );
    };

    const getParticipantEmail=(participant)=>{

        if(typeof participant==="string"){
            return participant;
        }

        return participant?.email||"";
    };

    const validatePage=()=>{

        if(!title.trim()){

            toast.error(
                "Please enter a page title."
            );

            return false;
        }

        const textContent=
            editorRef.current?.innerText||
            "";

        if(!textContent.trim()){

            toast.error(
                "Please enter MOM content."
            );

            return false;
        }

        if(participants.length===0){

            toast.error(
                "Please add at least one participant."
            );

            return false;
        }

        return true;
    };

    const getRequestData=()=>{

        const currentContent=
            editorRef.current?.innerHTML||
            pageContent||
            "";

        return{
            participants:participants.map(
                participant=>
                    String(participant).trim()
            ),
            pageContent:currentContent
        };
    };

    const handleEditorInput=(event)=>{

        setPageContent(
            event.currentTarget.innerHTML
        );
    };

    const handleSubmit=async()=>{

        if(saving||publishing){
            return;
        }

        if(!token){

            navigate("/");

            return;
        }

        if(!validatePage()){
            return;
        }

        const requestData=
            getRequestData();

        const request={
            method:"PUT",
            url:`${API_URL}/${pageId}`,
            data:requestData
        };

        try{

            setSaving(true);

            const response=
                await axios.put(
                    `${API_URL}/${pageId}`,
                    requestData,
                    {
                        headers:{
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            if(
                Array.isArray(
                    response.data?.participants
                )
            ){

                setParticipants(
                    response.data.participants
                        .map(
                            participant=>
                                typeof participant==="string"
                                    ? participant
                                    : participant?.email
                        )
                        .filter(Boolean)
                );
            }

            if(response.data?.status){

                setPageStatus(
                    response.data.status
                );

                dispatchPageStatus(
                    response.data.status
                );
            }

            logButtonEvent({
                buttonNo:"HB24",
                buttonName:"Update Page Button",
                request,
                response:response.data,
                status:response.status
            });

            toast.success(
                "Page updated successfully."
            );

        }catch(error){

            logButtonEvent({
                buttonNo:"HB24",
                buttonName:"Update Page Button",
                request,
                response:
                    error.response?.data||
                    error.message,
                status:
                    error.response?.status||
                    500
            });

            if(error.response?.status===401){

                toast.error(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                navigate("/");

            }else if(error.response?.status===403){

                toast.error(
                    "You are not authorized to update this page."
                );

            }else if(error.response?.status===404){

                toast.error(
                    "Page not found."
                );

            }else{

                toast.error(
                    error.response?.data?.message||
                    error.response?.data||
                    "Unable to update page."
                );
            }

        }finally{

            setSaving(false);
        }
    };

    const handlePublish=async()=>{

        if(saving||publishing){
            return;
        }

        if(!token){

            navigate("/");

            return;
        }

        if(!validatePage()){
            return;
        }

        const requestData=
            getRequestData();

        const request={
            method:"PUT",
            url:`${API_URL}/publish/${pageId}`,
            data:requestData
        };

        console.log(
            "PUBLISH REQUEST JSON"
        );

        console.log(
            JSON.stringify(
                requestData,
                null,
                2
            )
        );

        try{

            setPublishing(true);

            const response=
                await axios.put(
                    `${API_URL}/publish/${pageId}`,
                    requestData,
                    {
                        headers:{
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            console.log(
                "PUBLISH RESPONSE JSON"
            );

            console.log(
                JSON.stringify(
                    response.data,
                    null,
                    2
                )
            );

            const returnedStatus=
                response.data?.status||
                "PPB";

            setPageStatus(
                returnedStatus
            );

            dispatchPageStatus(
                returnedStatus
            );

            if(
                Array.isArray(
                    response.data?.participants
                )
            ){

                setParticipants(
                    response.data.participants
                        .map(
                            participant=>
                                typeof participant==="string"
                                    ? participant
                                    : participant?.email
                        )
                        .filter(Boolean)
                );
            }

            logButtonEvent({
                buttonNo:"FB42",
                buttonName:"Publish MOM Button",
                request,
                response:response.data,
                status:response.status
            });

            toast.success(
                "MOM published and mailed to all participants."
            );

        }catch(error){

            console.log(
                "PUBLISH ERROR RESPONSE"
            );

            console.log(
                error.response?.data||
                error.message
            );

            logButtonEvent({
                buttonNo:"FB42",
                buttonName:"Publish MOM Button",
                request,
                response:
                    error.response?.data||
                    error.message,
                status:
                    error.response?.status||
                    500
            });

            if(error.response?.status===401){

                toast.error(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                navigate("/");

            }else if(error.response?.status===403){

                toast.error(
                    "You are not authorized to publish this page."
                );

            }else if(error.response?.status===404){

                toast.error(
                    "Publish endpoint or page not found."
                );

            }else{

                toast.error(
                    error.response?.data?.message||
                    error.response?.data||
                    "Unable to publish page."
                );
            }

        }finally{

            setPublishing(false);
        }
    };

    const handleCopyDetails=async()=>{

        const contentElement=
            editorRef.current;

        const contentText=
            contentElement?.innerText||
            "";

        const details=[
            `Title: ${title.trim()}`,
            `Status: ${getStatusLabel(pageStatus)}`,
            `Participants:`,
            ...participants.map(
                participant=>
                    `- ${participant}`
            ),
            "",
            "MOM Content:",
            contentText.trim()
        ].join("\n");

        try{

            await navigator.clipboard.writeText(
                details
            );

            logButtonEvent({
                buttonNo:"FB45",
                buttonName:"Copy Page Details Button",
                request:{
                    action:"Copy Page Details",
                    pageId,
                    title,
                    participants,
                    status:pageStatus
                },
                response:{
                    message:
                        "Page details copied successfully"
                },
                status:200
            });

            toast.success(
                "Page details copied successfully."
            );

        }catch(error){

            const textArea=
                document.createElement("textarea");

            textArea.value=details;

            document.body.appendChild(
                textArea
            );

            textArea.select();

            document.execCommand(
                "copy"
            );

            document.body.removeChild(
                textArea
            );

            toast.success(
                "Page details copied successfully."
            );
        }
    };

    const handleAttachClick=()=>{

        if(
            saving||
            publishing||
            uploadingAttachment
        ){
            return;
        }

        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    };

    const handleFileChange=async(event)=>{

        const files=
            Array.from(
                event.target.files||[]
            );

        if(files.length===0){
            return;
        }

        if(!token){

            navigate("/");

            return;
        }

        try{

            setUploadingAttachment(true);

            for(const file of files){

                const formData=
                    new FormData();

                formData.append(
                    "file",
                    file
                );

                const request={
                    method:"POST",
                    url:`${ATTACHMENTS_API_URL}/${pageId}`,
                    fileName:file.name,
                    fileType:file.type,
                    fileSize:file.size
                };

                try{

                    const response=
                        await axios.post(
                            `${ATTACHMENTS_API_URL}/${pageId}`,
                            formData,
                            {
                                headers:{
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    setAttachments(prev=>[
                        ...prev,
                        response.data
                    ]);

                    logButtonEvent({
                        buttonNo:"FB46",
                        buttonName:"Attach File Button",
                        request,
                        response:response.data,
                        status:response.status
                    });

                }catch(error){

                    logButtonEvent({
                        buttonNo:"FB46",
                        buttonName:"Attach File Button",
                        request,
                        response:
                            error.response?.data||
                            error.message,
                        status:
                            error.response?.status||
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

        }finally{

            setUploadingAttachment(false);

            if(fileInputRef.current){
                fileInputRef.current.value="";
            }
        }
    };

    const getStatusLabel=(status)=>{

        const statusMap={
            PSV:"Saved",
            PPB:"Published",
            PSA:"Saved Archived",
            PPA:"Published Archived"
        };

        return statusMap[status]||status;
    };

    const handleBack=()=>{

        navigate(-1);
    };

    if(loading){

        return(
            <div className="update-page-container">

                <div className="update-page-loading">
                    Loading document...
                </div>

            </div>
        );
    }

    return(

        <div className="update-page-container">

            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{
                    display:"none"
                }}
            />

            <div className="update-page-scroll">

                <div className="update-page">

                    <div
                        ref={participantRef}
                        className="update-page-participants-section"
                    >

                        <div className="update-page-participants-label">
                            Participants
                        </div>

                        <div className="update-page-participants-box">

                            {participants.map(
                                (participant,index)=>(

                                    <div
                                        className="update-page-participant-chip"
                                        key={
                                            `${participant}-${index}`
                                        }
                                    >

                                        <div className="update-page-participant-chip-info">

                                            <span className="update-page-participant-name">
                                                {getParticipantName(
                                                    participant
                                                )}
                                            </span>

                                            <span className="update-page-participant-email">
                                                {getParticipantEmail(
                                                    participant
                                                )}
                                            </span>

                                        </div>

                                        <button
                                            type="button"
                                            className="update-page-participant-remove"
                                            onClick={()=>
                                                handleRemoveParticipant(
                                                    index
                                                )
                                            }
                                            disabled={
                                                saving||
                                                publishing
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                )
                            )}

                            <div className="update-page-participant-input-wrapper">

                                <input
                                    type="text"
                                    value={participantInput}
                                    onChange={
                                        handleParticipantInput
                                    }
                                    onFocus={()=>{

                                        if(
                                            participantSuggestions.length>0
                                        ){

                                            setShowParticipantSuggestions(
                                                true
                                            );
                                        }
                                    }}
                                    placeholder={
                                        participants.length===0
                                            ? "Add participants..."
                                            : "Add another participant..."
                                    }
                                    disabled={
                                        saving||
                                        publishing
                                    }
                                />

                                {searchingParticipants&&(
                                    <div className="update-page-participant-searching">
                                        Searching...
                                    </div>
                                )}

                                {showParticipantSuggestions&&
                                    participantSuggestions.length>0&&(

                                    <div className="update-page-participant-suggestions">

                                        {participantSuggestions.map(
                                            user=>(

                                                <button
                                                    type="button"
                                                    className="update-page-participant-suggestion"
                                                    key={
                                                        user.userId||
                                                        user.id||
                                                        user.email
                                                    }
                                                    onMouseDown={
                                                        event=>{

                                                            event.preventDefault();

                                                            handleParticipantSelect(
                                                                user
                                                            );
                                                        }
                                                    }
                                                >

                                                    <div className="update-page-participant-avatar">

                                                        {String(
                                                            user.userName||
                                                            user.username||
                                                            user.name||
                                                            user.email||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>

                                                    <div className="update-page-participant-suggestion-info">

                                                        <span>
                                                            {
                                                                user.userName||
                                                                user.username||
                                                                user.name||
                                                                user.email
                                                            }
                                                        </span>

                                                        <small>
                                                            {user.email}
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

                    <div
                        ref={editorRef}
                        className="update-page-editor"
                        contentEditable={
                            !saving&&
                            !publishing
                        }
                        suppressContentEditableWarning
                        onInput={handleEditorInput}
                    />

                    {attachments.length>0&&(

                        <div className="update-page-attachments">

                            <div className="update-page-attachments-title">
                                Attachments
                            </div>

                            {attachments.map(
                                (attachment,index)=>(

                                    <div
                                        className="update-page-attachment-item"
                                        key={
                                            attachment.attachmentId||
                                            index
                                        }
                                    >

                                        <span>
                                            {attachment.fileName||
                                                attachment.name||
                                                "Attachment"}
                                        </span>

                                        <span>
                                            {attachment.fileSize
                                                ? `${Math.ceil(
                                                    attachment.fileSize/1024
                                                )} KB`
                                                : ""}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

            {(saving||
                publishing||
                uploadingAttachment)&&(

                <div className="update-page-saving">

                    {publishing
                        ? "Publishing and sending email..."
                        : uploadingAttachment
                            ? "Uploading attachment..."
                            : "Saving..."}

                </div>

            )}

            <div className="update-page-action-bar">

                <button
                    type="button"
                    className="update-page-action-button update-page-back-button"
                    onClick={handleBack}
                    disabled={
                        saving||
                        publishing||
                        uploadingAttachment
                    }
                >
                    Back
                </button>

                <div className="update-page-action-right">

                    <button
                        type="button"
                        className="update-page-action-button update-page-save-button"
                        onClick={handleSubmit}
                        disabled={
                            saving||
                            publishing||
                            uploadingAttachment
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
                            saving||
                            publishing||
                            uploadingAttachment||
                            pageStatus==="PPB"
                        }
                    >
                        {publishing
                            ? "Publishing..."
                            : pageStatus==="PPB"
                                ? "Published"
                                : "Publish"}
                    </button>

                </div>

            </div>

        </div>
    );
}