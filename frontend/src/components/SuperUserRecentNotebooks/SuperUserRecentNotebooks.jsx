import React from "react";
import { useOutletContext } from "react-router-dom";
import RecentNotebooks from "../RecentNotebooks/RecentNotebooks";
import SuperUserRecentPages from "../SuperUserRecentPages/SuperUserRecentPages";
import UnmappedPages from "../UnmappedPages/UnmappedPages";
import "./SuperUserRecentNotebooks.css";

export default function SuperUserRecentNotebooks() {

    const { searchKeyword } = useOutletContext();

    return (
        <div className="user-home-page">

            <div className="user-home-content">

                <div className="user-home-grid">

                    <section className="user-home-section">

                        <RecentNotebooks
                            searchKeyword={searchKeyword}
                            superUser={true}
                        />

                    </section>

                    <section className="user-home-section">

                        <SuperUserRecentPages
                            searchKeyword={searchKeyword}
                        />

                    </section>

                    <section className="user-home-section">

                        <UnmappedPages
                            searchKeyword={searchKeyword}
                            superUser={true}
                        />

                    </section>

                </div>

            </div>

        </div>
    );
}