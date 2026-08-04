import React from "react";
import { useOutletContext } from "react-router-dom";
import UsersTable from "../UsersTable/UsersTable";

export default function AdminHomePage() {

    const { searchKeyword } = useOutletContext();

    return (
        <UsersTable searchKeyword={searchKeyword} />
    );
}