package com.example.mom.facade.Notebooks;

import com.example.mom.dto.Notebooks.NotebooksNamesResponseDto;
import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.service.Notebooks.NotebooksService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NotebooksFacadeImpl implements NotebooksFacade{

    private final NotebooksService notebooksService;

    public NotebooksFacadeImpl(NotebooksService notebooksService) {
        this.notebooksService = notebooksService;
    }

    @Override
    public NotebooksResponseDto createNotebook(NotebooksRequestDto notebooksRequestDto) {
        return notebooksService.createNotebook(notebooksRequestDto);
    }

    @Override
    public Page<NotebooksResponseDto> getAllNotebooks(int page, int size, String search, String authority, String status, String sortBy, String sortDir) {
        return notebooksService.getAllNotebooks(page,size,search,authority,status,sortBy,sortDir);
    }

    @Override
    public List<NotebooksResponseDto> getNotebooksByUser() {
        return notebooksService.getNotebooksByUser();
    }

    @Override
    public List<NotebooksNamesResponseDto> getNotebooksNamesByUser() {
        return notebooksService.getNotebooksNamesByUser();
    }

    @Override
    public NotebooksResponseDto getNotebookById(String notebookId) {
        return notebooksService.getNotebookById(notebookId);
    }

    @Override
    public List<NotebooksResponseDto> getAllArchivedNotebooks() {
        return notebooksService.getAllArchivedNotebooks();
    }

    @Override
    public List<NotebooksResponseDto> getArchivedNotebooksByUser() {
        return notebooksService.getArchivedNotebooksByUser();
    }

    @Override
    public NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto) {
        return notebooksService.updateNotebook(notebookId,notebooksRequestDto);
    }

    @Override
    public NotebooksResponseDto updateNotebookStatus(String notebookId) {
        return notebooksService.updateNotebookStatus(notebookId);
    }
}
