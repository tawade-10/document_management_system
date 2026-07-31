package com.example.mom.facade.Attachments;

import com.example.mom.dto.Attachments.AttachmentsResponseDto;
import org.jspecify.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

public interface AttachmentsFacade {

    @Nullable AttachmentsResponseDto uploadAttachment(String pageId, MultipartFile file);
}
