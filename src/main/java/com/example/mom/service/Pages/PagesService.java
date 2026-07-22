package com.example.mom.service.Pages;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;

import java.util.List;

public interface PagesService {

    PagesResponseDto createPage(PagesRequestDto pagesRequestDto);

    List<PagesResponseDto> getAllPages();

    PagesResponseDto getPageById(String pageId);

    PagesResponseDto editPageDetails(String pageId, PagesRequestDto pagesRequestDto);

    PagesResponseDto publishPage(String pageId, PagesRequestDto pagesRequestDto);

    PagesResponseDto archivePage(String pageId);

    List<PagesResponseDto> getPublishedPages();

    List<PagesResponseDto> getArchivedPages();

    PagesResponseDto mapPageToNotebook(String pageId, String notebookId);

    List<PagesResponseDto> getAllPagesByNotebook(String notebookId);
}
