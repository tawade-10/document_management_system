package com.example.mom.service.Search;


import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;

import java.util.List;

public interface SearchService {

    List<NotebooksResponseDto> searchNotebooks(String keyword);

    List<PagesUpdateResponseDto> searchPages(String keyword);

    List<UsersCreationResponseDto> searchUsers(String keyword);
}
