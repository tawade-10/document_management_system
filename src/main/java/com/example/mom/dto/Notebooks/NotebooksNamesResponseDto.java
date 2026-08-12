package com.example.mom.dto.Notebooks;

import com.example.mom.entity.Notebooks;

import java.time.LocalDateTime;

public class NotebooksNamesResponseDto {

    private String notebookId;

    private String name;

    public NotebooksNamesResponseDto(Notebooks notebooks){
        this.notebookId = notebooks.getNotebookId();
        this.name = notebooks.getName();
    }

    public String getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(String notebookId) {
        this.notebookId = notebookId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
