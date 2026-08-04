import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

export default function Layout() {

    const [searchKeyword, setSearchKeyword] = useState("");

    return (
        <div className="layout">
            <Header
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
            />
            <main className="layout-content">
                <Outlet context={{ searchKeyword }} />
            </main>
            <Footer />
        </div>
    );
}