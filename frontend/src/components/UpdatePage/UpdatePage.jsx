import React,{useEffect,useRef,useState} from "react";
import axios from "axios";
import {useNavigate,useParams} from "react-router-dom";
import {toast} from "react-toastify";
import "./UpdatePage.css";

const API_URL="http://localhost:8080/api/pages";

export default function UpdatePage(){

    const navigate=useNavigate();
    const {pageId}=useParams();
    const editorRef=useRef(null);

    const [title,setTitle]=useState("");
    const [pageContent,setPageContent]=useState("");
    const [loading,setLoading]=useState(true);
    const [saving,setSaving]=useState(false);

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

    useEffect(()=>{
        fetchPage();
    },[pageId]);

    useEffect(()=>{

        const handleKeyDown=(event)=>{

            if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="s"){

                event.preventDefault();

                if(!saving){
                    handleSubmit();
                }
            }
        };

        document.addEventListener("keydown",handleKeyDown);

        return()=>{
            document.removeEventListener("keydown",handleKeyDown);
        };

    },[title,pageContent,saving]);

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

    const fetchPage=async()=>{

        const token=localStorage.getItem("token");

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

            setTitle(page.title||"");
            setPageContent(page.pageContent||"");

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
                response:error.response?.data||error.message,
                status:error.response?.status||500
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

                toast.error("Page not found.");
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

    const handleEditorInput=(event)=>{

        setPageContent(
            event.currentTarget.innerHTML
        );
    };

    const handleSubmit=async()=>{

        const token=localStorage.getItem("token");

        if(!token){
            navigate("/");
            return;
        }

        if(!title.trim()){

            toast.error(
                "Please enter a page title."
            );

            return;
        }

        const currentContent=
            editorRef.current?.innerHTML||
            pageContent||
            "";

        const textContent=
            editorRef.current?.innerText||
            "";

        if(!textContent.trim()){

            toast.error(
                "Please enter MOM content."
            );

            return;
        }

        const requestData={
            title:title.trim(),
            pageContent:currentContent
        };

        const request={
            method:"PUT",
            url:`${API_URL}/${pageId}`,
            data:requestData
        };

        try{

            setSaving(true);

            const response=await axios.put(
                `${API_URL}/${pageId}`,
                requestData,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                        "Content-Type":"application/json"
                    }
                }
            );

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

            navigate(
                "/user-homepage/view-all-notebooks-pages",
                {
                    state:{
                        refresh:true
                    }
                }
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

                toast.error("Page not found.");

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

            <div className="update-page-scroll">

                <div className="update-page">

                    <div className="update-page-title">

                        <input
                            type="text"
                            value={title}
                            onChange={e=>
                                setTitle(e.target.value)
                            }
                            placeholder="Document title"
                            disabled={saving}
                        />

                    </div>

                    <div
                        ref={editorRef}
                        className="update-page-editor"
                        contentEditable={!saving}
                        suppressContentEditableWarning
                        onInput={handleEditorInput}
                    />

                </div>

            </div>

            {saving&&(
                <div className="update-page-saving">
                    Saving...
                </div>
            )}
        </div>
    );
}