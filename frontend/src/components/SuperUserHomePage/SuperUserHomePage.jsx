import React from "react";
import Header from "../Header/Header";
import "./SuperUserHomePage.css";

export default function SuperUserHomePage() {

    const data = [
        {
            id: "NA0001",
            name: "Development",
            type: "Notebook",
            owner: "John",
            status: "Active"
        },
        {
            id: "PA0001",
            name: "Sprint Planning",
            type: "Page",
            owner: "John",
            status: "Published"
        },
        {
            id: "PA0002",
            name: "Client Meeting",
            type: "Page",
            owner: "David",
            status: "Draft"
        },
        {
            id: "NA0002",
            name: "HR",
            type: "Notebook",
            owner: "Priya",
            status: "Active"
        },
        {
            id: "PA0003",
            name: "Interview Process",
            type: "Page",
            owner: "Priya",
            status: "Archived"
        }
    ];

    return (
        <>
            <Header />

            <div className="superuser-home">

                <div className="table-card">

                    <div className="table-container">

                        <table className="table align-middle">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {data.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.id}</td>

                                        <td>{item.name}</td>

                                        <td>

                                            <span
                                                className={
                                                    item.type === "Notebook"
                                                        ? "type notebook"
                                                        : "type page"
                                                }
                                            >
                                                {item.type}
                                            </span>

                                        </td>

                                        <td>{item.owner}</td>

                                        <td>

                                            <span
                                                className={`status ${item.status.toLowerCase()}`}
                                            >
                                                {item.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </>
    );
}