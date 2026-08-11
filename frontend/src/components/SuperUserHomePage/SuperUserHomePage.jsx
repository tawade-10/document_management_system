import React, { useState } from "react";
import Header from "../Header/Header";
import NotebooksTable from "../NotebooksTable/NotebooksTable";
import "./SuperUserHomePage.css";

export default function SuperUserHomePage() {

    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");
    const [authorityFilter, setAuthorityFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);

    return (
        <>
            <Header
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDir={sortDir}
                setSortDir={setSortDir}
                authorityFilter={authorityFilter}
                setAuthorityFilter={setAuthorityFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
            <div className="superuser-home">
                <NotebooksTable
                    searchKeyword={searchKeyword}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    authorityFilter={authorityFilter}
                    statusFilter={statusFilter}
                />
            </div>
        </>
    );
}