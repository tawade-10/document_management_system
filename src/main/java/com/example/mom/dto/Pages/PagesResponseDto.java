package com.example.mom.dto.Pages;

import com.example.mom.entity.Pages;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class PagesResponseDto {

    private String title;

    private String participants;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String pageContent;

    private String status;

    public PagesResponseDto(Pages pages) {
        this.title = pages.getTitle();
        this.participants = pages.getParticipants();
        this.createdBy = pages.getCreatedBy().getUserName();
        this.createdAt = pages.getCreatedAt();
        this.updatedAt = pages.getUpdatedAt();
        this.pageContent = pages.getPageContent();
        this.status = pages.getStatus().getStatusId();
    }

    public PagesResponseDto() {
    }

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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getPageContent() {
        return pageContent;
    }

    public void setPageContent(String pageContent) {
        this.pageContent = pageContent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
