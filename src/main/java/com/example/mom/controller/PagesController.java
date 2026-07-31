package com.example.mom.controller;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
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
    public ResponseEntity<PagesResponseDto> createPage(@Valid @RequestBody PagesRequestDto pagesRequestDto){
        PagesResponseDto createdPage = pagesFacade.createPage(pagesRequestDto);
        return new ResponseEntity<>(createdPage, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER')")
    public ResponseEntity<List<PagesResponseDto>> getAllPages(@RequestParam String sortBy, @RequestParam String sortDir){
        List<PagesResponseDto> allPages = pagesFacade.getAllPages(sortBy,sortDir);
        return ResponseEntity.ok(allPages);
    }

    @GetMapping("/allPages")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PagesResponseDto>> getPagesByUser(@RequestParam String sortBy, @RequestParam String sortDir){
        List<PagesResponseDto> pagesByUser = pagesFacade.getPagesByUser(sortBy,sortDir);
        return ResponseEntity.ok(pagesByUser);
    }

    @GetMapping("/{pageId}")
    public ResponseEntity<PagesResponseDto> getPageById(@PathVariable String pageId){
        PagesResponseDto pageById = pagesFacade.getPageById(pageId);
        return ResponseEntity.ok(pageById);
    }

    @PutMapping("/updateDetails/{pageId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesResponseDto> editPageDetails(@PathVariable String pageId, @Valid @RequestBody PagesRequestDto pagesRequestDto){
        PagesResponseDto editedPage = pagesFacade.editPageDetails(pageId, pagesRequestDto);
        return ResponseEntity.ok(editedPage);
    }

    @PutMapping("/publish/{pageId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesResponseDto> publishPage(@PathVariable String pageId, @Valid @RequestBody PagesRequestDto pagesRequestDto){
        PagesResponseDto publishedPage = pagesFacade.publishPage(pageId, pagesRequestDto);
        return ResponseEntity.ok(publishedPage);
    }

    @PutMapping("/archive/{pageId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesResponseDto> archivePage(@PathVariable String pageId){
        PagesResponseDto archivedPage = pagesFacade.archivePage(pageId);
        return ResponseEntity.ok(archivedPage);
    }

    @GetMapping("/published")
    public ResponseEntity<List<PagesResponseDto>> getPublishedPages(){
        List<PagesResponseDto> allPublishedPages = pagesFacade.getPublishedPages();
        return ResponseEntity.ok(allPublishedPages);
    }

    @GetMapping("/publishedByUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PagesResponseDto>> getPublishedPagesByUser(){
        List<PagesResponseDto> publishedPagesByUser = pagesFacade.getPublishedPagesByUser();
        return ResponseEntity.ok(publishedPagesByUser);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<PagesResponseDto>> getArchivedPages(){
        List<PagesResponseDto> allArchivedPages = pagesFacade.getArchivedPages();
        return ResponseEntity.ok(allArchivedPages);
    }

    @GetMapping("/archivedByUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PagesResponseDto>> getArchivedPagesByUser(){
        List<PagesResponseDto> archivedPagesByUser = pagesFacade.getArchivedPagesByUser();
        return ResponseEntity.ok(archivedPagesByUser);
    }

    @PutMapping("/{pageId}/notebook/{notebookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagesResponseDto> mapPageToNotebook(@PathVariable String pageId, @PathVariable String notebookId){
        PagesResponseDto mappedPage = pagesFacade.mapPageToNotebook(pageId, notebookId);
        return ResponseEntity.ok(mappedPage);
    }

    @GetMapping("/{notebookId}/pages")
    @PreAuthorize("hasAnyRole('SUPER_USER','USER')")
    public ResponseEntity<List<PagesResponseDto>> getAllPagesByNotebook(@PathVariable String notebookId){
        List<PagesResponseDto> allPagesByNotebook = pagesFacade.getAllPagesByNotebook(notebookId);
        return ResponseEntity.ok(allPagesByNotebook);
    }
}
