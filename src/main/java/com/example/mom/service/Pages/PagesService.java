package com.example.mom.service.Pages;

import com.example.mom.dto.Pages.PagesCreationRequestDto;
import com.example.mom.dto.Pages.PagesCreationResponseDto;
import com.example.mom.dto.Pages.PagesUpdateRequestDto;
import com.example.mom.dto.Pages.PagesUpdateResponseDto;

import java.util.List;

public interface PagesService {

    PagesCreationResponseDto createPage(PagesCreationRequestDto pagesCreationRequestDto);

    List<PagesUpdateResponseDto> getAllPages(String sortBy, String sortDir);

    List<PagesUpdateResponseDto> getPagesByUser(String sortBy, String sortDir);

    PagesUpdateResponseDto getPageById(String pageId);

    PagesUpdateResponseDto editPageDetails(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto);

    PagesUpdateResponseDto publishPage(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto);

    PagesUpdateResponseDto archivePage(String pageId);

    List<PagesUpdateResponseDto> getPublishedPages();

    List<PagesUpdateResponseDto> getPublishedPagesByUser();

    List<PagesUpdateResponseDto> getArchivedPages();

    List<PagesUpdateResponseDto> getArchivedPagesByUser();

    PagesUpdateResponseDto mapPageToNotebook(String pageId, String notebookId);

    List<PagesUpdateResponseDto> getAllPagesByNotebook(String notebookId);
}
