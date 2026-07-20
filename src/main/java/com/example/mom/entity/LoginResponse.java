package com.example.mom.entity;

public class LoginResponse {

    private final String token;
    private final String userName;
    private final String email;
    private final String authorityName;
    private final String userId;

    public LoginResponse(String token, String userName, String email, String authorityName, String userId) {
        this.token = token;
        this.userName = userName;
        this.email = email;
        this.authorityName = authorityName;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public String getAuthorityName() {
        return authorityName;
    }

    public String getUserId() {
        return userId;
    }
}
