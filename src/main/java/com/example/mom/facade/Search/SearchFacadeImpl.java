package com.example.mom.facade.Search;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Notebooks;
import com.example.mom.service.Search.SearchService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SearchFacadeImpl implements SearchFacade{

    private final SearchService searchService;

    public SearchFacadeImpl(SearchService searchService) {
        this.searchService = searchService;
    }

    @Override
    public List<NotebooksResponseDto> searchNotebooks(String keyword) {
        return searchService.searchNotebooks(keyword);
    }

    @Override
    public List<PagesResponseDto> searchPages(String keyword) {
        return searchService.searchPages(keyword);
    }

    @Override
    public List<UsersCreationResponseDto> searchUsers(String keyword) {
        return searchService.searchUsers(keyword);
    }
}
