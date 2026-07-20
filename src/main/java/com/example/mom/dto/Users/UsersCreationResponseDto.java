package com.example.mom.dto.Users;

import com.example.mom.entity.Users;

import java.time.LocalDateTime;

public class UsersCreationResponseDto {

    private String userId;

    private String userName;

    private String email;

    private String authorityName;

    private LocalDateTime createdAt;

    public UsersCreationResponseDto(Users users) {
        this.userId = users.getUserId();
        this.userName = users.getUserName();
        this.email = users.getEmail();
        this.authorityName = users.getAuthorityProfiles().getAuthorityName();
        this.createdAt = users.getCreatedAt();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAuthorityName() {
        return authorityName;
    }

    public void setAuthorityName(String authorityName) {
        this.authorityName = authorityName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
