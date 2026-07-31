package com.example.mom.controller;

import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.facade.Notebooks.NotebooksFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<NotebooksResponseDto> createNotebook(@Valid @RequestBody NotebooksRequestDto notebooksRequestDto){
        NotebooksResponseDto createdNotebook = notebooksFacade.createNotebook(notebooksRequestDto);
        return new ResponseEntity<>(createdNotebook, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER')")
    public ResponseEntity<List<NotebooksResponseDto>> getAllNotebooks(){
        List<NotebooksResponseDto> allNotebooks = notebooksFacade.getAllNotebooks();
        return ResponseEntity.ok(allNotebooks);
    }

    @GetMapping("/allNotebooks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<NotebooksResponseDto>> getNotebooksByUser(){
        List<NotebooksResponseDto> notebooksByUser = notebooksFacade.getNotebooksByUser();
        return ResponseEntity.ok(notebooksByUser);
    }

    @GetMapping("/{notebookId}")
    @PreAuthorize("hasAnyRole('SUPER_USER','USER')")
    public ResponseEntity<NotebooksResponseDto> getNotebookById(@PathVariable String notebookId){
        NotebooksResponseDto notebookById = notebooksFacade.getNotebookById(notebookId);
        return ResponseEntity.ok(notebookById);
    }

    @GetMapping("/archived")
    @PreAuthorize("hasRole('SUPER_USER')")
    public ResponseEntity<List<NotebooksResponseDto>> getAllArchivedNotebooks(){
        List<NotebooksResponseDto> archivedNotebooks = notebooksFacade.getAllArchivedNotebooks();
        return ResponseEntity.ok(archivedNotebooks);
    }

    @GetMapping("/allArchivedNotebooks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<NotebooksResponseDto>> getArchivedNotebooksByUser(){
        List<NotebooksResponseDto> archivedNotebooksByUser = notebooksFacade.getArchivedNotebooksByUser();
        return ResponseEntity.ok(archivedNotebooksByUser);
    }

    @PutMapping("/{notebookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<NotebooksResponseDto> updateNotebook(@PathVariable String notebookId, @RequestBody NotebooksRequestDto notebooksRequestDto){
        NotebooksResponseDto notebookById = notebooksFacade.updateNotebook(notebookId,notebooksRequestDto);
        return ResponseEntity.ok(notebookById);
    }

    @PutMapping("/updateStatus/{notebookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<NotebooksResponseDto> updateNotebookStatus(@PathVariable String notebookId){
        NotebooksResponseDto updatedNotebookStatus = notebooksFacade.updateNotebookStatus(notebookId);
        return ResponseEntity.ok(updatedNotebookStatus);
    }
}
