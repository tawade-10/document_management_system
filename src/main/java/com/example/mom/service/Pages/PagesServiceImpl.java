package com.example.mom.service.Pages;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Pages.*;
import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.NotebooksRepo;
import com.example.mom.repository.PagesRepo;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import com.example.mom.service.Email.EmailServiceImpl;
import com.example.mom.specification.PagesSpecification;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagesServiceImpl implements PagesService{

    private final CustomIdGenerator customIdGenerator;

    private final UsersRepo usersRepo;

    private final PagesRepo pagesRepo;

    private final StatusRepo statusRepo;

    private final NotebooksRepo notebooksRepo;

    private final EmailServiceImpl emailService;

    public PagesServiceImpl(CustomIdGenerator customIdGenerator, UsersRepo usersRepo, PagesRepo pagesRepo, StatusRepo statusRepo, NotebooksRepo notebooksRepo, EmailServiceImpl emailService) {
        this.customIdGenerator = customIdGenerator;
        this.usersRepo = usersRepo;
        this.pagesRepo = pagesRepo;
        this.statusRepo = statusRepo;
        this.notebooksRepo = notebooksRepo;
        this.emailService = emailService;
    }

    @Override
    public PagesCreationResponseDto createPage(PagesCreationRequestDto pagesRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String user = authentication.getName();

        Users users = usersRepo.findByEmail(user)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Status status = statusRepo.findById("PSV")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        Pages pages = new Pages();

        pages.setPageId(customIdGenerator.generatePageId());
        pages.setTitle(pagesRequestDto.getTitle().trim());
        pages.setCreatedBy(users);
        pages.setCreatedAt(LocalDateTime.now());
        pages.setStatus(status);
        
        if (pagesRequestDto.getNotebookId() != null && !pagesRequestDto.getNotebookId().isBlank()) {
            Notebooks notebooks = notebooksRepo.findById(
                    pagesRequestDto.getNotebookId()).orElseThrow(() ->
                            new RuntimeException("Notebook not found!"));
            pages.setNotebooks(notebooks);
        }
        Pages savedPages = pagesRepo.save(pages);
        return new PagesCreationResponseDto(savedPages);
    }

    @Override
    public Page<PagesUpdateResponseDto> getAllPages(int page, int size, String search,String authority, String status, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Pages> specification = PagesSpecification.filterPages(search,authority,status);

        Page<Pages> pagesPage = pagesRepo.findAll(specification, pageable);

        return pagesPage.map(PagesUpdateResponseDto::new);
    }

    @Override
    public Page<PagesUpdateResponseDto> getPagesByUser(int page, int size, String search,String authority, String status, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String userId = user.getUserId();

        Page<Pages> pagesPage = pagesRepo.findByCreatedByUserId(userId, pageable);

        return pagesPage.map(PagesUpdateResponseDto::new);
    }

    @Override
    public PagesUpdateResponseDto getPageById(String pageId) {

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page Not found"));

        return new PagesUpdateResponseDto(page);
    }

    @Override
    public PagesUpdateResponseDto editPageDetails(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
                .orElseThrow(() -> new RuntimeException("Cannot update Page Details!"));

        String currentStatus = page.getStatus().getStatusId();

        if (!"PSV".equals(currentStatus)) {
            throw new RuntimeException("Only saved and unarchived pages can be edited.");
        }

        if (pagesUpdateRequestDto.getTitle() != null
                && !pagesUpdateRequestDto.getTitle().isBlank()) {

            page.setTitle(pagesUpdateRequestDto.getTitle().trim());
        }

        if (pagesUpdateRequestDto.getParticipants() == null
                || pagesUpdateRequestDto.getParticipants().isEmpty()) {

            throw new RuntimeException("Please add at least one participant.");
        }

        String participants = pagesUpdateRequestDto
                .getParticipants()
                .stream()
                .map(String::trim)
                .filter(participant -> !participant.isBlank())
                .distinct()
                .collect(Collectors.joining(","));

        if (participants.isBlank()) {
            throw new RuntimeException("Please add at least one valid participant.");
        }

        if (pagesUpdateRequestDto.getPageContent() == null
                || pagesUpdateRequestDto.getPageContent().isBlank()) {

            throw new RuntimeException("Page content cannot be empty.");
        }

        page.setParticipants(participants);
        page.setPageContent(pagesUpdateRequestDto.getPageContent());
        page.setUpdatedAt(LocalDateTime.now());

        Status savedStatus = statusRepo.findById("PSV")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        page.setStatus(savedStatus);
        Pages savedPage = pagesRepo.save(page);

        return new PagesUpdateResponseDto(savedPage);
    }

    @Override
    public PagesUpdateResponseDto publishPage(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found!"));

        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
                        .orElseThrow(() -> new RuntimeException("Cannot publish Page!"));

        if (pagesUpdateRequestDto.getParticipants() == null ||
                pagesUpdateRequestDto.getParticipants().isEmpty()) {
            throw new RuntimeException("Cannot publish page because no participants are assigned.");
        }

        String participants = pagesUpdateRequestDto.getParticipants()
                        .stream()
                        .map(String::trim)
                        .filter(participant ->
                                !participant.isBlank()
                        )
                        .distinct()
                        .collect(Collectors.joining(","));

        if (participants.isBlank()) {
            throw new RuntimeException(
                    "Cannot publish page because no valid participants are assigned."
            );
        }

        if (pagesUpdateRequestDto.getPageContent() == null ||
                pagesUpdateRequestDto.getPageContent().isBlank()) {

            throw new RuntimeException(
                    "Page content cannot be empty."
            );
        }

        page.setParticipants(participants);

        page.setPageContent(pagesUpdateRequestDto.getPageContent());

        Status status = statusRepo.findById("PPB").orElseThrow(() ->
                                new RuntimeException("Invalid Status!"));
        page.setStatus(status);
        page.setPublishedAt(LocalDateTime.now());
        Pages savedPage = pagesRepo.save(page);
        try {
            emailService.sendPublishedPage(
                    savedPage
            );
        } catch (MessagingException e) {
            throw new RuntimeException(
                    "Page was published but email could not be sent.",
                    e
            );
        }
        return new PagesUpdateResponseDto(savedPage);
    }

    @Override
    public PagesUpdateResponseDto archivePage(String pageId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
                .orElseThrow(() -> new RuntimeException("Cannot Archive Page!"));

        String currentStatus = page.getStatus().getStatusId();

        if ("PSV".equals(currentStatus)) {
            Status savedArchived = statusRepo.findById("PSA")
                    .orElseThrow(() -> new RuntimeException("Invalid Status!"));
            page.setStatus(savedArchived);
        } else if ("PPB".equals(currentStatus)) {
            Status publishedArchived = statusRepo.findById("PPA")
                    .orElseThrow(() -> new RuntimeException("Invalid Status!"));
            page.setStatus(publishedArchived);
        } else if ("PSA".equals(currentStatus)) {
            Status publishedUnarchived = statusRepo.findById("PSV")
                    .orElseThrow(() -> new RuntimeException("Invalid Status!"));
            page.setStatus(publishedUnarchived);
        } else if ("PPA".equals(currentStatus)) {
            Status savedUnarchived = statusRepo.findById("PPB")
                    .orElseThrow(() -> new RuntimeException("Invalid Status!"));
            page.setStatus(savedUnarchived);
        } else {
            throw new RuntimeException("Only Saved or Published pages can be archived.");
        }

        page.setArchivedAt(LocalDateTime.now());
        Pages archivedPage = pagesRepo.save(page);
        return new PagesUpdateResponseDto(archivedPage);
    }

    @Override
    public PagesUpdateResponseDto updatePageStatus(String pageId, PageStatusUpdateRequestDto pageStatusUpdateRequestDto) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated()) {
//            throw new RuntimeException("User not authenticated");
//        }
//
//        String email = authentication.getName();
//
//        Users loggedInUser = usersRepo.findByEmail(email)
//                        .orElseThrow(() -> new RuntimeException("User not found!"));
//
//        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
//                        .orElseThrow(() -> new RuntimeException("Cannot update Page Status!"));
//
//        String currentStatus = page.getStatus().getStatusId();
//
//        String action = pageStatusUpdateRequestDto.getAction().trim().toLowerCase();
//
//        String newStatus;
//
//        if ("archive".equals(action)) {
//            if ("PSV".equals(currentStatus)) {
//                newStatus = "PSA";
//            } else if ("PPB".equals(currentStatus)) {
//                newStatus = "PPA";
//            } else {
//                throw new RuntimeException(
//                        "Only Saved or Published pages can be archived."
//                );
//            }
//        } else if ("unarchive".equals(action)) {
//            if ("PSA".equals(currentStatus)) {
//                newStatus = "PSV";
//            } else if ("PPA".equals(currentStatus)) {
//                newStatus = "PPB";
//            } else {
//                throw new RuntimeException("Only Archived pages can be unarchived.");
//            }
//        } else {
//            throw new RuntimeException("Invalid page status action.");
//        }
//
//        Status status = statusRepo.findById(newStatus)
//                        .orElseThrow(() -> new RuntimeException("Invalid Status!"));
//
//        page.setStatus(status);
//        page.setUpdatedAt(LocalDateTime.now());
//
//        if ("archive".equals(action)) {
//            page.setArchivedAt(LocalDateTime.now());
//        } else {
//            page.setArchivedAt(null);
//        }
//
//        Pages updatedPage = pagesRepo.save(page);
//
//        return new PagesUpdateResponseDto(updatedPage);
        return null;
    }

    @Override
    public List<PagesUpdateResponseDto> getPublishedPages() {

        List<Pages> publishedPages = pagesRepo.findByStatus_StatusId("PPB");

        return publishedPages.stream().map(PagesUpdateResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<PagesUpdateResponseDto> getPublishedPagesByUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Status publishedStatus = statusRepo.findById("PPB")
                .orElseThrow(() -> new RuntimeException("Published status not found"));

        List<Pages> pages = pagesRepo.findByCreatedByAndStatus(loggedInUser, publishedStatus);

        return pages.stream().map(PagesUpdateResponseDto::new).toList();
    }

    @Override
    public List<PagesUpdateResponseDto> getArchivedPages() {

        List<Pages> archivedPages = pagesRepo.findByStatus_StatusIdIn(List.of("PSA", "PPA"));

        return archivedPages.stream().map(PagesUpdateResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<PagesUpdateResponseDto> getArchivedPagesByUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Status savedArchivedStatus = statusRepo.findById("PSA")
                .orElseThrow(() -> new RuntimeException("Saved Archived status not found"));

        Status publishedArchivedStatus = statusRepo.findById("PPA")
                .orElseThrow(() -> new RuntimeException("Published Archived status not found"));

        List<Pages> pages = pagesRepo.findByCreatedByAndStatusIn(
                loggedInUser,
                List.of(savedArchivedStatus, publishedArchivedStatus)
        );

        return pages.stream().map(PagesUpdateResponseDto::new).toList();
    }

    @Override
    public PagesUpdateResponseDto mapPageToNotebook(String pageId, String notebookId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Notebooks notebook = notebooksRepo.findByNotebookIdAndCreatedBy(notebookId, loggedInUser)
                .orElseThrow(() -> new RuntimeException("Notebook not found or access denied."));

        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
                .orElseThrow(() -> new RuntimeException("Page not found or access denied."));

        String status = page.getStatus().getStatusId();

        if ("PSA".equals(status)) {
            throw new RuntimeException("Archived pages cannot be mapped to a notebook.");
        }

        page.setNotebooks(notebook);
        page.setUpdatedAt(LocalDateTime.now());

        Pages mappedPage = pagesRepo.save(page);

        return new PagesUpdateResponseDto(mappedPage);
    }

    @Override
    public PagesUpdateResponseDto unmapPageFromNotebook(String pageId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
                .orElseThrow(() -> new RuntimeException("Page not found or access denied."));

        page.setNotebooks(null);

        Pages saved = pagesRepo.save(page);

        return new PagesUpdateResponseDto(saved);
    }

    @Override
    public List<PagesUpdateResponseDto> getAllPagesByNotebook(String notebookId) {

        List<Pages> pages = pagesRepo.findByNotebooks_NotebookId(notebookId);

        return pages.stream().map(PagesUpdateResponseDto::new).toList();
    }
}
