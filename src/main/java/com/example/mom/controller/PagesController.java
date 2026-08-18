package com.example.mom.controller;

import com.example.mom.dto.Pages.*;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import com.example.mom.facade.Pages.PagesFacade;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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

    @GetMapping("/allPages")
    @PreAuthorize("hasRole('SUPER_USER')")
    public ResponseEntity<Page<PagesUpdateResponseDto>> getAllPages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String authority,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<PagesUpdateResponseDto> allPages = pagesFacade.getAllPages(page, size, search,authority, status, sortBy, sortDir);
        return ResponseEntity.ok(allPages);
    }

    @GetMapping("/myPages")
    @PreAuthorize("hasAnyRole('USER', 'SUPER_USER')")
    public ResponseEntity<Page<PagesUpdateResponseDto>> getPagesByUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String authority,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<PagesUpdateResponseDto> myPages = pagesFacade.getPagesByUser(page, size, search, authority, status, sortBy, sortDir);
        return ResponseEntity.ok(myPages);
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

    @PutMapping("/status/{pageId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesUpdateResponseDto> updatePageStatus(@PathVariable String pageId, @Valid @RequestBody PageStatusUpdateRequestDto pageStatusUpdateRequestDto) {
        PagesUpdateResponseDto updatedPage = pagesFacade.updatePageStatus(pageId, pageStatusUpdateRequestDto);
        return ResponseEntity.ok(updatedPage);
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
