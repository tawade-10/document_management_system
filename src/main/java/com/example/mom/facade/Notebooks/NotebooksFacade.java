package com.example.mom.facade.Notebooks;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface NotebooksFacade {

    NotebooksResponseDto createNotebook(@Valid NotebooksRequestDto notebooksRequestDto);

    List<NotebooksResponseDto> getAllNotebooks();

    List<NotebooksResponseDto> getNotebooksByUser();

    NotebooksResponseDto getNotebookById(String notebookId);

    List<NotebooksResponseDto> getAllArchivedNotebooks();

    List<NotebooksResponseDto> getArchivedNotebooksByUser();

    NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto);

    NotebooksResponseDto updateNotebookStatus(String notebookId);
}
