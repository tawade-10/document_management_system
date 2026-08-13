package com.example.mom.service.Pages;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Pages.PagesCreationRequestDto;
import com.example.mom.dto.Pages.PagesCreationResponseDto;
import com.example.mom.dto.Pages.PagesUpdateRequestDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.NotebooksRepo;
import com.example.mom.repository.PagesRepo;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import org.springframework.data.domain.Sort;
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

    public PagesServiceImpl(CustomIdGenerator customIdGenerator, UsersRepo usersRepo, PagesRepo pagesRepo, StatusRepo statusRepo, NotebooksRepo notebooksRepo) {
        this.customIdGenerator = customIdGenerator;
        this.usersRepo = usersRepo;
        this.pagesRepo = pagesRepo;
        this.statusRepo = statusRepo;
        this.notebooksRepo = notebooksRepo;
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
    public List<PagesUpdateResponseDto> getAllPages(String sortBy, String sortDir) {

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC,
                sortBy
        );
        List<Pages> pages = pagesRepo.findAll(sort);
        return pages.stream().map(PagesUpdateResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<PagesUpdateResponseDto> getPagesByUser(String sortBy, String sortDir) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        List<Pages> pages = pagesRepo.findByCreatedBy(user);

        return pages.stream().map(PagesUpdateResponseDto::new).toList();
    }

    @Override
    public PagesUpdateResponseDto getPageById(String pageId) {

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page Not found"));

        return new PagesUpdateResponseDto(page);
    }

    @Override
    public PagesUpdateResponseDto editPageDetails(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated()) {
//            throw new RuntimeException("User not authenticated");
//        }
//
//        String email = authentication.getName();
//
//        Users loggedInUser = usersRepo.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found!"));
//
//        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
//                .orElseThrow(() -> new RuntimeException("Cannot update Page Details!"));
//
//        page.setTitle(pagesUpdateRequestDto.getTitle());
//        page.setParticipants(
//                String.join(",", pagesUpdateRequestDto.getParticipants())
//        );
//        page.setUpdatedAt(LocalDateTime.now());
//        page.setPageContent(pagesUpdateRequestDto.getPageContent());
//
//        Pages editedPage = pagesRepo.save(page);
//
//        return new PagesUpdateResponseDto(editedPage);
        return null;
    }

    @Override
    public PagesUpdateResponseDto publishPage(String pageId, PagesUpdateRequestDto pagesRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users loggedInUser = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Pages page = pagesRepo.findByPageIdAndCreatedBy(pageId, loggedInUser)
                .orElseThrow(() -> new RuntimeException("Cannot publish Page!"));

        Status status = statusRepo.findById("PPB")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        page.setStatus(status);
        page.setPublishedAt(LocalDateTime.now());

        Pages savedPages = pagesRepo.save(page);

        return new PagesUpdateResponseDto(savedPages);
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
        } else {
            throw new RuntimeException("Only Saved or Published pages can be archived.");
        }

        page.setArchivedAt(LocalDateTime.now());
        Pages archivedPage = pagesRepo.save(page);
        return new PagesUpdateResponseDto(archivedPage);
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
    public List<PagesUpdateResponseDto> getAllPagesByNotebook(String notebookId) {

        List<Pages> pages = pagesRepo.findByNotebooks_NotebookId(notebookId);

        return pages.stream().map(PagesUpdateResponseDto::new).toList();
    }
}
