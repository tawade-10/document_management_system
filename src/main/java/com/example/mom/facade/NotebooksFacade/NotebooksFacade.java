package com.example.mom.facade.NotebooksFacade;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface NotebooksFacade {

    NotebooksResponseDto createNotebook(@Valid NotebooksRequestDto notebooksRequestDto);

    List<NotebooksResponseDto> getAllNotebooks();

    NotebooksResponseDto getNotebookById(String notebookId);

    List<NotebooksResponseDto> getArchivedNotebooks();

    NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto);

    NotebooksResponseDto updateNotebookStatus(String notebookId);
}
