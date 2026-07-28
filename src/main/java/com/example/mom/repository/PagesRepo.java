package com.example.mom.repository;

import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagesRepo extends JpaRepository<Pages,String> {

    List<Pages> findByStatus_StatusId(String statusId);

    List<Pages> findByStatus_StatusIdIn(Collection<String> statusIds);

    List<Pages> findByNotebooks_NotebookId(String notebookId);

    Optional<Pages> findByPageIdAndCreatedBy(String pageId, Users loggedInUser);

    List<Pages> findByCreatedBy(Users createdBy);

    List<Pages> findByCreatedByAndStatus(Users loggedInUser, Status publishedStatus);

    List<Pages> findByCreatedByAndStatusIn(Users loggedInUser, List<Status> savedArchivedStatus);
}
