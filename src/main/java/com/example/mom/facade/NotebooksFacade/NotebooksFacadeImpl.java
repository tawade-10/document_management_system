package com.example.mom.facade.NotebooksFacade;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.service.Notebooks.NotebooksService;
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
    public List<NotebooksResponseDto> getAllNotebooks() {
        return notebooksService.getAllNotebooks();
    }

    @Override
    public NotebooksResponseDto getNotebookById(String notebookId) {
        return notebooksService.getNotebookById(notebookId);
    }

    @Override
    public NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto) {
        return notebooksService.updateNotebook(notebookId,notebooksRequestDto);
    }
}
