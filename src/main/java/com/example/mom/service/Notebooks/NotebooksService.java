package com.example.mom.service.Notebooks;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;

import java.util.List;

public interface NotebooksService {

    NotebooksResponseDto createNotebook(NotebooksRequestDto notebooksRequestDto);

    List<NotebooksResponseDto> getAllNotebooks();

    NotebooksResponseDto getNotebookById(String notebookId);

    NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto);
}
