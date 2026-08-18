package com.example.mom.dto.Pages;

import jakarta.validation.constraints.NotBlank;

public class PageStatusUpdateRequestDto {

    @NotBlank(message = "Status action is required")
    private String action;

    public PageStatusUpdateRequestDto() {
    }

    public PageStatusUpdateRequestDto(String action) {
        this.action = action;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}