package com.example.mom.service.Notebooks;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NotebooksService {

    NotebooksResponseDto createNotebook(NotebooksRequestDto notebooksRequestDto);

    Page<NotebooksResponseDto> getAllNotebooks(int page, int size, String search, String authority, String status, String sortBy, String sortDir);

    List<NotebooksResponseDto> getNotebooksByUser();

    NotebooksResponseDto getNotebookById(String notebookId);

    List<NotebooksResponseDto> getAllArchivedNotebooks();

    List<NotebooksResponseDto> getArchivedNotebooksByUser();

    NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto);

    NotebooksResponseDto updateNotebookStatus(String notebookId);
}
