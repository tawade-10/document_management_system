package com.example.mom.service.Search;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.repository.Search.NotebooksSearchRepo;
import com.example.mom.repository.Search.PagesSearchRepo;
import com.example.mom.repository.Search.UsersSearchRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchServiceImpl implements SearchService{

    private final NotebooksSearchRepo notebooksSearchRepo;

    private final PagesSearchRepo pagesSearchRepo;

    private final UsersSearchRepo usersSearchRepo;

    public SearchServiceImpl(NotebooksSearchRepo notebooksSearchRepo, PagesSearchRepo pagesSearchRepo, UsersSearchRepo usersSearchRepo) {
        this.notebooksSearchRepo = notebooksSearchRepo;
        this.pagesSearchRepo = pagesSearchRepo;
        this.usersSearchRepo = usersSearchRepo;
    }

    @Override
    public List<NotebooksResponseDto> searchNotebooks(String keyword) {
        return notebooksSearchRepo.searchNotebook(keyword).stream().map(NotebooksResponseDto::new).toList();
    }

    @Override
    public List<PagesResponseDto> searchPages(String keyword) {
        return pagesSearchRepo.searchPage(keyword).stream().map(PagesResponseDto::new).toList();
    }

    @Override
    public List<UsersCreationResponseDto> searchUsers(String keyword) {
        return usersSearchRepo.searchUser(keyword).stream().map(UsersCreationResponseDto::new).toList();
    }
}
