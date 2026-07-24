package com.example.mom.repository;

import com.example.mom.entity.Pages;
import com.example.mom.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepo extends JpaRepository<Status, String> {

    Status findStatusByPageId(Pages page);
}