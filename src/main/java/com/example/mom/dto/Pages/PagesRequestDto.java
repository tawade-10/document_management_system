package com.example.mom.dto.Pages;

import jakarta.validation.constraints.NotBlank;

public class PagesRequestDto {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Participants cannot be empty")
    private String participants;

    @NotBlank(message = "Page content cannot be empty")
    private String pageContent;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getParticipants() {
        return participants;
    }

    public void setParticipants(String participants) {
        this.participants = participants;
    }

    public String getPageContent() {
        return pageContent;
    }

    public void setPageContent(String pageContent) {
        this.pageContent = pageContent;
    }
}
