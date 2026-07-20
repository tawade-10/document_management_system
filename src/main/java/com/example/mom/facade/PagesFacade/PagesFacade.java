package com.example.mom.facade.PagesFacade;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;

public interface PagesFacade {

    PagesResponseDto createPage(PagesRequestDto pagesRequestDto);
}
