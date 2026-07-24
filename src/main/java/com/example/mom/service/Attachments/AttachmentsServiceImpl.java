package com.example.mom.service.Attachments;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Attachments.AttachmentsResponseDto;
import com.example.mom.entity.Attachments;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Users;
import com.example.mom.repository.AttachmentsRepo;
import com.example.mom.repository.PagesRepo;
import com.example.mom.repository.UsersRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AttachmentsServiceImpl implements AttachmentsService {

    private static final String UPLOAD_DIR = "uploads";

    private final CustomIdGenerator customIdGenerator;
    private final AttachmentsRepo attachmentsRepo;
    private final UsersRepo usersRepo;
    private final PagesRepo pagesRepo;

    public AttachmentsServiceImpl(CustomIdGenerator customIdGenerator,
                                  AttachmentsRepo attachmentsRepo,
                                  UsersRepo usersRepo,
                                  PagesRepo pagesRepo) {
        this.customIdGenerator = customIdGenerator;
        this.attachmentsRepo = attachmentsRepo;
        this.usersRepo = usersRepo;
        this.pagesRepo = pagesRepo;
    }

    @Override
    public AttachmentsResponseDto uploadAttachment(String pageId, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a file to upload.");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new RuntimeException("Invalid file name.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated.");
        }

        Users user = usersRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page not found."));

        try {

            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String storedFileName = UUID.randomUUID() + "_" + originalFileName;

            Path destination = uploadPath.resolve(storedFileName);

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Attachments attachment = new Attachments();

            attachment.setAttachmentId(customIdGenerator.generateAttachmentId());
            attachment.setPages(page);
            attachment.setFileName(originalFileName);
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setFilePath(storedFileName);
            attachment.setAttachedBy(user);
            attachment.setAttachedAt(LocalDateTime.now());

            attachment = attachmentsRepo.save(attachment);

            return new AttachmentsResponseDto(attachment);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file.", e);
        }
    }
}