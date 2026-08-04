import React,{useEffect,useState} from "react";
import axios from "axios";
import {useLocation,useNavigate} from "react-router-dom";
import "./UsersTable.css";

export default function UsersTable({searchKeyword}){

    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [page,setPage]=useState(0);
    const [totalPages,setTotalPages]=useState(0);

    const location=useLocation();
    const navigate=useNavigate();

    useEffect(()=>{
        fetchUsers();
        if(location.state?.refresh){
            navigate(location.pathname,{replace:true,state:{}});
        }
    },[page,searchKeyword,location.state]);

    const fetchUsers=async()=>{
        try{
            setLoading(true);
            setError("");
            const token=localStorage.getItem("token");
            let url=`http://localhost:8080/api/users?page=${page}&size=5`;
            if(searchKeyword.trim()!==""){
                url=`http://localhost:8080/api/search/users?keyword=${encodeURIComponent(searchKeyword)}`;
            }
            console.log({
                method:"GET",
                url:url
            });
            const response=await axios.get(
                url,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            console.log(response.data);
            console.groupEnd();
            if(searchKeyword.trim()===""){
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
            }else{
                setUsers(response.data);
                setTotalPages(0);
            }
        }catch(error){
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to fetch users."
            );
        }finally{
            setLoading(false);
        }
    };

    if(loading){
        return(
            <div className="text-center mt-4">
                Loading Users...
            </div>
        );
    }

    if(error){
        return(
            <div className="text-danger text-center mt-4">
                {error}
            </div>
        );
    }

    return(
        <div className="users-table-container">
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Authority</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {
                        users.length>0
                        ?
                        users.map(user=>(
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.authorityName}</td>
                                <td>
                                    <span
                                        className={
                                            user.status==="UAC"
                                            ?
                                            "status-badge active"
                                            :
                                            "status-badge inactive"
                                        }
                                    >
                                        {
                                            user.status==="UAC"
                                            ?
                                            "Active"
                                            :
                                            "Inactive"
                                        }
                                    </span>
                                </td>
                            </tr>
                        ))
                        :
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center"
                            >
                                No Users Found
                            </td>
                        </tr>
                    }

                </tbody>

            </table>

            {
                searchKeyword.trim()==="" &&
                totalPages>0 &&
                <div className="pagination-container">

                    <button
                        className="pagination-btn"
                        disabled={page===0}
                        onClick={()=>setPage(page-1)}
                    >
                        Previous
                    </button>

                    <span className="page-number">
                        Page {page+1} of {totalPages}
                    </span>

                    <button
                        className="pagination-btn"
                        disabled={page===totalPages-1}
                        onClick={()=>setPage(page+1)}
                    >
                        Next
                    </button>

                </div>
            }

        </div>
    );
}