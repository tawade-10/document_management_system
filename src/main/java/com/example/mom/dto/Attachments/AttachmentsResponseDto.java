package com.example.mom.dto.Attachments;

import com.example.mom.entity.Attachments;

import java.time.LocalDateTime;

public class AttachmentsResponseDto {

    private String attachmentId;
    private String pageId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String attachedBy;
    private LocalDateTime attachedAt;

    public AttachmentsResponseDto(Attachments attachment) {
        this.attachmentId = attachment.getAttachmentId();
        this.pageId = attachment.getPages().getPageId();
        this.fileName = attachment.getFileName();
        this.fileType = attachment.getFileType();
        this.fileSize = attachment.getFileSize();
        this.attachedBy = attachment.getAttachedBy().getUserName();
        this.attachedAt = attachment.getAttachedAt();
    }

    public String getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(String attachmentId) {
        this.attachmentId = attachmentId;
    }

    public String getPageId() {
        return pageId;
    }

    public void setPageId(String pageId) {
        this.pageId = pageId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getAttachedBy() {
        return attachedBy;
    }

    public void setAttachedBy(String attachedBy) {
        this.attachedBy = attachedBy;
    }

    public LocalDateTime getAttachedAt() {
        return attachedAt;
    }

    public void setAttachedAt(LocalDateTime attachedAt) {
        this.attachedAt = attachedAt;
    }
}