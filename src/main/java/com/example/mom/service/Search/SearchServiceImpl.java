package com.example.mom.service.Search;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.repository.Search.NotebooksSearchRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchServiceImpl implements SearchService{

    private final NotebooksSearchRepo notebooksSearchRepo;

    public SearchServiceImpl(NotebooksSearchRepo notebooksSearchRepo) {
        this.notebooksSearchRepo = notebooksSearchRepo;
    }

    @Override
    public List<NotebooksResponseDto> searchNotebooks(String keyword) {
        return notebooksSearchRepo.searchNotebook(keyword).stream().map(NotebooksResponseDto::new).toList();
    }
}
