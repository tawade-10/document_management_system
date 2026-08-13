package com.example.mom.controller;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Notebooks;
import com.example.mom.facade.Search.SearchFacade;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchFacade searchFacade;

    public SearchController(SearchFacade searchFacade) {
        this.searchFacade = searchFacade;
    }

    @GetMapping("/notebooks")
    public ResponseEntity<List<NotebooksResponseDto>> searchNotebooks(@RequestParam String keyword){
        List<NotebooksResponseDto> searchedNotebooks = searchFacade.searchNotebooks(keyword);
        return new ResponseEntity<>(searchedNotebooks, HttpStatus.OK);
    }

    @GetMapping("/pages")
    public ResponseEntity<List<PagesUpdateResponseDto>> searchPages(@RequestParam String keyword){
        List<PagesUpdateResponseDto> searchedPages = searchFacade.searchPages(keyword);
        return new ResponseEntity<>(searchedPages, HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UsersCreationResponseDto>> searchUsers(@RequestParam String keyword){
        List<UsersCreationResponseDto> searchedUsers = searchFacade.searchUsers(keyword);
        return new ResponseEntity<>(searchedUsers, HttpStatus.OK);
    }

}
