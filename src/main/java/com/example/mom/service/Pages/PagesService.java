package com.example.mom.service.Pages;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;

public interface PagesService {

    PagesResponseDto createPage(PagesRequestDto pagesRequestDto);

    PagesResponseDto publishPage(PagesRequestDto pagesRequestDto);

    PagesResponseDto archivePage(String pageId);
}
