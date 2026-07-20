package com.example.mom.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authority_profiles")
public class AuthorityProfiles {

    @Id
    @Column(name = "authority_id", length = 10)
    private String authorityId;

    @Column(name = "authority_name", nullable = false, unique = true, length = 100)
    private String authorityName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "authorityProfiles", fetch = FetchType.LAZY)
    private List<Users> users = new ArrayList<>();

    public String getAuthorityId() {
        return authorityId;
    }

    public void setAuthorityId(String authorityId) {
        this.authorityId = authorityId;
    }

    public String getAuthorityName() { return authorityName; }

    public void setAuthorityName(String authorityName) { this.authorityName = authorityName; }

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
}