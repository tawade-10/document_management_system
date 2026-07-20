package com.example.mom.controller;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.facade.NotebooksFacade.NotebooksFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notebooks")
public class NotebooksController {

    private final NotebooksFacade notebooksFacade;

    public NotebooksController(NotebooksFacade notebooksFacade) {
        this.notebooksFacade = notebooksFacade;
    }

    @PostMapping("/create")
    public ResponseEntity<NotebooksResponseDto> createNotebook(@Valid @RequestBody NotebooksRequestDto notebooksRequestDto){
        NotebooksResponseDto createdNotebook = notebooksFacade.createNotebook(notebooksRequestDto);
        return new ResponseEntity<>(createdNotebook, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<NotebooksResponseDto>> getAllNotebooks(){
        List<NotebooksResponseDto> allNotebooks = notebooksFacade.getAllNotebooks();
        return new ResponseEntity<>(allNotebooks, HttpStatus.CREATED);
    }

    @GetMapping("/{notebookId}")
    public ResponseEntity<NotebooksResponseDto> getNotebookById(@PathVariable String notebookId){
        NotebooksResponseDto notebookById = notebooksFacade.getNotebookById(notebookId);
        return ResponseEntity.ok(notebookById);
    }

    @PutMapping("/{notebookId}")
    public ResponseEntity<NotebooksResponseDto> updateNotebook(@PathVariable String notebookId, @RequestBody NotebooksRequestDto notebooksRequestDto){
        NotebooksResponseDto notebookById = notebooksFacade.updateNotebook(notebookId,notebooksRequestDto);
        return ResponseEntity.ok(notebookById);
    }

}
