package com.example.mom.dto.Pages;

import jakarta.validation.constraints.NotBlank;

public class PagesCreationRequestDto {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String notebookId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(String notebookId) {
        this.notebookId = notebookId;
    }
}