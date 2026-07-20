package com.example.mom.dto.Notebooks;

import com.example.mom.entity.Notebooks;

import java.time.LocalDateTime;

public class NotebooksResponseDto {

    private String notebookId;

    private String name;

    private String description;

    private String status;

    private String createdBy;

    private LocalDateTime createdAt;

    public NotebooksResponseDto(Notebooks notebooks){
        this.notebookId = notebooks.getNotebookId();
        this.name = notebooks.getName();
        this.description = notebooks.getDescription();
        this.status = notebooks.getStatus().getStatusId();
        this.createdBy = notebooks.getCreatedBy().getUserName();
        this.createdAt = notebooks.getCreatedAt();
    }

    public String getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(String notebookId) {
        this.notebookId = notebookId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
