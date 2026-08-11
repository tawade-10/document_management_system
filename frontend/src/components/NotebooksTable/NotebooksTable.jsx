import React,{useEffect,useState} from "react";
import axios from "axios";
import {useLocation,useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "./NotebooksTable.css";

const API_URL="http://localhost:8080/api/notebooks";
const PAGE_SIZE=10;

export default function NotebooksTable({searchKeyword="",sortBy="createdAt",sortDir="desc",authorityFilter=[],statusFilter=[]}) {
    const [notebooks,setNotebooks]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [page,setPage]=useState(0);
    const [totalPages,setTotalPages]=useState(0);
    const [totalElements,setTotalElements]=useState(0);
    const location=useLocation();
    const navigate=useNavigate();

    const logButtonEvent=({buttonNo,buttonName,request,response,status})=>{
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
        setPage(0);
    },[searchKeyword,sortBy,sortDir,authorityFilter,statusFilter]);

    const fetchNotebooks=async()=>{
        const token=localStorage.getItem("token");
        if(!token){
            navigate("/");
            return;
        }

        let url=`${API_URL}?page=${page}&size=${PAGE_SIZE}`;

        if(searchKeyword?.trim()){
            url+=`&search=${encodeURIComponent(searchKeyword.trim())}`;
        }

        if(authorityFilter?.length>0){
            url+=`&authority=${encodeURIComponent(authorityFilter.join(","))}`;
        }

        if(statusFilter?.length>0){
            url+=`&status=${encodeURIComponent(statusFilter.join(","))}`;
        }

        url+=`&sortBy=${encodeURIComponent(sortBy)}`;
        url+=`&sortDir=${encodeURIComponent(sortDir)}`;

        const request={method:"GET",url};

        try{
            setLoading(true);
            setError("");

            const response=await axios.get(url,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });

            logButtonEvent({
                buttonNo:"HB16",
                buttonName:"Load Notebooks",
                request,
                response:response.data,
                status:response.status
            });

            setNotebooks(response.data.content||[]);
            setTotalPages(response.data.totalPages||0);
            setTotalElements(response.data.totalElements||0);
        }catch(error){
            logButtonEvent({
                buttonNo:"HB16",
                buttonName:"Load Notebooks",
                request,
                response:error.response?.data||error.message,
                status:error.response?.status||500
            });

            setNotebooks([]);
            setTotalPages(0);
            setTotalElements(0);

            setError(
                error.response?.data?.message||
                error.response?.data||
                "Unable to fetch notebooks."
            );

            if(error.response?.status===401){
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                navigate("/");
            }else if(error.response?.status===403){
                toast.error("You are not authorized to view notebooks.");
            }
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchNotebooks();
    },[page,searchKeyword,sortBy,sortDir,authorityFilter,statusFilter]);

    useEffect(()=>{
        if(location.state?.refresh){
            setPage(0);
            navigate(location.pathname,{replace:true,state:{}});
        }
    },[location.state]);

    const handlePageChange=(newPage)=>{
        if(newPage<0||newPage>=totalPages)return;
        setPage(newPage);
    };

    const getStatusText=(status)=>{
        if(!status)return "-";
        switch(String(status).toUpperCase()){
            case "NAC":return "Active";
            case "NAR":return "Archived";
            default:return status;
        }
    };

    const getCreatedBy=(notebook)=>{
        if(notebook.createdBy&&typeof notebook.createdBy==="object"){
            return notebook.createdBy.userName||notebook.createdBy.email||"-";
        }
        return notebook.createdBy||notebook.createdByUserName||"-";
    };

    if(loading){
        return <div className="notebooks-table-message">Loading Notebooks...</div>;
    }

    if(error){
        return <div className="notebooks-table-message notebooks-error-message">{error}</div>;
    }

    return(
        <div className="notebooks-table-container">
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>Notebook ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created By</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {notebooks.length>0?(
                        notebooks.map(notebook=>(
                            <tr key={notebook.notebookId}>
                                <td>{notebook.notebookId||"-"}</td>
                                <td>{notebook.name||"-"}</td>
                                <td className="notebook-description" title={notebook.description||""}>{notebook.description||"-"}</td>
                                <td>{getCreatedBy(notebook)}</td>
                                <td>
                                    <span className={String(notebook.status||"").toUpperCase()==="NAC"?"status-badge active":"status-badge inactive"}>
                                        {getStatusText(notebook.status)}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ):(
                        <tr>
                            <td colSpan="5" className="text-center">No Notebooks Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {totalPages>0&&(
                <div className="pagination-container">
                    <button className="pagination-btn" disabled={page===0} onClick={()=>handlePageChange(page-1)}>Previous</button>
                    <span className="page-number">Page {page+1} of {totalPages}</span>
                    <button className="pagination-btn" disabled={page===totalPages-1} onClick={()=>handlePageChange(page+1)}>Next</button>
                </div>
            )}
        </div>
    );
}