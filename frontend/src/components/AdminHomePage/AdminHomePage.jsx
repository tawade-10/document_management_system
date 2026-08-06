import React from "react";
import { useOutletContext } from "react-router-dom";
import UsersTable from "../UsersTable/UsersTable";

export default function AdminHomePage() {

    const {
        searchKeyword,
        sortBy,
        sortDir,
        authorityFilter,
        statusFilter
    } = useOutletContext();

    return (
        <UsersTable
            searchKeyword={searchKeyword}
            sortBy={sortBy}
            sortDir={sortDir}
            authorityFilter={authorityFilter}
            statusFilter={statusFilter}
        />
    );
}