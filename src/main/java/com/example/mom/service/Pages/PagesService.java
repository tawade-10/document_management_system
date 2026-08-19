package com.example.mom.service.Pages;

import com.example.mom.dto.Pages.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PagesService {

    PagesCreationResponseDto createPage(PagesCreationRequestDto pagesCreationRequestDto);

    Page<PagesUpdateResponseDto> getAllPages(int page, int size, String search,String authority, String status, String sortBy, String sortDir);

    Page<PagesUpdateResponseDto> getPagesByUser(int page, int size, String search,String authority, String status, String sortBy, String sortDir);

    PagesUpdateResponseDto getPageById(String pageId);

    PagesUpdateResponseDto editPageDetails(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto);

    PagesUpdateResponseDto publishPage(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto);

    PagesUpdateResponseDto archivePage(String pageId);

    PagesUpdateResponseDto updatePageStatus(String pageId, PageStatusUpdateRequestDto pageStatusUpdateRequestDto);

    List<PagesUpdateResponseDto> getPublishedPages();

    List<PagesUpdateResponseDto> getPublishedPagesByUser();

    List<PagesUpdateResponseDto> getArchivedPages();

    List<PagesUpdateResponseDto> getArchivedPagesByUser();

    PagesUpdateResponseDto mapPageToNotebook(String pageId, String notebookId);

    PagesUpdateResponseDto unmapPageFromNotebook(String pageId);

    List<PagesUpdateResponseDto> getAllPagesByNotebook(String notebookId);
}
