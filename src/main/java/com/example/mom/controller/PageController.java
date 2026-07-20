package com.example.mom.controller;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.facade.PagesFacade.PagesFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pages")
public class PageController {

    private final PagesFacade pagesFacade;

    public PageController(PagesFacade pagesFacade) {
        this.pagesFacade = pagesFacade;
    }

    @PostMapping("/create")
    public ResponseEntity<PagesResponseDto> createPage(@Valid @RequestBody PagesRequestDto pagesRequestDto){
        PagesResponseDto createdPage = pagesFacade.createPage(pagesRequestDto);
        return new ResponseEntity<>(createdPage, HttpStatus.CREATED);
    }
}
