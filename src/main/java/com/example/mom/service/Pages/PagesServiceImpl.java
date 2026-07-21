package com.example.mom.service.Pages;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.PagesRepo;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PagesServiceImpl implements PagesService{

    private final CustomIdGenerator customIdGenerator;

    private final UsersRepo usersRepo;

    private final PagesRepo pagesRepo;

    private final StatusRepo statusRepo;

    public PagesServiceImpl(CustomIdGenerator customIdGenerator, UsersRepo usersRepo, PagesRepo pagesRepo, StatusRepo statusRepo) {
        this.customIdGenerator = customIdGenerator;
        this.usersRepo = usersRepo;
        this.pagesRepo = pagesRepo;
        this.statusRepo = statusRepo;
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
    public PagesResponseDto publishPage(PagesRequestDto pagesRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String user = authentication.getName();

        Users users = usersRepo.findByEmail(user)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Status status = statusRepo.findById("PPB")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        Pages pages = new Pages();

        pages.setPageId(customIdGenerator.generatePageId());
        pages.setTitle(pagesRequestDto.getTitle());
        pages.setParticipants(pagesRequestDto.getParticipants());
        pages.setCreatedBy(users);
        pages.setCreatedAt(LocalDateTime.now());
        pages.setPageContent(pagesRequestDto.getPageContent());
        pages.setStatus(status);
        pages.setPublishedAt(LocalDateTime.now());

        Pages savedPages = pagesRepo.save(pages);

        return new PagesResponseDto(savedPages);
    }

    @Override
    public PagesResponseDto archivePage(String pageId) {
        return null;
    }

}
