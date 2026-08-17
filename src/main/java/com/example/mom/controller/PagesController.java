package com.example.mom.controller;

import com.example.mom.dto.Pages.PagesCreationRequestDto;
import com.example.mom.dto.Pages.PagesCreationResponseDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import com.example.mom.dto.Pages.PagesUpdateRequestDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import com.example.mom.facade.Pages.PagesFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PagesController {

    private final PagesFacade pagesFacade;

    public PagesController(PagesFacade pagesFacade) {
        this.pagesFacade = pagesFacade;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesCreationResponseDto> createPage(@Valid @RequestBody PagesCreationRequestDto pagesCreationRequestDto){
        PagesCreationResponseDto createdPage = pagesFacade.createPage(pagesCreationRequestDto);
        return new ResponseEntity<>(createdPage, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER')")
    public ResponseEntity<List<PagesUpdateResponseDto>> getAllPages(@RequestParam String sortBy, @RequestParam String sortDir){
        List<PagesUpdateResponseDto> allPages = pagesFacade.getAllPages(sortBy,sortDir);
        return ResponseEntity.ok(allPages);
    }

    @GetMapping("/allPages")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PagesUpdateResponseDto>> getPagesByUser(@RequestParam String sortBy, @RequestParam String sortDir){
        List<PagesUpdateResponseDto> pagesByUser = pagesFacade.getPagesByUser(sortBy,sortDir);
        return ResponseEntity.ok(pagesByUser);
    }

    @GetMapping("/{pageId}")
    public ResponseEntity<PagesUpdateResponseDto> getPageById(@PathVariable String pageId){
        PagesUpdateResponseDto pageById = pagesFacade.getPageById(pageId);
        return ResponseEntity.ok(pageById);
    }

    @PutMapping("/updateDetails/{pageId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesUpdateResponseDto> editPageDetails(@PathVariable String pageId, @Valid @RequestBody PagesUpdateRequestDto pagesUpdateRequestDto){
        PagesUpdateResponseDto editedPage = pagesFacade.editPageDetails(pageId, pagesUpdateRequestDto);
        return ResponseEntity.ok(editedPage);
    }

    @PutMapping("/publish/{pageId}")
    @PreAuthorize("hasAnyRole('USER', 'SUPER_USER')")
    public ResponseEntity<PagesUpdateResponseDto> publishPage(@PathVariable String pageId, @Valid @RequestBody PagesUpdateRequestDto pagesRequestDto){
        PagesUpdateResponseDto publishedPage = pagesFacade.publishPage(pageId, pagesRequestDto);
        return ResponseEntity.ok(publishedPage);
    }

    @PutMapping("/archive/{pageId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesUpdateResponseDto> archivePage(@PathVariable String pageId){
        PagesUpdateResponseDto archivedPage = pagesFacade.archivePage(pageId);
        return ResponseEntity.ok(archivedPage);
    }

    @GetMapping("/published")
    public ResponseEntity<List<PagesUpdateResponseDto>> getPublishedPages(){
        List<PagesUpdateResponseDto> allPublishedPages = pagesFacade.getPublishedPages();
        return ResponseEntity.ok(allPublishedPages);
    }

    @GetMapping("/publishedByUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PagesUpdateResponseDto>> getPublishedPagesByUser(){
        List<PagesUpdateResponseDto> publishedPagesByUser = pagesFacade.getPublishedPagesByUser();
        return ResponseEntity.ok(publishedPagesByUser);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<PagesUpdateResponseDto>> getArchivedPages(){
        List<PagesUpdateResponseDto> allArchivedPages = pagesFacade.getArchivedPages();
        return ResponseEntity.ok(allArchivedPages);
    }

    @GetMapping("/archivedByUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PagesUpdateResponseDto>> getArchivedPagesByUser(){
        List<PagesUpdateResponseDto> archivedPagesByUser = pagesFacade.getArchivedPagesByUser();
        return ResponseEntity.ok(archivedPagesByUser);
    }

    @PutMapping("/{pageId}/notebook/{notebookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesUpdateResponseDto> mapPageToNotebook(@PathVariable String pageId, @PathVariable String notebookId){
        PagesUpdateResponseDto mappedPage = pagesFacade.mapPageToNotebook(pageId, notebookId);
        return ResponseEntity.ok(mappedPage);
    }

    @GetMapping("/{notebookId}/pages")
    @PreAuthorize("hasAnyRole('SUPER_USER','USER')")
    public ResponseEntity<List<PagesUpdateResponseDto>> getAllPagesByNotebook(@PathVariable String notebookId){
        List<PagesUpdateResponseDto> allPagesByNotebook = pagesFacade.getAllPagesByNotebook(notebookId);
        return ResponseEntity.ok(allPagesByNotebook);
    }
}
