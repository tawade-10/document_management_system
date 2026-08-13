package com.example.mom.dto.Pages;

import com.example.mom.entity.Pages;
import java.time.LocalDateTime;

public class PagesCreationResponseDto {

    private String pageId;
    private String title;
    private String notebookId;
    private String createdBy;
    private LocalDateTime createdAt;
    private String status;

    public PagesCreationResponseDto(Pages pages) {
        this.pageId = pages.getPageId();
        this.title = pages.getTitle();
        this.createdBy = pages.getCreatedBy().getUserName();
        this.createdAt = pages.getCreatedAt();
        this.status = pages.getStatus().getStatusId();
        this.notebookId = pages.getNotebooks() != null
                ? pages.getNotebooks().getNotebookId()
                : null;
    }

    public PagesCreationResponseDto() {
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

    public String getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(String notebookId) {
        this.notebookId = notebookId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
