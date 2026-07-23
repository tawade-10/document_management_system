package com.example.mom.service.Notebooks;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;

import java.util.List;

public interface NotebooksService {

    NotebooksResponseDto createNotebook(NotebooksRequestDto notebooksRequestDto);

    List<NotebooksResponseDto> getAllNotebooks();

    NotebooksResponseDto getNotebookById(String notebookId);

    List<NotebooksResponseDto> getArchivedNotebooks();

    NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto);

    NotebooksResponseDto updateNotebookStatus(String notebookId);
}
