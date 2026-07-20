package com.example.mom.dto.Notebooks;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class NotebooksRequestDto {

    @NotBlank(message = "Notebook name cannot be empty")
    private String name;

    @NotBlank(message = "Notebook name cannot be empty")
    private String description;

    public NotebooksRequestDto(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public NotebooksRequestDto(){
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
