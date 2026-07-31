package com.example.mom.service.Search;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.entity.Notebooks;

import java.util.List;

public interface SearchService {

    List<NotebooksResponseDto> searchNotebooks(String keyword);
}
