package com.example.mom.facade.AttachmentsFacade;

import com.example.mom.dto.Attachments.AttachmentsResponseDto;
import com.example.mom.service.Attachments.AttachmentsService;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class AttachmentsFacadeImpl implements AttachmentsFacade{

    private final AttachmentsService attachmentsService;

    public AttachmentsFacadeImpl(AttachmentsService attachmentsService) {
        this.attachmentsService = attachmentsService;
    }

    @Override
    public @Nullable AttachmentsResponseDto uploadAttachment(String pageId, MultipartFile file) {
        return attachmentsService.uploadAttachment(pageId,file);
    }
}
