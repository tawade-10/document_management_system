package com.example.mom.service.Pages;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.NotebooksRepo;
import com.example.mom.repository.PagesRepo;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
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
    public PagesResponseDto createPage(PagesRequestDto pagesRequestDto) {

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
        pages.setTitle(pagesRequestDto.getTitle());
        pages.setParticipants(pagesRequestDto.getParticipants());
        pages.setCreatedBy(users);
        pages.setCreatedAt(LocalDateTime.now());
        pages.setPageContent(pagesRequestDto.getPageContent());
        pages.setStatus(status);

        Pages savedPages = pagesRepo.save(pages);

        return new PagesResponseDto(savedPages);
    }

    @Override
    public List<PagesResponseDto> getAllPages() {
        List<Pages> pages = pagesRepo.findAll();
        return pages.stream().map(PagesResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public PagesResponseDto getPageById(String pageId) {

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page Not found"));

        return new PagesResponseDto(page);
    }

    @Override
    public PagesResponseDto editPageDetails(String pageId, PagesRequestDto pagesRequestDto) {

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page Not found"));

        page.setTitle(pagesRequestDto.getTitle());
        page.setParticipants(pagesRequestDto.getParticipants());
        page.setUpdatedAt(LocalDateTime.now());
        page.setPageContent(pagesRequestDto.getPageContent());

        Pages editedPage = pagesRepo.save(page);

        return new PagesResponseDto(editedPage);
    }

    @Override
    public PagesResponseDto publishPage(String pageId, PagesRequestDto pagesRequestDto) {

        Pages pages = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page Not found"));

        Status status = statusRepo.findById("PPB")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        pages.setStatus(status);
        pages.setPublishedAt(LocalDateTime.now());

        Pages savedPages = pagesRepo.save(pages);

        return new PagesResponseDto(savedPages);
    }

    @Override
    public PagesResponseDto archivePage(String pageId) {

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page not found"));

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
        return new PagesResponseDto(archivedPage);
    }

    @Override
    public List<PagesResponseDto> getPublishedPages() {

        List<Pages> publishedPages = pagesRepo.findByStatus_StatusId("PPB");

        return publishedPages.stream().map(PagesResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public List<PagesResponseDto> getArchivedPages() {

        List<Pages> archivedPages = pagesRepo.findByStatus_StatusIdIn(List.of("PSA", "PPA"));

        return archivedPages.stream().map(PagesResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public PagesResponseDto mapPageToNotebook(String pageId, String notebookId) {

        Notebooks notebook = notebooksRepo.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook not found"));

        Pages page = pagesRepo.findById(pageId)
                .orElseThrow(() -> new RuntimeException("Page not found"));

        String status = page.getStatus().getStatusId();

        if ("PSV".equals(status) || "PSA".equals(status)){
            throw new RuntimeException("Archived pages cannot be mapped to a notebook.");
        }

        page.setNotebooks(notebook);
        Pages mappedToNotebook = pagesRepo.save(page);
        return new PagesResponseDto(mappedToNotebook);
    }

    @Override
    public List<PagesResponseDto> getAllPagesByNotebook(String notebookId) {

        List<Pages> pages = pagesRepo.findByNotebooks_NotebookId(notebookId);

        return pages.stream().map(PagesResponseDto::new).toList();
    }

}
