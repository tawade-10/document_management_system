package com.example.mom.repository;

import com.example.mom.entity.Attachments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentsRepo extends JpaRepository<Attachments,String> {
}
