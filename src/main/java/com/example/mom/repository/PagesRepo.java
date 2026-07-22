package com.example.mom.repository;

import com.example.mom.entity.Pages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PagesRepo extends JpaRepository<Pages,String> {

    List<Pages> findByStatus_StatusId(String statusId);

    List<Pages> findByStatus_StatusIdIn(Collection<String> statusIds);

    List<Pages> findByNotebooks_NotebookId(String notebookId);
}
