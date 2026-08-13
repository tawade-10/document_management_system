import React,{useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "./CreatePage.css";

const API_URL="http://localhost:8080/api/pages";

export default function CreatePage(){

    const navigate=useNavigate();

    const [title,setTitle]=useState("");
    const [participants,setParticipants]=useState("");
    const [pageContent,setPageContent]=useState("");
    const [loading,setLoading]=useState(false);

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

    const handleSubmit=async(e)=>{
        e.preventDefault();

        const token=localStorage.getItem("token");

        if(!token){
            navigate("/");
            return;
        }

        const participantList=participants
            .split(",")
            .map(item=>item.trim())
            .filter(item=>item.length>0);

        const requestData={
            title:title.trim(),
            participants:participantList,
            pageContent:pageContent.trim()
        };

        const request={
            method:"POST",
            url:`${API_URL}/create`,
            data:requestData
        };

        try{
            setLoading(true);

            const response=await axios.post(
                `${API_URL}/create`,
                requestData,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                        "Content-Type":"application/json"
                    }
                }
            );

            logButtonEvent({
                buttonNo:"HB22",
                buttonName:"Create Page Button",
                request,
                response:response.data,
                status:response.status
            });

            toast.success("Page created successfully.");

            navigate("/user-homepage",{
                state:{
                    refresh:true
                }
            });

        }catch(error){

            logButtonEvent({
                buttonNo:"HB22",
                buttonName:"Create Page Button",
                request,
                response:error.response?.data||error.message,
                status:error.response?.status||500
            });

            if(error.response?.status===401){
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate("/");
            }else if(error.response?.status===403){
                toast.error("You are not authorized to create a page.");
            }else{
                toast.error(
                    error.response?.data?.message||
                    error.response?.data||
                    "Unable to create page."
                );
            }
        }finally{
            setLoading(false);
        }
    };

    const handleCancel=()=>{
        navigate(-1);
    };

    return(
        <div className="create-page-container">
            <div className="create-page-card">
                <div className="create-page-header">
                    <h2>Create Page</h2>
                    <p>Create a new MOM page</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="title">
                            Page Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            placeholder="Enter page title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="participants">
                            Participants
                        </label>

                        <input
                            id="participants"
                            type="text"
                            value={participants}
                            onChange={(e)=>setParticipants(e.target.value)}
                            placeholder="Enter participant names separated by commas"
                            required
                        />

                        <small>
                            Example: ABC, XYZ, John
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pageContent">
                            Page Content
                        </label>

                        <textarea
                            id="pageContent"
                            value={pageContent}
                            onChange={(e)=>setPageContent(e.target.value)}
                            placeholder="Enter page content"
                            rows="12"
                            required
                        />
                    </div>

                    <div className="create-page-buttons">

                        <button
                            type="button"
                            className="cancel-page-btn"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-page-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Page"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}