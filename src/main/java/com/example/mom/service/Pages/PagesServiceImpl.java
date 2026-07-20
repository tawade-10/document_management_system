package com.example.mom.service.Pages;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Pages.PagesRequestDto;
import com.example.mom.dto.Pages.PagesResponseDto;
import com.example.mom.entity.Pages;
import org.springframework.stereotype.Service;

@Service
public class PagesServiceImpl implements PagesService{

    private final CustomIdGenerator customIdGenerator;

    public PagesServiceImpl(CustomIdGenerator customIdGenerator) {
        this.customIdGenerator = customIdGenerator;
    }

    @Override
    public PagesResponseDto createPage(PagesRequestDto pagesRequestDto) {

        Pages pages = new Pages();

        pages.setPageId(customIdGenerator.generatePageId());

        return null;
    }
}
