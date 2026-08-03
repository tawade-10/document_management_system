package com.example.mom.dto.Pages;

import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PagesResponseDto {

    private String pageId;

    private String title;

    private List<String> participants;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String pageContent;

    private String status;

    private String notebookId;

    public PagesResponseDto(Pages pages) {
        this.pageId = pages.getPageId();
        this.title = pages.getTitle();
        this.participants = pages.getParticipants() == null
                ? new ArrayList<>()
                : Arrays.stream(pages.getParticipants().split(","))
                .map(String::trim)
                .toList();
        this.createdBy = pages.getCreatedBy().getUserName();
        this.createdAt = pages.getCreatedAt();
        this.updatedAt = pages.getUpdatedAt();
        this.pageContent = pages.getPageContent();
        this.status = pages.getStatus().getStatusId();
        this.notebookId = pages.getNotebooks() != null
                ? pages.getNotebooks().getNotebookId()
                : null;
    }

    public PagesResponseDto() {
    }

    public String getPageId() {
        return pageId;
    }

    public void setPageId(String pageId) {
        this.pageId = pageId;
    }

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

    public String getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(String notebookId) {
        this.notebookId = notebookId;
    }
}
