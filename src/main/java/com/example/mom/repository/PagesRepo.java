package com.example.mom.repository;

import com.example.mom.entity.Pages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagesRepo extends JpaRepository<Pages,String> {
}
