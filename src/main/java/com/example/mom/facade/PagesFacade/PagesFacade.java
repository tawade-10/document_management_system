package com.example.mom.facade.PagesFacade;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface PagesFacade {

    PagesResponseDto createPage(PagesRequestDto pagesRequestDto);

    List<PagesResponseDto> getAllPages(String sortBy, String sortDir);

    PagesResponseDto getPageById(String pageId);

    PagesResponseDto editPageDetails(String pageId, @Valid PagesRequestDto pagesRequestDto);

    PagesResponseDto publishPage(String pageId, @Valid PagesRequestDto pagesRequestDto);

    PagesResponseDto archivePage(String pageId);

    List<PagesResponseDto> getPublishedPages();

    List<PagesResponseDto> getArchivedPages();

    PagesResponseDto mapPageToNotebook(String pageId, String notebookId);

    List<PagesResponseDto> getAllPagesByNotebook(String notebookId);
}
