package com.example.mom.dto.Users;

public class LoginResponseDto {

    private String token;
    private String userId;
    private String userName;
    private String email;
    private String authorityName;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String token, String userId, String userName, String email, String authorityName) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.authorityName = authorityName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
}