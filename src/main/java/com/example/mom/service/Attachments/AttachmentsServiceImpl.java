package com.example.mom.service.Attachments;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Attachments.AttachmentsRequestDto;
import com.example.mom.dto.Attachments.AttachmentsResponseDto;
import com.example.mom.entity.Attachments;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Users;
import com.example.mom.facade.AttachmentsFacade.AttachmentsFacade;
import com.example.mom.repository.AttachmentsRepo;
import com.example.mom.repository.NotebooksRepo;
import com.example.mom.repository.PagesRepo;
import com.example.mom.repository.UsersRepo;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

public class AttachmentsServiceImpl implements AttachmentsService {

    private final String uploadDir = "uploads/";

    private final CustomIdGenerator customIdGenerator;

    private final AttachmentsRepo attachmentsRepo;

    private final UsersRepo usersRepo;

    private final PagesRepo pagesRepo;

    public AttachmentsServiceImpl(CustomIdGenerator customIdGenerator, AttachmentsRepo attachmentsRepo, UsersRepo usersRepo, PagesRepo pagesRepo) {
        this.customIdGenerator = customIdGenerator;
        this.attachmentsRepo = attachmentsRepo;
        this.usersRepo = usersRepo;
        this.pagesRepo = pagesRepo;
    }

    @Override
    public @Nullable AttachmentsResponseDto uploadAttachment(String pageId, MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Users user = usersRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page not found"));

        try {

            File directory = new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            String storedFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir, storedFileName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            Attachments attachment = new Attachments();

            attachment.setAttachmentId(customIdGenerator.generateAttachmentId());
            attachment.setPages(page);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setFilePath(path.toString());
            attachment.setCreatedBy(user);
            attachment.setUploadedAt(LocalDateTime.now());

            attachmentsRepo.save(attachment);

            return new AttachmentsResponseDto(attachment);

        } catch (IOException e) {
            throw new RuntimeException("Unable to upload file");
        }
    }
}
