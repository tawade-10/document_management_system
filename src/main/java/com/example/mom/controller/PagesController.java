package com.example.mom.controller;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.facade.PagesFacade.PagesFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pages")
public class PagesController {

    private final PagesFacade pagesFacade;

    public PagesController(PagesFacade pagesFacade) {
        this.pagesFacade = pagesFacade;
    }

    @PostMapping("/create")
    public ResponseEntity<PagesResponseDto> createPage(@Valid @RequestBody PagesRequestDto pagesRequestDto){
        PagesResponseDto createdPage = pagesFacade.createPage(pagesRequestDto);
        return new ResponseEntity<>(createdPage, HttpStatus.CREATED);
    }

    @PostMapping("/publish")
    public ResponseEntity<PagesResponseDto> publishPage(@Valid @RequestBody PagesRequestDto pagesRequestDto){
        PagesResponseDto publishedPage = pagesFacade.publishPage(pagesRequestDto);
        return new ResponseEntity<>(publishedPage, HttpStatus.CREATED);
    }

    @PutMapping("/updatePageStatus/{pageId}")
    public ResponseEntity<PagesResponseDto> archivePage(@PathVariable String pageId){
        PagesResponseDto archivedPage = pagesFacade.archivePage(pageId);
        return new ResponseEntity<>(archivedPage, HttpStatus.CREATED);
    }

}
