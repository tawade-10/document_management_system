package com.example.mom.service.Search;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Notebooks;

import java.util.List;

public interface SearchService {

    List<NotebooksResponseDto> searchNotebooks(String keyword);

    List<PagesResponseDto> searchPages(String keyword);

    List<UsersCreationResponseDto> searchUsers(String keyword);
}
