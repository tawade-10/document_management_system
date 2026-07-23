package com.example.mom.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "status")
public class Status {

    @Id
    @Column(name = "status_id")
    private String statusId;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "status", fetch = FetchType.LAZY)
    private List<Users> users = new ArrayList<>();

    @OneToMany(mappedBy = "status", fetch = FetchType.LAZY)
    private List<Notebooks> notebooks = new ArrayList<>();

    @OneToMany(mappedBy = "status", fetch = FetchType.LAZY)
    private List<Pages> pages = new ArrayList<>();

    public String getStatusId() {
        return statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Users> getUsers() {
        return users;
    }

    public void setUsers(List<Users> users) {
        this.users = users;
    }

    public List<Notebooks> getNotebooks() {
        return notebooks;
    }

    public void setNotebooks(List<Notebooks> notebooks) {
        this.notebooks = notebooks;
    }

    public List<Pages> getPages() {
        return pages;
    }

    public void setPages(List<Pages> pages) {
        this.pages = pages;
    }
}