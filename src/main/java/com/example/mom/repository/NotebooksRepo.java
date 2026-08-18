package com.example.mom.repository;

import com.example.mom.entity.Notebooks;
import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface NotebooksRepo extends JpaRepository<Notebooks,String>,
        JpaSpecificationExecutor<Notebooks> {

    List<Notebooks> findByStatus_StatusId(String statusId);

    List<Notebooks> findByCreatedBy(Users createdBy);

    List<Notebooks> findByCreatedByAndStatus(Users user, Status archivedStatus);

    Optional<Notebooks> findByNotebookIdAndCreatedBy(String notebookId, Users loggedInUser);

    Optional<Notebooks> findByNameAndCreatedBy(String name, Users users);

    Page<Notebooks> findByCreatedByUserId(String userId, Pageable pageable);
}
