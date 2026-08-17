import React from "react";
import { useOutletContext } from "react-router-dom";
import RecentNotebooks from "../RecentNotebooks/RecentNotebooks";
import RecentPages from "../RecentPages/RecentPages";
import UnmappedPages from "../UnmappedPages/UnmappedPages";
import "./UserHomePage.css";

export default function UserHomePage() {

    const { searchKeyword } = useOutletContext();

    return (
        <div className="user-home-page">

            <div className="user-home-content">

                <div className="user-home-grid">

                    <section className="user-home-section">
                        <RecentNotebooks
                            searchKeyword={searchKeyword}
                        />
                    </section>

                    <section className="user-home-section">
                        <RecentPages
                            searchKeyword={searchKeyword}
                        />
                    </section>

                    <section className="user-home-section">
                        <UnmappedPages
                            searchKeyword={searchKeyword}
                        />
                    </section>

                </div>

            </div>

        </div>
    );
}