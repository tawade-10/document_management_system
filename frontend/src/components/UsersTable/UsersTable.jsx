import React,{useEffect,useState} from "react";
import axios from "axios";
import {useLocation,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import "./UsersTable.css";

export default function UsersTable({searchKeyword}){

const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);

const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
    setPage(0);
}, [searchKeyword]);

useEffect(() => {

    fetchUsers();

    if (location.state?.refresh) {
        navigate(location.pathname, {
            replace: true,
            state: {}
        });
    }

}, [page, searchKeyword, location.state]);

const logButtonEvent = ({
    buttonNo,
    buttonName,
    request,
    response,
    status
}) => {

    console.group(`${buttonNo} - ${buttonName}`);

    console.log("Request");
    console.log(request);

    console.log("Response");
    console.log(response);

    console.log("Status Code");
    console.log(status);

    console.groupEnd();

};

const PAGE_SIZE = 10;

const fetchUsers = async () => {

    const token = localStorage.getItem("token");

    let url = `http://localhost:8080/api/users?page=${page}&size=${PAGE_SIZE}`;

    const isSearch = searchKeyword.trim() !== "";

    if (isSearch) {
        url = `http://localhost:8080/api/search/users?keyword=${encodeURIComponent(searchKeyword)}`;
    }

    const request = {
        method: "GET",
        url
    };

    try {

        setLoading(true);
        setError("");

        const response = await axios.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        logButtonEvent({
            buttonNo: "HB15",
            buttonName: isSearch
                ? "Search User Button"
                : "Load Users",
            request,
            response: response.data,
            status: response.status
        });

        if (isSearch) {

            setUsers(response.data);
            setTotalPages(0);

        } else {

            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);

        }

    } catch (error) {

        logButtonEvent({
            buttonNo: "HB15",
            buttonName: isSearch
                ? "Search User Button"
                : "Load Users",
            request,
            response:
                error.response?.data ||
                error.message,
            status:
                error.response?.status ||
                500
        });

        setError(
            error.response?.data?.message ||
            "Unable to fetch users."
        );

    } finally {

        setLoading(false);

    }

};

const handleUpdateStatus = async (user) => {

    const token = localStorage.getItem("token");

    const buttonNo =
        user.status === "UAC"
            ? "BB20"
            : "BB19";

    const buttonName =
        user.status === "UAC"
            ? "Deactivate User Button"
            : "Activate User Button";

    const request = {
        method: "PUT",
        url: `http://localhost:8080/api/users/updateStatus/${user.userId}`
    };

    try {
        const response = await axios.put(
            request.url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        logButtonEvent({
            buttonNo,
            buttonName,
            request,
            response: response.data,
            status: response.status
        });
        fetchUsers();
    } catch (error) {
        logButtonEvent({
            buttonNo,
            buttonName,
            request,
            response:
                error.response?.data ||
                error.message,
            status:
                error.response?.status ||
                500
        });
        toast.error(error.response?.data?.message ||"Unable to update user status.");
    }
};

    if (loading) {
        return (
            <div className="text-center mt-4">
                Loading Users...
            </div>
        );
    }

    if (error) {
        return (
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.length>0
                        ?
                        users.map(user=>(
                           <tr
                               key={user.userId}
                               style={{ cursor: "pointer" }}
                               onClick={() => {
                                   logButtonEvent({
                                       buttonNo: "BB16",
                                       buttonName: "User Row Click",
                                       request: {
                                           action: "Open User",
                                           userId: user.userId
                                       },
                                       response: {
                                           message: "Opening View/Edit User",
                                           userId: user.userId
                                       },
                                       status: 200
                                   });
                                   navigate(`/admin/view-user/${user.userId}`);
                               }}
                           >
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
                                <td>
                                    <button
                                        className={
                                            user.status === "UAC" ? "deactivate-btn" : "activate-btn"
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateStatus(user);
                                        }}
                                    >
                                        {user.status === "UAC" ? "Deactivate" : "Activate"}
                                    </button>
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