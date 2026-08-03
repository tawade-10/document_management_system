package com.example.mom.facade.Search;


import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Notebooks;

import java.util.List;

public interface SearchFacade {

    List<NotebooksResponseDto> searchNotebooks(String keyword);

    List<PagesResponseDto> searchPages(String keyword);

    List<UsersCreationResponseDto> searchUsers(String keyword);
}
