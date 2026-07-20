package com.example.mom.service.Notebooks;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Notebooks.NotebooksRequestDto;
import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.NotebooksRepo;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotebooksServiceImpl implements NotebooksService{

    private final UsersRepo usersRepo;

    private final NotebooksRepo notebooksRepo;

    private final StatusRepo statusRepo;

    private final CustomIdGenerator customIdGenerator;

    public NotebooksServiceImpl(UsersRepo usersRepo, NotebooksRepo notebooksRepo, StatusRepo statusRepo, CustomIdGenerator customIdGenerator) {
        this.usersRepo = usersRepo;
        this.notebooksRepo = notebooksRepo;
        this.statusRepo = statusRepo;
        this.customIdGenerator = customIdGenerator;
    }

    @Override
    public NotebooksResponseDto createNotebook(NotebooksRequestDto notebooksRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String user = authentication.getName();

        Users users = usersRepo.findByEmail(user)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Status activeStatus = statusRepo.findById("NAC")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        Optional<Notebooks> existingNotebookByName = notebooksRepo.findByName(notebooksRequestDto.getName());
        if (existingNotebookByName.isPresent()) {
            return new NotebooksResponseDto(existingNotebookByName.get());
        }

        Notebooks notebooks = new Notebooks();

        notebooks.setNotebookId(customIdGenerator.generateNotebookId());
        notebooks.setName(notebooksRequestDto.getName());
        notebooks.setDescription(notebooksRequestDto.getDescription());
        notebooks.setStatus(activeStatus);
        notebooks.setCreatedBy(users);
        notebooks.setCreatedAt(LocalDateTime.now());

        Notebooks savedNotebooks = notebooksRepo.save(notebooks);

        return new NotebooksResponseDto(savedNotebooks);
    }

    @Override
    public List<NotebooksResponseDto> getAllNotebooks() {
        List<Notebooks> notebooks = notebooksRepo.findAll();
        return notebooks.stream().map(NotebooksResponseDto::new).collect(Collectors.toList());
    }

    @Override
    public NotebooksResponseDto getNotebookById(String notebookId) {

        Notebooks notebook = notebooksRepo.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook Not found"));

        return new NotebooksResponseDto(notebook);
    }

    @Override
    public NotebooksResponseDto updateNotebook(String notebookId, NotebooksRequestDto notebooksRequestDto) {

        Notebooks notebook = notebooksRepo.findById(notebookId)
                .orElseThrow(() -> new RuntimeException("Notebook Not found"));

        notebook.setName(notebooksRequestDto.getName());
        notebook.setDescription(notebooksRequestDto.getDescription());
        notebook.setUpdatedAt(LocalDateTime.now());

        Notebooks updatedNotebook = notebooksRepo.save(notebook);

        return new NotebooksResponseDto(updatedNotebook);
    }
}
