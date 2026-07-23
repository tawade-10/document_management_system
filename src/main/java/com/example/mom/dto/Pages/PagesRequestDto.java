package com.example.mom.dto.Pages;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class PagesRequestDto {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotEmpty(message = "Please add at least one participant")
    private List<String> participants;

    @NotBlank(message = "Page content cannot be empty")
    private String pageContent;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }

    public String getPageContent() {
        return pageContent;
    }

    public void setPageContent(String pageContent) {
        this.pageContent = pageContent;
    }
}
