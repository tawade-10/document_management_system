package com.example.mom.service.Attachments;

import com.example.mom.dto.Attachments.AttachmentsResponseDto;
import org.jspecify.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

public interface AttachmentsService {

    @Nullable AttachmentsResponseDto uploadAttachment(String pageId, MultipartFile file);
}
