package com.example.mom.dto.Users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UsersCreationRequestDto {

    @NotBlank(message = "User name cannot be empty")
    private String userName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid Email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    private String authorityId;

    public UsersCreationRequestDto(String userName, String email, String password, String authorityId) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.authorityId = authorityId;
    }

    public UsersCreationRequestDto() {
    }

    public String getUserName() { return userName; }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuthorityId() { return authorityId; }

    public void setAuthorityId(String authorityId) { this.authorityId = authorityId; }
}
