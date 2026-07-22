package com.example.mom.facade.PagesFacade;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.service.Pages.PagesService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PagesFacadeImpl implements PagesFacade{

    private final PagesService pagesService;

    public PagesFacadeImpl(PagesService pagesService) {
        this.pagesService = pagesService;
    }

    @Override
    public PagesResponseDto createPage(PagesRequestDto pagesRequestDto) {
        return pagesService.createPage(pagesRequestDto);
    }

    @Override
    public List<PagesResponseDto> getAllPages() {
        return pagesService.getAllPages();
    }

    @Override
    public PagesResponseDto getPageById(String pageId) {
        return pagesService.getPageById(pageId);
    }

    @Override
    public PagesResponseDto editPageDetails(String pageId, PagesRequestDto pagesRequestDto) {
        return pagesService.editPageDetails(pageId, pagesRequestDto);
    }

    @Override
    public PagesResponseDto publishPage(String pageId, PagesRequestDto pagesRequestDto) {
        return pagesService.publishPage(pageId, pagesRequestDto);
    }

    @Override
    public PagesResponseDto archivePage(String pageId) {
        return pagesService.archivePage(pageId);
    }

    @Override
    public List<PagesResponseDto> getPublishedPages() {
        return pagesService.getPublishedPages();
    }

    @Override
    public List<PagesResponseDto> getArchivedPages() {
        return pagesService.getArchivedPages();
    }

    @Override
    public PagesResponseDto mapPageToNotebook(String pageId, String notebookId) {
        return pagesService.mapPageToNotebook(pageId, notebookId);
    }

    @Override
    public List<PagesResponseDto> getAllPagesByNotebook(String notebookId) {
        return pagesService.getAllPagesByNotebook(notebookId);
    }
}
