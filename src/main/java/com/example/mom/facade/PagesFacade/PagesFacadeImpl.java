package com.example.mom.facade.PagesFacade;

import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.service.Pages.PagesService;
import org.springframework.stereotype.Component;

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
}
