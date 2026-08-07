import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

export default function Layout() {

    const [searchKeyword, setSearchKeyword] = useState("");

    const [sortBy, setSortBy] = useState("userName");
    const [sortDir, setSortDir] = useState("asc");

    const [authorityFilter, setAuthorityFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);

    return (
        <div className="layout">
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
            <main className="layout-content">
                <Outlet
                    context={{
                        searchKeyword,
                        sortBy,
                        sortDir,
                        authorityFilter,
                        statusFilter
                    }}
                />
            </main>
            <Footer />
        </div>
    );
}