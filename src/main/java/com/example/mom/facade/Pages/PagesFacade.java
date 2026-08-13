package com.example.mom.facade.Pages;

import com.example.mom.dto.Pages.PagesCreationRequestDto;
import com.example.mom.dto.Pages.PagesCreationResponseDto;
import com.example.mom.dto.Pages.PagesUpdateRequestDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface PagesFacade {

    PagesCreationResponseDto createPage(PagesCreationRequestDto pagesCreationRequestDto);

    List<PagesUpdateResponseDto> getAllPages(String sortBy, String sortDir);

    List<PagesUpdateResponseDto> getPagesByUser(String sortBy, String sortDir);

    PagesUpdateResponseDto getPageById(String pageId);

    PagesUpdateResponseDto editPageDetails(String pageId, @Valid PagesUpdateRequestDto pagesUpdateRequestDto);

    PagesUpdateResponseDto publishPage(String pageId, @Valid PagesUpdateRequestDto pagesUpdateRequestDto);

    PagesUpdateResponseDto archivePage(String pageId);

    List<PagesUpdateResponseDto> getPublishedPages();

    List<PagesUpdateResponseDto> getPublishedPagesByUser();

    List<PagesUpdateResponseDto> getArchivedPages();

    List<PagesUpdateResponseDto> getArchivedPagesByUser();

    PagesUpdateResponseDto mapPageToNotebook(String pageId, String notebookId);

    List<PagesUpdateResponseDto> getAllPagesByNotebook(String notebookId);
}
