package com.example.mom.controller;

import com.example.mom.dto.Attachments.AttachmentsResponseDto;
import com.example.mom.facade.Attachments.AttachmentsFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
        import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentsController {

    private final AttachmentsFacade attachmentsFacade;

    public AttachmentsController(AttachmentsFacade attachmentsFacade) {
        this.attachmentsFacade = attachmentsFacade;
    }

    @PostMapping("/{pageId}")
    public ResponseEntity<AttachmentsResponseDto> uploadAttachment(@PathVariable String pageId, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(attachmentsFacade.uploadAttachment(pageId, file));
    }
}
