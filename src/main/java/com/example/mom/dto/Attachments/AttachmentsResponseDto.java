package com.example.mom.dto.Attachments;

import com.example.mom.entity.Attachments;

import java.time.LocalDateTime;

public class AttachmentsResponseDto {

    private String attachmentId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String createdBy;
    private LocalDateTime uploadedAt;

    public AttachmentsResponseDto(Attachments attachment) {
        this.attachmentId = attachment.getAttachmentId();
        this.fileName = attachment.getFileName();
        this.fileType = attachment.getFileType();
        this.fileSize = attachment.getFileSize();
        this.createdBy = attachment.getCreatedBy().getUserName();
        this.uploadedAt = attachment.getUploadedAt();
    }

    public String getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(String attachmentId) {
        this.attachmentId = attachmentId;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}