package com.example.mom.dto.Users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UsersCreationRequestDto {

    @NotBlank(message = "User name cannot be empty")
    private String userName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid Email format")
    private String email;

    @NotBlank(message = "Authority cannot be empty")
    private String authorityId;

    public UsersCreationRequestDto() {
    }

    public UsersCreationRequestDto(String userName, String email, String authorityId) {
        this.userName = userName;
        this.email = email;
        this.authorityId = authorityId;
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

    public String getAuthorityId() {
        return authorityId;
    }

    public void setAuthorityId(String authorityId) {
        this.authorityId = authorityId;
    }
}