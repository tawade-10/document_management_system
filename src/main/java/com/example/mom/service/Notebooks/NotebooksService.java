package com.example.mom.service.Notebooks;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;

import java.util.List;

public interface NotebooksService {

    NotebooksResponseDto createNotebook(NotebooksRequestDto notebooksRequestDto);

    List<NotebooksResponseDto> getAllNotebooks();

    List<NotebooksResponseDto> getNotebooksByUser();

    NotebooksResponseDto getNotebookById(String notebookId);

    List<NotebooksResponseDto> getAllArchivedNotebooks();

    List<NotebooksResponseDto> getArchivedNotebooksByUser();

    NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto);

    NotebooksResponseDto updateNotebookStatus(String notebookId);
}
