package com.example.mom.facade.Pages;

import com.example.mom.dto.Pages.*;
import com.example.mom.service.Pages.PagesService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PagesFacadeImpl implements PagesFacade{

    private final PagesService pagesService;

    public PagesFacadeImpl(PagesService pagesService) {
        this.pagesService = pagesService;
    }

    @Override
    public PagesCreationResponseDto createPage(PagesCreationRequestDto pagesCreationRequestDto) {
        return pagesService.createPage(pagesCreationRequestDto);
    }

    @Override
    public Page<PagesUpdateResponseDto> getAllPages(int page, int size, String search,String authority,String status, String sortBy, String sortDir) {
        return pagesService.getAllPages(page,size,search,authority,status,sortBy,sortDir);
    }

    @Override
    public Page<PagesUpdateResponseDto> getPagesByUser(int page, int size, String search,String authority, String status, String sortBy, String sortDir) {
        return pagesService.getPagesByUser(page,size,search,authority,status,sortBy,sortDir);
    }

    @Override
    public PagesUpdateResponseDto getPageById(String pageId) {
        return pagesService.getPageById(pageId);
    }

    @Override
    public PagesUpdateResponseDto editPageDetails(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto) {
        return pagesService.editPageDetails(pageId, pagesUpdateRequestDto);
    }

    @Override
    public PagesUpdateResponseDto publishPage(String pageId, PagesUpdateRequestDto pagesUpdateRequestDto) {
        return pagesService.publishPage(pageId, pagesUpdateRequestDto);
    }

    @Override
    public PagesUpdateResponseDto archivePage(String pageId) {
        return pagesService.archivePage(pageId);
    }

    @Override
    public PagesUpdateResponseDto updatePageStatus(String pageId, PageStatusUpdateRequestDto pageStatusUpdateRequestDto) {
        return pagesService.updatePageStatus(pageId,pageStatusUpdateRequestDto);
    }

    @Override
    public List<PagesUpdateResponseDto> getPublishedPages() {
        return pagesService.getPublishedPages();
    }

    @Override
    public List<PagesUpdateResponseDto> getPublishedPagesByUser() {
        return pagesService.getPublishedPagesByUser();
    }

    @Override
    public List<PagesUpdateResponseDto> getArchivedPages() {
        return pagesService.getArchivedPages();
    }

    @Override
    public List<PagesUpdateResponseDto> getArchivedPagesByUser() {
        return pagesService.getArchivedPagesByUser();
    }

    @Override
    public PagesUpdateResponseDto mapPageToNotebook(String pageId, String notebookId) {
        return pagesService.mapPageToNotebook(pageId, notebookId);
    }

    @Override
    public List<PagesUpdateResponseDto> getAllPagesByNotebook(String notebookId) {
        return pagesService.getAllPagesByNotebook(notebookId);
    }
}
