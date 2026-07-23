package com.example.mom.repository;

import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotebooksRepo extends JpaRepository<Notebooks,String> {

    Optional<Notebooks> findByName(String name);

    List<Notebooks> findByStatus_StatusId(String statusId);
}
