import React from "react";
import { useOutletContext } from "react-router-dom";
import NotebooksTable from "../NotebooksTable/NotebooksTable";
import "./SuperUserHomePage.css";

export default function SuperUserHomePage() {

    const {
        searchKeyword,
        sortBy,
        sortDir,
        authorityFilter,
        statusFilter
    } = useOutletContext();

    return (
        <div className="superuser-home">
            <NotebooksTable
                searchKeyword={searchKeyword}
                sortBy={sortBy}
                sortDir={sortDir}
                authorityFilter={authorityFilter}
                statusFilter={statusFilter}
            />
        </div>
    );
}