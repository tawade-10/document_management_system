package com.example.mom.facade.PagesFacade;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import jakarta.validation.Valid;

public interface PagesFacade {

    PagesResponseDto createPage(PagesRequestDto pagesRequestDto);

    PagesResponseDto publishPage(@Valid PagesRequestDto pagesRequestDto);

    PagesResponseDto archivePage(String pageId);
}
