import React, { useState } from "react";
import Header from "../Header/Header";
import UsersTable from "../UsersTable/UsersTable";

export default function AdminHomePage() {

    const [searchKeyword, setSearchKeyword] = useState("");

    return (
        <>
            <Header
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
            />
            <UsersTable
                searchKeyword={searchKeyword}
            />
        </>
    );
}